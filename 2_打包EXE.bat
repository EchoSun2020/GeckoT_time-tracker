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

echo [0/3] 关闭正在运行的程序（避免文件占用）...
:: 如果你正在运行打包后的 BUILD\win-unpacked\Time Tracker.exe，会锁住 d3dcompiler_47.dll
taskkill /f /im "Time Tracker.exe" /t >nul 2>nul
taskkill /f /im "electron.exe" /t >nul 2>nul

echo [1/3] 清理旧的构建产物...
if exist "BUILD\win-unpacked" (
    rmdir /s /q "BUILD\win-unpacked" >nul 2>nul
)
:: 有时删除会被占用，等待一下再重试
if exist "BUILD\win-unpacked" (
    timeout /t 2 /nobreak >nul
    rmdir /s /q "BUILD\win-unpacked" >nul 2>nul
)
if exist "BUILD\win-unpacked" (
    echo [错误] 无法删除 BUILD\win-unpacked（可能被占用）
    echo - 请先关闭所有 Time Tracker 窗口
    echo - 关闭所有打开的 BUILD\win-unpacked 文件夹窗口
    echo - 再重新运行本脚本
    pause
    exit /b 1
)

echo [2/3] 开始打包...
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










