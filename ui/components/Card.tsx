'use client';

import { memo } from 'react';
import type { Card as CardType } from '../../game/types';
import styles from './Card.module.css';

interface CardProps {
  card: CardType;
  onClick: () => void;
  disabled?: boolean;
}

export const Card = memo(function Card({ card, onClick, disabled }: CardProps) {
  const handleClick = () => {
    if (disabled || card.state === 'matched' || card.state === 'revealed') {
      return;
    }
    onClick();
  };

  const getCardContent = () => {
    if (card.state === 'hidden') {
      return '?';
    }
    return card.value;
  };

  return (
    <button
      className={`${styles.card} ${styles[card.state]}`}
      onClick={handleClick}
      disabled={disabled || card.state === 'matched'}
      aria-label={`Card ${card.position + 1}`}
    >
      <span className={styles.content}>{getCardContent()}</span>
    </button>
  );
});
