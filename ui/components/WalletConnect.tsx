'use client';

import { useAccount, useConnectModal } from '@coinbase/onchainkit';
import styles from './WalletConnect.module.css';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (isConnected && address) {
    return (
      <div className={styles.connected}>
        <span className={styles.address}>
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </span>
      </div>
    );
  }

  return (
    <button className={styles.connectButton} onClick={openConnectModal}>
      Connect Wallet
    </button>
  );
}
