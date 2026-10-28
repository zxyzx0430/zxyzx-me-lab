# 知识网络模块 — V5 已确认设计基线

**确认日期：2026-10-28**
**状态：用户明确认可。后续保留并以此为该模块的默认基线。**
**范围：仅「知识网络 / Knowledge Graph」模块；不包括网站首屏、肖像、Open Margin、Hardware RAG Agent 或其他模块。**

## 已确定的设计

1. **C 为主体**：类似 Obsidian Graph View 的自然力导向图谱；从一个显著的大节点连接多个小节点开始，随着时间从既有关联自然形成其他大小不一、位置不规则的知识群落。
2. **A 为装饰**：节点微光、零星闪烁、局部高亮；不能掩盖真实网络结构。
3. **自然且疏密有别**：不做对称圆环、五个等权枢纽、规整星座、整齐放射线；避免过度发光及浓重特效。
4. **最终连通**：所有出现的知识节点在图上通过路径连通，但不是每两点直接画线。
5. **动画叙事**：孤立的知识起点 → 小节点逐个出现 → 关系与分支延展 → 更复杂的整体图谱 → 一条关联路径被局部唤醒，表示旧知识参与下一次学习。
6. **模块化边界**：此版本仅作为知识网络模块的设计资产。后续讨论其他模块时不随意修改它；若知识网络模块自身需要修订，则另开 V6/独立实验分支，不覆盖已确认的 V5。

## 已完成并保留的交付

- 在线审阅： https://zxyzx0430.github.io/zxyzx-me-lab/experiments/network-v5/
- 17 秒影片：`experiments/network-v5/assets/obsidian-growth-v5.mp4`
- 分镜：`experiments/network-v5/assets/stage-1.jpg`、`stage-4.jpg`、`stage-8.jpg`、`stage-13.jpg`、`final.jpg`
- Remotion 组件：`experiments/network-lab/src/NetworkObsidianV5.tsx`
- D3 force 图谱生成：`experiments/network-lab/generate-graph-v5.mjs`
- 数据：`experiments/network-lab/src/data/graph-v5.json`
- 现有可视化为 176 个合成节点、228 条关系，连通性通过代码验证；未读取私人 Obsidian 或真实学习数据。
- 仓库： https://github.com/zxyzx0430/zxyzx-me-lab
- 永久版本标记（Tag）：`knowledge-network-v5-approved`

**注意：** 这里确认的是「知识网络动画构图与设计方向」，不是整个个人网站 V5，也不是全部项目模块。
