const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: ""
  },
  miniapp: {
    version: "1",
    name: "Improve Your Memory", 
    subtitle: "Memory Puzzle Game with NFT Achievements", 
    description: "Test your memory skills, complete levels, and earn on-chain NFT achievements on Base",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#667eea",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "games",
    tags: ["memory", "puzzle", "game", "nft", "achievements", "base"],
    heroImageUrl: `${ROOT_URL}/hero.png`, 
    tagline: "Challenge your memory and earn NFT achievements",
    ogTitle: "Improve Your Memory - Base Mini-App",
    ogDescription: "Memory puzzle game with on-chain NFT achievements on Base",
    ogImageUrl: `${ROOT_URL}/screenshot.png`,
  },
} as const;

