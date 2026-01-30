'use client';

import { useAccount } from 'wagmi';
import { useMiniKit } from '@coinbase/onchainkit';
import styles from './WalletConnect.module.css';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { open } = useMiniKit(); // мини-кит открывает модалку

  if (isConnected && address) {
    return (
      <div className={styles.connected}>
        Connected: {address.slice(0, 6)}…{address.slice(-4)}
      </div>
    );
  }

  return (
    <button className={styles.button} onClick={open}>
      Connect Wallet
    </button>
  );
}
