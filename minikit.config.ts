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
    header: "eyJmaWQiOjIzNTU4MDAsInR5cGUiOiJhdXRoIiwia2V5IjoiMHhmNkQ0RDA2MjRhNGQ5ODNBMzhERmUzMTBBOTk4ZmI4MTA4ODJkZEQ3In0",
    payload: "eyJkb21haW4iOiJ2ay1iYXNlLWdhbWUtMDAxLnZlcmNlbC5hcHAifQ",
    signature: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEE8whSKpmDWssFlWKy4z6Klr_vSB-x2T3A2Dy_7HjtFlA2C15xxsTHA3scigOjRl1Vb5WZ6UUFVg3TwBDONU77hGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
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

