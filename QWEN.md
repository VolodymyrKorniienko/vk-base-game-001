# Improve Your Memory — Base Mini-App

## Project Overview

Це **Web3 гра-головоломка "Memory"** (меморі), побудована як **Base Mini-App** з ончейн NFT-досягненнями. Проєкт повністю відповідає вимогам Base Builder Rewards.

### Основні характеристики

- 🧠 **Механіка Memory**: Класична гра у пошук пар карток з фазою попереднього перегляду
- 🎮 **Режими гри**: 
  - **Stage Mode** — прогресивні рівні
  - **Arcade Mode** — нескінченні раунди
- ⭐ **Система підрахунку**: Відстеження часу, ходів, помилок з рейтингом зірок
- 🏆 **Ончейн-досягнення**: NFT-винагороди за завершення рівнів з ≤20 ходами
- 🔗 **Base інтеграція**: Безгазові транзакції через OnchainKit
- 📱 **Соціальний шерінг**: Публікація результатів у Twitter та Farcaster
- 🎨 **Сучасний UI**: Адаптивний дизайн, оптимізований для мобільних

### Технологічний стек

| Категорія | Технології |
|-----------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Web3** | OnchainKit, Wagmi, Viem, Ox |
| **Smart Contracts** | Solidity 0.8.19, Hardhat, OpenZeppelin |
| **Blockchain** | Base (mainnet + Sepolia testnet) |
| **Social** | Farcaster Mini-App SDK |
| **Styling** | CSS Modules |
| **Build** | npm, TypeScript |

## Архітектура проєкту

```
vk-base-game-001/
├── app/                    # Next.js App Router
│   ├── .well-known/        # Farcaster mini-app manifest
│   ├── api/                # API routes (webhook)
│   ├── success/            # Сторінка успіху
│   ├── layout.tsx          # Головний layout
│   ├── page.tsx            # Головна сторінка (меню)
│   └── rootProvider.tsx    # Web3 провайдер
├── contracts/              # Solidity смарт-контракти
│   └── BaseMemoryGame.sol  # NFT контракт досягнень
├── game/                   # Ігрова логіка (off-chain)
│   ├── engine/             # Ядро гри Memory
│   ├── modes/              # Stage & Arcade режими
│   ├── levels/             # Конфігурації рівнів
│   ├── scoring/            # Підрахунок зірок
│   └── types.ts            # TypeScript типи гри
├── ui/                     # UI компоненти
│   ├── components/         # Багаторазові компоненти
│   └── screens/            # Екрани гри (Menu, Stage, Arcade)
├── web3/                   # Web3 інтеграція
│   ├── contracts/          # Contract ABIs
│   ├── hooks/              # React hooks для контрактів
│   └── builderCode.ts      # Builder code конфігурація
├── social/                 # Утиліти соціального шерінгу
├── scripts/                # Скрипти деплою
│   └── deploy.ts           # Скрипт деплою контракту
├── public/                 # Статичні ресурси (іконки, скріншоти)
├── artifacts/              # Артефакти компіляції Hardhat
├── typechain-types/        # Автозгенеровані TypeScript типи для контрактів
├── cache/                  # Кеш Hardhat
├── .next/                  # Build артефакти Next.js
├── node_modules/           # Залежності npm
├── hardhat.config.ts       # Конфігурація Hardhat
├── minikit.config.ts       # Конфігурація Farcaster Mini-App
├── next.config.ts          # Конфігурація Next.js
├── tsconfig.json           # Конфігурація TypeScript
├── package.json            # Залежності та скрипти
└── .env                    # Змінні оточення (не комітити)
```

## Встановлення та запуск

### Пререквізити

