import type { GameResult } from '../game/types';

export function generateTwitterShareUrl(result: GameResult): string {
  const text = `I just completed a memory game level with ${result.stars} stars! 🧠✨\n\nMoves: ${result.moves} | Mistakes: ${result.mistakes}\n\n#Base #MemoryGame #OnChainGaming`;
  
  const params = new URLSearchParams({
    text,
    url: window.location.origin,
  });

  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function shareToTwitter(result: GameResult): void {
  const url = generateTwitterShareUrl(result);
  window.open(url, '_blank', 'width=550,height=420');
}
