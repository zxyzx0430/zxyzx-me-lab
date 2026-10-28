import { useEffect } from 'react';
import { isEditable, normalizedWheel, swipeDirection } from './paging';
export function usePageNavigation(ids: readonly string[]) {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const sections = () => ids.map(id => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const current = () => {
      const nodes = sections();
      return nodes.reduce((best, el, i) =>
        Math.abs(el.getBoundingClientRect().top) < Math.abs(nodes[best].getBoundingClientRect().top) ? i : best, 0);
    };
    let wheelAccum = 0, lastWheel = 0, lockUntil = 0;
    let start: { x: number; y: number } | null = null;
    const go = (dir: number) => {
      const nodes = sections(), index = current();
      const next = Math.max(0, Math.min(nodes.length - 1, index + dir));
      if (next === index) return false;
      nodes[next].scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' });
      lockUntil = performance.now() + 780;
      return true;
    };
    const wheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isEditable(e.target)) return;
      const delta = normalizedWheel(e.deltaY, e.deltaMode, innerHeight);
      if (!delta) return;
      const index = current(), possible = delta > 0 ? index < ids.length - 1 : index > 0;
      if (!possible) return;
      e.preventDefault();
      if (performance.now() < lockUntil) return;
      if (performance.now() - lastWheel > 250) wheelAccum = 0;
      lastWheel = performance.now();
      wheelAccum += delta;
      if (Math.abs(wheelAccum) >= 12) { go(Math.sign(wheelAccum)); wheelAccum = 0; }
    };
    const key = (e: KeyboardEvent) => {
      if (e.repeat || e.altKey || e.ctrlKey || e.metaKey || isEditable(e.target) ||
          (e.target instanceof Element && e.target.closest('a,button'))) return;
      const dir = ['ArrowDown','PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey) ? 1 :
        ['ArrowUp','PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey) ? -1 : 0;
      if (dir) { if (go(dir)) e.preventDefault(); }
    };
    const touchStart = (e: TouchEvent) => { if (e.touches.length === 1) start = { x:e.touches[0].clientX, y:e.touches[0].clientY }; };
    const touchEnd = (e: TouchEvent) => {
      if (!start || !e.changedTouches[0]) return;
      const t = e.changedTouches[0], dir = swipeDirection(start.y - t.clientY, t.clientX - start.x);
      start = null;
      if (dir && performance.now() >= lockUntil) go(dir);
    };
    window.addEventListener('wheel', wheel, { passive:false });
    window.addEventListener('keydown', key);
    window.addEventListener('touchstart', touchStart, { passive:true });
    window.addEventListener('touchend', touchEnd, { passive:true });
    return () => { window.removeEventListener('wheel',wheel);window.removeEventListener('keydown',key);
      window.removeEventListener('touchstart',touchStart);window.removeEventListener('touchend',touchEnd); };
  }, [ids.join(':')]);
}