- **Node.js 18+** та **npm**
- **Base гаманець** (Coinbase Wallet або сумісний)
- **OnchainKit API ключ** ([отримати тут](https://onchainkit.xyz))
- **Розгорнутий контракт `BaseMemoryGame`** на Base (mainnet або Sepolia)

### Крок 1: Встановлення залежностей

```bash
npm install
```

### Крок 2: Деплой смарт-контракту

Використовуйте Hardhat для деплою на Base Sepolia (testnet) або Base mainnet:

```bash
# Компіляція контрактів
npm run compile

# Деплой на Base Sepolia
npm run deploy:base-sepolia

# Або деплой на Base mainnet
npm run deploy:base
```

**Примітка:** Для деплою потрібен приватний ключ у змінній `DEPLOYER_PRIVATE_KEY` у `.env`.

### Крок 3: Налаштування змінних оточення

```bash
cp .env.example .env
```

Відредагуйте `.env`:

```env
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...your_deployed_contract_address
NEXT_PUBLIC_BUILDER_CODE=your_builder_code
CDP_PAYMASTER_URL=https://...
DEPLOYER_PRIVATE_KEY=your_private_key_for_deployments
```

### Крок 4: Запуск dev-сервера

```bash
npm run dev
```

Відкрийте `http://localhost:3000` у браузері.

## Доступні команди (npm scripts)

| Команда | Опис |
|---------|------|
| `npm run dev` | Запуск Next.js у режимі розробки |
| `npm run build` | Продакшн-білд |
| `npm run start` | Запуск продакшн-білду |
| `npm run lint` | Перевірка коду через ESLint |
| `npm run compile` | Компіляція Solidity контрактів (Hardhat) |
| `npm run deploy:base-sepolia` | Деплой на Base Sepolia testnet |
| `npm run deploy:base` | Деплой на Base mainnet |

## Смарт-контракт

### BaseMemoryGame.sol

Контракт розширює **ERC721** (OpenZeppelin) для NFT-досягнень.

#### Основні функції

- **`startSession()`** — Викликається на початку рівня
- **`finishGame(uint256 totalMoves)`** — Викликається після завершення рівня
- **`_mintAchievement(address player)`** — Мінтить NFT якщо `totalMoves ≤ 20`

#### Події

- `SessionStarted(address player)`
- `GameFinished(address player, uint256 moves)`
- `AchievementMinted(address player, uint256 tokenId)`

#### Параметри

- **MAX_MOVES_FOR_REWARD**: 20 ходів (максимум для отримання NFT)
- **NFT Token**: "Base Memory Achievement" (BMEM)

## Ігрова механіка

### Фаза попереднього перегляду (Preview Phase)

- Всі картки відкриті на заданий час
- Таймер показує залишок часу
- Кнопка "I Memorized — Start" для раннього початку
- Опція пропуску

### Система підрахунку

- **Moves**: Загальна кількість перевертань карток
- **Mistakes**: Невдалі спроби (незбіги пар)
- **Time**: Час з початку гри
- **Stars**: Розраховується на основі ефективності (1-3 зірки)

### Ончейн-інтеграція

1. `startSession()` викликається автоматично при початку рівня
2. `finishGame(moves)` викликається після завершення рівня
3. NFT мінтиться автоматично якщо `moves ≤ 20` і ще не було отримано

## Farcaster Mini-App конфігурація

Проєкт налаштований як Farcaster Mini-App через `minikit.config.ts`:

- **Назва**: "Improve Your Memory"
- **Категорія**: Games
- **Теги**: memory, puzzle, game, achievements, base
- **Webhook**: `/api/webhook`
- **Account Association**: Підписаний JWT для верифікації

## Розгортання у продакшн

### Vercel deployment

1. Push код у GitHub репозиторій
2. Імпортувати проєкт у Vercel
3. Додати змінні оточення:
   - `NEXT_PUBLIC_URL`
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_BUILDER_CODE`
   - `CDP_PAYMASTER_URL`
4. Deploy

### Production build локально

```bash
npm run build
npm start
```

## Base Builder Rewards вимоги

Проєкт відповідає всім вимогам:

- ✅ Правильна структура mini-app з manifest
- ✅ Підключення гаманця через OnchainKit
- ✅ Підтримка безгазових/спонсорованих транзакцій
- ✅ Прості одно-викликові транзакції
- ✅ Реальна ончейн-активність для Builder Rewards

Кожен завершений рівень генерує **2 транзакції** (`startSession` + `finishGame`).

## Ліцензія

MIT

## Корисні посилання

- [Base Docs: Mini-Apps](https://docs.base.org/mini-apps)
- [OnchainKit Documentation](https://onchainkit.xyz)
- [Farcaster Mini-App Spec](https://miniapps.farcaster.xyz/docs/guides/publishing)
- [Hardhat Documentation](https://hardhat.org/docs)
