/**
 * 图标生成脚本
 * 
 * 运行方式: node generate-icons.js
 * 
 * 依赖: npm install sharp
 * 
 * 此脚本将 SVG 图标转换为 PNG 和 ICO 格式
 */

const fs = require('fs');
const path = require('path');

// 检查是否安装了 sharp
let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.log('请先安装 sharp 库:');
    console.log('npm install sharp');
    console.log('\n或者使用在线工具转换 SVG:');
    console.log('1. 打开 ASSETS/icon.svg');
    console.log('2. 使用 https://convertio.co/svg-png/ 转换为 PNG');
    console.log('3. 使用 https://convertio.co/png-ico/ 转换为 ICO');
    process.exit(1);
}

const assetsDir = path.join(__dirname, 'ASSETS');

async function generateIcons() {
    console.log('正在生成图标...\n');

    try {
        // 生成应用图标 (256x256 PNG)
        await sharp(path.join(assetsDir, 'icon.svg'))
            .resize(256, 256)
            .png()
            .toFile(path.join(assetsDir, 'icon.png'));
        console.log('✓ icon.png (256x256) 已生成');

        // 生成托盘图标 (32x32 PNG)
        await sharp(path.join(assetsDir, 'tray-icon.svg'))
            .resize(32, 32)
            .png()
            .toFile(path.join(assetsDir, 'tray-icon.png'));
        console.log('✓ tray-icon.png (32x32) 已生成');

        // 生成不同尺寸用于 ICO
        const sizes = [16, 32, 48, 64, 128, 256];
        for (const size of sizes) {
            await sharp(path.join(assetsDir, 'icon.svg'))
                .resize(size, size)
                .png()
                .toFile(path.join(assetsDir, `icon-${size}.png`));
        }
        console.log('✓ 多尺寸 PNG 已生成 (用于创建 ICO)');

        console.log('\n图标生成完成!');
        console.log('\n提示: Windows ICO 文件需要使用专门工具生成:');
        console.log('推荐使用 https://icoconvert.com/ 上传 icon-256.png 来生成 icon.ico');

    } catch (error) {
        console.error('生成图标时出错:', error.message);
    }
}

generateIcons();










