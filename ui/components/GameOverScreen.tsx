'use client';

import { useCallback } from 'react';
import { useGameContract } from '../../web3/hooks/useGameContract';
import { TransactionStatus } from './TransactionStatus';
import type { GameResult } from '../../game/types';
import styles from './GameOverScreen.module.css';

interface GameOverScreenProps {
  result: GameResult;
  onRestart: () => void;
  onExit?: () => void;
}

export function GameOverScreen({ result, onRestart, onExit }: GameOverScreenProps) {
  const { finishGame, isPending, isSuccess, error, contractAvailable } = useGameContract();

  const handleMintNFT = useCallback(async () => {
    if (!contractAvailable) return;
    try {
      // Передаём completed: false для проигрыша
      await finishGame(result.moves > 0 ? result.moves : 1, false);
    } catch (err) {
      console.log('NFT mint failed:', err);
    }
  }, [contractAvailable, finishGame, result.moves]);

  return (
    <div className={styles.gameOver}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <svg className={styles.clockIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        <h2 className={styles.title}>Time&apos;s Up!</h2>
        <p className={styles.subtitle}>The timer ran out before you found all pairs</p>

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
            <span className={styles.statLabel}>Time</span>
            <span className={styles.statValue}>
              {Math.floor(result.timeElapsed / 1000)}s
            </span>
          </div>
        </div>

        {contractAvailable && (
          <div className={styles.nftSection}>
            <p className={styles.nftText}>Record your game result as an on-chain NFT</p>
            <button
              className={styles.mintButton}
              onClick={handleMintNFT}
              disabled={isPending || isSuccess}
            >
              {isPending ? 'Minting...' : isSuccess ? 'NFT Minted!' : 'Mint Result NFT'}
            </button>
            <TransactionStatus
              isPending={isPending}
              isSuccess={isSuccess}
              error={error}
              message="Recording your result on-chain..."
            />
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.restartButton} onClick={onRestart}>
            Try Again
          </button>
          {onExit && (
            <button className={styles.exitButton} onClick={onExit}>
              Back to Menu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
