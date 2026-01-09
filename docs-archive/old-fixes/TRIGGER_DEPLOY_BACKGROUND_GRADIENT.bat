@echo off
echo ========================================
echo TRIGGER NETLIFY DEPLOY - BACKGROUND GRADIENT
echo ========================================
echo.
echo Memicu Netlify untuk deploy ulang...
echo.

REM Buat file dummy untuk trigger deploy
echo. >> TRIGGER_DEPLOY.txt
echo Deploy triggered at %date% %time% >> TRIGGER_DEPLOY.txt

REM Git add, commit, push
git add TRIGGER_DEPLOY.txt
git commit -m "Trigger deploy: Update background gradient"
git push origin main

echo.
echo ========================================
echo DEPLOY TRIGGERED!
echo ========================================
echo.
echo Netlify akan auto-deploy dalam 2-3 menit
echo.
echo Cek status di: https://app.netlify.com
echo Atau tunggu 3 menit lalu buka: https://4leafclover.id
echo.
echo PENTING: Clear browser cache dengan Ctrl+Shift+R
echo ========================================
pause
