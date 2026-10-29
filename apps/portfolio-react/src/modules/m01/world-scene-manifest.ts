import type { WorldName } from './WorldStatic';

import withinReference from './assets/within-target-1536x864.png';
import beyondReference from './assets/beyond-target-1536x864.png';
import withinPlate from './world-assets/deep/within/base-with-transparent-holes.png';
import beyondPlate from './world-assets/deep/beyond/base-with-transparent-holes.png';
import withinManifestSource from './world-assets/deep/within/layer-manifest.json?raw';
import beyondManifestSource from './world-assets/deep/beyond/layer-manifest.json?raw';
import fillUnderManifestSource from './world-assets/deep/fill-under-manifest.json?raw';

const withinAssets = import.meta.glob<string>('./world-assets/deep/within/layers/**/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
});
const beyondAssets = import.meta.glob<string>('./world-assets/deep/beyond/assets/**/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
});
const withinFillUnderAssets = import.meta.glob<string>('./world-assets/deep/within/fill-under/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
});
const beyondFillUnderAssets = import.meta.glob<string>('./world-assets/deep/beyond/fill-under/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
});

export type SceneTransform = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  visible: boolean;
};

export type SceneBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
  anchor?: { x: number; y: number };
};

export type SceneGroupNode = {
  kind: 'group';
  id: string;
  label: string;
  groupKind: string;
  parentId: string | null;
  zIndex: number;
  children: SceneNode[];
};

export type SceneImageNode = {
  kind: 'image';
  id: string;
  sourceId: string;
  label: string;
  category: string;
  src: string;
  sourceAsset: string;
  bounds: SceneBounds;
  depth: number;
  compositionOrder: number;
  zIndex: number;
  parentId: string;
  occludes: string[];
  occludedBy: string[];
  requiresBackgroundFill: boolean;
  fillUnder: 'none' | 'approximate' | 'missing';
  fillStatus: string;
  fillUnderCandidate: {
    src: string;
    method: string;
    provenance: string;
    confidence: number;
    inferredPixelCount: number;
    fillIsInferred: true;
    outsideMaskChangedPixels: number;
    restReconstructionChangedPixels: number;
    motionPreview: string;
    limitations: string;
  } | null;
  provenance: 'source-pixels';
  maskConfidence: number;
  activePixelCount: number | null;
  capabilities: string[];
  limits: string[];
};

export type SceneNode = SceneGroupNode | SceneImageNode;

export type WorldSceneManifest = {
  world: WorldName;
  canvas: { width: 1536; height: 864 };
  reference: string;
  backgroundPlate: string;
  backgroundPlateStatus: 'original-with-overlap' | 'transparent-holes';
  sourceManifest: string;
  nodes: SceneNode[];
};

type RawGroup = {
  id: string;
  parent: string | null;
  kind?: string;
  transformRoot?: boolean;
};

type RawLayer = {
  id: string;
  name: string;
  category?: string;
  asset: string;
  parent: string;
  depth?: number;
  z?: number;
  bounds?: { x: number; y: number; width: number; height: number; anchor?: { x: number; y: number } };
  canvasBounds?: { x: number; y: number; width: number; height: number; anchor?: { x: number; y: number } };
  anchorCanvas?: { x: number; y: number };
  activePixelCount?: number;
  opaquePixelCount?: number;
  confidence?: number;
  maskMethodConfidence?: number;
  requiresBackgroundFill?: boolean;
  underfillRequired?: boolean;
  fillStatus?: string;
  fillNote?: string;
  underfill?: string;
  underfillSource?: string;
  occludes?: string[];
  occludedBy?: string[];
  occlusionNotes?: string;
  limitations?: string;
  capabilities?: string[];
  motion?: Record<string, boolean>;
};

type RawDeepManifest = {
  world?: string;
  canvas: { width: number; height: number };
  groups: RawGroup[];
  layers: RawLayer[];
  renderOrder?: string[];
};

type RawFillUnderLayer = {
  id: string;
  asset: string;
  inferredPixelCount: number;
  fillMethod: string;
  fillConfidence: number;
  fillIsInferred: true;
  outsideMaskChangedPixels: number;
  restReconstructionChangedPixels: number;
  motionPreview: string;
  limitations: string;
};

type RawFillUnderManifest = {
  method: string;
  provenance: string;
  scenes: Partial<Record<WorldName, { layers: RawFillUnderLayer[] }>>;
};

const withinRaw = JSON.parse(withinManifestSource) as RawDeepManifest;
const beyondRaw = JSON.parse(beyondManifestSource) as RawDeepManifest;
const fillUnderRaw = JSON.parse(fillUnderManifestSource) as RawFillUnderManifest;

