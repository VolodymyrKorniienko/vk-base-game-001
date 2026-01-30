export type CardState = 'hidden' | 'revealed' | 'matched';

export interface Card {
  id: string;
  value: number;
  state: CardState;
  position: number;
}

export type GameState = 'idle' | 'preview' | 'playing' | 'paused' | 'finished';

export interface GameConfig {
  rows: number;
  cols: number;
  previewDuration: number;
}

export interface GameStats {
  moves: number;
  mistakes: number;
  startTime: number;
  endTime?: number;
  timeElapsed: number;
}

export interface GameResult {
  completed: boolean;
  moves: number;
  mistakes: number;
  timeElapsed: number;
  stars: number;
}

export interface LevelConfig extends GameConfig {
  id: string;
  name: string;
  difficulty: number;

  starThresholds?: {
    three: number;
    two: number;
  };
}

