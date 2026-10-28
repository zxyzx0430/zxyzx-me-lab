import { useEffect } from 'react';
import gsap from 'gsap';
import { isEditable, normalizedWheel, swipeDirection } from './paging';

/** One discrete intent = one cinematic page; never requires sticky scrolling. */
export function usePageNavigation(ids: readonly string[]) {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const staticPreview = new URLSearchParams(location.search).has('static');
    const sections = () => ids.map(id => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const current = () => {
      const nodes = sections();
      return nodes.reduce((best, el, i) =>
        Math.abs(el.getBoundingClientRect().top) < Math.abs(nodes[best].getBoundingClientRect().top) ? i : best, 0);
    };
    const hero = document.getElementById('top');
    const stage = hero?.querySelector<HTMLElement>('.cinema-stage');
    const black = document.querySelector<HTMLElement>('.cinema-blackout');
    let active: gsap.core.Timeline | null = null;
    let lockUntil = 0, wheelAccum = 0, lastWheel = 0;
    let touchStart: { x: number; y: number } | null = null;

    const scrollExact = (target: HTMLElement) =>
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
    const finish = () => {
      if (stage) gsap.set(stage, { clearProps: 'transform' });
      if (black) gsap.set(black, { clearProps: 'opacity,visibility' });
      active = null;
      lockUntil = performance.now() + 260;
    };
    const go = (index: number, directTarget?: HTMLElement, force = false): boolean => {
      const nodes = sections();
      if (!nodes.length || index < 0 || index >= nodes.length) return false;
      if (active) { active.progress(1); finish(); }
      const from = current(), target = directTarget ?? nodes[index];
      if (from === index) {
        if (directTarget) scrollExact(directTarget);
        return false;
      }
      window.dispatchEvent(new Event('m01:intro-skip'));
      const instant = staticPreview || reduced.matches || !stage || !black;
      if (instant) {
        scrollExact(target);
        lockUntil = performance.now() + 500;
        return true;
      }
      if (performance.now() < lockUntil && !force) return false;
      const forward = index > from;
      const w = window.innerWidth, h = window.innerHeight;
      const tl = gsap.timeline({ onComplete: finish });
      active = tl;
      lockUntil = performance.now() + 1600;
      if (forward) {
        tl.to(stage, { scale: 1.12, x: -w * .025, y: -h * .01, duration: .29, ease: 'power2.inOut' }, 0)
          .to(stage, { scale: 2.65, x: -w * .20, y: -h * .055, duration: .66, ease: 'power3.in' }, .25)
          .to(black, { autoAlpha: 1, duration: .16, ease: 'power2.in' }, .78)
          .call(() => { scrollExact(target); gsap.set(stage, { clearProps: 'transform' }); }, [], .97)
          .to(black, { autoAlpha: 0, duration: .25, ease: 'power2.out' }, 1.24);
      } else {
        tl.to(black, { autoAlpha: 1, duration: .17, ease: 'power2.in' }, 0)
          .call(() => {
            gsap.set(stage, { scale: 2.65, x: -w * .20, y: -h * .055 });
            scrollExact(target);
          }, [], .21)
          .to(black, { autoAlpha: 0, duration: .19, ease: 'power2.out' }, .50)
          .to(stage, { scale: 1, x: 0, y: 0, duration: .65, ease: 'power2.out' }, .51);
      }
      return true;
    };
    const wheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isEditable(e.target)) return;
      const delta = normalizedWheel(e.deltaY, e.deltaMode, innerHeight);
      if (!delta) return;
      const from = current(), dir = delta > 0 ? 1 : -1;
      if (from + dir < 0 || from + dir >= ids.length) return;
      e.preventDefault();
      if (active || performance.now() < lockUntil) return;
      if (performance.now() - lastWheel > 220 || Math.sign(wheelAccum) !== dir) wheelAccum = 0;
      lastWheel = performance.now();
      wheelAccum += delta;
      if (Math.abs(wheelAccum) >= 12) {
        wheelAccum = 0;
        go(from + dir);
      }
    };
    const key = (e: KeyboardEvent) => {
      if (e.repeat || e.altKey || e.ctrlKey || e.metaKey || isEditable(e.target) ||
        (e.target instanceof Element && e.target.closest('a,button'))) return;
      const dir = ['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey) ? 1 :
        ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey) ? -1 : 0;
      if (dir) {
        const from = current();
        if (from + dir >= 0 && from + dir < ids.length) {
          e.preventDefault();
          go(from + dir, undefined, true);
        }
      }
    };
    const touchBegin = (e: TouchEvent) => {
      if (e.touches.length === 1) touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const touchMove = (e: TouchEvent) => {
      if (!touchStart || e.touches.length !== 1 || isEditable(e.target)) return;
      const t = e.touches[0], deltaY = touchStart.y - t.clientY;
      const index = current(), dir = Math.sign(deltaY);
      if (Math.abs(deltaY) > 12 && Math.abs(deltaY) > Math.abs(t.clientX - touchStart.x) * 1.25 &&
        index + dir >= 0 && index + dir < ids.length) e.preventDefault();
    };
    const touchEnd = (e: TouchEvent) => {
      if (!touchStart || !e.changedTouches[0]) return;
      const t = e.changedTouches[0];
      const dir = swipeDirection(touchStart.y - t.clientY, t.clientX - touchStart.x);
      touchStart = null;
      if (dir && !active && performance.now() >= lockUntil) go(current() + dir);
    };
    const click = (e: MouseEvent) => {
      const anchor = (e.target instanceof Element ? e.target.closest('a[href^="#"]') : null) as HTMLAnchorElement | null;
      if (!anchor || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const id = decodeURIComponent(anchor.hash.slice(1));
      const destination = document.getElementById(id);
      if (!destination) return;
      let index = ids.indexOf(id);
      if (index < 0 && destination.closest('#world')) index = ids.indexOf('world');
      if (index < 0) return;
      e.preventDefault();
      history.replaceState(null, '', anchor.hash);
      go(index, destination, true);
    };
    window.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('keydown', key);
    window.addEventListener('touchstart', touchBegin, { passive: true });
    window.addEventListener('touchmove', touchMove, { passive: false });
    window.addEventListener('touchend', touchEnd, { passive: true });
    document.addEventListener('click', click);
    return () => {
      active?.kill(); finish();
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('keydown', key);
      window.removeEventListener('touchstart', touchBegin);
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('touchend', touchEnd);
      document.removeEventListener('click', click);
    };
  }, [ids.join(':')]);
}
