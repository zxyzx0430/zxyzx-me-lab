# M01 React / TS + Vite 独立预览（未批准）

本实验位于 `apps/portfolio-react/`，不覆盖根目录 V4、`experiments/m01-v3-art-motion/`、`modules/knowledge-network/`，也不修改旧 module registry。

- `src/modules/m01/components/`：字形、肖像、轨迹 SVG、装饰独立图层。
- `src/modules/m01/m01.css`：从历史海报分支 `fix/m01-poster-ink-orbits` 迁入的画布几何 CSS（保持尺寸值以便先行校准）。
- `src/shared/navigation/`：一手势一页协调器（组合层负责）。
- `src/shared/animation/`：GSAP 预设；Motion 只处理轻交互。
- `src/remotion/`：仅用于可复用的视频预演，**不控制网站**。
- `visual/proxy-1672.jpg`：历史 1672×941 截图，**不是**用户指定的 `docs/design-references/m01-poster-v2-target.png`。

开发：`pnpm install && pnpm run dev`。构建：`pnpm run build`。单元：`pnpm run test`。浏览器：`pnpm run test:browser`。逐帧预演：`pnpm run remotion`。

独立预览路径：`/zxyzx-me-lab/preview/m01-react/`。静态视觉截图加 `?static=1` 可关闭入场动画。

> 视觉母版文件尚未在用户对话附件、Repository main 和 VPS 工作目录中找到。所有当前截图/差异分析均仅是对历史代理基线的比较。不得标为 1:1 或 approved。

## Verified original visual master (2026-10-28)

The ZIP's original 1672×941 PNG was verified at SHA-256 `f28b1294ca511661d1ed6ce8bddcd524fdf9d50f8ac5428eac6362d3e6333257` and stored at `docs/design-references/m01-poster-v2-target.png`. This supersedes any earlier missing-PNG notices. All **current** visual comparison is against this PNG, not `visual/proxy-1672.jpg`. `pnpm run test:visual` produces the original-source side-by-side, overlay, heatmap, and per-region metrics. All source-derived text masks and photographic scraps remain **separate layers**; never use the full original poster as a page background.
