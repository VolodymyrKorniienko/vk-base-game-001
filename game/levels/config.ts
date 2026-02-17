import type { GameConfig, LevelConfig } from '../types';
import type { CardCategory } from '../assets';

const STAGE_CATEGORY: CardCategory[] = ['coins'];

export const STAGE_LEVELS: LevelConfig[] = [
  {
    id: 'stage-1',
    name: 'Easy Start',
    difficulty: 1,
    rows: 2,
    cols: 2,
    previewDuration: 3000,
    categories: STAGE_CATEGORY,
  },
  {
    id: 'stage-2',
    name: 'Getting Started',
    difficulty: 2,
    rows: 2,
    cols: 3,
    previewDuration: 4000,
    categories: STAGE_CATEGORY,
  },
  {
    id: 'stage-3',
    name: 'Warming Up',
    difficulty: 3,
    rows: 3,
    cols: 4,
    previewDuration: 5000,
    categories: STAGE_CATEGORY,
  },
  {
    id: 'stage-4',
    name: 'Challenge',
    difficulty: 4,
    rows: 4,
    cols: 4,
    previewDuration: 6000,
    categories: STAGE_CATEGORY,
  },
  {
    id: 'stage-5',
    name: 'Expert',
    difficulty: 5,
    rows: 4,
    cols: 5,
    previewDuration: 7000,
    categories: STAGE_CATEGORY,
  },
  {
    id: 'stage-6',
    name: 'Master',
    difficulty: 6,
    rows: 5,
    cols: 6,
    previewDuration: 8000,
    categories: STAGE_CATEGORY,
  },
];

const ARCADE_CATEGORY: CardCategory[] = ['mixed'];

export const ARCADE_CONFIGS: GameConfig[] = [
  { rows: 2, cols: 2, previewDuration: 3000, categories: ARCADE_CATEGORY },
  { rows: 2, cols: 3, previewDuration: 4000, categories: ARCADE_CATEGORY },
  { rows: 3, cols: 4, previewDuration: 5000, categories: ARCADE_CATEGORY },
  { rows: 4, cols: 4, previewDuration: 6000, categories: ARCADE_CATEGORY },
  { rows: 4, cols: 5, previewDuration: 7000, categories: ARCADE_CATEGORY },
];

export function getLevelById(id: string): LevelConfig | undefined {
  return STAGE_LEVELS.find((level) => level.id === id);
}

export function getNextLevel(currentLevelId: string): LevelConfig | null {
  const index = STAGE_LEVELS.findIndex((l) => l.id === currentLevelId);
  return index >= 0 && index < STAGE_LEVELS.length - 1
    ? STAGE_LEVELS[index + 1]
    : null;
}
