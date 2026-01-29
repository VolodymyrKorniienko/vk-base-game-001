'use client';

import type { GameStats as GameStatsType } from '../../game/types';
import styles from './GameStats.module.css';

interface GameStatsProps {
  stats: GameStatsType;
}

export function GameStats({ stats }: GameStatsProps) {
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
      <div className={styles.statItem}>
        <span className={styles.label}>Time</span>
        <span className={styles.value}>{formatTime(stats.timeElapsed)}</span>
      </div>
    </div>
  );
}
