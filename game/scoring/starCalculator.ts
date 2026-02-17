import type { GameResult, GameConfig } from '../types';

type PerformanceMetrics = Pick<GameResult, 'moves' | 'mistakes' | 'timeElapsed'>;

export interface StarCriteria {
  maxMoves: number;
  maxMistakes: number;
  maxTime: number;
}

export function calculateStars(
  result: PerformanceMetrics,
  config: GameConfig
): number {
  const totalPairs = (config.rows * config.cols) / 2;
  const idealMoves = totalPairs;
  const maxMoves = totalPairs * 2.5;
  const maxMistakes = totalPairs * 0.5;
  const maxTime = config.previewDuration * 10;

  const moveScore = Math.max(0, 1 - (result.moves - idealMoves) / (maxMoves - idealMoves));
  const mistakeScore = Math.max(0, 1 - result.mistakes / maxMistakes);
  const timeScore = Math.max(0, 1 - result.timeElapsed / maxTime);

  const totalScore = (moveScore * 0.4 + mistakeScore * 0.4 + timeScore * 0.2);

  if (totalScore >= 0.8) return 3;
  if (totalScore >= 0.5) return 2;
  return 1;
}

export function getStarCriteria(config: GameConfig): StarCriteria {
  const totalPairs = (config.rows * config.cols) / 2;
  return {
    maxMoves: Math.ceil(totalPairs * 2.5),
    maxMistakes: Math.ceil(totalPairs * 0.5),
    maxTime: config.previewDuration * 10,
  };
}
