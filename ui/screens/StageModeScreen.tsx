'use client';

import { useState, useCallback } from 'react';
import { StageMode } from '../../game/modes';
import { STAGE_LEVELS } from '../../game/levels/config';
import { GameScreen } from './GameScreen';
import { MenuScreen } from './MenuScreen';
import { useGameContract } from '../../web3/hooks/useGameContract';
import { shareToTwitter, shareToFarcaster } from '../../social';
import { TransactionStatus } from '../components/TransactionStatus';
import type { GameResult } from '../../game/types';
import styles from './StageModeScreen.module.css';

type ScreenState = 'menu' | 'playing' | 'result';

export function StageModeScreen() {
  const [stageMode] = useState(() => new StageMode(STAGE_LEVELS));
  const [screenState, setScreenState] = useState<ScreenState>('menu');
  const [currentResult, setCurrentResult] = useState<GameResult | null>(null);
  const { startSession, finishGame, isPending, isSuccess, error } = useGameContract();

  const handleStartStage = useCallback(async () => {
    try {
      await startSession();
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
      setScreenState('result');

      try {
        await finishGame(result.moves);
      } catch (error) {
        // Игнорируем ошибки контракта, игра продолжает работать
        console.log('Contract call failed, continuing without on-chain features');
      }
    },
    [finishGame]
  );

  const handleContinue = useCallback(() => {
    if (!currentResult) return;

    if (stageMode.hasNextLevel()) {
      const nextLevel = stageMode.getNextLevel();
      if (nextLevel) {
        stageMode.startLevel(nextLevel.id);
        setScreenState('playing');
        setCurrentResult(null);
      }
    } else {
      setScreenState('menu');
      setCurrentResult(null);
      stageMode.reset();
    }
  }, [currentResult, stageMode]);

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
    setScreenState('menu');
    setCurrentResult(null);
    stageMode.reset();
  }, [stageMode]);

  const currentLevel = stageMode.getCurrentLevel();
  const progress = stageMode.getProgress();

  if (screenState === 'menu') {
    return <MenuScreen onStartStage={handleStartStage} onStartArcade={() => {}} />;
  }

  if (screenState === 'result' && currentResult && currentLevel) {
    return (
      <div className={styles.container}>
        <div className={styles.resultWrapper}>
          <h2 className={styles.levelName}>{currentLevel.name}</h2>
          <div className={styles.progress}>
            Level {progress.current} of {progress.total}
          </div>
          <TransactionStatus
            isPending={isPending}
            isSuccess={isSuccess}
            error={error}
            message="Recording your achievement on-chain..."
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
