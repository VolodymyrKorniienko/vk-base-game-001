# Git Push Script for PowerShell
# Запустіть: .\git-push.ps1

$ErrorActionPreference = "Stop"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Git Push Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$repoPath = "C:\Users\Volodymyr\Desktop\vk-base-game-001"
Set-Location $repoPath

Write-Host "[1/5] Перевірка статусу репозиторію..." -ForegroundColor Yellow
git status
if ($LASTEXITCODE -ne 0) {
    Write-Host "Помилка: не вдалося отримати статус git" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "[2/5] Додавання змін до індексу..." -ForegroundColor Yellow
git add -A
if ($LASTEXITCODE -ne 0) {
    Write-Host "Помилка: не вдалося додати зміни" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "[3/5] Перевірка змін..." -ForegroundColor Yellow
git diff --cached --stat

Write-Host ""
Write-Host "[4/5] Створення коміту..." -ForegroundColor Yellow
$commitMessage = @"
Fix: Level counter, UI buttons, card loading, NFT rewards

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
"@

git commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "Помилка: не вдалося створити коміт (можливо, немає змін)" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "[5/5] Відправка змін на сервер..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Попередження: не вдалося відправити зміни" -ForegroundColor Yellow
    Write-Host "Можливо, потрібно виконати git pull спочатку" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "  Успішно! Зміни відправлено." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
pause
