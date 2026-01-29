'use client';

import styles from './StarRating.module.css';

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: 'small' | 'medium' | 'large';
}

export function StarRating({ stars, maxStars = 3, size = 'medium' }: StarRatingProps) {
  return (
    <div className={`${styles.rating} ${styles[size]}`}>
      {Array.from({ length: maxStars }, (_, index) => (
        <span
          key={index}
          className={`${styles.star} ${index < stars ? styles.filled : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
