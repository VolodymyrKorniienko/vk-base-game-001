import type { Card, CardState, GameState, GameConfig, GameStats, GameResult } from '../types';
import { calculateStars } from '../scoring';
import { selectAssetPairs } from '../assets';

export class MemoryEngine {
  private cards: Card[] = [];
  private state: GameState = 'idle';
  private stats: GameStats;
  private config: GameConfig;
  private revealedCards: number[] = [];
  private matchedPairs: number = 0;

  constructor(config: GameConfig) {
    this.config = config;
    this.stats = {
      moves: 0,
      mistakes: 0,
      startTime: Date.now(),
      timeElapsed: 0,
    };
  }

  initialize(): void {
    const totalCards = this.config.rows * this.config.cols;
    const pairs = totalCards / 2;
    
    if (totalCards % 2 !== 0) {
      throw new Error('Grid must have even number of cards');
    }

    const assetPairs = selectAssetPairs({
      count: pairs,
      categories: this.config.categories,
    });

    const valueByAssetId = new Map<string, number>();
    let nextValue = 0;

    const cardData: Array<{ value: number; image: string }> = assetPairs.map((asset) => {
      const existingValue = valueByAssetId.get(asset.id);
      if (existingValue !== undefined) {
        return { value: existingValue, image: asset.src };
      }
      const assignedValue = nextValue++;
      valueByAssetId.set(asset.id, assignedValue);
      return { value: assignedValue, image: asset.src };
    });

    this.shuffleArray(cardData);

    this.cards = cardData.map((data, index) => ({
      id: `card-${index}`,
      value: data.value,
      image: data.image,
      state: 'hidden' as CardState,
      position: index,
    }));

    this.state = 'idle';
    this.revealedCards = [];
    this.matchedPairs = 0;
    this.stats = {
      moves: 0,
      mistakes: 0,
      startTime: Date.now(),
      timeElapsed: 0,
    };
  }

  startPreview(): void {
    if (this.state !== 'idle') {
      throw new Error('Game must be in idle state to start preview');
    }
    this.state = 'preview';
    this.revealAllCards();
  }

  startGame(): void {
    if (this.state !== 'preview') {
      throw new Error('Game must be in preview state to start');
    }
    this.state = 'playing';
    this.hideAllCards();
    this.stats.startTime = Date.now();
  }

  revealCard(position: number): boolean {
    if (this.state !== 'playing') {
      return false;
    }

    const card = this.cards[position];
    if (!card || card.state !== 'hidden') {
      return false;
    }

    if (this.revealedCards.length >= 2) {
      return false;
    }

    card.state = 'revealed';
    this.revealedCards.push(position);

    if (this.revealedCards.length === 2) {
      this.processRevealedPair();
    }

    return true;
  }

  private processRevealedPair(): void {
    const [pos1, pos2] = this.revealedCards;
    const card1 = this.cards[pos1];
    const card2 = this.cards[pos2];

    if (!card1 || !card2) {
      return;
    }

    this.stats.moves++;

    if (card1.value === card2.value) {
      card1.state = 'matched';
      card2.state = 'matched';
      this.matchedPairs++;
      this.revealedCards = [];
      
      if (this.isGameComplete()) {
        this.finishGame();
      }
    } else {
      this.stats.mistakes++;
      setTimeout(() => {
        this.flipBackCards(pos1, pos2);
      }, 1000);
    }
  }

  private flipBackCards(pos1: number, pos2: number): void {
    if (this.state !== 'playing') {
      return;
    }

    const card1 = this.cards[pos1];
    const card2 = this.cards[pos2];

    if (card1 && card1.state === 'revealed') {
      card1.state = 'hidden';
    }
    if (card2 && card2.state === 'revealed') {
      card2.state = 'hidden';
    }

    this.revealedCards = [];
  }

  private revealAllCards(): void {
    this.cards.forEach((card) => {
      card.state = 'revealed';
    });
  }

  private hideAllCards(): void {
    this.cards.forEach((card) => {
      if (card.state !== 'matched') {
        card.state = 'hidden';
      }
    });
    this.revealedCards = [];
  }

  private isGameComplete(): boolean {
    return this.matchedPairs === this.cards.length / 2;
  }

  private finishGame(): void {
    this.state = 'finished';
    this.stats.endTime = Date.now();
    this.stats.timeElapsed = this.stats.endTime - this.stats.startTime;
  }

  getCards(): Card[] {
    return [...this.cards];
  }

  getState(): GameState {
    return this.state;
  }

  getStats(): GameStats {
    const currentStats = { ...this.stats };
    if (this.state === 'playing') {
      currentStats.timeElapsed = Date.now() - this.stats.startTime;
    }
    return currentStats;
  }

  getResult(): GameResult | null {
    if (this.state !== 'finished') {
      return null;
    }

    const stars = calculateStars(
      {
        moves: this.stats.moves,
        mistakes: this.stats.mistakes,
        timeElapsed: this.stats.timeElapsed,
      },
      this.config
    );
    return {
      completed: true,
      moves: this.stats.moves,
      mistakes: this.stats.mistakes,
      timeElapsed: this.stats.timeElapsed,
      stars,
    };
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  pause(): void {
    if (this.state === 'playing') {
      this.state = 'paused';
    }
  }

  resume(): void {
    if (this.state === 'paused') {
      this.state = 'playing';
    }
  }

  reset(): void {
    this.initialize();
  }
}
