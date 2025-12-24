# Time Tracker - 时间记录应用

完全离线的时间记录桌面应用，支持全局快捷键和置顶小组件。

## 📁 项目结构

```
20251224_CODE_TimeRecord/
├── SRC/                    # 源代码
│   ├── index.html          # 主界面
│   ├── mini.html           # 迷你窗口界面
│   ├── styles.css          # 样式
│   ├── app.js              # 应用逻辑
│   └── data.js             # 数据管理
├── ASSETS/                 # 资源文件（图标等）
├── BUILD/                  # 打包输出
├── DOCS/                   # 文档
├── package.json            # 项目配置
├── main.js                 # Electron 主进程
└── preload.js              # Electron 预加载脚本
```

## 🚀 两种使用方式

### 方式一：纯网页版（简单）

直接双击打开 `SRC/index.html` 即可使用。

**限制**：
- 快捷键仅在浏览器窗口激活时有效
- 无法使用迷你窗口和系统托盘

---

### 方式二：桌面应用版（推荐）

支持全局快捷键、置顶小组件、系统托盘。

#### 安装步骤

1. **安装 Node.js**
   - 下载地址：https://nodejs.org/
   - 选择 LTS 版本，安装时勾选所有默认选项

2. **安装依赖**
   
   打开命令提示符（Win+R 输入 cmd），进入项目目录：
   ```bash
   cd D:\00working\20251224_CODE_TimeRecord
   npm install
   ```

3. **运行应用**
   ```bash
   npm start
   ```

4. **（可选）打包成 .exe**
   ```bash
   npm run build
   ```
   打包后的文件在 `BUILD/` 目录

---

## ⌨️ 快捷键

| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `Ctrl+Shift+T` | 开始记录 | 全局有效（桌面版） |
| `Ctrl+Shift+S` | 停止计时 | 全局有效（桌面版） |
| `Ctrl+Shift+M` | 切换迷你模式 | 桌面版专属 |
| `Ctrl+Enter` | 开始/停止 | 在对话框中 |
| `Esc` | 关闭弹窗 | - |

---

## 🖥️ 功能说明

### 迷你模式
- 点击右上角 ▫ 按钮进入
- 置顶显示在屏幕右上角
- 实时显示计时状态
- 点击展开按钮返回主窗口

### 系统托盘
- 应用最小化后驻留托盘
- 右键菜单快速操作
- 左键点击显示/隐藏主窗口

### 数据导出/导入
- 支持选择日期范围导出 JSON
- JSON 文件可跨平台导入
- 智能合并或覆盖导入

---

## 📋 添加托盘图标（可选）

为了让系统托盘显示图标，请将图标文件放到 `ASSETS/` 目录：

- `tray-icon.png` - 托盘图标（建议 16x16 或 32x32 像素）
- `icon.png` - 应用图标（建议 256x256 像素）
- `icon.ico` - Windows 应用图标

---

## 🛠️ 一键脚本

项目根目录提供了三个便捷脚本：

| 脚本 | 用途 |
|------|------|
| `1_安装依赖.bat` | 安装项目依赖（首次使用运行一次） |
| `2_打包EXE.bat` | 打包成便携式 .exe 文件 |
| `3_启动应用.bat` | 开发模式运行应用 |

---

## ⚠️ 打包注意事项

在运行 `2_打包EXE.bat` 之前，**务必确认**：

1. ❌ **Time Tracker 应用没在运行**
   - 检查任务栏和系统托盘
   - 如有运行，右键退出或从任务管理器结束

2. ❌ **BUILD 文件夹没在资源管理器中打开**
   - 关闭所有打开 `BUILD\win-unpacked` 的窗口

3. ✅ **然后再运行打包脚本**

### 打包失败怎么办？

如果看到 `Access is denied` 错误：
```
remove ...\d3dcompiler_47.dll: Access is denied.
```

解决方法：
1. 关闭 Time Tracker 应用
2. 关闭 BUILD 文件夹
3. 手动删除 `BUILD\win-unpacked` 文件夹
4. 重新运行 `2_打包EXE.bat`

---

## 🔧 常见问题

**Q: npm install 报错怎么办？**
A: 确保 Node.js 已正确安装，可以运行 `node -v` 检查版本。

**Q: 快捷键不生效？**
A: 网页版需要浏览器窗口在前台。要实现全局快捷键，请使用桌面应用版。

**Q: 数据存在哪里？**
A: 数据存储在浏览器的 localStorage 中，导出为 JSON 可备份。

**Q: 打包时提示 Access is denied？**
A: 见上方"打包注意事项"，关闭应用和文件夹后重试。

**Q: 打包后的 EXE 在哪？**
A: 在 `BUILD\win-unpacked\Time Tracker.exe`。复制整个 `win-unpacked` 文件夹到其他电脑即可使用。

---

## 📦 跨平台

- ✅ Windows
- ✅ macOS  
- ✅ Linux

导出的 JSON 数据文件可在任意平台导入使用。

