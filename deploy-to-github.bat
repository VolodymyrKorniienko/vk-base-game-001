@echo off
echo ========================================
echo Deploying to GitHub
echo ========================================
echo.

REM Проверка установки Git
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/6] Initializing git repository...
git init

echo.
echo [2/6] Adding all files...
git add .

echo.
echo [3/6] Creating initial commit...
git commit -m "Initial commit: Improve Your Memory - Base Mini-App

- Memory puzzle game with preview phase
- Stage Mode (6 progressive levels)
- Arcade Mode (endless rounds)
- Scoring system with stars (1-3)
- On-chain NFT achievements integration
- Social sharing (Twitter, Farcaster)
- Base mini-app compatible
- Production-ready architecture"

echo.
echo [4/6] Git repository initialized successfully!
echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo.
echo 1. Go to https://github.com and create a new repository
echo    (or use existing repository URL)
echo.
echo 2. Run these commands (replace YOUR_USERNAME and REPO_NAME):
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo OR if you already have a repository URL, run:
echo    git remote add origin YOUR_REPO_URL
echo    git branch -M main
echo    git push -u origin main
echo.
echo ========================================
pause
