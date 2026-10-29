import type { CSSProperties } from 'react';
import { homeLink, worldLink, type WorldName } from './WorldStatic';
import './world-layered.css';

import withinPlate from './world-assets/layers/within/background-plate.png';
import withinMountain from './world-assets/layers/within/02-left-mountain.png';
import withinArchitecture from './world-assets/layers/within/03-rock-architecture.png';
import withinBeam from './world-assets/layers/within/04-light-shaft.png';
import withinTitle from './world-assets/layers/within/05-within-title.png';
import withinObserver from './world-assets/layers/within/06-observer.png';
import withinPaper from './world-assets/layers/within/07-foreground-paper.png';
import withinRails from './world-assets/layers/within/08-rails-annotations.png';

import beyondPlate from './world-assets/layers/beyond/background-plate.png';
import beyondMountain from './world-assets/layers/beyond/02-left-mountain.png';
import beyondCity from './world-assets/layers/beyond/03-right-city-clouds.png';
import beyondPaper from './world-assets/layers/beyond/04-torn-paper.png';
import beyondTitle from './world-assets/layers/beyond/05-beyond-title.png';
import beyondRails from './world-assets/layers/beyond/06-rails-microtype.png';

type SceneLayerSpec = {
  id: string;
  label: string;
  src: string;
  bounds: { x: number; y: number; width: number; height: number };
  zIndex: number;
};

const canvasBounds = { x: 0, y: 0, width: 1536, height: 864 } as const;

const withinLayers: SceneLayerSpec[] = [
  { id: 'left-mountain', label: '左侧山脉拼贴', src: withinMountain, bounds: canvasBounds, zIndex: 2 },
  { id: 'rock-architecture', label: '前后景岩壁与建筑结构', src: withinArchitecture, bounds: canvasBounds, zIndex: 3 },
  { id: 'light-shaft', label: '顶部自然光束', src: withinBeam, bounds: canvasBounds, zIndex: 4 },
  { id: 'within-title', label: '巨型破损 WITHIN 字形', src: withinTitle, bounds: canvasBounds, zIndex: 5 },
  { id: 'observer', label: '人物背影', src: withinObserver, bounds: canvasBounds, zIndex: 6 },
  { id: 'foreground-paper', label: '前景纸张与岩石遮挡', src: withinPaper, bounds: canvasBounds, zIndex: 7 },
  { id: 'rails-annotations', label: '轨道、测绘线与微排版', src: withinRails, bounds: canvasBounds, zIndex: 8 },
];

const beyondLayers: SceneLayerSpec[] = [
  { id: 'left-mountain', label: '左侧山脉与近景山脊', src: beyondMountain, bounds: canvasBounds, zIndex: 2 },
  { id: 'right-city-clouds', label: '右侧城市、云层与远景', src: beyondCity, bounds: canvasBounds, zIndex: 3 },
  { id: 'torn-paper', label: '撕裂纸张与拼贴遮挡', src: beyondPaper, bounds: canvasBounds, zIndex: 4 },
  { id: 'beyond-title', label: '巨型破损 BEYOND 字形', src: beyondTitle, bounds: canvasBounds, zIndex: 5 },
  { id: 'rails-microtype', label: '轨道、测绘线与微排版', src: beyondRails, bounds: canvasBounds, zIndex: 6 },
];

function SceneLayer({ layer }: { layer: SceneLayerSpec }) {
  const style = {
    left: `${(layer.bounds.x / 1536) * 100}%`,
    top: `${(layer.bounds.y / 864) * 100}%`,
    width: `${(layer.bounds.width / 1536) * 100}%`,
    height: `${(layer.bounds.height / 864) * 100}%`,
    zIndex: layer.zIndex,
  } satisfies CSSProperties;

  return (
    <img
      className="world-scene-layer"
      src={layer.src}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      data-scene-layer={layer.id}
      data-layer-label={layer.label}
      style={style}
    />
  );
}

export function WorldLayered({ world }: { world: WorldName }) {
  const within = world === 'within';
  const otherWorld = within ? 'beyond' : 'within';
  const layers = within ? withinLayers : beyondLayers;

  return (
    <main className={`m01-world-world m01-world-${world} m01-world-layered`}>
      <figure
        className="world-canvas"
        role="img"
        aria-label={within
          ? 'WITHIN 分层静态场景：山脉、岩壁、光束、标题、人物、前景纸张与测绘图层。'
          : 'BEYOND 分层静态场景：左侧山脉、远方城市与云层、撕裂纸张、标题与测绘图层。'}
        data-layered-scene={world}
      >
        <img
          className="world-layered-background"
          src={within ? withinPlate : beyondPlate}
          alt=""
          aria-hidden="true"
          draggable={false}
          width="1536"
          height="864"
        />
        <div className="world-layer-stack" aria-hidden="true">
          {layers.map((layer) => <SceneLayer key={layer.id} layer={layer} />)}
        </div>
        <nav className="world-route-nav" aria-label="世界场景导航">
          <a className="world-hotspot world-home-hotspot" href={homeLink()} aria-label="返回 M01 首页" title="返回 M01 首页" />
          <a className={`world-hotspot world-switch-hotspot world-switch-${world}`} href={worldLink(otherWorld)} aria-label={`切换到 ${otherWorld.toUpperCase()} 分层场景`} title={`切换到 ${otherWorld.toUpperCase()} 分层场景`} />
          <a className="world-hotspot world-reference-hotspot" href={`${window.location.pathname}?world=${world}`} aria-label="打开原始 PNG 像素基准" title="打开原始 PNG 像素基准" />
        </nav>
      </figure>
    </main>
  );
}
