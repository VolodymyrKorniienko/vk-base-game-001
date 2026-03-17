"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { StageModeScreen } from "../ui/screens/StageModeScreen";
import { MenuScreen } from "../ui/screens/MenuScreen";
import styles from "./page.module.css";

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const [gameMode, setGameMode] = useState<'menu' | 'stage' | null>(null);
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

  const handleBackToMenu = useCallback(() => {
    setGameMode('menu');
  }, []);

  if (gameMode === 'stage') {
    return <StageModeScreen onBackToMenu={handleBackToMenu} />;
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
      <MenuScreen onStartStage={handleStartStage} />
    </div>
  );
}
