import type { GameConfig } from '../types';

export interface LevelConfig extends GameConfig {
  id: string;
  name: string;
  difficulty: number;
}

export const STAGE_LEVELS: LevelConfig[] = [
  {
    id: 'stage-1',
    name: 'Easy Start',
    difficulty: 1,
    rows: 2,
    cols: 2,
    previewDuration: 3000,
  },
  {
    id: 'stage-2',
    name: 'Getting Started',
    difficulty: 2,
    rows: 2,
    cols: 3,
    previewDuration: 4000,
  },
  {
    id: 'stage-3',
    name: 'Warming Up',
    difficulty: 3,
    rows: 3,
    cols: 4,
    previewDuration: 5000,
  },
  {
    id: 'stage-4',
    name: 'Challenge',
    difficulty: 4,
    rows: 4,
    cols: 4,
    previewDuration: 6000,
  },
  {
    id: 'stage-5',
    name: 'Expert',
    difficulty: 5,
    rows: 4,
    cols: 5,
    previewDuration: 7000,
  },
  {
    id: 'stage-6',
    name: 'Master',
    difficulty: 6,
    rows: 5,
    cols: 6,
    previewDuration: 8000,
  },
];

export const ARCADE_CONFIGS: GameConfig[] = [
  { rows: 2, cols: 2, previewDuration: 3000 },
  { rows: 2, cols: 3, previewDuration: 4000 },
  { rows: 3, cols: 4, previewDuration: 5000 },
  { rows: 4, cols: 4, previewDuration: 6000 },
  { rows: 4, cols: 5, previewDuration: 7000 },
];

export function getLevelById(id: string): LevelConfig | undefined {
  return STAGE_LEVELS.find((level) => level.id === id);
}

export function getNextLevel(currentLevelId: string): LevelConfig | null {
  const currentIndex = STAGE_LEVELS.findIndex((level) => level.id === currentLevelId);
  if (currentIndex === -1 || currentIndex === STAGE_LEVELS.length - 1) {
    return null;
  }
  return STAGE_LEVELS[currentIndex + 1];
}
