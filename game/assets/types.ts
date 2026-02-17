export type CardCategory = 'abstract' | 'coins' | 'mascots' | 'mixed' | 'persons' | 'virtuals';

export interface CardAsset {
  id: string;
  src: string;
  category: CardCategory;
}
