'use client';

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { BASE_MEMORY_GAME_ABI, BASE_MEMORY_GAME_ADDRESS, isContractConfigured } from '../contracts/BaseMemoryGame';
import { useAccount } from 'wagmi';

export function useGameContract() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const contractAvailable = isContractConfigured() && !!address;

  const startSession = async () => {
    if (!contractAvailable) {
      console.log('Contract not available, skipping startSession');
      return;
    }

    try {
      return await writeContract({
        address: BASE_MEMORY_GAME_ADDRESS as `0x${string}`,
        abi: BASE_MEMORY_GAME_ABI,
        functionName: 'startSession',
      });
    } catch (err) {
      console.error('Failed to start session:', err);
      // Не пробрасываем ошибку, чтобы игра продолжала работать
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
      return await writeContract({
        address: BASE_MEMORY_GAME_ADDRESS as `0x${string}`,
        abi: BASE_MEMORY_GAME_ABI,
        functionName: 'finishGame',
        args: [BigInt(totalMoves)],
      });
    } catch (err) {
      console.error('Failed to finish game:', err);
      // Не пробрасываем ошибку, чтобы игра продолжала работать
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

  return {
    startSession,
    finishGame,
    isPending: contractAvailable ? (isPending || isConfirming) : false,
    isSuccess: contractAvailable ? isSuccess : false,
    error: contractAvailable ? error : null,
    session,
    contractAvailable,
  };
}
