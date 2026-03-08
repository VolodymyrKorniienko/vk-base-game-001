'use client';

import { useEffect, useState, useCallback, useReducer, useRef } from 'react';
import { MemoryEngine } from '../../game/engine';
import { GameGrid } from '../components/GameGrid';
import { GameStats } from '../components/GameStats';
import { PreviewScreen } from '../components/PreviewScreen';
import { ResultScreen } from '../components/ResultScreen';
import { GameOverScreen } from '../components/GameOverScreen';
import type { GameConfig, GameResult } from '../../game/types';
import styles from './GameScreen.module.css';

const DEFAULT_TIME_LIMIT = 30_000;

interface GameScreenProps {
  config: GameConfig;
  onComplete: (result: GameResult) => void;
  onExit?: () => void;
  onGameOver?: (result: GameResult) => void;
}

export function GameScreen({ config, onComplete, onExit, onGameOver }: GameScreenProps) {
  const [engine, setEngine] = useState<MemoryEngine | null>(null);
  const [previewTime, setPreviewTime] = useState(config.previewDuration);
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverResult, setGameOverResult] = useState<GameResult | null>(null);
  const [remainingTime, setRemainingTime] = useState(config.timeLimit ?? DEFAULT_TIME_LIMIT);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const timeLimit = config.timeLimit ?? DEFAULT_TIME_LIMIT;

  useEffect(() => {
    const newEngine = new MemoryEngine(config);
    newEngine.initialize();
    setEngine(newEngine);
    setPreviewTime(config.previewDuration);
    setIsPreviewActive(true);
    setIsGameOver(false);
    setGameOverResult(null);
    setRemainingTime(timeLimit);
  }, [config, timeLimit]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleGameOver = useCallback(() => {
    stopTimer();
    if (!engine) return;

    engine.pause();
    const stats = engine.getStats();
    const result: GameResult = {
      completed: false,
      moves: stats.moves,
      mistakes: stats.mistakes,
      timeElapsed: timeLimit,
      stars: 0,
    };
    setGameOverResult(result);
    setIsGameOver(true);
    onGameOver?.(result);
  }, [engine, stopTimer, timeLimit, onGameOver]);

  const handleStartGame = useCallback(() => {
    if (!engine) return;
    engine.startGame();
    setIsPreviewActive(false);
    setPreviewTime(0);
    setRemainingTime(timeLimit);
    forceUpdate();

    stopTimer();
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        const next = prev - 100;
        if (next <= 0) {
          return 0;
        }
        return next;
      });
    }, 100);
  }, [engine, timeLimit, stopTimer]);

  // Отслеживаем достижение 0 и вызываем game over
  useEffect(() => {
    if (remainingTime <= 0 && !isPreviewActive && !isGameOver && engine?.getState() === 'playing') {
      handleGameOver();
    }
  }, [remainingTime, isPreviewActive, isGameOver, engine, handleGameOver]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  useEffect(() => {
    if (!isPreviewActive || !engine) return;

    const interval = setInterval(() => {
      setPreviewTime((prev) => {
        const newTime = prev - 100;
        if (newTime <= 0) {
          handleStartGame();
          return 0;
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPreviewActive, engine, handleStartGame]);

  const handleSkipPreview = useCallback(() => {
    handleStartGame();
  }, [handleStartGame]);

  const handleCardClick = useCallback(
    (position: number) => {
      if (!engine || isPreviewActive || isGameOver) return;
      const revealed = engine.revealCard(position);
      if (revealed) {
        forceUpdate();
      }

      const result = engine.getResult();
      if (result) {
        stopTimer();
        setTimeout(() => {
          onComplete(result);
        }, 500);
      } else {
        setTimeout(() => {
          forceUpdate();
        }, 1100);
      }
    },
    [engine, isPreviewActive, isGameOver, onComplete, stopTimer]
  );

  const handleContinue = useCallback(() => {
    const result = engine?.getResult();
    if (result) {
      onComplete(result);
    }
  }, [engine, onComplete]);

  const handleRestart = useCallback(() => {
    if (!engine) return;
    stopTimer();
    engine.reset();
    engine.startPreview();
    setPreviewTime(config.previewDuration);
    setIsPreviewActive(true);
    setIsGameOver(false);
    setGameOverResult(null);
    setRemainingTime(timeLimit);
    forceUpdate();
  }, [engine, config.previewDuration, timeLimit, stopTimer]);

  const handleRestartFromGameOver = useCallback(() => {
    handleRestart();
  }, [handleRestart]);

  if (!engine) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (isGameOver && gameOverResult) {
    return (
      <GameOverScreen
        result={gameOverResult}
        onRestart={handleRestartFromGameOver}
        onExit={onExit}
      />
    );
  }

  const cards = engine.getCards();
  const stats = engine.getStats();
  const result = engine.getResult();

  if (isPreviewActive) {
    return (
      <div className={styles.gameScreen}>
        {onExit && (
          <button className={styles.exitButton} onClick={onExit}>
            ✕
          </button>
        )}
        <PreviewScreen
          duration={config.previewDuration}
          remainingTime={previewTime}
          onStart={handleStartGame}
          onSkip={handleSkipPreview}
        />
        <GameGrid
          cards={cards}
          onCardClick={() => {}}
          disabled={true}
          rows={config.rows}
          cols={config.cols}
        />
      </div>
    );
  }

  if (result) {
    return (
      <ResultScreen
        result={result}
        onContinue={handleContinue}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className={styles.gameScreen}>
      {onExit && (
        <button className={styles.exitButton} onClick={onExit}>
          ✕
        </button>
      )}
      <GameStats stats={stats} remainingTime={remainingTime} timeLimit={timeLimit} />
      <GameGrid
        cards={cards}
        onCardClick={handleCardClick}
        rows={config.rows}
        cols={config.cols}
      />
    </div>
  );
}
