# 📤 Інструкція для пушу змін

## Зміни для відправки

### Нові файли:
- `web3/nftGenerator.ts` — Генератор SVG для NFT Achievement
- `BASE_BUILDER_REWARDS_ANALYSIS.md` — Аналіз відповідності Base Builder Rewards

### Оновлені файли:
- `contracts/BaseMemoryGame.sol` — Додано mint NFT для рівня 1, participation NFT
- `web3/contracts/BaseMemoryGame.ts` — Оновлено ABI з новими функціями
- `web3/hooks/useGameContract.ts` — Додано параметр `completed` для finishGame
- `ui/screens/StageModeScreen.tsx` — Оновлено виклик finishGame
- `ui/components/GameOverScreen.tsx` — Додано mint NFT при програші

---

## 🚀 Команди для пуша

Відкрийте **Git Bash** або термінал у папці проекту та виконайте:

```bash
cd C:\Users\Volodymyr\Desktop\vk-base-game-001

# 1. Перевірка статусу
git status

# 2. Додавання змін
git add -A

# 3. Створення коміту
git commit -m "feat: Add NFT rewards system

- Add NFT generator with neon design (web3/nftGenerator.ts)
- Mint NFT after completing Level 1
- Mint Participation NFT for loss on Level 2+
- Mint Achievement NFT for perfect games (≤20 moves)
- Update smart contract with new mint logic
- Add Base Builder Rewards analysis document
- Update ABI and hooks for new contract functions"

# 4. Пуш змін
git push
```

---

## 📋 Повідомлення коміту

```
feat: Add NFT rewards system

- Add NFT generator with neon design (web3/nftGenerator.ts)
  * Dynamic SVG generation with game colors
  * Neon glow effects (purple, blue, pink gradients)
  * Player stats display (moves, mistakes, time, stars)
  * Efficiency badge (PERFECT/GREAT/GOOD/WARRIOR)
  * Base logo in bottom right corner

- Smart contract updates (contracts/BaseMemoryGame.sol)
  * Mint NFT after completing Level 1
  * Mint Participation NFT for loss on Level 2+
  * Mint Achievement NFT for games with ≤20 moves
  * New functions: finishGame(totalMoves, completed), finishGameSimple()
  * Updated session struct with level tracking

- Frontend integration
  * Update useGameContract hook with completed parameter
  * Update StageModeScreen for NFT minting
  * Update GameOverScreen for participation NFT
  * Updated ABI with new contract functions

- Documentation (BASE_BUILDER_REWARDS_ANALYSIS.md)
  * Base Builder Rewards requirements analysis
  * Funding programs overview (Weekly Rewards, Builder Grants)
  * Action plan for qualification
  * Current project readiness: 65%
```

---

## ✅ Перевірка після пуша

1. Перевірте на GitHub, що всі файли завантажені
2. Переконайтеся, що немає конфліктів
3. Якщо є конфлікти — виконайте `git pull` та вирішіть їх

---

## 🔗 Наступні кроки після пуша

1. **Деплой контракту на Base mainnet:**
   ```bash
   npm run deploy:base
   ```

2. **Налаштування змінних оточення:**
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` (адреса після деплою)
   - `NEXT_PUBLIC_BUILDER_CODE` (з base.dev)
   - `CDP_PAYMASTER_URL` (з Coinbase Developer Portal)

3. **Верифікація контракту на Basescan**

4. **Підключення Talent Protocol** для трекингу Builder Score
