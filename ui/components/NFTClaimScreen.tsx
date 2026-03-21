'use client';

import { useState } from 'react';
import { TransactionStatus } from './TransactionStatus';
import type { GameResult } from '../../game/types';
import styles from './NFTClaimScreen.module.css';

interface NFTClaimScreenProps {
  result: GameResult;
  onMint: (moves: number) => Promise<void>;
  onStartSession?: () => Promise<void>;
  onContinue: () => void;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
}

export function NFTClaimScreen({
  result,
  onMint,
  onStartSession,
  onContinue,
  isPending,
  isSuccess,
  error,
}: NFTClaimScreenProps) {
  const [hasClaimed, setHasClaimed] = useState(false);

  const handleClaim = async () => {
    try {
      // Спочатку переконуємося, що сесія активна
      if (onStartSession) {
        await onStartSession();
        // Даємо час на активацію сесії
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      await onMint(result.moves);
      setHasClaimed(true);
    } catch (err) {
      console.error('NFT claim failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      // Якщо помилка "No active session", намагаємося ще раз
      if (errorMessage.includes('No active session') && onStartSession) {
        console.log('Retrying with new session...');
        try {
          await onStartSession();
          await new Promise(resolve => setTimeout(resolve, 500));
          await onMint(result.moves);
          setHasClaimed(true);
        } catch (retryErr) {
          console.error('NFT claim retry failed:', retryErr);
        }
      }
    }
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.nftIcon}>🏆</div>
          <h2 className={styles.title}>NFT Achievement!</h2>
          <p className={styles.subtitle}>
            You completed the level with {result.moves} moves!
          </p>
        </div>

        <div className={styles.achievementInfo}>
          <div className={styles.achievementBadge}>
            {result.moves <= 10 ? (
              <span className={styles.perfectBadge}>🌟 Perfect Game!</span>
            ) : (
              <span className={styles.excellentBadge}>⭐ Excellent!</span>
            )}
          </div>
          <p className={styles.description}>
            {result.moves <= 20
              ? "You've earned a Base Memory Achievement NFT!"
              : "Great job completing the level!"}
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Moves</span>
            <span className={styles.statValue}>{result.moves}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Mistakes</span>
            <span className={styles.statValue}>{result.mistakes}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Stars</span>
            <span className={styles.statValue}>
              {'★'.repeat(result.stars)}
              {'☆'.repeat(3 - result.stars)}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Time</span>
            <span className={styles.statValue}>{formatTime(result.timeElapsed)}</span>
          </div>
        </div>

        <TransactionStatus
          isPending={isPending}
          isSuccess={isSuccess}
          error={error}
          mode="minting"
          message={hasClaimed ? 'Claiming your NFT...' : 'Ready to mint!'}
        />

        <div className={styles.actions}>
          {!hasClaimed ? (
            <button
              className={styles.claimButton}
              onClick={handleClaim}
              disabled={isPending}
            >
              🎁 Claim NFT
            </button>
          ) : (
            <div className={styles.claimedMessage}>
              {isSuccess ? (
                <>
                  <span className={styles.successIcon}>✅</span>
                  <span>NFT Successfully Minted!</span>
                </>
              ) : isPending ? (
                <>
                  <span className={styles.pendingIcon}>⏳</span>
                  <span>Minting in progress...</span>
                </>
              ) : error ? (
                <>
                  <span className={styles.errorIcon}>❌</span>
                  <span>{error.message || 'Claim failed. Try again!'}</span>
                </>
              ) : (
                <>
                  <span className={styles.errorIcon}>❌</span>
                  <span>Ready to claim</span>
                </>
              )}
            </div>
          )}

          <button
            className={styles.continueButton}
            onClick={onContinue}
            disabled={isPending}
          >
            Continue
          </button>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            This NFT will be minted on Base blockchain
          </p>
        </div>
      </div>
    </div>
  );
}
