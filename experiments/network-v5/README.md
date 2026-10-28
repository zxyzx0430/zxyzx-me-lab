# Knowledge Graph V5 — Obsidian-style organic growth

V5 是独立的实验性视觉稿，承接此前 A/B/C/D 但不覆盖它们。

## 已确认的需求
- **C 为主体**：Obsidian 式自然力导向知识图谱，一颗相对较大的核心节点带动众多小节点，再自然形成不规则分支。
- **A 为点缀**：星点轻微闪烁、局部高亮，而不是大量发光球或对称的五角式枢纽。
- **最终连通**：所有节点能够通过图中的真实边路径相互到达，但不是每两点直接连接。
- **叙事目的**：代表学习经验持续积累，并在下一次遇到问题时被重新调用。

## 工程结构
- `../network-lab/generate-graph-v5.mjs`: D3 Force 离线计算的图谱布局和连通性校验。
- `../network-lab/src/data/graph-v5.json`: 176 个确定性节点、228 条关系。
- `../network-lab/src/NetworkObsidianV5.tsx`: Remotion 程序化镜头，含生长、闪烁、微位移、关联出现、沿图路径高亮。
- `assets/obsidian-growth-v5.mp4`: 720x900 / 24fps / 408 frames / 17s 预渲染视频。
- `index.html`: 单视频评审页，可播放、拖动时间轴、跳到分镜时刻。

本次使用 Remotion、RemotionUI ParticleField 和 d3-force。图谱是视觉化示意，**没有连接真实 Obsidian 仓库或者学生学习记录**。

## 部署原则
开发分支位于 `zxyzx0430/zxyzx-me-lab`，GitHub Pages 独立发布。不要因此修改个人网站主域名 zxyzx.me 的解析，也不需要修改三个项目的原仓库。

## 待评审
检查最终构图的疏密、大小节点比例、闪烁强度和“经验被调用”时高亮路径是否足够清晰。确定后再整合入网站，避免边设计边替换正式页面。
