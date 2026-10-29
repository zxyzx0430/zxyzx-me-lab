import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import gsap from 'gsap';
import paper from './assets/master-paper-tile.png';
import mountain from './assets/master-mountain.png';
import into from './assets/master-into.png';
import out from './assets/master-out.png';
import './world-entry.css';

type World = 'within' | 'beyond';
type WorldRequest = CustomEvent<{ world: World }>;
type Props = { hero: RefObject<HTMLDivElement | null>; staticPreview: boolean };
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => n * n * (3 - 2 * n);

/**
 * Review-only continuation of the ORIGINAL M01 artboard.
 * There are no pre-rendered destination scenes. Real text/image/SVG
 * layers stay underneath the lens throughout the 1.2s camera move.
 */
export function WorldEntry({ hero, staticPreview }: Props) {
  const overlay = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [world, setWorld] = useState<World | null>(null);
  const [phase, setPhase] = useState<'playing' | 'inspection'>('playing');
  const [progress, setProgress] = useState(0);
  const active = useRef<World | null>(null);

  useEffect(() => {
    const el = hero.current;
    const layer = overlay.current;
    if (!el || !layer || staticPreview) return;
    const stage = el.querySelector<HTMLElement>('.cinema-stage');
    if (!stage) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let proxy = { p: 0 };
    let segment: World = 'within';
    let origin = { x: 0, y: 0, dx: 0, dy: 0 };
    const savedOverflow = document.documentElement.style.overflow;

    const update = (p: number) => {
      const s = smooth(clamp(p));
      const a = clamp((p - .38) / .62);
      const b = smooth(a);
      const zoom = 1 + (segment === 'within' ? 4.8 : 3.55) * s;
      gsap.set(stage, {
        transformOrigin: origin.x + 'px ' + origin.y + 'px',
        scale: zoom, x: origin.dx * s, y: origin.dy * s,
        force3D: true
      });
      layer.style.setProperty('--journey-progress', String(p));
      layer.style.setProperty('--open', String(b));
      layer.style.setProperty('--ink', String(clamp((p - .46) / .4)));
      layer.style.setProperty('--arrival', String(clamp((p - .74) / .26)));
      // The paper slit is formed from the original typographic gap,
      // not crossfaded to a cave/landscape photograph.
      const slit = 15 + b * 25;
      const leftEdge = 50 - slit;
      const rightEdge = 50 + slit;
      const near = 49 - (1 - b) * 2;
      const far = 51 + (1 - b) * 2;
      const wallL = layer.querySelector<HTMLElement>('.m01-wall-left');
      const wallR = layer.querySelector<HTMLElement>('.m01-wall-right');
      if (wallL && wallR) {
        wallL.style.clipPath = 'polygon(0 0,' + near + '% 0,' + leftEdge + '% 23%,' + (leftEdge + 4) + '% 58%,' + (leftEdge - 9) + '% 100%,0 100%)';
        wallR.style.clipPath = 'polygon(' + far + '% 0,100% 0,100% 100%,' + (rightEdge + 8) + '% 100%,' + (rightEdge - 4) + '% 55%,' + rightEdge + '% 25%)';
      }
      setProgress(Math.round(p * 100));
    };
    const close = () => {
      timeline.current?.kill();
      timeline.current = null;
      active.current = null;
      el.dataset.transitioning = 'false';
      delete el.dataset.entryWorld;
      delete el.dataset.hoverWorld;
      delete document.body.dataset.m01World;
      document.documentElement.style.overflow = savedOverflow;
      gsap.set(stage, { clearProps: 'transform,transformOrigin' });
      layer.style.removeProperty('--journey-progress');
      layer.style.removeProperty('--open');
      layer.style.removeProperty('--ink');
      layer.style.removeProperty('--arrival');
      setWorld(null);
      setProgress(0);
    };
    const start = (ev: Event) => {
      const requested = (ev as WorldRequest).detail?.world;
      if (requested !== 'within' && requested !== 'beyond') return;
      window.dispatchEvent(new Event('m01:intro-skip'));
      if (active.current) close();
      window.scrollTo({ top: 0, behavior: 'instant' });
      active.current = requested;
      segment = requested;
      proxy = { p: 0 };
      const mobile = matchMedia('(max-width:900px)').matches;
      const selector = requested === 'within'
        ? (mobile ? '.responsive-type-layer .t-into' : '.master-word.word-into')
        : (mobile ? '.responsive-type-layer .t-out' : '.master-word.word-out');
      const word = el.querySelector<HTMLElement>(selector);
      const box = word?.getBoundingClientRect() ?? el.getBoundingClientRect();
      const stageBox = stage.getBoundingClientRect();
      origin = {
        x: box.left - stageBox.left + box.width * (requested === 'within' ? .46 : .57),
        y: box.top - stageBox.top + box.height * (requested === 'within' ? .56 : .65),
        dx: window.innerWidth / 2 - (box.left + box.width * .5),
        dy: window.innerHeight / 2 - (box.top + box.height * .55)
      };
      el.dataset.transitioning = 'true';
      el.dataset.entryWorld = requested;
      delete el.dataset.hoverWorld;
      document.body.dataset.m01World = requested;
      document.documentElement.style.overflow = 'hidden';
      layer.dataset.world = requested;
      setWorld(requested);
      setPhase('playing');
      update(0);
      if (reduced.matches) {
        update(1);
        setPhase('inspection');
        return;
      }
      const tl = gsap.timeline({
        onUpdate: () => update(proxy.p),
        onComplete: () => setPhase('inspection')
      });
      timeline.current = tl;
      tl.to(proxy, { p: 1, duration: 1.2, ease: 'none' });
    };
    const changeProgress = (ev: Event) => {
      if (!active.current) return;
      const value = (ev as CustomEvent<{ value: number }>).detail?.value;
      if (typeof value !== 'number') return;
      timeline.current?.pause();
      if (timeline.current) timeline.current.progress(clamp(value));
      else update(clamp(value));
      setPhase('inspection');
    };
    const skip = () => {
      if (!active.current) return;
      if (timeline.current) timeline.current.progress(1).pause();
      else update(1);
      setPhase('inspection');
    };
    const key = (ev: KeyboardEvent) => {
      if (!active.current) return;
      if (ev.key === 'Escape') {
        ev.preventDefault(); close();
      } else if ((ev.key === ' ' || ev.key === 'Enter') &&
        !(ev.target instanceof HTMLElement && ev.target.closest('button,input,a'))) {
        ev.preventDefault(); skip();
      }
    };
    window.addEventListener('m01:enter-world', start);
    window.addEventListener('m01:close-world', close);
    window.addEventListener('m01:world-scrub', changeProgress);
    window.addEventListener('m01:world-skip', skip);
    window.addEventListener('keydown', key);
    return () => {
      close();
      window.removeEventListener('m01:enter-world', start);
      window.removeEventListener('m01:close-world', close);
      window.removeEventListener('m01:world-scrub', changeProgress);
      window.removeEventListener('m01:world-skip', skip);
      window.removeEventListener('keydown', key);
    };
  }, [hero, staticPreview]);

  if (staticPreview) return null;
  const fire = (action: string, detail?: object) =>
    window.dispatchEvent(new CustomEvent(action, { detail }));
  return <>
    <div className="m01-route-hotspots" aria-label="双世界入口">
      <button type="button" className="m01-route-hit m01-route-hit-within"
        aria-label="进入 WITHIN，向内寻找中心"
        onPointerEnter={() => { if (hero.current && !active.current) hero.current.dataset.hoverWorld = 'within'; }}
        onPointerLeave={() => { if (hero.current) delete hero.current.dataset.hoverWorld; }}
        onClick={() => fire('m01:enter-world', { world: 'within' })}>
        <span>ENTER WITHIN <i>向内</i></span>
      </button>
      <button type="button" className="m01-route-hit m01-route-hit-beyond"
        aria-label="进入 BEYOND，向外探寻世界"
        onPointerEnter={() => { if (hero.current && !active.current) hero.current.dataset.hoverWorld = 'beyond'; }}
        onPointerLeave={() => { if (hero.current) delete hero.current.dataset.hoverWorld; }}
        onClick={() => fire('m01:enter-world', { world: 'beyond' })}>
        <span>EXPLORE BEYOND <i>向外</i></span>
      </button>
    </div>
    <div className="m01-entry-portal" ref={overlay} data-world={world ?? ''} aria-hidden="true"
      style={{
        '--m01-paper': 'url(' + paper + ')',
        '--m01-mountain': 'url(' + mountain + ')',
        '--m01-into': 'url(' + into + ')',
        '--m01-out': 'url(' + out + ')'
      } as CSSProperties}>
      <div className="m01-wall m01-wall-left"/>
      <div className="m01-wall m01-wall-right"/>
      <div className="m01-fold m01-fold-left"/>
      <div className="m01-fold m01-fold-right"/>
      <svg className="m01-continuous-road" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice">
        <path className="m01-road-origin" d="M496 806 C558 712 619 614 678 545"/>
        <path className="m01-road-extension" d="M678 545 C824 420 932 450 1079 376 S1356 247 1724 118" pathLength="1"/>
        <path className="m01-road-edge" d="M485 814 C558 720 624 618 690 553 C835 437 945 462 1091 390 S1370 267 1736 139" pathLength="1"/>
      </svg>
      <div className="m01-source-mark" aria-hidden="true">M01 / ORIGINAL ARTBOARD STUDY</div>
    </div>
    {world && <div className="m01-entry-inspector" role="region" aria-label="穿越前段审核控件">
      <div className="m01-entry-inspector-heading">
        <span>{world === 'within' ? 'WITHIN / 字形内部' : 'BEYOND / 轨道之外'}</span>
        <span>{phase === 'playing' ? 'CAMERA IN MOTION' : 'FRAME HELD — 终点尚未设计'}</span>
      </div>
      <div className="m01-entry-progress">
        <input type="range" min="0" max="100" value={progress}
          aria-label="前段转场进度" onChange={event => fire('m01:world-scrub', { value: Number(event.target.value) / 100 })}/>
        <span>{(progress * .012).toFixed(2)} / 1.20 s</span>
      </div>
      <div className="m01-entry-inspector-actions">
        <button type="button" onClick={() => fire('m01:world-skip')}>跳至末帧</button>
        <button type="button" onClick={() => fire('m01:close-world')}>← 返回原海报 · Esc</button>
      </div>
    </div>}
  </>;
}
