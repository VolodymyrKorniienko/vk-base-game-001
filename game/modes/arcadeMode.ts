import { MemoryEngine } from '../engine';
import type { GameConfig, GameResult } from '../types';
import { ARCADE_CONFIGS } from '../levels/config';

export interface ArcadeStats {
  roundsCompleted: number;
  totalMoves: number;
  totalMistakes: number;
  totalTime: number;
  bestRound: {
    moves: number;
    mistakes: number;
    time: number;
  } | null;
}

export class ArcadeMode {
  private engine: MemoryEngine | null = null;
  private currentRound: number = 0;
  private stats: ArcadeStats;
  private configs: GameConfig[];

  constructor() {
    this.configs = [...ARCADE_CONFIGS];
    this.stats = {
      roundsCompleted: 0,
      totalMoves: 0,
      totalMistakes: 0,
      totalTime: 0,
      bestRound: null,
    };
  }

  startRound(): MemoryEngine {
    const configIndex = Math.min(this.currentRound, this.configs.length - 1);
    const config = this.configs[configIndex];

    this.engine = new MemoryEngine(config);
    this.engine.initialize();
    return this.engine;
  }

  completeRound(result: GameResult): void {
    if (!result.completed) {
      return;
    }

    this.stats.roundsCompleted++;
    this.stats.totalMoves += result.moves;
    this.stats.totalMistakes += result.mistakes;
    this.stats.totalTime += result.timeElapsed;

    if (
      !this.stats.bestRound ||
      result.moves < this.stats.bestRound.moves ||
      (result.moves === this.stats.bestRound.moves &&
        result.mistakes < this.stats.bestRound.mistakes)
    ) {
      this.stats.bestRound = {
        moves: result.moves,
        mistakes: result.mistakes,
        time: result.timeElapsed,
      };
    }

    this.currentRound++;
  }

  getCurrentConfig(): GameConfig | null {
    if (this.currentRound >= this.configs.length) {
      return this.configs[this.configs.length - 1];
    }
    return this.configs[this.currentRound] || null;
  }

  getStats(): ArcadeStats {
    return { ...this.stats };
  }

  getEngine(): MemoryEngine | null {
    return this.engine;
  }

  reset(): void {
    this.currentRound = 0;
    this.engine = null;
    this.stats = {
      roundsCompleted: 0,
      totalMoves: 0,
      totalMistakes: 0,
      totalTime: 0,
      bestRound: null,
    };
  }
}
