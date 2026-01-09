@echo off
echo Triggering Netlify deploy...
git commit --allow-empty -m "Trigger Netlify deploy for bulk actions"
git push origin main
echo.
echo Deploy triggered! Wait 2-3 minutes then check:
echo https://4leafclover.id/admin/messages
echo.
echo Remember to clear browser cache (Ctrl+Shift+R)
pause
