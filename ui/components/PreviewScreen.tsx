'use client';

import { useEffect, useState } from 'react';
import styles from './PreviewScreen.module.css';

interface PreviewScreenProps {
  duration: number;
  onStart: () => void;
  onSkip: () => void;
  remainingTime: number;
}

export function PreviewScreen({ duration, onStart, onSkip, remainingTime }: PreviewScreenProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      const newProgress = (remainingTime / duration) * 100;
      setProgress(Math.max(0, newProgress));
    }, 50);

    return () => clearInterval(interval);
  }, [remainingTime, duration]);

  return (
    <div className={styles.preview}>
      <div className={styles.content}>
        <h2 className={styles.title}>Memorize the Cards</h2>
        <div className={styles.timer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.time}>{Math.ceil(remainingTime / 1000)}s</span>
        </div>
        <div className={styles.actions}>
          <button className={styles.startButton} onClick={onStart}>
            I Memorized — Start
          </button>
          <button className={styles.skipButton} onClick={onSkip}>
            Skip Preview
          </button>
        </div>
      </div>
    </div>
  );
}
