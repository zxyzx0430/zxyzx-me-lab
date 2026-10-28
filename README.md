# ZXYZX.ME — Personal Digital Lab

独立个人网站开发仓库。当前为 V4 动效与交互预览版本。

## 场景与交互
- 首屏：中文巨型排版与概念肖像。肖像图片为第三方占位图，**不是作者真人照片**。
- Personal AI System：Canvas 知识节点由星光出现、延伸连接成图谱；五个可点击阶段分别展示学习诊断、理解、独立验证、长期记忆、知识复用。
- Open Margin：一笔模拟支付通知进入 Android → HTTPS → SQLite → Wallos/MCP 的四阶段流程；**没有真实财务数据**。
- Hardware RAG Agent：手册检索、来源核对、接线审查、代码预览、串口监视的模拟命令行演示；**不代表真实设备运行结果**。
- 移动端无滚动锁定和持续 scroll-driven canvas 绘制；支持 prefers-reduced-motion。

## 开发和发布
- 静态单页 HTML/CSS/JS，直接打开 `index.html` 可预览。
- GitHub Pages：main 分支根目录发布。
- 本仓库是开发沙盒，**不要把它与个人 AI 学习项目主仓库混用**。
- 正式域名 zxyzx.me 没有在这个仓库配置，避免未经评审覆盖主页。
- 后续请使用 feature branch + Pull Request 更新视觉与内容。

## 项目来源
- https://github.com/zxyzx0430/personal-ai-web
- https://github.com/zxyzx0430/open-margin
- https://github.com/zxyzx0430/Hardware-RAG-Agent

## 注意
此项目里的视觉场景和示例终端输出仅用于网站动画设计评审；实际功能及验证状态以原始项目 README 为准。
