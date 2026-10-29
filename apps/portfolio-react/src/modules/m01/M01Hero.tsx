import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { Portrait } from './components/Portrait';
import { PosterTypography } from './components/PosterTypography';
import { PosterDetails } from './components/PosterDetails';
import { TrackLines } from './components/TrackLines';
import { WorldEntry } from './WorldEntry';
import './m01.css';
import './cinema.css';

export const REFERENCE = { width: 1672, height: 941 } as const;
export function artboardScale(width: number, height: number): number {
  return width > 900 ? Math.min(width / REFERENCE.width, height / REFERENCE.height) : 1;
}
const isStaticPreview = () => new URLSearchParams(window.location.search).has('static');

export function M01Hero() {
  const root = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(() => artboardScale(window.innerWidth, window.innerHeight));
  const staticPreview = isStaticPreview();

  useEffect(() => {
    const update = () => setScale(artboardScale(window.innerWidth, window.innerHeight));
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || staticPreview || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const words = [...el.querySelectorAll<HTMLElement>('.master-word, .responsive-type-layer .t')]
      .filter(node => node.getClientRects().length > 0 && getComputedStyle(node).visibility !== 'hidden');
    const word = (name: string) => words.find(node => node.classList.contains('word-' + name) || node.classList.contains('t-' + name));
    const trackPaths = [...el.querySelectorAll<SVGPathElement>('.master-orbits path, .poster-ink-orbits path')]
      .filter(path => path.getClientRects().length > 0 && getComputedStyle(path.closest('svg')!).display !== 'none');
    const nav = document.querySelector<HTMLElement>('.nav');
    const cleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
      if (nav) timeline.fromTo(nav, { autoAlpha: 0 }, { autoAlpha: 1, duration: .48 }, .08);
      for (const [name, at, duration] of [
        ['into', .40, .89], ['out', .80, 1.0],
        ['find', 2.60, .43], ['center', 2.73, .48],
        ['explore', 2.85, .5], ['world', 3.0, .52],
      ] as const) {
        const elWord = word(name);
        if (elWord) timeline.fromTo(elWord,
          { opacity: 0, clipPath: 'inset(94% 0 0)' },
          { opacity: 1, clipPath: 'inset(0% 0 0)', duration }, at);
      }
      const mountain = el.querySelector('.poster-mountain');
      if (mountain) timeline.fromTo(mountain, { opacity: 0 }, { opacity: 1, duration: .65 }, .9);
      trackPaths.forEach((path, i) => {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        timeline.to(path, { strokeDashoffset: 0, duration: 1.10, ease: 'power2.inOut' }, 1.08 + Math.min(i, 5) * .105);
      });
      const photo = el.querySelector<HTMLElement>('.photo-frame');
      const scrim = el.querySelector<HTMLElement>('.cinema-photo-scrim');
      if (photo) timeline.fromTo(photo, { opacity: 0 }, { opacity: 1, duration: 1.10 }, 1.72);
      if (scrim) timeline.fromTo(scrim, { opacity: .58 }, { opacity: 0, duration: 1.15 }, 1.93);
      for (const [selector, at] of [
        ['.poster-thought', 3.04], ['.poster-meta', 3.17],
        ['.poster-asterisk', 3.24], ['.scene-count', 3.27], ['.enter', 3.31],
      ] as const) {
        const node = el.querySelector(selector);
        if (node) timeline.fromTo(node, { opacity: 0 }, { opacity: 1, duration: .40 }, at);
      }
      timeline.to({}, { duration: .08 }, 3.54);
      timeline.eventCallback('onComplete', () => {
        const clearNodes = [nav, ...words, mountain, photo, scrim,
          ...[...el.querySelectorAll('.poster-thought,.poster-meta,.poster-asterisk,.scene-count,.enter')]];
        gsap.set(clearNodes.filter(Boolean), { clearProps: 'opacity,visibility,transform,clipPath' });
        gsap.set(trackPaths, { clearProps: 'strokeDasharray,strokeDashoffset' });
        el.dataset.intro = 'complete';
      });
      const skip = () => timeline.progress(1);
      el.dataset.intro = 'running';
      window.addEventListener('m01:intro-skip', skip);
      timeline.play();
      // A slow device must not leave the poster stuck in its half-revealed state.
      const introFallback = window.setTimeout(() => {
        if (el.dataset.intro === 'running') timeline.progress(1);
      }, 6500);
      // The quiet orbit glint uses a timer rather than relying on the GSAP
      // requestAnimationFrame ticker, which may be throttled on low-power tabs.
      // It only starts once the intro has actually completed, so the moment of
      // first motion remains clear to returning viewers.
      const dotPaths = [...el.querySelectorAll<SVGCircleElement>('.cinema-track-dot')]
        .map(dot => ({ dot, svg: dot.closest('svg'), path: dot.closest('svg')?.querySelector('path') }))
        .filter((item): item is { dot: SVGCircleElement; svg: SVGSVGElement; path: SVGPathElement } =>
          Boolean(item.svg && item.path && getComputedStyle(item.svg).display !== 'none'));
      let startedAt: number | null = null;
      const updateGlints = () => {
        if (el.dataset.intro !== 'complete') return;
        if (startedAt === null) startedAt = performance.now();
        const phase = (performance.now() - startedAt) % 8900;
        const travelling = phase < 6200;
        for (const { dot, path } of dotPaths) {
          if (!travelling) { dot.style.opacity = '0'; continue; }
          const t = phase / 6200;
          const p = path.getPointAtLength(t * path.getTotalLength());
          dot.setAttribute('cx', String(p.x));
          dot.setAttribute('cy', String(p.y));
          dot.style.opacity = String(Math.sin(Math.PI * t) * .72);
        }
      };
      const glintInterval = window.setInterval(updateGlints, 75);
      updateGlints();
      cleanups.push(() => {
        window.clearTimeout(introFallback);
        window.removeEventListener('m01:intro-skip', skip);
        window.clearInterval(glintInterval);
        dotPaths.forEach(({ dot }) => { dot.style.opacity = '0'; });
      });
    }, el);
    return () => {
      cleanups.forEach(clean => clean());
      ctx.revert();
      el.dataset.intro = 'complete';
    };
  }, [staticPreview]);

  useEffect(() => {
    const el = root.current;
    if (!el || staticPreview || matchMedia('(prefers-reduced-motion: reduce)').matches ||
      matchMedia('(pointer: coarse)').matches) return;
    const light = el.querySelector<HTMLElement>('.cinema-photo-light');
    const portrait = el.querySelector<HTMLElement>('.portrait-plane');
    const clamp = (value: number, low: number, high: number) =>
      Math.max(low, Math.min(high, value));
    const move = (event: PointerEvent) => {
      if (el.dataset.transitioning === 'true') return;
      const bounds = el.getBoundingClientRect();
      const x = clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1);
      const y = clamp((event.clientY - bounds.top) / bounds.height * 2 - 1, -1, 1);
      // Typography, paper and orbit respond together, without changing any
      // resting position or recreating the original lettering as live fonts.
      gsap.to(el, { '--px': x, '--py': y, duration: .72, ease: 'power2.out', overwrite: true });
      if (light && portrait) {
        const frame = portrait.getBoundingClientRect();
        const nx = clamp((event.clientX - frame.left) / frame.width, 0, 1);
        const ny = clamp((event.clientY - frame.top) / frame.height, 0, 1);
        // Keep the visible beam inside the existing LEFT-wall light cone,
        // even when the pointer crosses the face; no new glowing facial patch.
        const lx = 17 + nx * 22;
        const ly = 17 + ny * 45;
        const inside = event.clientX >= frame.left && event.clientX <= frame.right &&
          event.clientY >= frame.top && event.clientY <= frame.bottom;
        gsap.to(light, {
          '--light-x': lx + '%', '--light-y': ly + '%',
          opacity: inside ? .52 : x > .05 ? .15 : .035,
          duration: .52, ease: 'power2.out', overwrite: true,
        });
      }
    };
    const leave = () => {
      gsap.to(el, { '--px': 0, '--py': 0, duration: 1, ease: 'power2.out', overwrite: true });
      if (light) gsap.to(light, {
        '--light-x': '22%', '--light-y': '29%', opacity: .035,
        duration: .85, ease: 'power2.out', overwrite: true,
      });
    };
    el.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', leave, { passive: true });
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      gsap.killTweensOf(el);
      if (light) gsap.killTweensOf(light);
    };
  }, [staticPreview]);

  return <div ref={root} id="top" data-module="M01"
    className={'m01-root' + (staticPreview ? ' static-preview' : ' cinematic-motion')}
    style={{ '--art-scale': scale } as CSSProperties}>
    <section className="scene" aria-label="个人首页：向内寻找中心，向外探寻世界">
      <div className="ambient" aria-hidden="true"><span className="orbit orbit-1"/><span className="orbit orbit-2"/><span className="glint"/></div>
      <div className="cinema-stage">
        <div className="poster-artboard" style={{ '--art-scale': scale } as CSSProperties} aria-hidden="true">
          <PosterDetails/><Portrait/><PosterTypography/><TrackLines/>
        </div>
      </div>
      <WorldEntry hero={root} staticPreview={staticPreview}/>
      <h1 className="sr-only">向内寻找中心，向外探寻世界。</h1>
      <div className="scene-count" aria-hidden="true"><i/><i/><i/><i/></div>
      <a href="#world" className="enter" aria-label="向下滚动，探索作品世界"><span>SCROLL TO EXPLORE</span><span className="arrow">↙</span></a>
      <div className="grain" aria-hidden="true"/>
    </section>
  </div>;
}
