# Memory Game — План виправлень (Bug Fix Roadmap)

## 📋 Аналіз поточного стану

**Дата аналізу:** 17 березня 2026 р.  
**Статус:** Частково виправлено (cea680f)

### ✅ Вже виправлено (поточний коміт)

| Файл | Проблема | Рішення | Статус |
|------|----------|---------|--------|
| `game/levels/config.ts` | Відсутній `timeLimit` | Додано timeLimit для всіх рівнів | ✅ |
| `game/modes/stageMode.ts` | Не передається `timeLimit` | Додано передачу config | ✅ |
| `game/scoring/starCalculator.ts` | Неправильний підрахунок зірок | Використовує timeLimit | ✅ |
| `ui/screens/GameScreen.tsx` | Подвійний виклик handleStartGame | Додано gameStartedRef guard | ✅ |

---

## 🔴 Критичні проблеми (Phase 1)

### 1.1 Engine State Machine — Відсутній виклик `startPreview()`

**Файл:** `ui/screens/GameScreen.tsx`  
**Проблема:** Після `engine.initialize()` стан залишається `'idle'`, картки не показуються у preview фазі.

**Поточний код:**
```typescript
useEffect(() => {
  const newEngine = new MemoryEngine(config);
  newEngine.initialize();
  setEngine(newEngine);
  setPreviewTime(config.previewDuration);
  setIsPreviewActive(true);
  // ❌ Missing: engine.startPreview()
}, [config, timeLimit]);
```

**Виправлення:**
```typescript
useEffect(() => {
  const newEngine = new MemoryEngine(config);
  newEngine.initialize();
  newEngine.startPreview(); // ✅ Додати виклик
  setEngine(newEngine);
  setPreviewTime(config.previewDuration);
  setIsPreviewActive(true);
}, [config, timeLimit]);
```

**Пріоритет:** 🔴 Critical

---

### 1.2 Bounds Checking — Відсутня перевірка індексів

**Файл:** `game/engine/memoryEngine.ts`  
**Проблема:** Можливі runtime crashes при неправильних індексах карток.

**Виправлення для `revealCard()`:**
```typescript
revealCard(position: number): boolean {
  // ✅ Додати bounds checking
  if (position < 0 || position >= this.cards.length) {
    return false;
  }
  
  if (this.state !== 'playing') {
    return false;
  }
  // ... rest of code
}
```

**Виправлення для `processRevealedPair()`:**
```typescript
private processRevealedPair(): void {
  const [pos1, pos2] = this.revealedCards;
  
  // ✅ Додати validation
  if (pos1 === undefined || pos2 === undefined) {
    return;
  }
  
  const card1 = this.cards[pos1];
  const card2 = this.cards[pos2];

  if (!card1 || !card2) {
    return;
  }
  // ... rest of code
}
```

**Пріоритет:** 🔴 Critical

---

### 1.3 State Validation — Занадто суворі перевірки

**Файл:** `ui/screens/GameScreen.tsx`  
**Проблема:** `handleStartGame()` має перевірку `engine.getState() !== 'preview'`, яка блокує перехід якщо стан не синхронізований.

**Поточний код:**
```typescript
const handleStartGame = useCallback(() => {
  if (!engine) return;
  if (gameStartedRef.current) return;
  if (engine.getState() !== 'preview') return; // ❌ Може блокувати легітимні переходи
  // ...
}, [engine, timeLimit, stopTimer]);
```

**Виправлення:**
```typescript
const handleStartGame = useCallback(() => {
  if (!engine) return;
  if (gameStartedRef.current) return;
  
  const state = engine.getState();
  if (state !== 'preview' && state !== 'idle') {
    return; // ✅ Дозволити перехід з idle або preview
  }
  
  // Якщо ще не в preview, спочатку запустити preview
  if (state === 'idle') {
    engine.startPreview();
  }
  
  gameStartedRef.current = true;
  engine.startGame();
  // ...
}, [engine, timeLimit, stopTimer]);
```

**Пріоритет:** 🟠 High

---

## 🟠 Проблеми з активами (Phase 2)

### 2.1 Asset Path Resolution — Відсутній PUBLIC_URL

**Файл:** `game/assets/registry.ts`  
**Проблема:** Шляхи до активів не використовують `process.env.PUBLIC_URL`, що може викликати 404 у VK Bridge iframe.

**Поточний код:**
```typescript
const BASE_ICONS_PATH = '/assets/base-icons';
```

