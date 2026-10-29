import type { CSSProperties } from 'react';
import type { SceneNode, SceneTransform } from './world-scene-manifest';

export type InspectorView = 'composite' | 'reference' | 'difference';

type LayerInspectorProps = {
  nodes: SceneNode[];
  backgroundPlateStatus: 'original-with-overlap' | 'transparent-holes';
  selectedId: string;
  view: InspectorView;
  showBounds: boolean;
  onSelect: (id: string) => void;
  onViewChange: (view: InspectorView) => void;
  onShowBoundsChange: (show: boolean) => void;
  onTransformChange: (id: string, update: Partial<SceneTransform>) => void;
  onReset: () => void;
  showSelectedFillUnder: boolean;
  onFillUnderPreviewChange: (show: boolean) => void;
  transforms: Record<string, SceneTransform>;
};

const range = (value: number, min: number, max: number, step: number, label: string, change: (value: number) => void, testId: string) => (
  <label className="layer-inspector-range">
    <span>{label}<output>{Number(value.toFixed(2))}</output></span>
    <input data-testid={testId} type="range" min={min} max={max} step={step} value={value} onChange={(event) => change(Number(event.currentTarget.value))} />
  </label>
);

function TreeItems({
  nodes,
  depth,
  selectedId,
  onSelect,
}: {
  nodes: SceneNode[];
  depth: number;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return <>
    {nodes.map((node) => (
      <div key={node.id} className="layer-tree-item-wrap">
        <button
          type="button"
          className={`layer-tree-item${selectedId === node.id ? ' is-selected' : ''}${node.kind === 'group' ? ' is-group' : ''}`}
          data-testid={`layer-tree-item-${node.id}`}
          style={{ '--tree-depth': depth } as CSSProperties & { '--tree-depth': number }}
          onClick={() => onSelect(node.id)}
          aria-current={selectedId === node.id ? 'true' : undefined}
        >
          <span className="layer-tree-kind">{node.kind === 'group' ? '▾' : '◇'}</span>
          <span className="layer-tree-name">{node.label}</span>
          <span className="layer-tree-id">{node.id}</span>
        </button>
        {node.kind === 'group' && <TreeItems nodes={node.children} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />}
      </div>
    ))}
  </>;
}

export function LayerInspector({
  nodes,
  backgroundPlateStatus,
  selectedId,
  view,
  showBounds,
  onSelect,
  onViewChange,
  onShowBoundsChange,
  onTransformChange,
  onReset,
  showSelectedFillUnder,
  onFillUnderPreviewChange,
  transforms,
}: LayerInspectorProps) {
  const selected = transforms[selectedId];
  const selectedNode = findNode(nodes, selectedId);
  const isGroup = selectedNode?.kind === 'group';

  return (
    <aside className="layer-inspector" aria-label="Layer Inspector">
      <header className="layer-inspector-header">
        <div><span className="layer-inspector-kicker">DEVELOPMENT TOOL</span><h2>Layer Inspector</h2></div>
        <span className="layer-inspector-count">{countImages(nodes)} image units</span>
      </header>

      <div className={`layer-inspector-fill-status is-${backgroundPlateStatus}`} data-background-plate-status={backgroundPlateStatus}>
        底板：{backgroundPlateStatus === 'original-with-overlap' ? '含原图重叠像素' : '含透明孔洞'} · 推测补全仅覆盖少数单层
      </div>

      <section className="layer-inspector-section">
        <h3>Scene view</h3>
        <div className="layer-inspector-segmented" role="group" aria-label="场景对照模式">
          {(['composite', 'reference', 'difference'] as const).map((value) => (
            <button key={value} type="button" aria-pressed={view === value} onClick={() => onViewChange(value)}>
              {value === 'composite' ? '分层合成' : value === 'reference' ? '原图' : '差异'}
            </button>
          ))}
        </div>
        <label className="layer-inspector-check"><input type="checkbox" checked={showBounds} onChange={(event) => onShowBoundsChange(event.currentTarget.checked)} />显示图层边界</label>
      </section>

      <section className="layer-inspector-section layer-inspector-tree-section">
        <div className="layer-inspector-section-title"><h3>Hierarchy</h3><span>父子组 / 遮挡层级</span></div>
        <div className="layer-inspector-tree"><TreeItems nodes={nodes} depth={0} selectedId={selectedId} onSelect={onSelect} /></div>
      </section>

      {selected && selectedNode && (
        <section className="layer-inspector-section layer-inspector-controls">
          <div className="layer-inspector-section-title"><h3>Selected</h3><span>{selectedNode.label}</span></div>
          <label className="layer-inspector-check"><input data-testid="layer-visibility-toggle" type="checkbox" checked={selected.visible} onChange={(event) => onTransformChange(selectedId, { visible: event.currentTarget.checked })} />可见</label>
          {selectedNode.kind === 'image' && selectedNode.fillUnderCandidate && (
            <label className="layer-inspector-check layer-inspector-fill-toggle">
              <input
                data-testid="layer-fill-under-toggle"
                type="checkbox"
                checked={showSelectedFillUnder}
                onChange={(event) => onFillUnderPreviewChange(event.currentTarget.checked)}
              />
              显示此层推测补全
            </label>
          )}
          {range(selected.opacity, 0, 1, 0.01, '不透明度', (opacity) => onTransformChange(selectedId, { opacity }), 'layer-opacity-range')}
          {range(selected.x, -200, 200, 1, '水平位移 px', (x) => onTransformChange(selectedId, { x }), 'layer-x-range')}
          {range(selected.y, -200, 200, 1, '垂直位移 px', (y) => onTransformChange(selectedId, { y }), 'layer-y-range')}
          {range(selected.scale, 0.3, 2, 0.01, '缩放', (scale) => onTransformChange(selectedId, { scale }), 'layer-scale-range')}
          {range(selected.rotation, -25, 25, 0.25, '旋转 °', (rotation) => onTransformChange(selectedId, { rotation }), 'layer-rotation-range')}
          <div className="layer-inspector-motion-tests">
            <p>位移测试</p>
            {[30, 80, 150].map((distance) => (
              <div className="layer-inspector-motion-row" key={distance}>
                <span>±{distance}px</span>
                <button type="button" onClick={() => onTransformChange(selectedId, { x: -distance })} aria-label={`向左移动 ${distance} 像素`}>←</button>
                <button type="button" onClick={() => onTransformChange(selectedId, { x: distance })} aria-label={`向右移动 ${distance} 像素`}>→</button>
                <button type="button" onClick={() => onTransformChange(selectedId, { y: -distance })} aria-label={`向上移动 ${distance} 像素`}>↑</button>
                <button type="button" onClick={() => onTransformChange(selectedId, { y: distance })} aria-label={`向下移动 ${distance} 像素`}>↓</button>
              </div>
            ))}
          </div>
          {selectedNode.kind === 'image' && (
            <dl className="layer-inspector-metadata">
              <div><dt>Parent</dt><dd>{selectedNode.parentId}</dd></div>
              <div><dt>Category</dt><dd>{selectedNode.category}</dd></div>
              <div><dt>Asset</dt><dd>{selectedNode.sourceAsset}</dd></div>
              <div><dt>Source</dt><dd>原图像素</dd></div>
              <div><dt>Fill under</dt><dd>{selectedNode.fillUnder === 'approximate' ? '推测补全' : selectedNode.fillUnder === 'missing' ? '尚无 clean plate' : '不需要'}</dd></div>
              <div><dt>Fill note</dt><dd>{selectedNode.fillStatus}</dd></div>
              <div><dt>Bounds</dt><dd>{selectedNode.bounds.x}, {selectedNode.bounds.y} · {selectedNode.bounds.width} × {selectedNode.bounds.height}</dd></div>
              <div><dt>Depth / order</dt><dd>{selectedNode.depth} / {selectedNode.compositionOrder}</dd></div>
              <div><dt>Mask confidence</dt><dd>{Math.round(selectedNode.maskConfidence * 100)}%</dd></div>
              {selectedNode.activePixelCount !== null && <div><dt>Visible pixels</dt><dd>{selectedNode.activePixelCount.toLocaleString()}</dd></div>}
              <div><dt>Moves</dt><dd>{selectedNode.capabilities.join(', ') || '未声明'}</dd></div>
              {selectedNode.occludes.length > 0 && <div><dt>Occludes</dt><dd>{selectedNode.occludes.join(', ')}</dd></div>}
              {selectedNode.occludedBy.length > 0 && <div><dt>Occluded by</dt><dd>{selectedNode.occludedBy.join(', ')}</dd></div>}
              {selectedNode.limits.map((limit) => <div key={limit}><dt>Limit</dt><dd>{limit}</dd></div>)}
              {selectedNode.fillUnderCandidate && (
                <>
                  <div><dt>Fill source</dt><dd>推测纹理 · {selectedNode.fillUnderCandidate.method}</dd></div>
                  <div><dt>Fill confidence</dt><dd>{Math.round(selectedNode.fillUnderCandidate.confidence * 100)}%</dd></div>
                  <div><dt>Fill pixels</dt><dd>{selectedNode.fillUnderCandidate.inferredPixelCount.toLocaleString()}</dd></div>
                  <div><dt>Fill limit</dt><dd>{selectedNode.fillUnderCandidate.limitations}</dd></div>
                </>
              )}
            </dl>
          )}
          {isGroup && <p className="layer-inspector-note">父级变换会作用于组内全部图层。Group type: {selectedNode.groupKind}.</p>}
        </section>
      )}

      <footer className="layer-inspector-footer">
        <button type="button" className="layer-inspector-reset" onClick={onReset}>恢复原始姿态</button>
        <p>此面板只在 `&amp;inspect=1` 路由显示；不会出现在普通场景截图。</p>
      </footer>
    </aside>
  );
}

function findNode(nodes: SceneNode[], id: string): SceneNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.kind === 'group') {
      const child = findNode(node.children, id);
      if (child) return child;
    }
  }
  return undefined;
}

function countImages(nodes: SceneNode[]): number {
  return nodes.reduce((total, node) => total + (node.kind === 'group' ? countImages(node.children) : 1), 0);
}
