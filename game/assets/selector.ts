import type { CardAsset, CardCategory } from './types';
import { getAllAssets, getAssetsByCategories } from './registry';

function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export interface SelectAssetsOptions {
  count: number;
  categories?: CardCategory[];
}

export function selectAssetPairs(options: SelectAssetsOptions): CardAsset[] {
  const { count, categories } = options;

  if (count <= 0) {
    throw new Error('Count must be greater than 0');
  }

  let availableAssets: CardAsset[];

  if (categories && categories.length > 0) {
    availableAssets = getAssetsByCategories(categories);
  } else {
    availableAssets = getAllAssets();
  }

  if (availableAssets.length < count) {
    throw new Error(
      `Not enough assets available. Required: ${count}, Available: ${availableAssets.length}`
    );
  }

  const shuffled = [...availableAssets];
  shuffleArray(shuffled);

  const selected = shuffled.slice(0, count);

  const pairs: CardAsset[] = [];
  selected.forEach((asset) => {
    pairs.push(asset, { ...asset });
  });

  shuffleArray(pairs);

  return pairs;
}
