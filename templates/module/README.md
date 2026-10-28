# 新模块模板（仅作为起点，不是已上线模块）

创建一个真正独立的新模块时，在 `modules/<new-id>/` 下建立：

- `index.html`：独立模块预览（仅引用本模块内部文件）
- `module.js`：可嵌入入口，原生 Web Component 或同等级的独立边界
- `module.css`：只作用于本模块
- `module.json`：模块 ID / 版本 / 状态 / 资源 / 接口
- `assets/`：该模块图片、视频、素材
- `README.md`：解决的问题、设计、公共接口、限制
- `tests/`：加载和资产/行为验收

新模块初始为 `draft`，**不应默认宣称批准**。确定视觉方向和评审通过后再 `approved`。
只有经正式登记的模块才加入 `docs/module-registry.json`。
具体请按 `docs/MODULE_STANDARD.md` 中的完整标准执行。

不要直接把旧 V4 首页复制成新模块；不要让新模块隐式依赖 `window` 全局变量或其它模块的 DOM。
