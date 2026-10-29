import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { homeLink, worldLink, type WorldName } from './WorldStatic';
import { LayerInspector, type InspectorView } from './LayerInspector';
import {
  defaultSceneTransform,
  flattenSceneNodes,
  worldSceneManifests,
  type SceneImageNode,
  type SceneNode,
  type SceneTransform,
} from './world-scene-manifest';
import './world-layered.css';

type Matrix2D = readonly [number, number, number, number, number, number];

const IDENTITY: Matrix2D = [1, 0, 0, 1, 0, 0];

function multiply(left: Matrix2D, right: Matrix2D): Matrix2D {
  const [a, b, c, d, e, f] = left;
  const [g, h, i, j, k, l] = right;
  return [
    a * g + c * h,
    b * g + d * h,
    a * i + c * j,
    b * i + d * j,
    a * k + c * l + e,
    b * k + d * l + f,
  ];
}

function translate(x: number, y: number): Matrix2D {
  return [1, 0, 0, 1, x, y];
}

function aroundTransform(
  transform: SceneTransform,
  originX: number,
  originY: number,
  scaleX: number,
  scaleY: number,
): Matrix2D {
  const radians = (transform.rotation * Math.PI) / 180;
  const a = Math.cos(radians) * transform.scale;
  const b = Math.sin(radians) * transform.scale;
  const c = -Math.sin(radians) * transform.scale;
  const d = Math.cos(radians) * transform.scale;
  const e = originX + transform.x * scaleX - a * originX - c * originY;
  const f = originY + transform.y * scaleY - b * originX - d * originY;
  return [a, b, c, d, e, f];
}

function hasGeometry(transform: SceneTransform): boolean {
  return transform.x !== 0 || transform.y !== 0 || transform.scale !== 1 || transform.rotation !== 0;
}

function ImageLayer({
  node,
  transform,
  visible,
  opacity,
  matrix,
  groupIds,
  showBounds,
  inspector,
}: {
  node: SceneImageNode;
  transform: SceneTransform;
  visible: boolean;
  opacity: number;
  matrix: Matrix2D | null;
  groupIds: string[];
  showBounds: boolean;
  inspector: boolean;
}) {
  const style = {
    left: matrix ? 0 : `${(node.bounds.x / 1536) * 100}%`,
    top: matrix ? 0 : `${(node.bounds.y / 864) * 100}%`,
    width: `${(node.bounds.width / 1536) * 100}%`,
    height: `${(node.bounds.height / 864) * 100}%`,
    zIndex: node.zIndex,
    opacity,
    visibility: visible ? 'visible' : 'hidden',
    transformOrigin: matrix ? '0 0' : '50% 50%',
    transform: matrix ? `matrix(${matrix.map((value) => Number(value.toFixed(6))).join(',')})` : 'none',
    ...(showBounds && inspector ? { outline: '1px dashed rgba(0, 220, 255, .92)' } : {}),
  } satisfies CSSProperties;

  return (
    <img
      className="world-scene-layer"
      src={node.src}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      data-scene-layer={node.id}
      data-layer-source-id={node.sourceId}
      data-layer-label={node.label}
      data-layer-parent={node.parentId}
      data-scene-groups={groupIds.join(' ')}
      data-layer-depth={node.depth}
      data-layer-paint-order={node.compositionOrder}
      data-layer-transform={JSON.stringify(transform)}
      style={style}
    />
  );
}

function FillUnderLayer({ node }: { node: SceneImageNode }) {
  const style = {
    left: `${(node.bounds.x / 1536) * 100}%`,
    top: `${(node.bounds.y / 864) * 100}%`,
    width: `${(node.bounds.width / 1536) * 100}%`,
    height: `${(node.bounds.height / 864) * 100}%`,
    zIndex: node.zIndex,
  } satisfies CSSProperties;

  return (
    <img
      className="world-scene-fill-under"
      src={node.fillUnderCandidate?.src}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      data-scene-fill-under={node.id}
      data-fill-provenance={node.fillUnderCandidate?.provenance}
      style={style}
    />
  );
}

