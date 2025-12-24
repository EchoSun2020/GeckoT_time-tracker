/**
 * Time Tracker - Electron 主进程
 * 实现全局快捷键、系统托盘、迷你窗口等功能
 */

const { app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu, screen, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

// 创建内置托盘图标（16x16 像素的简单时钟图标）
function createBuiltinIcon() {
    // 创建一个 16x16 的简单图标
    // 使用 Buffer 手动创建一个简单的 PNG
    const size = 16;
    const channels = 4; // RGBA
    const data = Buffer.alloc(size * size * channels);
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 6;
    
    // 时钟颜色 (天蓝色 #7dd3fc)
    const clockR = 125, clockG = 211, clockB = 252;
    // 背景色 (深色 #1a1a24)
    const bgR = 26, bgG = 26, bgB = 36;
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * channels;
            const dx = x - centerX + 0.5;
            const dy = y - centerY + 0.5;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist <= radius + 1 && dist >= radius - 1) {
                // 外圈
                data[idx] = clockR;
                data[idx + 1] = clockG;
                data[idx + 2] = clockB;
                data[idx + 3] = 255;
            } else if (dist < radius - 1) {
                // 内部
                // 时针 (向上)
                if (x >= 7 && x <= 8 && y >= 4 && y <= 8) {
                    data[idx] = 228;
                    data[idx + 1] = 228;
                    data[idx + 2] = 231;
                    data[idx + 3] = 255;
                }
                // 分针 (向右上)
                else if ((x === 9 && y === 6) || (x === 10 && y === 5)) {
                    data[idx] = clockR;
                    data[idx + 1] = clockG;
                    data[idx + 2] = clockB;
                    data[idx + 3] = 255;
                }
                // 中心点
                else if (dist <= 1.5) {
                    data[idx] = clockR;
                    data[idx + 1] = clockG;
                    data[idx + 2] = clockB;
                    data[idx + 3] = 255;
                }
                // 背景
                else {
                    data[idx] = bgR;
                    data[idx + 1] = bgG;
                    data[idx + 2] = bgB;
                    data[idx + 3] = 255;
                }
            } else {
                // 外部透明
                data[idx] = 0;
                data[idx + 1] = 0;
                data[idx + 2] = 0;
                data[idx + 3] = 0;
            }
        }
    }
    
    return nativeImage.createFromBuffer(data, { width: size, height: size });
}

// 窗口引用
let mainWindow = null;
let miniWindow = null;
let tray = null;

// 应用状态
let isTimerRunning = false;
let currentTimerDisplay = '00:00:00';
let appWasReady = false;

// 创建主窗口
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        frame: true,
        backgroundColor: '#0f0f14',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'ASSETS', 'icon.png'),
        show: false
    });

    mainWindow.loadFile(path.join(__dirname, 'SRC', 'index.html'));

    // 窗口准备好后显示
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // 关闭窗口时隐藏到托盘而不是退出
    mainWindow.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 创建迷你窗口（置顶小组件）
