'use client';

import Image from 'next/image';
import styles from './PreviewIntroScreen.module.css';

interface PreviewIntroScreenProps {
  onStartGame: () => void;
}

export function PreviewIntroScreen({ onStartGame }: PreviewIntroScreenProps) {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundGlow} />
      
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            <Image
              src="/preview-intro.svg"
              alt="Improve Your Memory Game"
              width={600}
              height={315}
              className={styles.logoImage}
              priority
            />
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>6 Challenging Levels</h3>
              <p className={styles.featureDescription}>
                Progress from 3×4 to 6×6 grid. Test your limits!
              </p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⭐</div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>Earn Stars</h3>
              <p className={styles.featureDescription}>
                Complete levels with fewer moves for 3-star rating.
              </p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏆</div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>Win NFT Rewards</h3>
              <p className={styles.featureDescription}>
                Complete levels with ≤20 moves and mint exclusive NFTs on Base!
              </p>
            </div>
          </div>
        </div>

        <div className={styles.nftBadge}>
          <div className={styles.nftBadgeGlow} />
          <span className={styles.nftBadgeIcon}>✨</span>
          <div className={styles.nftBadgeText}>
            <strong>On-Chain Achievements</strong>
            <span>Powered by Base</span>
          </div>
        </div>

        <button
          className={styles.startButton}
          onClick={onStartGame}
        >
          <span className={styles.startButtonText}>Start Training</span>
          <span className={styles.startButtonArrow}>→</span>
        </button>

        <p className={styles.hint}>
          Free to play • Gasless NFT minting
        </p>
      </div>
    </div>
  );
}
