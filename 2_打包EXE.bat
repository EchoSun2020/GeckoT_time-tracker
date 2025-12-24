@echo off
chcp 65001 >nul
title Time Tracker - 打包 EXE

echo ========================================
echo    Time Tracker 打包工具
echo ========================================
echo.

:: 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 请先运行 "1_安装依赖.bat"
    pause
    exit /b 1
)

:: 进入项目目录
cd /d "%~dp0"

:: 检查依赖是否已安装
if not exist "node_modules" (
    echo [错误] 依赖未安装，请先运行 "1_安装依赖.bat"
    pause
    exit /b 1
)

echo [*] 正在打包成 Windows 便携版...
echo     (首次打包可能需要 3-5 分钟)
echo.

call npm run build

if %errorlevel% neq 0 (
    echo.
    echo [错误] 打包失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo [√] 打包完成！
echo.
echo 文件位置: BUILD\
echo 找到 TimeTracker.exe 双击即可运行
echo.
echo 这个 EXE 可以复制到任意电脑使用！
echo ========================================
echo.

:: 打开 BUILD 文件夹
explorer "%~dp0BUILD"

pause

