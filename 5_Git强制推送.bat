@echo off
chcp 65001 >nul
echo ========================================
echo   Git 强制推送到 GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] 添加所有更改...
git add .

echo.
echo [2/4] 创建提交...
git commit -m "Time Tracker v1.0 - Full project upload" --allow-empty

echo.
echo [3/4] 强制推送到 GitHub（覆盖远程）...
git push -u origin main --force

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo   ✓ 成功！代码已推送到 GitHub
) else (
    echo   ✗ 推送失败，请检查网络或登录状态
)
echo ========================================
echo.
echo 仓库地址: https://github.com/EchoSun2020/GeckoT_time-tracker
echo.
pause

