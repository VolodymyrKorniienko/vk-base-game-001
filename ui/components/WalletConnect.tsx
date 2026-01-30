'use client';

import { useAccount } from 'wagmi';
import styles from './WalletConnect.module.css';

export function WalletConnect() {
  const { address, isConnected } = useAccount();

  if (isConnected && address) {
    return (
      <div className={styles.connected}>
        Connected: {address.slice(0, 6)}…{address.slice(-4)}
      </div>
    );
  }

  return (
    <button className={styles.button} onClick={() => { /* OnchainKit modal откроется автоматически */ }}>
      Connect Wallet
    </button>
  );
}
