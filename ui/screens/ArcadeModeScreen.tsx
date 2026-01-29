'use client';

import { useState, useCallback } from 'react';
import { ArcadeMode } from '../../game/modes';
import { GameScreen } from './GameScreen';
import { MenuScreen } from './MenuScreen';
import { useGameContract } from '../../web3/hooks/useGameContract';
import { shareToTwitter, shareToFarcaster } from '../../social';
import { TransactionStatus } from '../components/TransactionStatus';
import type { GameResult } from '../../game/types';
import styles from './ArcadeModeScreen.module.css';

type ScreenState = 'menu' | 'playing' | 'result';

export function ArcadeModeScreen() {
  const [arcadeMode] = useState(() => new ArcadeMode());
  const [screenState, setScreenState] = useState<ScreenState>('menu');
  const [currentResult, setCurrentResult] = useState<GameResult | null>(null);
  const { startSession, finishGame, isPending, isSuccess, error } = useGameContract();

  const handleStartArcade = useCallback(async () => {
    try {
      await startSession();
    } catch (error) {
      // Игнорируем ошибки контракта, игра продолжает работать
      console.log('Contract call failed, continuing without on-chain features');
    }
    arcadeMode.startRound();
    setScreenState('playing');
  }, [arcadeMode, startSession]);

  const handleGameComplete = useCallback(
    async (result: GameResult) => {
      setCurrentResult(result);
      setScreenState('result');
      arcadeMode.completeRound(result);

      try {
        await finishGame(result.moves);
      } catch (error) {
        // Игнорируем ошибки контракта, игра продолжает работать
        console.log('Contract call failed, continuing without on-chain features');
      }
    },
    [arcadeMode, finishGame]
  );

  const handleContinue = useCallback(() => {
    arcadeMode.startRound();
    setScreenState('playing');
    setCurrentResult(null);
  }, [arcadeMode]);

  const handleRestart = useCallback(() => {
    arcadeMode.reset();
    arcadeMode.startRound();
    setScreenState('playing');
    setCurrentResult(null);
  }, [arcadeMode]);

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
    arcadeMode.reset();
  }, [arcadeMode]);

  const currentConfig = arcadeMode.getCurrentConfig();
  const stats = arcadeMode.getStats();

  if (screenState === 'menu') {
    return <MenuScreen onStartStage={() => {}} onStartArcade={handleStartArcade} />;
  }

  if (screenState === 'result' && currentResult && currentConfig) {
    return (
      <div className={styles.container}>
        <div className={styles.resultWrapper}>
          <h2 className={styles.title}>Round Complete!</h2>
          <div className={styles.roundInfo}>
            Round {stats.roundsCompleted} completed
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
            <div className={styles.arcadeStats}>
              <h3>Arcade Stats</h3>
              <div className={styles.arcadeStatRow}>
                <span>Total Rounds:</span>
                <span>{stats.roundsCompleted}</span>
              </div>
              <div className={styles.arcadeStatRow}>
                <span>Total Moves:</span>
                <span>{stats.totalMoves}</span>
              </div>
              {stats.bestRound && (
                <div className={styles.bestRound}>
                  <h4>Best Round</h4>
                  <div className={styles.arcadeStatRow}>
                    <span>Moves:</span>
                    <span>{stats.bestRound.moves}</span>
                  </div>
                </div>
              )}
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
              <button
                className={styles.continueButton}
                onClick={handleContinue}
                disabled={isPending}
              >
                Next Round
              </button>
              <button
                className={styles.restartButton}
                onClick={handleRestart}
                disabled={isPending}
              >
                Restart Arcade
              </button>
              <button
                className={styles.menuButton}
                onClick={handleBackToMenu}
                disabled={isPending}
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentConfig) {
    return (
      <GameScreen
        config={currentConfig}
        onComplete={handleGameComplete}
        onExit={handleBackToMenu}
      />
    );
  }

  return null;
}
