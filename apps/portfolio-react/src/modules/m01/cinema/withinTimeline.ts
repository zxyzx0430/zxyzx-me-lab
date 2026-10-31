import gsap from 'gsap';
import type { CinemaTimelineContext } from './animationTypes';

/**
 * Camera path for the WITHIN preview. The source poster moves as one plane;
 * the destination is revealed as one registered composition so cutout layers
 * never drift away from their incomplete background plate.
 */
export function buildWithinTimeline(context: CinemaTimelineContext): gsap.core.Timeline {
  const { sourceRoot, sourceStage, curtain, destinationCanvas } = context;
  const viewportWidth = curtain.ownerDocument.defaultView?.innerWidth ?? 1536;
  const timeline = gsap.timeline({ paused: true });
  const activeOrbit = [...(sourceStage?.querySelectorAll<SVGElement>('.master-orbits, .poster-ink-orbits') ?? [])]
    .find((node) => node.getClientRects().length > 0 &&
      node.ownerDocument.defaultView?.getComputedStyle(node).display !== 'none') ?? null;
  const sourceDepthPlanes = [
    sourceStage?.querySelector<HTMLElement>('.master-word-layer') ?? null,
    sourceStage?.querySelector<HTMLElement>('.portrait-plane') ?? null,
    activeOrbit,
  ].filter((node): node is HTMLElement | SVGElement => node !== null);

  timeline.call(() => {
    context.setPhase('approach');
    if (sourceRoot) sourceRoot.dataset.transitioning = 'true';
  }, [], 0);

  if (sourceStage) {
    timeline.set(sourceStage, {
      transformOrigin: '23% 36%',
      scale: 1,
      x: 0,
      y: 0,
    }, 0);
    timeline.to(sourceStage, {
      scale: 1.045,
      x: -3,
      y: -2,
      duration: 0.3,
      ease: 'power1.out',
    }, 0);
    const [wordPlane, portraitPlane, orbitPlane] = sourceDepthPlanes;
    if (wordPlane) timeline.to(wordPlane, { x: -3, y: -1, scale: 1.005, duration: 0.3, ease: 'power1.out' }, 0);
    if (portraitPlane) timeline.to(portraitPlane, { x: 3, y: 2, scale: 1.006, duration: 0.3, ease: 'power1.out' }, 0);
    if (orbitPlane) timeline.to(orbitPlane, { x: -1.5, y: 1, duration: 0.3, ease: 'power1.out' }, 0);
    timeline.call(() => context.setPhase('depth'), [], 0.3);
    timeline.to(sourceStage, {
      scale: 1.55,
      x: -16,
      y: -8,
      duration: 0.55,
      ease: 'sine.inOut',
    }, 0.3);
    if (wordPlane) timeline.to(wordPlane, { x: -8, y: -4, scale: 1.015, duration: 0.55, ease: 'sine.inOut' }, 0.3);
    if (portraitPlane) timeline.to(portraitPlane, { x: 8, y: -5, scale: 1.016, duration: 0.55, ease: 'sine.inOut' }, 0.3);
    if (orbitPlane) timeline.to(orbitPlane, { x: -4, y: 2.5, duration: 0.55, ease: 'sine.inOut' }, 0.3);
  }

  timeline.set(curtain, { x: -2 * viewportWidth }, 0);
  timeline.call(() => context.setPhase('ink-threshold'), [], 0.85);
  if (sourceStage) {
    timeline.to(sourceStage, {
      scale: 2.35,
      x: -30,
      y: -14,
      duration: 0.21,
      ease: 'power4.in',
    }, 0.85);
  }
  const [wordPlane, portraitPlane, orbitPlane] = sourceDepthPlanes;
  if (wordPlane) timeline.to(wordPlane, { x: -10, y: -5, scale: 1.02, duration: 0.21, ease: 'power4.in' }, 0.85);
  if (portraitPlane) timeline.to(portraitPlane, { x: 10, y: -6, scale: 1.02, duration: 0.21, ease: 'power4.in' }, 0.85);
  if (orbitPlane) timeline.to(orbitPlane, { x: -5, y: 3, duration: 0.21, ease: 'power4.in' }, 0.85);
  timeline.to(curtain, {
    x: 0,
    duration: 0.21,
    ease: 'power4.in',
  }, 0.85);

  timeline.call(() => context.setPhase('covered'), [], 1.06);
  if (destinationCanvas) {
    timeline.set(destinationCanvas, {
      transformOrigin: '38% 47%',
      scale: 1.18,
      x: -18,
      y: 9,
    }, 1.06);
  }
  timeline.call(() => context.onCovered(), [], 1.06);

  timeline.call(() => context.setPhase('reveal'), [], 1.14);
  timeline.to(curtain, {
    x: 2 * viewportWidth,
    duration: 0.58,
    ease: 'power2.out',
  }, 1.14);
  if (destinationCanvas) {
    timeline.to(destinationCanvas, {
      scale: 1.1,
      x: -7,
      y: 4,
      duration: 0.58,
      ease: 'power2.out',
    }, 1.14);
  }

  timeline.call(() => context.setPhase('discover'), [], 1.72);
  timeline.to(curtain, {
    x: 3 * viewportWidth,
    duration: 0.38,
    ease: 'power2.inOut',
  }, 1.72);
  if (destinationCanvas) {
    timeline.to(destinationCanvas, {
      scale: 1.035,
      x: -2,
      y: 1.5,
      duration: 0.38,
      ease: 'power2.out',
    }, 1.72);
  }

  timeline.call(() => context.setPhase('settle'), [], 2.1);
  if (destinationCanvas) {
    timeline.to(destinationCanvas, {
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.2,
      ease: 'power2.out',
    }, 2.1);
  } else {
    timeline.to({}, { duration: 0.2, ease: 'none' }, 2.1);
  }

  timeline.set([sourceStage, ...sourceDepthPlanes, destinationCanvas, curtain]
    .filter((node): node is HTMLElement | SVGElement => node !== null), {
    clearProps: 'transform,transformOrigin,willChange',
  }, 2.3);
  timeline.call(() => {
    if (sourceRoot) delete sourceRoot.dataset.transitioning;
    context.setPhase('complete');
    context.onComplete();
  }, [], 2.3);

  return timeline;
}
