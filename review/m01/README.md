# M01 · 固定截图验收站

固定网址：https://zxyzx0430.github.io/zxyzx-me-lab/review/m01/

这里只展示 **1920×1080** 的 M01 V3 首页桌面截图。手机访问会自动缩放图片。点击主图或“放大查看完整截图”可以直接打开原图；历史版本展示每次修改的留档截图。

## 自动更新

GitHub Actions 工作流：.github/workflows/m01-visual-review.yml

- 当 experiments/m01-v3-art-motion/index.html 改变并推送到 main 时，自动使用桌面 Chromium 截图；也可以手动 workflow_dispatch。
- 视口仅 **1920×1080**，不会截图 1440×900 或其他大小。
- 生成 latest.jpg、按源文件版本生成 versions/<sha>.jpg，并更新 history.json。
- 生成后的图片及历史索引由 bot 自动提交，随后请求 GitHub Pages 重新构建。不把截图目录放在工作流触发路径内，避免循环。
- 本地/VPS：PUPPETEER_PATH=/opt/dc-agent/node_modules/puppeteer CHROME_BIN=/usr/bin/chromium node scripts/review/capture-m01.cjs
- 截图前验证页面 HTTP 200、肖像加载、无 JavaScript 报错、无横向溢出；页面动画完成后截屏。

## 范围

本目录只用于视觉验收，不修改 V3 源画面、根首页或 Knowledge Network V5。每次任务交付应同时提供截图站的网址。
