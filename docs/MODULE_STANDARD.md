# ZXYZX.ME｜模块化开发规范 v1.0

> 本文档是独立开发仓库的**交接合同**。先读根目录的 AGENTS.md，再读本文件与目标模块 README.md；不要直接从根目录 index.html 着手做全站重构。

## 最新验收事实（2026-10-28）

- M01 V3 视觉已通过用户验收：原稿 experiments/m01-v3-art-motion/index.html，设计母稿 docs/module-designs/M01_HOME_APPROVED.md，Git 标签 m01-v3-visual-approved。视觉批准不等于正式独立模块封装。
- modules/home-hero/ 是已被 V3 替代的旧 V1 草稿；不要误用它作为首页。
- 每个模块完成后均须按 docs/MODULE_ACCEPTANCE_AND_HANDOFF.md 保存思想、构图、交互、版本、截图、批准边界和给下个线程的交接材料。
- M02 下一步是精选作品入口：docs/module-designs/M02_WORKS_DESIGN_BRIEF.md（目前只是构思稿，尚未开发）。

## 0. 当前状态（必须如实区分）

- 正式域名 zxyzx.me **未通过本仓库覆盖或接管**。
- 根目录 `index.html` 仍是旧版 V4 单文件实验首页，**尚未整体模块化**。
- 从现在开始，`modules/<module-id>/` 是可独立预览、测试、开发的模块边界。
- 已完成独立封装的模块：`knowledge-network`（已批准视觉 V5）。
- `experiments/network-v5/` 是此前用户认可的历史原稿，不迁移、不覆盖、不删除。
- M01 首页 V3 视觉基准已验收，但仍需正式封装及全站集成；M02、Open Margin、Hardware RAG Agent、About 等后续模块尚未验收。

## 1. 分层与职责

```text
zxyzx-me-lab/
├── index.html                         # 旧 V4 原型，暂不动
├── AGENTS.md                          # 未来开发者/Agent 入口
├── docs/
│   ├── MODULE_STANDARD.md             # 本标准
│   └── module-registry.json           # 模块注册表：事实来源
├── modules/
│   └── knowledge-network/             # 独立已批准模块
│       ├── index.html                 # 可单独打开的预览入口
│       ├── module.json                # ID/版本/状态/接口/素材声明
│       ├── README.md                  # 功能、限制、如何验收
│       ├── module.js                   # 消费端唯一入口
│       ├── module.css                  # 仅供组件内部引用
│       ├── assets/                     # 模块自己的图片/动画
│       ├── motion/                     # 独立 Remotion 动效源码和依赖
│       └── tests/                      # 模块自己的自动验收测试
├── scripts/
│   └── validate-modules.mjs           # 校验所有已登记模块
├── templates/module/                  # 新模块结构参考，不是已上线模块
└── experiments/                       # 历史和独立研究版本，不直接集成
```

**网站组合层**（首页 / pages / layout）只负责插入与排列模块；不能把某个模块的 CSS、关键动画代码和资源复制进首页。未来需要切到 Astro 等站点框架时，应通过现有模块入口集成，不以重写所有已批准的视觉稿为前提。

## 2. 模块必须满足的文件契约

每个可集成模块必须有：
1. **稳定 ID**（kebab-case）和 `module.json`；加入 `docs/module-registry.json` 才算正式纳入模块系统。
2. **独立消费入口**（目前规范为 `module.js`、自定义元素），不依赖旧主页的脚本变量或 CSS 选择器；CSS 使用 Shadow DOM 或同等隔离方案。
3. **独立资源**：相对 `module.js` 的资源地址，适用于 GitHub Pages 子路径；不要硬编码个人主页域名或本地绝对路径。
4. **独立 `index.html` 预览页**，手机/桌面可访问；方便不同线程仅评审一个模块。
5. **`README.md` 与测试**：说明视觉设计、所解决的问题、对外接口、已知限制、如何本地复现、如何核验。
6. **批准和历史记录**：未评审标为 `draft`，用户明确认可后才能设置 `approved` 并打 immutable Git tag。

