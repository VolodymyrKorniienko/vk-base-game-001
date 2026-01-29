'use client';

import { isContractConfigured } from '../../web3/contracts/BaseMemoryGame';
import styles from './TransactionStatus.module.css';

interface TransactionStatusProps {
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  message?: string;
}

export function TransactionStatus({ isPending, isSuccess, error, message }: TransactionStatusProps) {
  // Не показываем статус, если контракт не настроен
  if (!isContractConfigured()) {
    return null;
  }

  if (!isPending && !isSuccess && !error) {
    return null;
  }

  return (
    <div className={styles.status}>
      {isPending && (
        <div className={styles.pending}>
          <span className={styles.spinner}>⏳</span>
          <span>{message || 'Processing transaction...'}</span>
        </div>
      )}
      {isSuccess && (
        <div className={styles.success}>
          <span>✅</span>
          <span>Transaction confirmed!</span>
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
