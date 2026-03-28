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
echo  Git Commit & Push
echo ================================
echo.

echo [1/4] Перевірка статусу репозиторію...
git status

echo.
echo [2/4] Додавання змін до індексу...
git add -A
if %errorlevel% neq 0 (
    echo Помилка: не вдалося додати зміни
    pause
    exit /b 1
)

echo.
echo [3/4] Створення коміту...
git commit -m "Deploy: Base Mainnet contract + verification setup

- Deploy BaseMemoryGame to Base Mainnet (0xd981169D823F7f511312A86d6E52C409BFC86290)
- Add hardhat.config.ts etherscan configuration for BaseScan
- Add verify:base script to package.json
- Add scripts/verify-contract.ts and scripts/check-balance.ts
- Fix TypeScript error in verify-contract.ts
- Add BASESCAN_API_KEY to .env"
if %errorlevel% neq 0 (
    echo Помилка: не вдалося створити коміт (можливо, немає змін)
    pause
    exit /b 1
)

echo.
echo [4/4] Відправка змін на сервер...
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
