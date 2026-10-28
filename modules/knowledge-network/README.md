# Knowledge Network · 知识网络 V5（独立模块）

**状态：approved · 视觉冻结**　**ID：knowledge-network**　**版本：5.0.0**

这是此前用户认可的 Obsidian 风格知识网络。**本次只改变封装方式，不改变已批准的 V5 动画画面。**

## 独立预览与历史基线

- **新独立模块：** https://zxyzx0430.github.io/zxyzx-me-lab/modules/knowledge-network/
- **用户批准的历史原稿：** https://zxyzx0430.github.io/zxyzx-me-lab/experiments/network-v5/
- 批准版本 Git 标签：`knowledge-network-v5-approved`
- 组件文件 `assets/obsidian-growth-v5.mp4` 的 SHA-256：
  `528b8963cc58e228bbd67233cef159dae57c3af70f7c078c9ec3ac1fd06a3071`
- `module.json` 是模块身份、接口、媒体及版本状态的权威清单。

## 用户确认的视觉原则（不要重设计）

C：像 Obsidian 一样自然力导向、不规则、疏密变化，开始一个明显的大节点连接多个小节点，后来从已有节点生成其他分支与群落。A：只加微弱星光闪烁和局部高亮。所有节点最终通过路径连通，不是任意两点直接连线。结束阶段通过一段路径唤醒表达旧经验复用。不得恢复五等分圆环或规则辐射。

现有 V5 图谱是 176 个合成节点和 228 条关系，不连接私人 Obsidian 笔记或学习数据。

## 模块包含什么

```text
modules/knowledge-network/
├── index.html                     # 模块独立预览
├── module.js                      # 唯一可嵌入入口：Web Component
├── module.css                     # Shadow DOM 作用域内的样式
├── module.json                    # 模块版本/状态/接口/素材登记
├── assets/                        # V5 批准视频、截图（原字节复制）
├── motion/
│   ├── NetworkObsidianV5.tsx      # 原 V5 Remotion 动效源码
│   ├── Root.tsx / index.ts        # 独立 Composition 注册
│   ├── generate-graph-v5.mjs      # d3-force 图谱生成
│   ├── data/graph-v5.json         # 视觉图谱
│   ├── components/particle-field.tsx
│   ├── components/LICENSE-RemotionUI.txt
│   └── package.json               # 只用于重新渲染，不在网页端加载
└── tests/                         # 静态、关系连通、资产一致性测试
```

## 嵌入任何页面

```html
<script type="module" src="./modules/knowledge-network/module.js"></script>
<zxyzx-knowledge-network id="knowledge"></zxyzx-knowledge-network>
<script>
  const graph = document.getElementById("knowledge");
  // graph.play(); graph.pause(); graph.seek(8.5);
  graph.addEventListener("knowledge-network:ready", e => console.log(e.detail));
</script>
```

注意 `src` 是**相对于当前使用该模块的页面**；组件内部使用 `import.meta.url` 来解析视频及样式，因此不受页面位于哪条路由影响。

**属性：** `autoplay`（可选）、`loop`（可选）；默认不自动播放，并遵循 `prefers-reduced-motion`。
**方法：** `play()`、`pause()`、`seek(seconds)`（返回可等待的 Promise，等待跳转完成再播放）；只读 `currentTime`、`duration`。
**事件：** `knowledge-network:ready`、`:play`、`:pause`、`:seek`、`:error`；事件冒泡并穿出 Shadow DOM。
**样式接口：** `--kn-ink`、`--kn-muted`、`--kn-border`、`--kn-background`；可在父页面局部覆盖变量，而无需修改模块 CSS。
**资源：** MP4 17 秒，poster 及四张分镜图片。页面不需 React/Remotion 运行时。

## 本地预览/测试

仓库根目录：
```bash
python3 -m http.server 8000
# 打开 http://localhost:8000/modules/knowledge-network/
node scripts/validate-modules.mjs
node --test modules/knowledge-network/tests/*.test.mjs
```

要修改**未来新视觉版本**（不得覆盖 V5 视频）：
```bash
cd modules/knowledge-network/motion
npm install
npm run studio
# 首先在独立分支改 Composition/图谱，渲染成新的文件名并提交评审
```

## 升级/修改规则

- **只改容器 UI**（例如播放控件可访问性）：修改 `module.js` / `module.css`，不修改 `assets/` 或 `motion/`。
- **改画面/动效/节点拓扑**：必须重新走视觉评审，另建版本 V6（或其他独立版本），不能覆盖已批准 V5 文件。
- **改嵌入接口**：同步更新 module.json、README 和测试；对外接口不应无意破坏旧调用。
- **改页面布局**：只改变嵌入该模块的页面，不修改模块内部设计。

## 安全与限制

- 无网络 API；图谱媒体均为静态合成内容。
- 不公开真实个人财务、学生学习或知识库内容。
- RemotionUI ParticleField 组件与许可保留在本模块，后续检查第三方许可证。
- **没有**替换根目录 V4 首页，也**没有**修改 zxyzx.me 正式域名。