function createMiniWindow() {
    const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;
    
    miniWindow = new BrowserWindow({
        width: 280,
        height: 80,
        x: screenWidth - 300,
        y: 20,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        skipTaskbar: true,
        focusable: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    miniWindow.loadFile(path.join(__dirname, 'SRC', 'mini.html'));
    
    // 允许拖拽移动
    miniWindow.setMovable(true);

    miniWindow.on('closed', () => {
        miniWindow = null;
    });
}

// 创建系统托盘
function createTray() {
    const { nativeImage } = require('electron');
    const fs = require('fs');
    
    let trayIcon;
    const pngPath = path.join(__dirname, 'ASSETS', 'tray-icon.png');
    const svgPath = path.join(__dirname, 'ASSETS', 'tray-icon.svg');
    
    // 优先使用 PNG，其次 SVG，最后使用内置图标
    if (fs.existsSync(pngPath)) {
        trayIcon = nativeImage.createFromPath(pngPath);
    } else if (fs.existsSync(svgPath)) {
        // 从 SVG 创建图标（需要转换）
        trayIcon = createBuiltinIcon();
    } else {
        // 使用内置的 Data URL 图标
        trayIcon = createBuiltinIcon();
    }
    
    tray = new Tray(trayIcon);

    const contextMenu = Menu.buildFromTemplate([
        { 
            label: '显示主窗口', 
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        },
        { 
            label: '迷你模式', 
            click: () => toggleMiniMode()
        },
        { type: 'separator' },
        { 
            label: '开始记录 (Ctrl+Shift+T)', 
            click: () => triggerStartTimer()
        },
        { 
            label: '停止计时 (Ctrl+Shift+S)', 
            click: () => triggerStopTimer()
        },
        { type: 'separator' },
        { 
            label: '退出', 
            click: () => {
                app.isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Time Tracker');
    tray.setContextMenu(contextMenu);

    // 点击托盘图标显示主窗口
    tray.on('click', () => {
        if (mainWindow) {
            if (mainWindow.isVisible()) {
                mainWindow.hide();
            } else {
                mainWindow.show();
                mainWindow.focus();
            }
        }
    });
}

// 注册全局快捷键
function registerShortcuts() {
    // Ctrl+Shift+T: 开始记录
    globalShortcut.register('CommandOrControl+Shift+T', () => {
        triggerStartTimer();
    });

    // Ctrl+Shift+S: 停止计时
    globalShortcut.register('CommandOrControl+Shift+S', () => {
        triggerStopTimer();
    });

    // Ctrl+Shift+M: 切换迷你模式
    globalShortcut.register('CommandOrControl+Shift+M', () => {
        toggleMiniMode();
    });
}

// 触发开始计时
function triggerStartTimer() {
    if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
        mainWindow.webContents.send('shortcut-start-timer');
    }
}

// 触发停止计时
function triggerStopTimer() {
    if (mainWindow) {
        mainWindow.webContents.send('shortcut-stop-timer');
    }
    if (miniWindow) {
        miniWindow.webContents.send('shortcut-stop-timer');
    }
}

// 切换迷你模式
function toggleMiniMode() {
    if (miniWindow) {
        miniWindow.close();
        miniWindow = null;
        if (mainWindow) {
            mainWindow.show();
        }
    } else {
        createMiniWindow();
        if (mainWindow) {
            mainWindow.hide();
        }
    }
}

// IPC 事件处理
function setupIPC() {
    // 切换到迷你模式
    ipcMain.on('toggle-mini-mode', () => {
        toggleMiniMode();
    });

    // 从迷你模式切换到主窗口
    ipcMain.on('show-main-window', () => {
        if (miniWindow) {
            miniWindow.close();
            miniWindow = null;
        }
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    // 更新计时状态（用于迷你窗口显示）
    ipcMain.on('timer-update', (event, data) => {
        isTimerRunning = data.isRunning;
        currentTimerDisplay = data.display;
        
        // 更新托盘提示
        if (tray) {
            tray.setToolTip(isTimerRunning ? `Time Tracker - ${currentTimerDisplay}` : 'Time Tracker');
        }
        
        // 同步到迷你窗口
        if (miniWindow && !miniWindow.isDestroyed()) {
            miniWindow.webContents.send('timer-sync', data);
        }
    });

    // 从迷你窗口停止计时
    ipcMain.on('mini-stop-timer', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('shortcut-stop-timer');
        }
    });

    // 从迷你窗口继续记录
    ipcMain.on('mini-continue-record', (event, recordData) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('continue-record', recordData);
        }
    });

    // 最小化到托盘
    ipcMain.on('minimize-to-tray', () => {
        if (mainWindow) {
            mainWindow.hide();
        }
    });
}

// 应用就绪
app.whenReady().then(() => {
    appWasReady = true;
    createMainWindow();
    createTray();
    registerShortcuts();
    setupIPC();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

// 防止多实例 - 必须在 app.whenReady 之前检查
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
    });
}

// 退出前清理 - 只有在 app 曾经 ready 过才清理快捷键
app.on('will-quit', () => {
    if (appWasReady) {
        globalShortcut.unregisterAll();
    }
});

// macOS 关闭所有窗口时不退出
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // Windows/Linux: 保持托盘运行
        // app.quit();
    }
});

