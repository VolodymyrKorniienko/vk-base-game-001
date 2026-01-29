'use client';

import { useEffect, useState, useCallback } from 'react';
import { MemoryEngine } from '../../game/engine';
import { GameGrid } from '../components/GameGrid';
import { GameStats } from '../components/GameStats';
import { PreviewScreen } from '../components/PreviewScreen';
import { ResultScreen } from '../components/ResultScreen';
import type { GameConfig, GameResult } from '../../game/types';
import styles from './GameScreen.module.css';

interface GameScreenProps {
  config: GameConfig;
  onComplete: (result: GameResult) => void;
  onExit?: () => void;
}

export function GameScreen({ config, onComplete, onExit }: GameScreenProps) {
  const [engine, setEngine] = useState<MemoryEngine | null>(null);
  const [previewTime, setPreviewTime] = useState(config.previewDuration);
  const [isPreviewActive, setIsPreviewActive] = useState(false);

  useEffect(() => {
    const newEngine = new MemoryEngine(config);
    newEngine.initialize();
    setEngine(newEngine);
    setPreviewTime(config.previewDuration);
    setIsPreviewActive(true);
    newEngine.startPreview();
  }, [config]);

  const handleStartGame = useCallback(() => {
    if (!engine) return;
    engine.startGame();
    setIsPreviewActive(false);
    setPreviewTime(0);
  }, [engine]);

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
      if (!engine || isPreviewActive) return;
      engine.revealCard(position);

      const result = engine.getResult();
      if (result) {
        setTimeout(() => {
          onComplete(result);
        }, 500);
      }
    },
    [engine, isPreviewActive, onComplete]
  );

  const handleContinue = useCallback(() => {
    const result = engine?.getResult();
    if (result) {
      onComplete(result);
    }
  }, [engine, onComplete]);

  const handleRestart = useCallback(() => {
    if (!engine) return;
    engine.reset();
    engine.startPreview();
    setPreviewTime(config.previewDuration);
    setIsPreviewActive(true);
  }, [engine, config.previewDuration]);

  if (!engine) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const gameState = engine.getState();
  const cards = engine.getCards();
  const stats = engine.getStats();
  const result = engine.getResult();

  if (gameState === 'preview' || isPreviewActive) {
    return (
      <PreviewScreen
        duration={config.previewDuration}
        remainingTime={previewTime}
        onStart={handleStartGame}
        onSkip={handleSkipPreview}
      />
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
      <GameStats stats={stats} />
      <GameGrid
        cards={cards}
        onCardClick={handleCardClick}
        rows={config.rows}
        cols={config.cols}
      />
    </div>
  );
}
