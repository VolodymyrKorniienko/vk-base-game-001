'use client';

import { StarRating } from './StarRating';
import { GameStats } from './GameStats';
import type { GameResult } from '../../game/types';
import styles from './ResultScreen.module.css';

interface ResultScreenProps {
  result: GameResult;
  onContinue: () => void;
  onRestart: () => void;
  onShare?: () => void;
}

export function ResultScreen({ result, onContinue, onRestart, onShare }: ResultScreenProps) {
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.result}>
      <div className={styles.content}>
        <h2 className={styles.title}>Level Complete!</h2>
        <StarRating stars={result.stars} size="large" />
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
            <span className={styles.statValue}>{formatTime(result.timeElapsed)}</span>
          </div>
        </div>
        <div className={styles.actions}>
          {onShare && (
            <button className={styles.shareButton} onClick={onShare}>
              Share Result
            </button>
          )}
          <button className={styles.continueButton} onClick={onContinue}>
            Continue
          </button>
          <button className={styles.restartButton} onClick={onRestart}>
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
