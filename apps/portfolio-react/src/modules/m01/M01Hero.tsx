import { useEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { cinematic } from '../../shared/animation/presets';
import { Portrait } from './components/Portrait';
import { PosterTypography } from './components/PosterTypography';
import { PosterDetails } from './components/PosterDetails';
import { TrackLines } from './components/TrackLines';
import './m01.css';
export const REFERENCE = { width: 1672, height: 941 } as const;
export function artboardScale(width: number, height: number): number {
  return width > 900 ? Math.min(width / REFERENCE.width, height / REFERENCE.height) : 1;
}
export function M01Hero() {
  const root = useRef<HTMLDivElement>(null);
  const artboard = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(() => artboardScale(innerWidth,innerHeight));
  const staticPreview = new URLSearchParams(location.search).has('static');
  useEffect(() => {
    const updateScale = () => setScale(artboardScale(innerWidth, innerHeight));
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);
  useEffect(() => {
    const el = root.current, board = artboard.current;
    if (!el || !board) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, px = 0, py = 0;
    const update = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf=0;const r=el.getBoundingClientRect();
        const raw = Math.max(0,Math.min(1,-r.top / Math.max(1,innerHeight)));
        const p = reduced.matches ? 0 : raw*raw*(3-2*raw);
        el.style.setProperty('--p',String(p));
        el.style.setProperty('--px',String(reduced.matches?0:px));
        el.style.setProperty('--py',String(reduced.matches?0:py));
      });
    };
    const move = (e: PointerEvent) => {
      if (reduced.matches || matchMedia('(pointer:coarse)').matches) return;
      const r=el.getBoundingClientRect();
      px = Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));
      py = Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));
      update();
    };
    const leave = () => {px=0;py=0;update();};
    el.addEventListener('pointermove',move,{passive:true});
    el.addEventListener('pointerleave',leave,{passive:true});
    addEventListener('scroll',update,{passive:true});
    update();
    return () => {el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);removeEventListener('scroll',update);cancelAnimationFrame(raf);};
  }, []);
  useEffect(() => {
    const el=root.current;
    if (!el || staticPreview || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx=gsap.context(() => {
      const textEls=gsap.utils.toArray<HTMLElement>('.poster-title .master-word, .poster-title .t').filter(node => node.getClientRects().length > 0);
      const tl=gsap.timeline({defaults:{ease:cinematic.ease}});
      textEls.forEach((node,index) => tl.fromTo(node,
        {opacity:0,clipPath:'inset(100% 0 0)',filter:'blur(5px)'},
        {opacity:1,clipPath:'inset(0% 0 0)',filter:'blur(0px)',duration:0.72},index*cinematic.staggerSeconds));
      const paths=gsap.utils.toArray<SVGPathElement>('.master-orbits path, .poster-ink-orbits path').filter(path => path.getClientRects().length > 0);
      paths.forEach(path => {
        const length=path.getTotalLength();
        gsap.set(path,{strokeDasharray:length,strokeDashoffset:length});
        tl.to(path,{strokeDashoffset:0,duration:1.5,ease:'power2.inOut'},0.3);
      });
    },el);
    return () => ctx.revert();
  }, [staticPreview]);
  return <div className={'m01-root' + (staticPreview?' static-preview':'')} ref={root} id="top" data-module="M01">
    <section className="scene" aria-label="个人首页：向内寻找中心，向外探寻世界">
      <div className="ambient" aria-hidden="true"><span className="orbit orbit-1"/><span className="orbit orbit-2"/><span className="glint"/></div>
      <div className="poster-artboard" ref={artboard} style={{'--art-scale':scale} as CSSProperties} aria-hidden="true">
        <PosterDetails/><Portrait/><PosterTypography/><TrackLines/>
      </div>
      <h1 className="sr-only">向内寻找中心，向外探寻世界。</h1>
      <div className="scene-count" aria-hidden="true"><i/><i/><i/><i/></div>
      <a href="#world" className="enter" aria-label="向下滚动，探索作品世界"><span>SCROLL TO EXPLORE</span><span className="arrow">↙</span></a>
      <div className="grain" aria-hidden="true"/>
    </section>
  </div>;
}