**Виправлення:**
```typescript
const BASE_ICONS_PATH = `${process.env.NEXT_PUBLIC_URL || ''}/assets/base-icons`;
```

**Пріоритет:** 🟠 High

---

### 2.2 Asset Validation — Відсутня перевірка доступності

**Файл:** `game/engine/memoryEngine.ts`  
**Проблема:** Немає перевірки чи достатньо активів для обраної категорії.

**Виправлення:**
```typescript
initialize(): void {
  const totalCards = this.config.rows * this.config.cols;
  const pairs = totalCards / 2;

  if (totalCards % 2 !== 0) {
    throw new Error('Grid must have even number of cards');
  }

  // ✅ Додати перевірку доступності активів
  const assetPairs = selectAssetPairs({
    count: pairs,
    categories: this.config.categories,
  });
  
  if (assetPairs.length < pairs * 2) {
    console.error('Not enough assets available');
    // Fallback to mixed category
    assetPairs = selectAssetPairs({
      count: pairs,
      categories: ['mixed'],
    });
  }
  // ... rest of code
}
```

**Пріоритет:** 🟡 Medium

---

## 🟡 Проблеми синхронізації (Phase 3)

### 3.1 Interval Cleanup — Відсутнє очищення таймерів

**Файл:** `ui/screens/GameScreen.tsx`  
**Проблема:** Деякі useEffect з setInterval можуть не мати cleanup функції.

**Перевірити всі useEffect з setInterval:**

```typescript
// Preview countdown
useEffect(() => {
  if (!isPreviewActive || !engine) return;

  const interval = setInterval(() => {
    setPreviewTime((prev) => {
      const newTime = prev - 100;
      if (newTime <= 0) {
        return 0;
      }
      return newTime;
    });
  }, 100);

  return () => clearInterval(interval); // ✅ Вже є
}, [isPreviewActive, engine]);

// Game timer
useEffect(() => {
  if (!engine || isPreviewActive || isGameOver) return;
  
  stopTimer();
  timerRef.current = setInterval(() => {
    setRemainingTime((prev) => {
      const next = prev - 100;
      if (next <= 0) {
        return 0;
      }
      return next;
    });
  }, 100);
  
  return () => stopTimer(); // ✅ Вже є
}, [engine, isPreviewActive, isGameOver, stopTimer]);
```

**Статус:** ✅ Вже виправлено в поточній версії

**Пріоритет:** ✅ Done

---

### 3.2 Manual Phase Skip — Кнопка "I Memorized"

**Файл:** `ui/components/PreviewScreen.tsx`  
**Проблема:** Кнопка може не коректно викликати onSkip/onStart.

**Перевірка:**
```typescript
// Вже реалізовано коректно
const handleSkipPreview = useCallback(() => {
  handleStartGame();
}, [handleStartGame]);
```

**Статус:** ✅ Вже виправлено

**Пріоритет:** ✅ Done

---

## 🔵 Інтеграційні проблеми (Phase 4)

### 4.1 Web3 Race Condition — startSession блокує гру

**Файл:** `ui/screens/StageModeScreen.tsx`, `ui/screens/ArcadeModeScreen.tsx`  
**Проблема:** Якщо Web3 транзакція зависає, гра не починається.

**Поточний код:**
```typescript
const handleStartStage = useCallback(async () => {
  try {
    await startSession();
  } catch (error) {
    console.log('Contract call failed, continuing without on-chain features');
  }
  const engine = stageMode.startLevel();
  setScreenState('playing');
}, [stageMode, startSession]);
```

**Статус:** ✅ Вже оброблено (try/catch ігнорує помилки)

**Пріоритет:** ✅ Done

---

### 4.2 Environment — HTTPS для VK Bridge

**Файл:** `package.json`  
**Проблема:** VK Bridge вимагає HTTPS для локальної розробки.

**Виправлення:**
```json
{
  "scripts": {
    "dev": "set HTTPS=true&& next dev",
    "dev:secure": "next dev --experimental-https"
  }
}
```

**Пріоритет:** 🟡 Medium

---

## 📊 Code Quality (Phase 5)

### 5.1 Type Safety — Перевірка `any` типів

**Файл:** `game/types.ts`  
**Завдання:** Перевірити чи немає `any` типів.

**Статус:** ✅ Вже використовується строга типізація

---

### 5.2 List Stability — Унікальні key для карток

**Файл:** `ui/components/GameGrid.tsx`, `ui/components/Card.tsx`  
**Перевірка:**

```tsx
{cards.map((card) => (
  <Card
    key={card.id} // ✅ Використовує стабільний id
    card={card}
    onClick={() => onCardClick(card.position)}
    disabled={disabled}
  />
))}
```

