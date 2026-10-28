import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { Portrait } from './components/Portrait';
import { PosterTypography } from './components/PosterTypography';
import { PosterDetails } from './components/PosterDetails';
import { TrackLines } from './components/TrackLines';
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
      // The weak, occasional glint follows the existing SVG geometry.
      const dots = [...el.querySelectorAll<SVGCircleElement>('.cinema-track-dot')];
      const glints: gsap.core.Tween[] = [];
      for (const dot of dots) {
        const path = dot.closest('svg')?.querySelector('path');
        if (!path || getComputedStyle(dot.closest('svg')!).display === 'none') continue;
        const length = path.getTotalLength();
        const progress = { t: 0 };
        glints.push(gsap.to(progress, {
          t: 1, duration: 5.8, repeat: -1, repeatDelay: 11, ease: 'none', delay: 5,
          onUpdate: () => {
            const p = path.getPointAtLength(progress.t * length);
            dot.setAttribute('cx', String(p.x));
            dot.setAttribute('cy', String(p.y));
            dot.style.opacity = String(Math.sin(Math.PI * progress.t) * .48);
          },
        }));
      }
      cleanups.push(() => {
        window.removeEventListener('m01:intro-skip', skip);
        glints.forEach(t => t.kill());
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
    const move = (event: PointerEvent) => {
      const bounds = el.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      gsap.to(el, { '--px': x * .24, '--py': y * .24, duration: .85, ease: 'power2.out', overwrite: true });
      if (light) gsap.to(light, { opacity: x > .05 ? .11 : .035, duration: .9, ease: 'power2.out', overwrite: true });
    };
    const leave = () => {
      gsap.to(el, { '--px': 0, '--py': 0, duration: 1, ease: 'power2.out', overwrite: true });
      if (light) gsap.to(light, { opacity: .035, duration: 1, overwrite: true });
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
    className={'m01-root' + (staticPreview ? ' static-preview' : ' cinematic-motion')}>
    <section className="scene" aria-label="个人首页：向内寻找中心，向外探寻世界">
      <div className="ambient" aria-hidden="true"><span className="orbit orbit-1"/><span className="orbit orbit-2"/><span className="glint"/></div>
      <div className="cinema-stage">
        <div className="poster-artboard" style={{ '--art-scale': scale } as CSSProperties} aria-hidden="true">
          <PosterDetails/><Portrait/><PosterTypography/><TrackLines/>
        </div>
      </div>
      <h1 className="sr-only">向内寻找中心，向外探寻世界。</h1>
      <div className="scene-count" aria-hidden="true"><i/><i/><i/><i/></div>
      <a href="#world" className="enter" aria-label="向下滚动，探索作品世界"><span>SCROLL TO EXPLORE</span><span className="arrow">↙</span></a>
      <div className="grain" aria-hidden="true"/>
    </section>
  </div>;
}
