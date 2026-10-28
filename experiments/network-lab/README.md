# ZXYZX / Knowledge Network Motion Lab

四版动效使用 Remotion 实际渲染，并引用 RemotionUI 现成组件。本文件夹不改变站点正式首页。

## 内容
- A 星光觉醒：星点 → 联结 → 学习闭环
- B 神经脉冲：节点激活 → 信号传播 → 学习反馈形成新联系
- C Obsidian 式知识图谱：知识簇生长、建立跨主题联系 → 长期经验复用
- **D（最终选择）融合连通网络**：80 颗星点觉醒 → 5 个知识簇逐步连通 → 跨簇桥接 → 传递脉冲 → 最终整个图谱为 1 个连通分量。

D 的拓扑保证：每簇从中心点开始，每新增一个点至少连接一个已在簇内的点；再用中心点之间的 4 条跨簇桥组成连通骨架，额外边只是补充关系。因此最后 80 个节点全部可达，但并非每对节点都必须直接画线。NetworkD.tsx 有运行时图连通性校验，渲染不连通即报错。

视频在 assets/ 目录，为 720×900，24fps，144 帧（6 秒）H.264 MP4；对应浏览器对比入口 index.html。

场景均为概念动画，节点关系为合成素材，不使用真实学生或私人 Obsidian 数据。

## 引用组件
- src/components/particle-field.tsx
- src/components/connector-lines.tsx
- src/components/glow-pulse.tsx

均来自 riaz37/remotion-ui（MIT），https://github.com/riaz37/remotion-ui ；仅对 Connector Lines 的独立 import 作适配。
具体出处参见 THIRD_PARTY.md。

## 本地使用

npm ci
npm run studio
npm run render:a
npm run render:b
npm run render:c
npm run render:d

如环境无 Remotion Chrome，可使用 --browser-executable 指定 chromium。

性能策略：离线渲染 H.264，在网站中一次只播放选中的视频；不会随滚动实时计算动态节点。浏览器减少动态效果时不自动播放。

## V5 有机图谱实验

[C 为主体、A 为点缀的自然生长版](../network-v5/)；源码在 src/NetworkObsidianV5.tsx，D3 力导向图谱由 generate-graph-v5.mjs 生成。