**Статус:** ✅ Вже виправлено

---

## ✅ Checklist для тестування

### Cold Start
- [ ] `npm run dev` запускається без помилок
- [ ] Консоль не показує initialization errors

### Preview Phase
- [ ] Картки видно (face-up) після завантаження рівня
- [ ] Таймер preview зменшується
- [ ] Прогрес-бар показує залишок часу

### Auto-Transition
- [ ] Гра автоматично переходить у "Matching" фазу коли timer = 0
- [ ] Картки перевертаються (face-down) після preview

### Manual Transition
- [ ] Кнопка "I Memorized — Start" працює
- [ ] Кнопка "Skip Preview" працює

### Asset Integrity
- [ ] Немає 404 помилок у Network tab
- [ ] Всі картки показують правильні зображення

### Game Flow
- [ ] Клік по картці перевертає її
- [ ] Pair matching працює коректно
- [ ] Mistakes підраховуються правильно
- [ ] Moves підраховуються правильно

### Result Screen
- [ ] Результати показуються після завершення
- [ ] Stars підраховуються коректно
- [ ] Кнопки "Continue"/"Restart" працюють

---

## 📝 Summary of Required Changes

| Файл | Проблема | Зміна | Пріоритет | Статус |
|------|----------|-------|-----------|--------|
| `ui/screens/GameScreen.tsx` | Engine не викликає startPreview() | Додати `engine.startPreview()` після initialize() | 🔴 Critical | ⏳ Pending |
| `game/engine/memoryEngine.ts` | Відсутній bounds checking | Додати перевірку `position < 0 \|\| position >= this.cards.length` | 🔴 Critical | ⏳ Pending |
| `game/engine/memoryEngine.ts` | Відсутня validation у processRevealedPair | Додати перевірку pos1/pos2 на undefined | 🔴 Critical | ⏳ Pending |
| `ui/screens/GameScreen.tsx` | Занадто суворі перевірки стану | Дозволити перехід з idle або preview | 🟠 High | ⏳ Pending |
| `game/assets/registry.ts` | Шляхи без PUBLIC_URL | Використовувати `process.env.NEXT_PUBLIC_URL` | 🟠 High | ⏳ Pending |
| `game/engine/memoryEngine.ts` | Немає fallback для активів | Додати fallback на 'mixed' категорію | 🟡 Medium | ⏳ Pending |
| `package.json` | Немає HTTPS для VK Bridge | Додати `HTTPS=true` до dev scripts | 🟡 Medium | ⏳ Pending |

---

## 🎯 План дій для наступної сесії

### Крок 1: Engine State Fix (15 хв)
1. Відкрити `ui/screens/GameScreen.tsx`
2. Знайти useEffect з engine.initialize()
3. Додати `newEngine.startPreview()` після `newEngine.initialize()`
4. Протестувати preview фазу

### Крок 2: Bounds Checking (10 хв)
1. Відкрити `game/engine/memoryEngine.ts`
2. Додати bounds checking до `revealCard()`
3. Додати validation до `processRevealedPair()`
4. Протестувати кліки по картках

### Крок 3: Asset Path Fix (10 хв)
1. Відкрити `game/assets/registry.ts`
2. Замінити `BASE_ICONS_PATH` на шаблон з `process.env.NEXT_PUBLIC_URL`
3. Перевірити Network tab на 404 помилки

### Крок 4: State Validation (10 хв)
1. Відкрити `ui/screens/GameScreen.tsx`
2. Пом'якшити перевірку в `handleStartGame()`
3. Протестувати ручний та автоматичний перехід

### Крок 5: Final Testing (15 хв)
1. Пройти повний цикл гри
2. Перевірити всі checkpoint з checklist
3. Закомітити зміни

---

## 📌 Notes

- **Agent Mode Directive:** Перед будь-якими змінами виконати `grep -r "engine.initialize()"` для виявлення всіх call sites
- **Architectural Consistency:** Зберігати поточну структуру MemoryGameEngine без радикальних змін
- **VK Bridge Compatibility:** Всі зміни мають бути сумісними з VK Bridge iframe середовищем

---

## 🔗 Корисні посилання

- [Base Docs: Mini-Apps](https://docs.base.org/mini-apps)
- [OnchainKit Documentation](https://onchainkit.xyz)
- [VK Bridge Documentation](https://dev.vk.com/bridge/overview)
- [Next.js App Router](https://nextjs.org/docs/app)
