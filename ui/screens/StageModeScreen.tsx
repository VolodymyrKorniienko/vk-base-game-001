'use client';

import { useState, useCallback } from 'react';
import { StageMode } from '../../game/modes';
import { STAGE_LEVELS } from '../../game/levels/config';
import { GameScreen } from './GameScreen';
import { NFTClaimScreen } from '../components/NFTClaimScreen';
import { useGameContract } from '../../web3/hooks/useGameContract';
import { shareToTwitter, shareToFarcaster } from '../../social';
import { TransactionStatus } from '../components/TransactionStatus';
import type { GameResult } from '../../game/types';
import styles from './StageModeScreen.module.css';

type ScreenState = 'playing' | 'result' | 'nftClaim';

interface StageModeScreenProps {
  onBackToMenu?: () => void;
}

export function StageModeScreen({ onBackToMenu }: StageModeScreenProps) {
  const [stageMode] = useState(() => new StageMode(STAGE_LEVELS));
  const [screenState, setScreenState] = useState<ScreenState>('playing');
  const [currentResult, setCurrentResult] = useState<GameResult | null>(null);
  const { startSession, mintNFT, isPending, isSuccess, error } = useGameContract();

  const handleStartStage = useCallback(async () => {
    try {
      const currentLevel = stageMode.getCurrentLevel();
      if (currentLevel) {
        // Parse level number from level ID (e.g., "stage-1" -> 1)
        const levelNumber = parseInt(currentLevel.id.split('-')[1]) || 1;
        await startSession();
        // Note: startSessionForLevel could be used for more granular tracking
      }
    } catch (error) {
      // Игнорируем ошибки контракта, игра продолжает работать
      console.log('Contract call failed, continuing without on-chain features');
    }
    const engine = stageMode.startLevel();
    setScreenState('playing');
  }, [stageMode, startSession]);

  const handleGameComplete = useCallback(
    async (result: GameResult) => {
      setCurrentResult(result);
      setNftMinted(false);

      // Если игрок получил ≤20 ходов, показываем экран NFT Claim
      if (result.moves <= 20) {
        setScreenState('nftClaim');
        console.log('Eligible for NFT reward! Claim your NFT.');
      } else {
        setScreenState('result');
        console.log('Level completed! Moves:', result.moves);
      }
    },
    []
  );

  const handleContinue = useCallback(() => {
    if (!currentResult) return;

    // Завершаємо текущий уровень
    stageMode.completeLevel(currentResult);

    if (stageMode.hasNextLevel()) {
      const nextLevel = stageMode.getNextLevel();
      if (nextLevel) {
        stageMode.startLevel(nextLevel.id);
        setScreenState('playing');
        setCurrentResult(null);
      }
    } else {
      onBackToMenu?.();
      setCurrentResult(null);
      stageMode.reset();
    }
  }, [currentResult, stageMode, onBackToMenu]);

  const handleRestart = useCallback(() => {
    const currentLevel = stageMode.getCurrentLevel();
    if (currentLevel) {
      stageMode.startLevel(currentLevel.id);
      setScreenState('playing');
      setCurrentResult(null);
    }
  }, [stageMode]);

  const handleShare = useCallback(() => {
    if (!currentResult) return;
    shareToTwitter(currentResult);
  }, [currentResult]);

  const handleShareFarcaster = useCallback(() => {
    if (!currentResult) return;
    shareToFarcaster(currentResult);
  }, [currentResult]);

  const handleBackToMenu = useCallback(() => {
    onBackToMenu?.();
    setCurrentResult(null);
    stageMode.reset();
  }, [onBackToMenu]);

  const currentLevel = stageMode.getCurrentLevel();
  const progress = stageMode.getProgress();

  // NFT Claim Screen для игроков с ≤20 ходами
  if (screenState === 'nftClaim' && currentResult && currentLevel) {
    return (
      <NFTClaimScreen
        result={currentResult}
        onMint={mintNFT}
        onContinue={() => setScreenState('result')}
        isPending={isPending}
        isSuccess={isSuccess}
        error={error}
      />
    );
  }

  if (screenState === 'result' && currentResult && currentLevel) {
    const isEligibleForNFT = currentResult.moves <= 20;

    return (
      <div className={styles.container}>
        <div className={styles.resultWrapper}>
          <h2 className={styles.levelName}>{currentLevel.name}</h2>
          <div className={styles.progress}>
            Level {progress.current} of {progress.total}
          </div>
          {isEligibleForNFT && (
            <div className={styles.nftBadge}>
              🏆 NFT Achievement Unlocked!
            </div>
          )}
          <TransactionStatus
            isPending={isPending}
            isSuccess={isSuccess}
            error={error}
            mode="transaction"
            message="Recording your game on-chain..."
          />
          <div className={styles.resultContent}>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Moves</span>
                <span className={styles.statValue}>{currentResult.moves}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Mistakes</span>
                <span className={styles.statValue}>{currentResult.mistakes}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Stars</span>
                <span className={styles.statValue}>
                  {'★'.repeat(currentResult.stars)}
                  {'☆'.repeat(3 - currentResult.stars)}
                </span>
              </div>
            </div>
            <div className={styles.actions}>
              {stageMode.hasNextLevel() ? (
                <button
                  className={styles.continueButton}
                  onClick={handleContinue}
                  disabled={isPending}
                >
                  Next Level
                </button>
              ) : (
                <button
                  className={styles.continueButton}
                  onClick={handleBackToMenu}
                  disabled={isPending}
                >
                  Back to Menu
                </button>
              )}
              <button
                className={styles.restartButton}
                onClick={handleRestart}
                disabled={isPending}
              >
                Restart Level
              </button>
              <div className={styles.shareSeparator}></div>
              <button
                className={styles.shareButton}
                onClick={handleShare}
                disabled={isPending}
              >
                Share on Twitter
              </button>
              <button
                className={styles.shareButton}
                onClick={handleShareFarcaster}
                disabled={isPending}
              >
                Share on Farcaster
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentLevel) {
    return (
      <GameScreen
        config={currentLevel}
        onComplete={handleGameComplete}
        onExit={handleBackToMenu}
      />
    );
  }

  return null;
}
