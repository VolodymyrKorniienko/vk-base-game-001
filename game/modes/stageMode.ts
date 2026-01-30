import { MemoryEngine } from '../engine';
import type { LevelConfig, GameResult, GameConfig } from '../types';

export class StageMode {
  private currentLevelIndex = 0;
  private levels: LevelConfig[];
  private engine: MemoryEngine | null = null;
  private completedLevels: Set<number> = new Set();

  constructor(levels: LevelConfig[]) {
    this.levels = levels;
  }

  startLevel(levelId?: string): MemoryEngine {
    const level = levelId !== undefined
      ? this.levels.find((l) => l.id === levelId)
      : this.levels[this.currentLevelIndex];

    if (!level) {
      throw new Error(`Level not found: ${levelId ?? 'current'}`);
    }

    const gameConfig: GameConfig = {
      rows: level.rows,
      cols: level.cols,
      previewDuration: level.previewDuration,
    };

    this.engine = new MemoryEngine(gameConfig);
    this.engine.initialize();

    return this.engine;
  }

  getCurrentLevel(): LevelConfig | null {
    return this.levels[this.currentLevelIndex] ?? null;
  }

  completeLevel(result: GameResult): boolean {
    if (!this.engine) return false;

    const currentLevel = this.getCurrentLevel();
    if (!currentLevel) return false;

    this.completedLevels.add(currentLevel.id);

    if (this.currentLevelIndex < this.levels.length - 1) {
      this.currentLevelIndex++;
      return true;
    }

    return false;
  }

  hasNextLevel(): boolean {
    return this.currentLevelIndex < this.levels.length - 1;
  }

  getNextLevel(): LevelConfig | null {
    return this.hasNextLevel()
      ? this.levels[this.currentLevelIndex + 1]
      : null;
  }

  getProgress(): { current: number; total: number; completed: number } {
    return {
      current: this.currentLevelIndex + 1,
      total: this.levels.length,
      completed: this.completedLevels.size,
    };
  }

  reset(): void {
    this.currentLevelIndex = 0;
    this.completedLevels.clear();
    this.engine = null;
  }

  getEngine(): MemoryEngine | null {
    return this.engine;
  }
}
