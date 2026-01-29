# Инструкция по загрузке на GitHub

## Шаг 1: Установка Git (если не установлен)

1. Скачайте Git для Windows: https://git-scm.com/download/win
2. Установите с настройками по умолчанию
3. Перезапустите терминал/PowerShell

## Шаг 2: Автоматическая загрузка

Запустите файл `deploy-to-github.bat` двойным кликом или выполните в терминале:

```bash
deploy-to-github.bat
```

## Шаг 3: Ручная загрузка (альтернатива)

Если автоматический скрипт не работает, выполните команды вручную:

### 1. Инициализация репозитория
```bash
git init
```

### 2. Добавление файлов
```bash
git add .
```

### 3. Создание коммита
```bash
git commit -m "Initial commit: Improve Your Memory - Base Mini-App"
```

### 4. Создание репозитория на GitHub

1. Перейдите на https://github.com
2. Нажмите "+" в правом верхнем углу → "New repository"
3. Введите название (например: `vk-base-game-001`)
4. Выберите Public или Private
5. НЕ добавляйте README, .gitignore или лицензию (они уже есть)
6. Нажмите "Create repository"

### 5. Подключение к GitHub и загрузка

Замените `YOUR_USERNAME` и `REPO_NAME` на ваши данные:

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

Пример:
```bash
git remote add origin https://github.com/volodymyr/vk-base-game-001.git
git branch -M main
git push -u origin main
```

## Шаг 4: Проверка

После успешной загрузки откройте ваш репозиторий на GitHub и убедитесь, что все файлы загружены.

## Важные файлы, которые НЕ загружаются (в .gitignore):

- `node_modules/` - зависимости (устанавливаются через `npm install`)
- `.env.local` - локальные переменные окружения
- `.next/` - билд Next.js
- `*.log` - логи

## После загрузки:

1. Добавьте описание репозитория на GitHub
2. Установите темы: `memory-game`, `base`, `web3`, `nextjs`
3. При необходимости настройте GitHub Pages или Vercel для деплоя
