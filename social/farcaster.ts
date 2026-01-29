import type { GameResult } from '../game/types';

export function generateFarcasterShareText(result: GameResult): string {
  const stars = '★'.repeat(result.stars) + '☆'.repeat(3 - result.stars);
  return `🧠 Memory Game Complete! ${stars}\n\nMoves: ${result.moves} | Mistakes: ${result.mistakes}\n\n#Base #MemoryGame #OnChainGaming`;
}

export function shareToFarcaster(result: GameResult): void {
  const text = generateFarcasterShareText(result);
  
  if (navigator.share) {
    navigator.share({
      title: 'Memory Game Result',
      text,
      url: window.location.origin,
    }).catch((error) => {
      console.error('Error sharing to Farcaster:', error);
    });
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Result copied to clipboard! Share it on Farcaster.');
  }
}
