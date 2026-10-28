# ZXYZX.ME — Personal Digital Laboratory

独立的个人网站开发仓库（**开发预览，不是 zxyzx.me 正式站**）。

## 新线程 / 新开发者从这里开始

1. **[AGENTS.md](AGENTS.md)**：明确开发边界、视觉保护规则与交接标准
2. **[模块化开发规范](docs/MODULE_STANDARD.md)**：结构、接口、版本、集成及验收流程
3. **[已登记模块清单](docs/module-registry.json)**：只记录已真实建立的模块
4. **[新模块模板](templates/module/README.md)**：未来创建一个独立模块时怎么做

新模块可以运行 `node scripts/new-module.mjs <module-id>` 初始化为 **draft**；这不会更改首页或自动标记为已批准。

## 当前已经模块化的内容

| ID | 状态 | 单独预览 | 设计说明 |
| --- | --- | --- | --- |
| `knowledge-network` | **approved V5** | [独立模块](modules/knowledge-network/) | [README](modules/knowledge-network/README.md) |

唯一已批准的知识网络 V5 还保存在 `experiments/network-v5/` 与 Git 标签 `knowledge-network-v5-approved`。新 `modules/knowledge-network/` 是**字节相同的 V5 视频 + 独立组件和可重渲染源码**，不是重新设计的动画。

## 当前网站状态

- 根目录 `index.html` 是此前 V4 交互开发原型，目前仍为单文件。**尚未迁移为模块化首页**。
- `experiments/` 是历史实验与已确认版本的原稿库。
- 本次没有重写首页，没有修改其他项目模块，也没有调整正式域名或生产项目仓库。
- 未来按 `modules/<module-id>` 单独开发：例如首页 Hero、三个项目介绍等；这些目前只是**候选方向**，不能写成已完成。

## 校验模块

```bash
node scripts/validate-modules.mjs
node --test modules/knowledge-network/tests/*.test.mjs
```

## 本地预览

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000/modules/knowledge-network/
```

## 原有实验

- [旧版 V4 整页](index.html)
- [A/B/C/D 动效研究](experiments/network-lab/)
- [已批准的知识网络 V5 原稿](experiments/network-v5/)

其他项目源仓库： [Personal AI System](https://github.com/zxyzx0430/personal-ai-web) · [Open Margin](https://github.com/zxyzx0430/open-margin) · [Hardware RAG Agent](https://github.com/zxyzx0430/Hardware-RAG-Agent)
