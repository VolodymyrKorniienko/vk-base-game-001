'use client';

import { useAccount } from 'wagmi';
import styles from './WalletConnect.module.css';

export function WalletConnect() {
  const { address, isConnected } = useAccount();

  return (
    <div className={styles.container}>
      {isConnected && address ? (
        <div className={styles.connected}>
          Connected: {address.slice(0, 6)}…{address.slice(-4)}
        </div>
      ) : (
        <button
          className={styles.button}
          // OnchainKit откроет модальное окно сам благодаря miniKit.enabled
          onClick={() => {}}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
