@echo off
chcp 65001 >nul

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

:: 启动应用
start "" npm start

