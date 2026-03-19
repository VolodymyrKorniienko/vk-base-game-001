# Інструкція з деплою контракту BaseMemoryGame на Base Mainnet

Ця інструкція допоможе вам розгорнути смарт-контракт **BaseMemoryGame** у мережі **Base Mainnet** та налаштувати гру для роботи з ним.

## 📋 Передумови

Перед початком переконайтеся, що у вас є:

1. **Node.js 18+** та **npm**
2. **Гаманець Coinbase Wallet** (або інший сумісний гаманець)
3. **ETH у мережі Base** для оплати газу (≈0.01 ETH для деплою)
4. **OnchainKit API ключ** — [отримати тут](https://onchainkit.xyz)
5. **Builder Code** (опціонально) — для участі в Base Builder Rewards

---

## 🚀 Крок 1: Встановлення залежностей

```bash
npm install
```

---

## 🔧 Крок 2: Налаштування змінних оточення

Створіть файл `.env` на основі `.example.env`:

```bash
cp .example.env .env
```

Відредагуйте `.env` та заповніть наступні змінні:

```env
# URL вашого додатку (для локальної розробки)
NEXT_PUBLIC_URL=http://localhost:3000

# OnchainKit API ключ
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key

# Адреса контракту (буде заповнена після деплою)
NEXT_PUBLIC_CONTRACT_ADDRESS=

# Builder Code (опціонально, для Base Builder Rewards)
NEXT_PUBLIC_BUILDER_CODE=your_builder_code

# CDP Paymaster URL для спонсорування газу
CDP_PAYMASTER_URL=https://api.cdp.coinbase.com/platform/v1/networks/base/paymaster

# Приватний ключ акаунту для деплою (НЕ ДІЛІТЬСЯ ЦИМ КЛЮЧЕМ!)
DEPLOYER_PRIVATE_KEY=your_private_key_here
```

### ⚠️ Важливо: Ніколи не комітьте `.env` у Git!

Файл `.env` вже додано до `.gitignore`. Ніколи не публікуйте свій приватний ключ!

---

## 📦 Крок 3: Деплой смарт-контракту на Base Mainnet

### 3.1. Компіляція контрактів

```bash
npm run compile
```

Ви повинні побачити повідомлення:
```
Compiled Solidity Smart Contract: BaseMemoryGame.sol
```

### 3.2. Деплой на Base Mainnet

```bash
npm run deploy:base
```

Після успішного деплою ви побачите:
```
Deploying BaseMemoryGame with account: 0xYourAddress
Account balance: 1234567890000000000
BaseMemoryGame deployed to: 0xYourContractAddress

Next steps:
1. Add to .env: NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
2. Add NEXT_PUBLIC_CONTRACT_ADDRESS to Vercel environment variables
3. Redeploy the app
```

### 3.3. Збережіть адресу контракту

Скопіюйте адресу контракту (наприклад, `0x1234567890abcdef...`) та додайте її до `.env`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
```

---

## ✅ Крок 4: Перевірка контракту на Etherscan

Після деплою рекомендується верифікувати контракт на [BaseScan](https://basescan.org):

### 4.1. Додайте API ключ Etherscan до `.env`

```env
ETHERSCAN_API_KEY=your_etherscan_api_key
BASESCAN_API_KEY=your_basescan_api_key
```

### 4.2. Верифікуйте контракт

```bash
npx hardhat verify --network base <CONTRACT_ADDRESS>
```

Приклад:
```bash
npx hardhat verify --network base 0x1234567890abcdef1234567890abcdef12345678
```

---

## 🌐 Крок 5: Налаштування фронтенду

### 5.1. Локальний запуск

```bash
npm run dev
```

Відкрийте `http://localhost:3000` у браузері та перевірте роботу гри.

### 5.2. Перевірка Web3 функціоналу

1. Підключіть гаманець
2. Розпочніть гру
3. Пройдіть рівень з ≤20 ходами
4. Перевірте, що NFT була відмінтована (подія `AchievementMinted` на [BaseScan](https://basescan.org))

---

## 🚀 Крок 6: Деплой на Vercel

### 6.1. Push у GitHub

```bash
git add .
git commit -m "Prepare for Base mainnet deployment"
git push origin main
```

### 6.2. Налаштування Vercel

1. Відкрийте [Vercel Dashboard](https://vercel.com/dashboard)
2. Імпортуйте ваш GitHub репозиторій
3. Додайте змінні оточення в **Settings → Environment Variables**:

   | Змінна | Значення |
   |--------|----------|
   | `NEXT_PUBLIC_URL` | `https://your-app.vercel.app` |
   | `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | Ваш API ключ |
   | `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0xYourContractAddress` |
   | `NEXT_PUBLIC_BUILDER_CODE` | Ваш builder code (опціонально) |
   | `CDP_PAYMASTER_URL` | `https://api.cdp.coinbase.com/platform/v1/networks/base/paymaster` |

4. Натисніть **Deploy**

---

## 🎮 Крок 7: Фінальна перевірка

### 7.1. Перевірте роботу гри

1. Відкрийте ваш додаток у браузері
2. Підключіть гаманець
3. Пройдіть тестовий рівень
4. Переконайтеся, що транзакції проходять успішно

### 7.2. Перевірте NFT

1. Пройдіть рівень з ≤20 ходами
2. Перевірте ваш гаманець на наявність NFT
3. Перегляньте NFT на [BaseScan](https://basescan.org) або в гаманці

---

## 📊 Корисні посилання

| Ресурс | Посилання |
|--------|-----------|
| BaseScan (Mainnet) | https://basescan.org |
| BaseScan (Sepolia) | https://sepolia.basescan.org |
| Base Docs | https://docs.base.org |
| OnchainKit | https://onchainkit.xyz |
| CDP Paymaster | https://portal.cdp.coinbase.com |

---

## 🔧 Команди для розробки

| Команда | Опис |
|---------|------|
| `npm run compile` | Компіляція контрактів |
| `npm run deploy:base` | Деплой на Base Mainnet |
| `npm run deploy:base-sepolia` | Деплой на Base Sepolia Testnet |
| `npm run dev` | Локальний dev-сервер |
| `npm run build` | Продакшн-білд |

---

## ⚠️ Усунення несправностей

### Помилка "Insufficient funds for gas"

- Переконайтеся, що на гаманці є ETH у мережі Base
- Для деплою потрібно ≈0.01 ETH

### Помилка "Contract not configured"

- Перевірте, що `NEXT_PUBLIC_CONTRACT_ADDRESS` заповнено у `.env`
- Перезапустіть dev-сервер (`npm run dev`)

### NFT не мінтиться

- Переконайтеся, що ви пройшли рівень з ≤20 ходами
- Перевірте, що `rewardClaimed` ще не встановлено для вашого акаунту
- Перегляньте логи консолі на наявність помилок

---

## 🎉 Вітаємо!

Ваш смарт-контракт **BaseMemoryGame** розгорнуто в **Base Mainnet**, і гра готова до використання!

Гравці тепер можуть отримувати **безкоштовні NFT-досягнення** за проходження рівнів з ≤20 ходами, а ви — заробляти винагороди через **Base Builder Rewards**.
