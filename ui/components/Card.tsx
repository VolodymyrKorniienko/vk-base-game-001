'use client';

import { memo } from 'react';
import Image from 'next/image';
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

  const isRevealed = card.state === 'revealed' || card.state === 'matched';
  const showImage = isRevealed && card.image;

  return (
    <button
      className={`${styles.card} ${styles[card.state]}`}
      onClick={handleClick}
      disabled={disabled || card.state === 'matched'}
      aria-label={`Card ${card.position + 1}`}
    >
      {showImage ? (
        <div className={styles.imageContainer}>
          <Image
            src={card.image}
            alt={`Card ${card.position + 1}`}
            fill
            sizes="(max-width: 768px) 20vw, 120px"
            className={styles.image}
          />
        </div>
      ) : (
        <span className={styles.content}>?</span>
      )}
    </button>
  );
});
