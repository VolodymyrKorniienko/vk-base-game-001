"use client";
import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { StageModeScreen } from "../ui/screens/StageModeScreen";
import { ArcadeModeScreen } from "../ui/screens/ArcadeModeScreen";
import { MenuScreen, type GameMode } from "../ui/screens/MenuScreen";
import styles from "./page.module.css";

export default function Home() {
  const { isFrameReady, setFrameReady } = useMiniKit();
  const [isReady, setIsReady] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    } else {
      setIsReady(true);
    }
  }, [setFrameReady, isFrameReady]);

  const handleStartStage = () => {
    setGameMode('stage');
  };

  const handleStartArcade = () => {
    setGameMode('arcade');
  };

  const _handleBackToMenu = () => {
    setGameMode(null);
  };

  if (!isReady) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}>Loading...</div>
      </div>
    );
  }

  if (gameMode === 'stage') {
    return <StageModeScreen />;
  }

  if (gameMode === 'arcade') {
    return <ArcadeModeScreen />;
  }

  return (
    <div className={styles.container}>
      <MenuScreen onStartStage={handleStartStage} onStartArcade={handleStartArcade} />
    </div>
  );
}
