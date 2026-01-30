'use client';

import { useAccount } from 'wagmi';
import { useConnectModal } from '@coinbase/onchainkit';
import styles from './WalletConnect.module.css';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (isConnected && address) {
    return (
      <div className={styles.connected}>
        Connected: {address.slice(0, 6)}…{address.slice(-4)}
      </div>
    );
  }

  return (
    <button className={styles.button} onClick={openConnectModal}>
      Connect Wallet
    </button>
  );
}
