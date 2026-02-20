"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { StageModeScreen } from "../ui/screens/StageModeScreen";
import { ArcadeModeScreen } from "../ui/screens/ArcadeModeScreen";
import { MenuScreen, type GameMode } from "../ui/screens/MenuScreen";
import styles from "./page.module.css";

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const frameReadyCalled = useRef(false);

  useEffect(() => {
    if (!frameReadyCalled.current) {
      frameReadyCalled.current = true;
      setFrameReady({ disableNativeGestures: true });
    }
  }, [setFrameReady]);

  const handleStartStage = useCallback(() => {
    setGameMode('stage');
  }, []);

  const handleStartArcade = useCallback(() => {
    setGameMode('arcade');
  }, []);

  if (gameMode === 'stage') {
    return <StageModeScreen />;
  }

  if (gameMode === 'arcade') {
    return <ArcadeModeScreen />;
  }

  if (!isFrameReady) {
    return (
      <div className={styles.loading}>
        <span className={styles.loader}>Loading...</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <MenuScreen onStartStage={handleStartStage} onStartArcade={handleStartArcade} />
    </div>
  );
}