const groupLabels: Record<string, string> = {
  'world-within': 'WITHIN · 场景根组',
  'within-title-group': '破损 WITHIN 字形',
  'within-midground': '人物背影',
  'within-light-group': '光束与散射光',
  'within-paper-group': '撕纸与前景拼贴',
  'within-photography-group': '山脉、建筑、岩石与摄影裁片',
  'within-survey-group': '轨道与测绘线',
  'within-type-group': '标题、中文与档案注释',
  scene: 'BEYOND · 场景根组',
  'mountain-system': '左侧山脉深度组',
  'horizon-system': '远景、云海与城市',
  'paper-system': '撕纸摄影拼贴',
  'hero-title': '破损 BEYOND 字形',
  'glyph-b': '字母 B',
  'glyph-e': '字母 E',
  'glyph-y': '字母 Y',
  'glyph-o': '字母 O',
  'glyph-n': '字母 N',
  'glyph-d': '字母 D',
  'glyph-dot': '标题句点',
  instrumentation: '轨道与测绘标记',
  annotations: '微排版与注释',
};

const describeGroup = (group: RawGroup) => groupLabels[group.id] ?? group.id;

function resolveAsset(assetMap: Record<string, string>, root: string, asset: string, id: string): string {
  const key = `${root}${asset.replaceAll('\\', '/')}`;
  const url = assetMap[key];
  if (!url) throw new Error(`Missing scene asset for ${id}: ${key}`);
  return url;
}

function resolveRelation(world: WorldName, id: string, raw: RawDeepManifest): string {
  const aliases: Record<string, string> = world === 'within'
    ? { 'annotation-type': 'within-type-group', 'survey-rails': 'within-survey-group' }
    : {};
  const normalized = aliases[id] ?? id;
  if (raw.groups.some((group) => group.id === normalized)) return `${world}-group-${normalized}`;
  if (raw.layers.some((layer) => layer.id === normalized)) return `${world}-layer-${normalized}`;
  return `${world}-unresolved-${normalized}`;
}

function normalizeLayer(
  layer: RawLayer,
  world: WorldName,
  assetMap: Record<string, string>,
  root: string,
  raw: RawDeepManifest,
  renderOrder?: string[],
  fillUnderLayer?: RawFillUnderLayer,
  fillUnderAssetMap?: Record<string, string>,
  fillUnderRoot?: string,
): SceneImageNode {
  const rawBounds = layer.canvasBounds ?? layer.bounds;
  if (!rawBounds) throw new Error(`Missing bounds for scene layer ${layer.id}`);

  const requiresBackgroundFill = Boolean(layer.requiresBackgroundFill ?? layer.underfillRequired);
  const fillStatus = layer.fillStatus ?? layer.fillNote ?? layer.underfill ?? layer.underfillSource ?? 'Not audited';
  const motionCapabilities = layer.capabilities ?? Object.entries(layer.motion ?? {})
    .filter(([, enabled]) => enabled)
    .map(([capability]) => capability);
  const zIndex = layer.z ?? Math.max(1, (renderOrder?.indexOf(layer.id) ?? layer.depth ?? 0) + (renderOrder ? 1 : 0));

  return {
    kind: 'image',
    id: `${world}-layer-${layer.id}`,
    sourceId: layer.id,
    label: layer.name,
    category: layer.category ?? layer.id.split('-')[0],
    src: resolveAsset(assetMap, root, layer.asset, layer.id),
    sourceAsset: layer.asset,
    bounds: {
      ...rawBounds,
      anchor: rawBounds.anchor ?? layer.anchorCanvas,
    },
    depth: layer.depth ?? layer.z ?? zIndex,
    compositionOrder: zIndex,
    zIndex,
    parentId: `${world}-group-${layer.parent}`,
    occludes: (layer.occludes ?? []).map((id) => resolveRelation(world, id, raw)),
    occludedBy: (layer.occludedBy ?? []).map((id) => resolveRelation(world, id, raw)),
    requiresBackgroundFill,
    fillUnder: !requiresBackgroundFill ? 'none' : fillUnderLayer ? 'approximate' : 'missing',
    fillStatus,
    fillUnderCandidate: fillUnderLayer && fillUnderAssetMap && fillUnderRoot
      ? {
          src: resolveAsset(fillUnderAssetMap, fillUnderRoot, fillUnderLayer.asset, `${layer.id} fill-under candidate`),
          method: fillUnderLayer.fillMethod,
          provenance: fillUnderRaw.provenance,
          confidence: fillUnderLayer.fillConfidence,
          inferredPixelCount: fillUnderLayer.inferredPixelCount,
          fillIsInferred: fillUnderLayer.fillIsInferred,
          outsideMaskChangedPixels: fillUnderLayer.outsideMaskChangedPixels,
          restReconstructionChangedPixels: fillUnderLayer.restReconstructionChangedPixels,
          motionPreview: fillUnderLayer.motionPreview,
          limitations: fillUnderLayer.limitations,
        }
      : null,
    provenance: 'source-pixels',
    maskConfidence: layer.confidence ?? layer.maskMethodConfidence ?? 0,
    activePixelCount: layer.opaquePixelCount ?? layer.activePixelCount ?? null,
    capabilities: motionCapabilities,
    limits: [layer.limitations, layer.occlusionNotes, layer.fillNote].filter((note): note is string => Boolean(note)),
  };
}

