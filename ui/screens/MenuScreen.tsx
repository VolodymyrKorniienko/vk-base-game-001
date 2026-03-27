'use client';

import { ThemeToggle } from '../components/ThemeToggle';
import styles from './MenuScreen.module.css';

interface MenuScreenProps {
  onStartStage: () => void;
  onShowIntro?: () => void;
}

export function MenuScreen({ onStartStage, onShowIntro }: MenuScreenProps) {
  return (
    <div className={styles.menu}>
      <ThemeToggle />
      <div className={styles.content}>
        <h1 className={styles.title}>Improve Your Memory</h1>
        <p className={styles.subtitle}>Test your memory skills and earn NFT achievements!</p>
        
        <div className={styles.introCard}>
          <div className={styles.introIcon}>🎮</div>
          <div className={styles.introContent}>
            <h2 className={styles.introTitle}>New to the game?</h2>
            <p className={styles.introDescription}>
              Watch how to play and learn about NFT rewards
            </p>
          </div>
          <button
            type="button"
            className={styles.introButton}
            onClick={onShowIntro}
          >
            Watch Intro
          </button>
        </div>

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
