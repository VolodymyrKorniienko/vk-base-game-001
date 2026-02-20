'use client';

import styles from './MenuScreen.module.css';

export type GameMode = 'stage' | 'arcade';

interface MenuScreenProps {
  onStartStage: () => void;
  onStartArcade: () => void;
}

export function MenuScreen({ onStartStage, onStartArcade }: MenuScreenProps) {
  return (
    <div className={styles.menu}>
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
          <button
            type="button"
            className={styles.modeButton}
            onClick={onStartArcade}
          >
            <span className={styles.modeTitle}>Arcade Mode</span>
            <span className={styles.modeDescription}>
              Endless rounds with progressive difficulty
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
