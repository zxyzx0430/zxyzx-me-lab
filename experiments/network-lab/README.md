# ZXYZX / Knowledge Network Motion Lab

三版动效使用 Remotion 实际渲染，并引用 RemotionUI 现成组件。本文件夹不改变站点正式首页。

## 内容
- A 星光觉醒：星点 → 联结 → 学习闭环
- B 神经脉冲：节点激活 → 信号传播 → 学习反馈形成新联系
- C Obsidian 式知识图谱：知识簇生长、建立跨主题联系 → 长期经验复用

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

如环境无 Remotion Chrome，可使用 --browser-executable 指定 chromium。

性能策略：离线渲染 H.264，在网站中一次只播放选中的视频；不会随滚动实时计算动态节点。浏览器减少动态效果时不自动播放。
