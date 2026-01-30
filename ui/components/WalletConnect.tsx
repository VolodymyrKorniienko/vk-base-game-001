'use client';

import { useAccount } from 'wagmi';
import { useOnchainKit } from '@coinbase/onchainkit';
import styles from './WalletConnect.module.css';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { open } = useOnchainKit(); // хук OnchainKit для открытия модалки

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
          onClick={open} // теперь кнопка реально вызывает модалку
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
