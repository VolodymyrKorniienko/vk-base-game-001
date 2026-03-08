'use client';

import type { GameStats as GameStatsType } from '../../game/types';
import styles from './GameStats.module.css';

interface GameStatsProps {
  stats: GameStatsType;
  remainingTime?: number;
  timeLimit?: number;
}

export function GameStats({ stats, remainingTime, timeLimit }: GameStatsProps) {
  const hasTimer = remainingTime !== undefined && timeLimit !== undefined;
  const timerSeconds = hasTimer ? Math.ceil(remainingTime / 1000) : 0;
  const timerProgress = hasTimer ? remainingTime / timeLimit : 1;
  const isTimerCritical = hasTimer && timerSeconds <= 10;

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.stats}>
      <div className={styles.statItem}>
        <span className={styles.label}>Moves</span>
        <span className={styles.value}>{stats.moves}</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.label}>Mistakes</span>
        <span className={styles.value}>{stats.mistakes}</span>
      </div>
      {hasTimer ? (
        <div className={`${styles.statItem} ${styles.timerItem}`}>
          <span className={styles.label}>Timer</span>
          <div className={styles.timerWrapper}>
            <span className={`${styles.timerValue} ${isTimerCritical ? styles.timerCritical : ''}`}>
              {timerSeconds}s
            </span>
            <div className={styles.timerBar}>
              <div
                className={`${styles.timerFill} ${isTimerCritical ? styles.timerFillCritical : ''}`}
                style={{ width: `${timerProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.statItem}>
          <span className={styles.label}>Time</span>
          <span className={styles.value}>{formatTime(stats.timeElapsed)}</span>
        </div>
      )}
    </div>
  );
}
