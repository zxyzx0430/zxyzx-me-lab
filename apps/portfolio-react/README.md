# M01 React / TypeScript · 独立视觉候选版（draft）

> 本项目只提供 M01 React 海报候选版及 M01→M02 过渡示意；**未获视觉批准，也未接管正式首页**。冻结的 `experiments/m01-v3-art-motion/`、根目录 `index.html`、知识网络 V5 与模块注册表保持不变。

## 唯一正式视觉母版

- 源文件：`../../docs/design-references/m01-poster-v2-target.png`（原始 PNG，1672×941）。
- SHA-256：`f28b1294ca511661d1ed6ce8bddcd524fdf9d50f8ac5428eac6362d3e6333257`。
- 已于 2026-10-28 从用户 ZIP 中恢复，并验证字节与 GitHub Blob 一致。
- `visual/proxy-1672.jpg`、`visual/artifacts/score.txt`、`iterations.txt` 为**历史 JPG 代理阶段的留档**，不得引用其误差作为原始 PNG 的当前验收结果。
- 当前真实 PNG 结果在 `visual/artifacts/master-regions.json`；完整审计见 `../../docs/react-architecture/M01_PNG_MASTER_VISUAL_AUDIT_2026-10-28.md`。

## 分层架构

- `src/app/`：页面壳层及暂未批准的 M02 过渡。
- `src/modules/m01/M01Hero.tsx`：1672×941 桌面艺术画布缩放、静态展示和动画生命周期。
- `src/modules/m01/components/`：字形、肖像、SVG 轨迹和微型装饰的独立可调图层。
- `src/modules/m01/assets/`：高清肖像 WebP；由**原始 PNG**提取的独立字形、肖像、山脉、纸张素材。整个海报 **不作为一张背景图**。
- `src/modules/m01/m01.css`：布局、层级、缩放及移动响应式规则。
- `src/shared/animation/`：GSAP 参数。Motion 仅负责轻量悬停。
- `src/shared/navigation/`：滚轮、键盘、触摸一手势一页，由组合层管理。
- `src/remotion/`：独立视频分镜预演，不作为网站运行容器。
- `visual/extract_layers.py`：核验母版哈希后才会提取艺术图层。
- `visual/compare.py`：核验原始 PNG 哈希，再生成实际截图并排图、50% 叠加、三倍 RGB 差异、热力图及分区 MAE；**不会读取 JPG 代理**。

## 本地命令

在 `apps/portfolio-react/` 下：

```sh
pnpm install --frozen-lockfile
pnpm run dev
pnpm run build
pnpm run test
pnpm run test:browser
pnpm run test:visual
```

视觉分析依赖 Python `pillow`、`numpy`、`opencv-python-headless`。浏览器截图脚本默认输出至 `visual/artifacts/`，强制与母版统一在 1672×941 再比较。

Remotion 独立预演：`pnpm run remotion`。

## 预览与验收

- 动态预览：https://zxyzx0430.github.io/zxyzx-me-lab/preview/m01-react/
- 静态对照：https://zxyzx0430.github.io/zxyzx-me-lab/preview/m01-react/?static=1
- 固定视口：1672×941、1440×900、768×1024、390×844、320×680。
- 2026-10-28 实测线上静态画面对原始 PNG **RGB MAE 5.2349/255**。这是阶段性回归数值，不是绝对 1:1 或用户审美批准。
- 详细区域差异、四次存档截图及三轮校正记录：[`M01_PNG_MASTER_VISUAL_AUDIT_2026-10-28.md`](../../docs/react-architecture/M01_PNG_MASTER_VISUAL_AUDIT_2026-10-28.md)。

## 未解决

山脉拼贴、部分较小汉字及底部微排版仍有明显差异；原始独立摄影母片、完全矢量化字形及长期帧率压力测试尚未完成。移动端已通过 Playwright 交互测试，但不等于所有真实手机均已验证。

**状态始终为 `draft`；未经用户明确确认，不修改已批准标签或正式站入口。**

## BEYOND THE FRAME · 电影动效候选版（2026-10-28）

- 此版本仅为 React 独立候选，不升级 M01 审批状态，不进入正式网站、知识网络 V5 或已批准的 V3。
- 肖像基线：先从 `fix/m01-new-portrait-and-bilingual-copy` 的 `5ed1ad0` 开发，后同步并行分支 `e396142`、`78cdf17` 与最新 `771e9dc`（恢复探寻／世界字形坐标，仅轻微右移肖像并保留留白）。沿用该分支接入的原始 `portrait-user-20261028.jpg`、人物轮廓遮罩、双语文字与右侧英文签名；**未合入已被否定的照片边缘接缝修复**，动效部分不重新生成肖像。
- GSAP 入场依次完成字体油墨显影、现有轨道绘制、照片暗部显影与微型文字；不改变任何 SVG 路径或原始 PNG 视觉母版。
- 指针只对现有图层施加极弱视差与照片光照，手机不模拟鼠标；`?static=1` 和系统减少动态效果均禁用电影镜头。
- 一次明确向下滚动即沿轨道穿入右侧照片，经历短黑场再进入既有第二幕；向上滚动、PageUp、方向键和手机轻扫支持返回。
- 本地真实 Chrome 测试：`pnpm run build`、`pnpm run test`、`pnpm exec playwright test --workers=1`；16 项浏览器测试全部通过，覆盖 5 个指定尺寸。
- 同步新原始肖像后，1672×941 的动态定格与 `?static=1` 浏览器截图平均 RGB 差异约 `3.377/255`；这是局部摄影呼吸和光照叠加的差别，几何构图未被重排。
- 真实测试截图、浏览器录屏：`visual/motion-evidence/`。录屏文件来自 Playwright Chrome，非人工拼接的动画模拟。
- 持续性能压力测试、低端真机 GPU 帧率测量仍待单独验证；本次没有臆造 FPS/CPU 数值。
