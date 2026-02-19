'use client';

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { useSendTransaction } from 'wagmi';
import { BASE_MEMORY_GAME_ABI, BASE_MEMORY_GAME_ADDRESS, isContractConfigured } from '../contracts/BaseMemoryGame';
import { appendBuilderAttribution, isBuilderCodeConfigured } from '../builderCode';
import { useAccount } from 'wagmi';

export function useGameContract() {
  const { address } = useAccount();
  const { writeContract, data: writeHash, isPending: isWritePending, error: writeError } = useWriteContract();
  const { sendTransaction, data: sendHash, isPending: isSendPending, error: sendError } = useSendTransaction();

  const activeHash = writeHash || sendHash;
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: activeHash,
  });

  const contractAvailable = isContractConfigured() && !!address;
  const useAttribution = isBuilderCodeConfigured();

  const startSession = async () => {
    if (!contractAvailable) {
      console.log('Contract not available, skipping startSession');
      return;
    }

    try {
      if (useAttribution) {
        const data = encodeFunctionData({
          abi: BASE_MEMORY_GAME_ABI,
          functionName: 'startSession',
        });
        return await sendTransaction({
          to: BASE_MEMORY_GAME_ADDRESS as `0x${string}`,
          data: appendBuilderAttribution(data),
        });
      }

      return await writeContract({
        address: BASE_MEMORY_GAME_ADDRESS as `0x${string}`,
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
      if (useAttribution) {
        const data = encodeFunctionData({
          abi: BASE_MEMORY_GAME_ABI,
          functionName: 'finishGame',
          args: [BigInt(totalMoves)],
        });
        return await sendTransaction({
          to: BASE_MEMORY_GAME_ADDRESS as `0x${string}`,
          data: appendBuilderAttribution(data),
        });
      }

      return await writeContract({
        address: BASE_MEMORY_GAME_ADDRESS as `0x${string}`,
        abi: BASE_MEMORY_GAME_ABI,
        functionName: 'finishGame',
        args: [BigInt(totalMoves)],
      });
    } catch (err) {
      console.error('Failed to finish game:', err);
    }
  };

  const { data: session } = useReadContract({
    address: BASE_MEMORY_GAME_ADDRESS as `0x${string}`,
    abi: BASE_MEMORY_GAME_ABI,
    functionName: 'sessions',
    args: address ? [address] : undefined,
    query: {
      enabled: contractAvailable,
    },
  });

  const isPending = isWritePending || isSendPending || isConfirming;

  return {
    startSession,
    finishGame,
    isPending: contractAvailable ? isPending : false,
    isSuccess: contractAvailable ? isSuccess : false,
    error: contractAvailable ? (writeError || sendError) : null,
    session,
    contractAvailable,
  };
}
