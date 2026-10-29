import withinTarget from './assets/within-target-1536x864.png';
import beyondTarget from './assets/beyond-target-1536x864.png';
import './world-static.css';

export type WorldName = 'within' | 'beyond';

export const getWorldFromQuery = (): WorldName | null => {
  const value = new URLSearchParams(window.location.search).get('world');
  return value === 'within' || value === 'beyond' ? value : null;
};

export const getWorldViewFromQuery = (): 'reference' | 'layers' =>
  new URLSearchParams(window.location.search).get('view') === 'layers'
    ? 'layers'
    : 'reference';

export const worldLink = (world: WorldName) =>
  window.location.pathname + '?world=' + world + '&view=layers';

export const worldReferenceLink = (world: WorldName) =>
  window.location.pathname + '?world=' + world;

export const homeLink = () => window.location.pathname;

export function WorldStatic({ world }: { world: WorldName }) {
  const within = world === 'within';
  const otherWorld = within ? 'beyond' : 'within';

  return (
    <main className={'m01-world-world m01-world-' + world}>
      <figure className="world-canvas">
        <img
          className="world-reference-image"
          src={within ? withinTarget : beyondTarget}
          alt={within
            ? 'WITHIN. 向内寻找中心：黑白撕纸拼贴形成深邃山岩空间，光束落在中央人物背影上。'
            : 'BEYOND. 向外探寻世界：左侧山脉延伸至云海中的远方城市，中央为巨型标题与测绘轨道。'}
          width="1536"
          height="864"
          draggable={false}
        />
        <nav className="world-route-nav" aria-label="世界场景导航">
          <a
            className="world-hotspot world-home-hotspot"
            href={homeLink()}
            aria-label="返回 M01 首页"
            title="返回 M01 首页"
          />
          <a
            className={'world-hotspot world-switch-hotspot world-switch-' + world}
            href={worldReferenceLink(otherWorld)}
            aria-label={'切换到 ' + otherWorld.toUpperCase() + ' 场景'}
            title={'切换到 ' + otherWorld.toUpperCase() + ' 场景'}
          />
        </nav>
      </figure>
    </main>
  );
}
