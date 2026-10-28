# M01 React 候选版｜原始 PNG 视觉验收审计（2026-10-28）

> 本文仅记录已核验事实。候选版本仍为 **draft / 未获用户批准**；不影响已批准的 M01 V3、知识网络 V5 或根目录入口。

## 唯一正式母版

- 路径：`docs/design-references/m01-poster-v2-target.png`
- 格式：原始 PNG，RGB；尺寸：**1672 × 941**
- SHA-256：`f28b1294ca511661d1ed6ce8bddcd524fdf9d50f8ac5428eac6362d3e6333257`
- Git Blob SHA-1：`88496fca4ea38117a861f24367e74b4012295f3c`。仓库中的同路径文件 Blob SHA 与上传 ZIP 中原始字节的 Git Blob SHA 相同。
- 原始母版提交：`baf96af061a7f27c4c4cd95bebfced5164f01994`。
- 历史 `visual/proxy-1672.jpg` 和旧版 `score.txt` 只表示历史代理比较，**不是**当前验收依据。

## 已核验工程边界

- 开发分支：`feat/react-m01-poster-architecture`；本次审计对照的源码提交：`d17f5bc06f88d0e1a2aa17334f199d496bce46da`。
- 发布入口：`https://zxyzx0430.github.io/zxyzx-me-lab/preview/m01-react/`；`?static=1` 为静态对照。
- 主体由 React / TypeScript 组织；字形、摄影裁片、山脉、纸片和 SVG 轨道分别管理；GSAP 负责主视觉入场，Motion 只管理过渡区悬停，Remotion 独立保留。
- `apps/portfolio-react/module.json` 仍为 `status: draft`、`approvedTag: null`。
- 禁止将本 React 候选版误称为既有 V3 的新版批准基线。

## 实测环境与结果

- 2026-10-28 使用 VPS Chromium 对 **线上静态预览** 重新抓取 1672×941、390×844 截图，`deviceScaleFactor=1`，等待 `networkidle`、字体就绪和图像稳定。
- 两种视口均返回 HTTP **200**；没有页面 JavaScript 异常、HTTP 4xx/5xx 资源响应或横向溢出；桌面提取后的肖像资产在浏览器中成功解码（naturalWidth=800）。
- 线上 1672×941 截图与原始 PNG 直接重新比较（RGB 三通道绝对差均值）：**5.2349/255**，大于 20/255 的像素占 **4.749%**，像素级误差 P95 **19.0/255**。
- 对应 feature commit 的 [GitHub Actions run 40692865727](https://github.com/zxyzx0430/zxyzx-me-lab/actions/runs/40692865727) 为 success：构建、Vitest、Playwright、模块规范校验、严格 PNG 对照脚本均成功。
- 自动浏览器测试覆盖 1672×941、1440×900、768×1024、390×844、320×680，以及滚轮、键盘、模拟触摸切换。**自动测试不等同于真人手机触感或审美验收**。

## 原始母版三轮以上可复核的校正记录

使用存档的四张 1672×941 PNG 与同一原始母版重新计算 MAE，均非历史 JPG 代理：

| 阶段 | 存档图像 | 对原始 PNG 的 RGB MAE | 说明 |
|---|---|---:|---|
| 起点 | `master-iteration-0-pre-rebuild.png` | 39.4986 | 原先排版与肖像遮挡仍明显不一致 |
| 校正 1 | `master-iteration-2.png` | 7.2473 | 改为母版来源的独立视觉图层，结构性改善 |
| 校正 2 | `master-iteration-3.png` | 5.2793 | 继续调节图层、构图与轨道 |
| 校正 3 | `master-iteration-4.png` | **5.2349** | 修正肖像附近重复微文字；线上截图实测一致 |

> 以上“说明”是从提交历史、源代码结构和结果得出的阶段性概括；每一轮的像素几何变化及独立操作日志并未完整记录，不能虚构为已测量的 X/Y 偏移值。

## 最新区域比较（统一 1672 × 941 坐标系）

所有数值来源：`apps/portfolio-react/visual/artifacts/master-regions.json`，坐标是参考图裁切区间，不是自动识别的实际元素边框。

| 区域 | 参考裁切坐标 (x0,y0,x1,y1) | RGB MAE | 判断 |
|---|---|---:|---|
| 顶部品牌及导航 | 34,8,1640,100 | 6.307 | 仍有字号/间距或局部亮度误差 |
| 巨型「向内」 | 61,112,525,420 | 4.807 | 大体接近，纹理和边缘存在差异 |
| 「寻找」 | 512,232,770,366 | 10.564 | **继续优先校正** |
| 空心「中心，」 | 522,342,838,481 | 7.393 | 描边与轨道叠加仍有差异 |
| 巨型「向外」 | 127,412,622,747 | 5.978 | 纹理、边缘和微偏移尚存 |
| 「探寻」 | 605,491,890,635 | 8.004 | 仍需细化 |
| 「世界。」 | 597,611,886,779 | 8.717 | 仍需细化 |
| 山脉拼贴 | 12,413,233,515 | **11.969** | **最高优先级**，裁剪及色阶不完全吻合 |
| 肖像及相框 | 805,67,1600,935 | **3.932** | 目前最接近的主图层之一；局部灰阶差异 |
| 底部文字 | 42,723,793,935 | 9.331 | 字重、抗锯齿和定位仍需校正 |
| 纸张留白 | 260,0,580,110 | 1.138 | 接近 |
| 轨道交叉 | 0,185,940,828 | 6.754 | 局部穿插、透明度和位置仍不同 |

## 可复核证据

- 当前静态截图：`apps/portfolio-react/visual/artifacts/m01-1672x941.png`
- 母版并排图：`apps/portfolio-react/visual/artifacts/side-by-side-master-1672.png`
- 50% 叠加：`apps/portfolio-react/visual/artifacts/overlay-master-1672.png`
- 三倍 RGB 差异：`apps/portfolio-react/visual/artifacts/diff-master-1672.png`
- 色彩热力图：`apps/portfolio-react/visual/artifacts/heatmap-master-1672.png`
- 区域指标：`apps/portfolio-react/visual/artifacts/master-regions.json`
- 校验脚本：`apps/portfolio-react/visual/compare.py`，读取原始母版前会核验 SHA-256，**不读取 JPG 代理**。

## 明确未完成及建议优先顺序

1. **未达到绝对逐像素一致，也未获用户批准**。5.2349/255 是全图均值，不表示每个字符、轨道和装饰都满足几何 1:1。
2. 下一轮重点为山脉、`寻找`、底部微文字、`世界。`、`探寻`；在更新后重新测量独立元素的实际边框与参考坐标偏移，而不仅是区域均值。
3. 桌面用原始 PNG 中分别提取的图层贴合参考；这保证参照精度，但 **裁片不等同于原始独立高分辨率摄影母片或可编辑 SVG 字形**。面向未来更高 DPI 的真实摄影素材和矢量化仍有待完善。
4. 尚未做充分的长时间掉帧基准及真实多机型触控体验验证。已通过的 Playwright 功能测试不能替代这部分工作。
5. 旧文档中关于“PNG 缺失”和代理误差的条目是历史记录，现已被本报告和交接文档的 2026-10-28 段落取代；不应混用。

**结论：候选版已建立真实原始 PNG 回归基线，并以独立图层实现较高精度静态还原；仍为 draft，不能直接升级为 approved，也不能覆盖正式站入口。**
