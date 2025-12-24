@echo off
chcp 65001 >nul
echo ========================================
echo   Git 初始化和推送到 GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] 初始化 Git 仓库...
git init

echo.
echo [2/5] 添加所有文件...
git add .

echo.
echo [3/5] 创建首次提交...
git commit -m "Initial commit: Time Tracker v1.0"

echo.
echo [4/5] 添加远程仓库...
git remote add origin https://github.com/EchoSun2020/GeckoT_time-tracker.git

echo.
echo [5/5] 推送到 GitHub...
echo （首次推送可能需要登录 GitHub）
git branch -M main
git push -u origin main

echo.
echo ========================================
echo   完成！代码已推送到 GitHub
echo ========================================
echo.
echo 仓库地址: https://github.com/EchoSun2020/GeckoT_time-tracker
echo.
pause

