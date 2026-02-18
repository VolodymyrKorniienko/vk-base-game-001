"use client";
import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { StageModeScreen } from "../ui/screens/StageModeScreen";
import { ArcadeModeScreen } from "../ui/screens/ArcadeModeScreen";
import { MenuScreen, type GameMode } from "../ui/screens/MenuScreen";
import styles from "./page.module.css";

export default function Home() {
  const { setFrameReady } = useMiniKit();
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  const handleStartStage = () => {
    setGameMode('stage');
  };

  const handleStartArcade = () => {
    setGameMode('arcade');
  };

  const _handleBackToMenu = () => {
    setGameMode(null);
  };

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
