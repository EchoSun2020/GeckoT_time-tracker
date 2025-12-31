@echo off
chcp 65001 >nul
title Time Tracker - 安装依赖

echo ========================================
echo    Time Tracker 依赖安装
echo ========================================
echo.

:: 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js
    echo.
    echo 请先安装 Node.js：
    echo   1. 打开浏览器访问: https://nodejs.org/
    echo   2. 点击左边绿色按钮下载 LTS 版本
    echo   3. 双击安装，一路点"下一步"即可
    echo   4. 安装完成后，重新运行此脚本
    echo.
    pause
    exit /b 1
)

echo [√] Node.js 已安装
for /f "tokens=*" %%i in ('node -v') do echo     版本: %%i
echo.

:: 进入项目目录
cd /d "%~dp0"

echo [*] 正在安装依赖，请稍候...
echo     (首次安装可能需要 1-3 分钟)
echo.

call npm install

if %errorlevel% neq 0 (
    echo.
    echo [错误] 安装失败，请检查网络连接后重试
    pause
    exit /b 1
)

echo.
echo ========================================
echo [√] 安装完成！
echo.
echo 接下来你可以：
echo   - 双击 "2_打包EXE.bat" 生成便携版
echo   - 双击 "3_启动应用.bat" 直接运行
echo ========================================
echo.
pause










