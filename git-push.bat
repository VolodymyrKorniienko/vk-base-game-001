@echo off
chcp 65001 >nul
echo Встановлення змінних оточення для Git...
set "GIT_INSTALL_DIR=C:\Program Files\Git"
set "PATH=%GIT_INSTALL_DIR%\bin;%GIT_INSTALL_DIR%\cmd;%PATH%"
set "GIT_EXEC_PATH=%GIT_INSTALL_DIR%\mingw64\libexec\git-core"
set "GIT_TEMPLATE_DIR=%GIT_INSTALL_DIR%\share\git-core\templates"

cd /d "C:\Users\Volodymyr\Desktop\vk-base-game-001"

echo.
echo ================================
echo  Git Push Script
echo ================================
echo.

echo [1/6] Видалення nul з git індексу...
git rm --cached nul 2>nul
if %errorlevel% equ 0 (
    echo Видалено nul з індексу
) else (
    echo nul не в індексі або вже видалено
)

echo.
echo [2/6] Перевірка статусу репозиторію...
git status
if %errorlevel% neq 0 (
    echo Помилка: не вдалося отримати статус git
    pause
    exit /b 1
)

echo.
echo [3/6] Додавання змін до індексу...
git add -A
if %errorlevel% neq 0 (
    echo Помилка: не вдалося додати зміни
    pause
    exit /b 1
)

echo.
echo [4/6] Перевірка змін...
git diff --cached --stat

echo.
echo [5/6] Створення коміту...
git commit -m "Fix: Level counter, UI buttons, card loading, NFT rewards

- Fix level counter not incrementing after completing levels
- Reorder buttons: Next/Restart Level above Share buttons
- Add separator between game action buttons and share buttons
- Style Next Level button: larger, brighter, gradient background
- Fix card loading issues during extended gameplay:
  * Unique IDs for card pairs in selector
  * Unique keys for Image components
  * Grid re-render on card state changes
  * Image caching optimization in next.config.ts
- Add NFT achievement badge for levels completed with ≤20 moves
- Add DEPLOYMENT.md with Base Mainnet deployment instructions
- Add CHANGES_REPORT.md with detailed change summary
- Add nul to .gitignore (Windows reserved filename)"
if %errorlevel% neq 0 (
    echo Помилка: не вдалося створити коміт (можливо, немає змін)
    pause
    exit /b 1
)

echo.
echo [6/6] Відправка змін на сервер...
git push

if %errorlevel% neq 0 (
    echo.
    echo Попередження: не вдалося відправити зміни
    echo Можливо, потрібно виконати git pull спочатку
    pause
    exit /b 1
)

echo.
echo ================================
echo  Успішно! Зміни відправлено.
echo ================================
echo.
pause
