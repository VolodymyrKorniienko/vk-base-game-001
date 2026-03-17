'use client';

import { ThemeToggle } from '../components/ThemeToggle';
import styles from './MenuScreen.module.css';

interface MenuScreenProps {
  onStartStage: () => void;
}

export function MenuScreen({ onStartStage }: MenuScreenProps) {
  return (
    <div className={styles.menu}>
      <ThemeToggle />
      <div className={styles.content}>
        <h1 className={styles.title}>Improve Your Memory</h1>
        <p className={styles.subtitle}>Test your memory skills and earn NFT achievements!</p>
        <div className={styles.modes}>
          <button
            type="button"
            className={styles.modeButton}
            onClick={onStartStage}
          >
            <span className={styles.modeTitle}>Stage Mode</span>
            <span className={styles.modeDescription}>
              Progress through levels with increasing difficulty
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