function normalizeManifest(
  world: WorldName,
  raw: RawDeepManifest,
  assetMap: Record<string, string>,
  root: string,
  fillUnderLayers: RawFillUnderLayer[],
  fillUnderAssetMap: Record<string, string>,
  fillUnderRoot: string,
): SceneNode[] {
  const fillUnderById = new Map(fillUnderLayers.map((layer) => [layer.id, layer]));
  const layersByParent = new Map<string, RawLayer[]>();
  for (const layer of raw.layers) {
    const layers = layersByParent.get(layer.parent) ?? [];
    layers.push(layer);
    layersByParent.set(layer.parent, layers);
  }

  const childGroups = new Map<string, RawGroup[]>();
  for (const group of raw.groups) {
    if (!group.parent) continue;
    const children = childGroups.get(group.parent) ?? [];
    children.push(group);
    childGroups.set(group.parent, children);
  }

  const buildGroup = (group: RawGroup): SceneGroupNode => {
    const groupsUnder = childGroups.get(group.id) ?? [];
    const imageLayers = layersByParent.get(group.id) ?? [];
    const children: SceneNode[] = [
      ...groupsUnder.map(buildGroup),
      ...imageLayers.map((layer) => normalizeLayer(
        layer,
        world,
        assetMap,
        root,
        raw,
        raw.renderOrder,
        fillUnderById.get(layer.id),
        fillUnderAssetMap,
        fillUnderRoot,
      )),
    ];
    const minimumZ = children.length ? Math.min(...children.map((child) => child.zIndex)) : 0;
    return {
      kind: 'group',
      id: `${world}-group-${group.id}`,
      label: describeGroup(group),
      groupKind: group.kind ?? (group.transformRoot ? 'scene-root' : 'semantic-group'),
      parentId: group.parent ? `${world}-group-${group.parent}` : null,
      zIndex: minimumZ,
      children: children.sort((a, b) => a.zIndex - b.zIndex),
    };
  };

  const roots = raw.groups.filter((group) => !group.parent);
  return roots.map(buildGroup);
}

export const worldSceneManifests: Record<WorldName, WorldSceneManifest> = {
  within: {
    world: 'within',
    canvas: { width: 1536, height: 864 },
    reference: withinReference,
    backgroundPlate: withinPlate,
    backgroundPlateStatus: 'transparent-holes',
    sourceManifest: 'world-assets/deep/within/layer-manifest.json',
    nodes: normalizeManifest(
      'within',
      withinRaw,
      withinAssets,
      './world-assets/deep/within/',
      fillUnderRaw.scenes.within?.layers ?? [],
      withinFillUnderAssets,
      './world-assets/deep/within/fill-under/',
    ),
  },
  beyond: {
    world: 'beyond',
    canvas: { width: 1536, height: 864 },
    reference: beyondReference,
    backgroundPlate: beyondPlate,
    backgroundPlateStatus: 'transparent-holes',
    sourceManifest: 'world-assets/deep/beyond/layer-manifest.json',
    nodes: normalizeManifest(
      'beyond',
      beyondRaw,
      beyondAssets,
      './world-assets/deep/beyond/',
      fillUnderRaw.scenes.beyond?.layers ?? [],
      beyondFillUnderAssets,
      './world-assets/deep/beyond/fill-under/',
    ),
  },
};

export const flattenSceneNodes = (nodes: SceneNode[]): SceneNode[] =>
  nodes.flatMap((node) => node.kind === 'group'
    ? [node, ...flattenSceneNodes(node.children)]
    : [node]);

export const defaultSceneTransform: SceneTransform = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  opacity: 1,
  visible: true,
};
