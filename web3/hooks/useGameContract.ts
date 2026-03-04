'use client';

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useSendTransaction,
  useSendCalls,
  useCallsStatus,
  useAccount,
} from 'wagmi';
import { encodeFunctionData, type Hex } from 'viem';
import {
  BASE_MEMORY_GAME_ABI,
  BASE_MEMORY_GAME_ADDRESS,
  isContractConfigured,
} from '../contracts/BaseMemoryGame';
import { appendBuilderAttribution, isBuilderCodeConfigured } from '../builderCode';
import { usePaymasterCapabilities } from './usePaymasterCapabilities';

function encodeWithAttribution(data: Hex): Hex {
  return isBuilderCodeConfigured() ? appendBuilderAttribution(data) : data;
}

export function useGameContract() {
  const { address } = useAccount();
  const { isPaymasterAvailable, paymasterUrl } = usePaymasterCapabilities();

  const contractAddress = BASE_MEMORY_GAME_ADDRESS as `0x${string}`;
  const contractAvailable = isContractConfigured() && !!address;

  // --- Path 1: Sponsored (EIP-5792 sendCalls + paymaster) ---
  const {
    sendCalls,
    data: sendCallsResult,
    isPending: isSendCallsPending,
    error: sendCallsError,
  } = useSendCalls();

  const { data: callsStatus } = useCallsStatus({
    id: sendCallsResult?.id ?? '',
    query: {
      enabled: !!sendCallsResult?.id,
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        if (status === 'success' || status === 'failure') return false;
        return 1000;
      },
    },
  });

  // --- Path 2: Attribution (sendTransaction + builder code) ---
  const {
    sendTransaction,
    data: sendHash,
    isPending: isSendPending,
    error: sendError,
  } = useSendTransaction();

  // --- Path 3: Direct (writeContract) ---
  const {
    writeContract,
    data: writeHash,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  // --- Transaction receipt for paths 2 & 3 ---
  const legacyHash = writeHash || sendHash;
  const { isLoading: isLegacyConfirming, isSuccess: isLegacySuccess } =
    useWaitForTransactionReceipt({ hash: legacyHash });

  // --- Aggregated state ---
  const isSponsoredConfirming =
    !!sendCallsResult?.id &&
    callsStatus?.status !== 'success' &&
    callsStatus?.status !== 'failure';
  const isSponsoredSuccess = callsStatus?.status === 'success';

  const isPending =
    isSendCallsPending || isSendPending || isWritePending ||
    isSponsoredConfirming || isLegacyConfirming;

  const isSuccess = isSponsoredSuccess || isLegacySuccess;
  const error = sendCallsError || sendError || writeError;

  // --- Public API ---
  const startSession = async () => {
    if (!contractAvailable) {
      console.log('Contract not available, skipping startSession');
      return;
    }

    try {
      if (isPaymasterAvailable && paymasterUrl) {
        const data = encodeWithAttribution(
          encodeFunctionData({
            abi: BASE_MEMORY_GAME_ABI,
            functionName: 'startSession',
          }),
        );
        return sendCalls({
          calls: [{ to: contractAddress, data }],
          capabilities: {
            paymasterService: { url: paymasterUrl },
          },
        });
      }

      if (isBuilderCodeConfigured()) {
        const data = encodeWithAttribution(
          encodeFunctionData({
            abi: BASE_MEMORY_GAME_ABI,
            functionName: 'startSession',
          }),
        );
        return sendTransaction({ to: contractAddress, data });
      }

      return writeContract({
        address: contractAddress,
        abi: BASE_MEMORY_GAME_ABI,
        functionName: 'startSession',
      });
    } catch (err) {
      console.error('Failed to start session:', err);
    }
  };

  const finishGame = async (totalMoves: number) => {
    if (!contractAvailable) {
      console.log('Contract not available, skipping finishGame');
      return;
    }

    if (totalMoves <= 0) {
      console.error('Invalid move count');
      return;
    }

    try {
      if (isPaymasterAvailable && paymasterUrl) {
        const data = encodeWithAttribution(
          encodeFunctionData({
            abi: BASE_MEMORY_GAME_ABI,
            functionName: 'finishGame',
            args: [BigInt(totalMoves)],
          }),
        );
        return sendCalls({
          calls: [{ to: contractAddress, data }],
          capabilities: {
            paymasterService: { url: paymasterUrl },
          },
        });
      }

      if (isBuilderCodeConfigured()) {
        const data = encodeWithAttribution(
          encodeFunctionData({
            abi: BASE_MEMORY_GAME_ABI,
            functionName: 'finishGame',
            args: [BigInt(totalMoves)],
          }),
        );
        return sendTransaction({ to: contractAddress, data });
      }

      return writeContract({
        address: contractAddress,
        abi: BASE_MEMORY_GAME_ABI,
        functionName: 'finishGame',
        args: [BigInt(totalMoves)],
      });
    } catch (err) {
      console.error('Failed to finish game:', err);
    }
  };

  const { data: session } = useReadContract({
    address: contractAddress,
    abi: BASE_MEMORY_GAME_ABI,
    functionName: 'sessions',
    args: address ? [address] : undefined,
    query: {
      enabled: contractAvailable,
    },
  });

  return {
    startSession,
    finishGame,
    isPending: contractAvailable ? isPending : false,
    isSuccess: contractAvailable ? isSuccess : false,
    error: contractAvailable ? error : null,
    session,
    contractAvailable,
  };
}