const initialTransforms = (nodes: SceneNode[]): Record<string, SceneTransform> =>
  Object.fromEntries(flattenSceneNodes(nodes).map((node) => [node.id, { ...defaultSceneTransform }]));

export function WorldLayered({ world }: { world: WorldName }) {
  const manifest = worldSceneManifests[world];
  const canvasRef = useRef<HTMLElement>(null);
  const flatNodes = useMemo(() => flattenSceneNodes(manifest.nodes), [manifest]);
  const nodeById = useMemo(() => new Map(flatNodes.map((node) => [node.id, node])), [flatNodes]);
  const imageNodes = useMemo(() => flatNodes
    .filter((node): node is SceneImageNode => node.kind === 'image')
    .sort((a, b) => a.zIndex - b.zIndex), [flatNodes]);
  const [transforms, setTransforms] = useState(() => initialTransforms(manifest.nodes));
  const [selectedId, setSelectedId] = useState(() => imageNodes[0]?.id ?? flatNodes[0].id);
  const [view, setView] = useState<InspectorView>('composite');
  const [showBounds, setShowBounds] = useState(false);
  const [alphaPreview, setAlphaPreview] = useState(false);
  const [showSelectedFillUnder, setShowSelectedFillUnder] = useState(false);
  const [canvasScale, setCanvasScale] = useState({ x: 1, y: 1 });
  const inspector = new URLSearchParams(window.location.search).get('inspect') === '1';
  const otherWorld = world === 'within' ? 'beyond' : 'within';

  useLayoutEffect(() => {
    const element = canvasRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;
    const updateScale = () => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      setCanvasScale({ x: rect.width / 1536, y: rect.height / 864 });
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const updateTransform = (id: string, update: Partial<SceneTransform>) => {
    setTransforms((current) => ({
      ...current,
      [id]: { ...(current[id] ?? defaultSceneTransform), ...update },
    }));
  };

  const selectNode = (id: string) => {
    setSelectedId(id);
    setShowSelectedFillUnder(false);
  };

  const reset = () => {
    setTransforms(initialTransforms(manifest.nodes));
    setView('composite');
    setShowBounds(false);
    setAlphaPreview(false);
    setShowSelectedFillUnder(false);
  };

  const presentationFor = (node: SceneImageNode) => {
    const ownTransform = transforms[node.id] ?? defaultSceneTransform;
    let visible = ownTransform.visible;
    let opacity = ownTransform.opacity;
    let groupMatrix = IDENTITY;
    let parentId: string | null = node.parentId;
    let hasMovedAncestor = false;
    const ancestors: SceneNode[] = [];

    while (parentId) {
      const parent = nodeById.get(parentId);
      if (!parent) break;
      if (parent.kind === 'group') ancestors.unshift(parent);
      parentId = parent.parentId;
    }

    const canvasCenterX = (1536 * canvasScale.x) / 2;
    const canvasCenterY = (864 * canvasScale.y) / 2;
    for (const group of ancestors) {
      const transform = transforms[group.id] ?? defaultSceneTransform;
      visible = visible && transform.visible;
      opacity *= transform.opacity;
      hasMovedAncestor ||= hasGeometry(transform);
      if (hasGeometry(transform)) {
        groupMatrix = multiply(groupMatrix, aroundTransform(transform, canvasCenterX, canvasCenterY, canvasScale.x, canvasScale.y));
      }
    }

    const hasMovedLayer = hasGeometry(ownTransform);
    if (!hasMovedLayer && !hasMovedAncestor) {
      return { ownTransform, visible, opacity, matrix: null as Matrix2D | null, groupIds: ancestors.map((group) => group.id) };
    }

    const bounds = node.bounds;
    const placement = translate(bounds.x * canvasScale.x, bounds.y * canvasScale.y);
    const layerMatrix = aroundTransform(
      ownTransform,
      (bounds.width * canvasScale.x) / 2,
      (bounds.height * canvasScale.y) / 2,
      canvasScale.x,
      canvasScale.y,
    );
    return {
      ownTransform,
      visible,
      opacity,
      matrix: multiply(groupMatrix, multiply(placement, layerMatrix)),
      groupIds: ancestors.map((group) => group.id),
    };
  };

  const visibleReference = view === 'reference';
  const showBackground = !visibleReference && !alphaPreview;
  const showLayers = !visibleReference;
  const selectedNode = nodeById.get(selectedId);
  const selectedFillNode = selectedNode?.kind === 'image' && selectedNode.fillUnderCandidate
    ? selectedNode
    : null;

  return (
    <main className={`m01-world-world m01-world-${world} m01-world-layered${alphaPreview && inspector ? ' is-alpha-preview' : ''}`} data-background-plate-status={manifest.backgroundPlateStatus}>
      <figure
        ref={canvasRef}
        className="world-canvas"
        role="img"
        aria-label={world === 'within'
          ? 'WITHIN React 分层场景：按前后景和语义图层重组原始像素素材。'
          : 'BEYOND React 分层场景：按山脉、城市云层、纸张、标题和测绘图层重组原始像素素材。'}
        data-layered-scene={world}
        data-inspector={inspector ? 'true' : 'false'}
      >
        {showBackground && <img className="world-layered-background" src={manifest.backgroundPlate} alt="" aria-hidden="true" draggable={false} width="1536" height="864" />}
        {visibleReference && <img className="world-reference-image" src={manifest.reference} alt="" aria-hidden="true" draggable={false} width="1536" height="864" />}
        {showLayers && (
          <div className="world-layer-stack" aria-hidden="true">
            {imageNodes.flatMap((node) => {
              const presentation = presentationFor(node);
              const fillUnder = inspector && showSelectedFillUnder && selectedFillNode?.id === node.id && view === 'composite'
                ? [<FillUnderLayer key={`fill-under-${node.id}`} node={node} />]
                : [];
              return [...fillUnder, <ImageLayer
                key={node.id}
                node={node}
                transform={presentation.ownTransform}
                visible={presentation.visible}
                opacity={presentation.opacity}
                matrix={presentation.matrix}
                groupIds={presentation.groupIds}
                showBounds={showBounds}
                inspector={inspector}
              />];
            })}
          </div>
        )}
        {view === 'difference' && (
          <img className="world-difference-reference" src={manifest.reference} alt="" aria-hidden="true" draggable={false} width="1536" height="864" />
        )}
        <nav className="world-route-nav" aria-label="世界场景导航">
          <a className="world-hotspot world-home-hotspot" href={homeLink()} aria-label="返回 M01 首页" title="返回 M01 首页" />
          <a className={`world-hotspot world-switch-hotspot world-switch-${world}`} href={worldLink(otherWorld)} aria-label={`切换到 ${otherWorld.toUpperCase()} 分层场景`} title={`切换到 ${otherWorld.toUpperCase()} 分层场景`} />
          <a className="world-hotspot world-reference-hotspot" href={`${window.location.pathname}?world=${world}`} aria-label="打开原始 PNG 像素基准" title="打开原始 PNG 像素基准" />
        </nav>
      </figure>
      {inspector && (
        <>
          <button
            className="layer-inspector-alpha-toggle"
            data-testid="layer-inspector-alpha-toggle"
            type="button"
            aria-pressed={alphaPreview}
            onClick={() => setAlphaPreview((current) => !current)}
            title="显示透明图层和遮罩边界"
          >
            Alpha / 透明区
          </button>
          <LayerInspector
            nodes={manifest.nodes}
            backgroundPlateStatus={manifest.backgroundPlateStatus}
            selectedId={selectedId}
            view={view}
            showBounds={showBounds}
            transforms={transforms}
            onSelect={selectNode}
            onViewChange={setView}
            onShowBoundsChange={setShowBounds}
            onTransformChange={updateTransform}
            onReset={reset}
            showSelectedFillUnder={showSelectedFillUnder}
            onFillUnderPreviewChange={setShowSelectedFillUnder}
          />
        </>
      )}
    </main>
  );
}