`module.json` 字段至少包括：
`schemaVersion`、`id`、`displayName`、`version`、`status`、`entry`、`preview`、`assets`、`publicApi`、`approvedTag`（未批准为 null）。

## 3. 设计与数据边界

- **一模块一个职责**。知识网络模块不负责个人网站首页、项目介绍文案、财务演示或硬件 Agent。
- 设计统一不是“所有模块共享动画”，而是共享网站的语义导航和最低限度的排版/可用性约束；允许各项目有独立色彩与视觉。
- 不在未经明确授权的情况下使用私人 Obsidian 知识、真实学生记录、财务数据或尚未验证的实机结果。
- 真实视频、合成数据、占位肖像应清楚标注。
- 不通过在 CSS 中写全局 `html/body/*` 规则影响其他模块；消费入口不能强制锁滚动、拦截整页键盘或重写导航。

## 4. 版本与保护策略

- **正式认可的视觉版本只读**：旧 `experiments/network-v5/` 与标签 `knowledge-network-v5-approved` 保留。
- 模块封装允许在不改变视觉内容的情况下调整播放器/路径/可访问性；若改动关键构图、动效或节点关系，应新建视觉版本并让用户重新确认。
- 不要覆盖原有 MP4、图片或已批准数据。需要改动画时，在独立工作分支制作新资源，比较原版与新版。
- 版本建议 `<module-id>-v<major>.<minor>.<patch>`；当前知识网络模块使用 `5.0.0` 来表示被封装的 V5 视觉基线。
- 不要随意移动或删除其他模块目录、既有项目官网仓库和正式 DNS 配置。

## 5. 后续线程标准工作流程

1. 读 `AGENTS.md`、`docs/MODULE_STANDARD.md`、注册表和该模块 `README.md`，确认当前设计冻结点。
2. 只修改本任务模块目录。若必须改共享配置/入口，先列出依赖和受影响模块，再做隔离变更。
3. 建 `feat/<module-id>-<purpose>` 分支；保留可工作的 `main`，不要在未验证时直接替换首页。
4. 修改模块自己的预览页并运行 `node scripts/validate-modules.mjs` 与模块测试。
5. 检查桌面和手机浏览器，至少确认：资源 HTTP 200、加载无 JS 错误、无横向溢出、点击/播放/暂停正常、无意外全局副作用。
6. 审查 `git diff --name-only`：若出现其他模块/批准历史资产，必须撤回无关改动。
7. 提交、推送、展示模块独立 URL 与修改摘要；视觉改版需要用户亲自认可后再更新 `status` 或新建 tag。
8. 报告中明确区分**已实现/已测试/仍未集成**，禁止把模块预览说成正式个人网站完成。

## 6. 消费端示例（无框架依赖）

```html
<script type="module" src="/zxyzx-me-lab/modules/knowledge-network/module.js"></script>
<zxyzx-knowledge-network id="knowledge-network"></zxyzx-knowledge-network>
<script>
  document.getElementById("knowledge-network").addEventListener(
    "knowledge-network:ready", event => console.log(event.detail.duration)
  );
</script>
```

此地址仅示范 GitHub Pages 项目子路径，正式站点应按部署环境改用相对 URL 或构建工具的资源解析方式。

页面可以调用 `play()`、`pause()`、`seek(seconds)`。不要跨组件 Shadow DOM 修改内部 DOM。监听公开事件，不读取内部变量。

## 7. 什么才算“整个网站模块化”

当前完成了**模块规范初始化 + 知识网络的独立模块化 + M01 V3 视觉验收**。要将整个网站模块化，需要未来逐个完成首页 Hero、作品入口、每个项目等的独立封装，最后由组合层装配；这一步尚未实施。

本标准不要求为每个模块创建单独 GitHub 仓库。所有模块可以同仓库、独立目录、独立验收、独立版本。

## 8. 协作交接必须包含

每次开发结束向下一个线程留下：目标与范围、模块路径、批准版本/标签、改动文件列表、演示 URL、运行过的测试、已知问题、下一步待决策。没有这些信息不能宣称“已交接完成”。
