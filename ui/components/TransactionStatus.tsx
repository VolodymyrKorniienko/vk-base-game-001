'use client';

import { isContractConfigured } from '../../web3/contracts/BaseMemoryGame';
import styles from './TransactionStatus.module.css';

interface TransactionStatusProps {
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  message?: string;
  mode?: 'transaction' | 'minting';
}

export function TransactionStatus({ isPending, isSuccess, error, message, mode = 'transaction' }: TransactionStatusProps) {
  // Не показываем статус, если контракт не настроен
  if (!isContractConfigured()) {
    return null;
  }

  if (!isPending && !isSuccess && !error) {
    return null;
  }

  const defaultMessages = {
    transaction: {
      pending: 'Processing transaction...',
      success: 'Transaction confirmed!',
    },
    minting: {
      pending: 'Minting your NFT achievement...',
      success: 'NFT minted successfully!',
    },
  };

  const messages = defaultMessages[mode];

  return (
    <div className={styles.status}>
      {isPending && (
        <div className={styles.pending}>
          <span className={styles.spinner}>⏳</span>
          <span>{message || messages.pending}</span>
        </div>
      )}
      {isSuccess && (
        <div className={styles.success}>
          <span>✅</span>
          <span>{messages.success}</span>
        </div>
      )}
      {error && (
        <div className={styles.error}>
          <span>❌</span>
          <span>{error.message || 'Transaction failed'}</span>
        </div>
      )}
    </div>
  );
}
