'use client';

import { useAccount } from 'wagmi';
import styles from './WalletConnect.module.css';

export function WalletConnect() {
  const { address, isConnected } = useAccount();

  return (
    <div>
      {isConnected && address ? (
        <div className={styles.connected}>
          <span className={styles.address}>
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
        </div>
      ) : (
        <button
          className={styles.connectButton}
          // Модальное окно автоматически откроется через miniKit.enabled
          onClick={() => {}}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
