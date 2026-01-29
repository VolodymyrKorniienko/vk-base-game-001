# Improve Your Memory — Base Mini-App

Memory puzzle game built as a Base mini-app with on-chain NFT achievements, fully aligned with Base Builder Rewards requirements.

## Features

- 🧠 **Memory Game Mechanics**: Classic card matching game with preview phase
- 🎮 **Game Modes**: Stage Mode (progressive levels) and Arcade Mode (endless rounds)
- ⭐ **Scoring System**: Time, moves, mistakes tracking with star ratings
- 🏆 **On-Chain Achievements**: NFT rewards for completing levels with ≤20 moves
- 🔗 **Base Integration**: Gasless transactions via OnchainKit
- 📱 **Social Sharing**: Share results to Twitter and Farcaster
- 🎨 **Modern UI**: Beautiful, responsive design optimized for mobile

## Architecture

```
src/
 ├─ app/              # Next.js app router
 ├─ game/             # Game logic (off-chain)
 │   ├─ engine/       # Memory game engine
 │   ├─ modes/         # Stage & Arcade modes
 │   ├─ levels/       # Level configurations
 │   └─ scoring/      # Star calculation
 ├─ web3/             # Web3 integration
 │   ├─ contracts/    # Contract ABIs
 │   └─ hooks/         # React hooks for contracts
 ├─ ui/               # UI components
 │   ├─ screens/      # Game screens
 │   └─ components/   # Reusable components
 └─ social/           # Social sharing utilities
```

## Prerequisites

- Node.js 18+ and npm
- Base wallet (Coinbase Wallet or compatible)
- OnchainKit API key ([get one here](https://onchainkit.xyz))
- Deployed `BaseMemoryGame` contract on Base (mainnet or Sepolia)

## Setup

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Deploy the smart contract**:
   - Use Hardhat, Foundry, or Remix
   - Deploy `contracts/BaseMemoryGame.sol` to Base Sepolia (testnet) or Base mainnet
   - Save the contract address

3. **Configure environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...your_deployed_contract_address
```

4. **Update minikit config** (optional):
   - Edit `minikit.config.ts` to customize mini-app metadata
   - Update images in `public/` folder

5. **Run development server**:
```bash
npm run dev
```

Visit `http://localhost:3000` to play!

## Smart Contract Deployment

### Using Hardhat

1. Install Hardhat:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. Create `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

3. Deploy:
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

### Contract Functions

- `startSession()`: Called when a level starts
- `finishGame(uint256 totalMoves)`: Called when level completes
- NFT minted automatically if `totalMoves <= 20` and not already claimed

## Game Mechanics

### Preview Phase
- All cards revealed for a configurable duration
- Timer shows remaining preview time
- "I Memorized — Start" button to begin early
- Skip option available

### Scoring
- **Moves**: Total card flips
- **Mistakes**: Unmatched pairs
- **Time**: Elapsed time from game start
- **Stars**: Calculated based on efficiency (1-3 stars)

### On-Chain Integration
- `startSession()` called automatically when level starts
- `finishGame(moves)` called when level completes
- NFT achievement minted if performance qualifies (≤20 moves)

## Base Mini-App Requirements

This mini-app follows Base documentation:
- ✅ Proper mini-app structure with manifest
- ✅ Wallet connection via OnchainKit
- ✅ Gasless/sponsored transaction support
- ✅ Simple, single-call transactions
- ✅ Real on-chain activity for Builder Rewards

## Social Sharing

After completing a level, players can share results:
- **Twitter**: Opens Twitter compose with formatted message
- **Farcaster**: Uses Web Share API or clipboard fallback

Includes hashtags: `#Base #MemoryGame #OnChainGaming`

## Building for Production

```bash
npm run build
npm start
```

For deployment to Vercel:
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Base Builder Rewards

This mini-app generates real on-chain activity:
- Each level completion = 2 transactions (`startSession` + `finishGame`)
- NFT achievements for qualifying players
- Simple, gasless transactions (when sponsored)
- Repeatable gameplay encourages multiple sessions

## License

MIT

## Support

For issues or questions:
- Base Docs: https://docs.base.org/mini-apps
- OnchainKit: https://onchainkit.xyz
