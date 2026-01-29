import { MemoryEngine } from '../engine';
import type { LevelConfig, GameResult } from '../types';
import { getNextLevel } from '../levels/config';

export class StageMode {
  private currentLevelIndex: number = 0;
  private levels: LevelConfig[];
  private engine: MemoryEngine | null = null;
  private completedLevels: Set<string> = new Set();

  constructor(levels: LevelConfig[]) {
    this.levels = levels;
  }

  startLevel(levelId?: string): MemoryEngine {
    const level = levelId
      ? this.levels.find((l) => l.id === levelId)
      : this.levels[this.currentLevelIndex];

    if (!level) {
      throw new Error(`Level not found: ${levelId || 'current'}`);
    }

    this.engine = new MemoryEngine(level);
    this.engine.initialize();
    return this.engine;
  }

  getCurrentLevel(): LevelConfig | null {
    return this.levels[this.currentLevelIndex] || null;
  }

  completeLevel(result: GameResult): boolean {
    if (!this.engine) {
      return false;
    }

    const currentLevel = this.getCurrentLevel();
    if (!currentLevel) {
      return false;
    }

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
    if (!this.hasNextLevel()) {
      return null;
    }
    return this.levels[this.currentLevelIndex + 1];
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
