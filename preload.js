/**
 * Time Tracker - Preload 脚本
 * 安全地暴露主进程功能给渲染进程
 */

const { contextBridge, ipcRenderer } = require('electron');

// 暴露给渲染进程的 API
contextBridge.exposeInMainWorld('electronAPI', {
    // 切换迷你模式
    toggleMiniMode: () => {
        ipcRenderer.send('toggle-mini-mode');
    },

    // 显示主窗口
    showMainWindow: () => {
        ipcRenderer.send('show-main-window');
    },

    // 最小化到托盘
    minimizeToTray: () => {
        ipcRenderer.send('minimize-to-tray');
    },

    // 发送计时器更新
    sendTimerUpdate: (data) => {
        ipcRenderer.send('timer-update', data);
    },

    // 停止计时（从迷你窗口）
    stopTimer: () => {
        ipcRenderer.send('mini-stop-timer');
    },

    // 继续上一条记录（从迷你窗口）
    continueLastRecord: (recordData) => {
        ipcRenderer.send('mini-continue-record', recordData);
    },

    // 监听快捷键触发的开始计时
    onStartTimer: (callback) => {
        ipcRenderer.on('shortcut-start-timer', callback);
    },

    // 监听快捷键触发的停止计时
    onStopTimer: (callback) => {
        ipcRenderer.on('shortcut-stop-timer', callback);
    },

    // 监听计时器同步（迷你窗口用）
    onTimerSync: (callback) => {
        ipcRenderer.on('timer-sync', (event, data) => callback(data));
    },

    // 监听继续记录请求（主窗口用）
    onContinueRecord: (callback) => {
        ipcRenderer.on('continue-record', (event, data) => callback(data));
    },

    // 检测是否在 Electron 环境
    isElectron: true
});
