'use client';

import { Card } from './Card';
import type { Card as CardType } from '../../game/types';
import styles from './GameGrid.module.css';

interface GameGridProps {
  cards: CardType[];
  onCardClick: (position: number) => void;
  disabled?: boolean;
  rows: number;
  cols: number;
}

export function GameGrid({ cards, onCardClick, disabled, rows, cols }: GameGridProps) {
  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onClick={() => onCardClick(card.position)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
