import gsap from 'gsap';
import type { CinemaTimelineContext } from './animationTypes';

/**
 * Build the BEYOND preview route. The destination is kept as one composed
 * camera plane during the move; independently translating the mountain/city
 * cutouts would expose the unfilled source footprints documented in the layer
 * manifest.
 */
export function buildBeyondTimeline(context: CinemaTimelineContext): gsap.core.Timeline {
  const { sourceRoot, sourceStage, curtain, destinationCanvas } = context;
  const viewportWidth = typeof window === 'undefined' ? 1536 : window.innerWidth;
  const orbitPlane = [...(sourceStage?.querySelectorAll<SVGElement>('.master-orbits, .poster-ink-orbits') ?? [])]
    .find((node) => node.getClientRects().length > 0 &&
      node.ownerDocument.defaultView?.getComputedStyle(node).display !== 'none') ?? null;
  const sourceDepthPlanes = [
    sourceStage?.querySelector<HTMLElement>('.master-word-layer') ?? null,
    sourceStage?.querySelector<HTMLElement>('.portrait-plane') ?? null,
    orbitPlane,
  ].filter((node): node is HTMLElement | SVGElement => node !== null);
  const [wordPlane, portraitPlane] = sourceDepthPlanes;

  if (sourceRoot) {
    gsap.set(sourceRoot, {
      perspective: 1800,
      transformStyle: 'preserve-3d',
    });
  }

  if (sourceStage) {
    gsap.set(sourceStage, {
      transformOrigin: '72% 48%',
      force3D: true,
    });
  }

  // The opaque paper is 300vw wide and starts at -150vw in CSS. At +3vw it
  // has fully cleared the viewport; +2vw would still cover its right half.
  gsap.set(curtain, {
    x: -2 * viewportWidth,
    autoAlpha: 1,
  });

  if (destinationCanvas) {
    gsap.set(destinationCanvas, {
      transformOrigin: '70% 53%',
      x: 24,
      y: 11,
      scale: 1.1,
      rotation: 0.35,
      autoAlpha: 0,
      force3D: true,
    });
  }

  const timeline = gsap.timeline({ paused: true });

  timeline.call(() => context.setPhase('launch'), [], 0);

  if (sourceStage) {
    timeline.to(sourceStage, {
      x: -15,
      y: 1,
      scale: 1.035,
      rotation: 0.08,
      rotationY: -0.35,
      duration: 0.35,
      ease: 'power2.out',
    }, 0);
    timeline.to(sourceStage, {
      x: -62,
      y: -11,
      scale: 1.18,
      rotation: 0.55,
      rotationY: -1.15,
      duration: 0.6,
      ease: 'power3.in',
    }, 0.35);

    if (wordPlane) {
      timeline.to(wordPlane, {
        x: -5,
        y: -2,
        scale: 1.008,
        duration: 0.35,
        ease: 'power2.out',
      }, 0);
      timeline.to(wordPlane, {
        x: -9,
        y: -4,
        scale: 1.016,
        duration: 0.6,
        ease: 'power3.in',
      }, 0.35);
    }
    if (portraitPlane) {
      timeline.to(portraitPlane, {
        x: -8,
        y: 2,
        scale: 1.01,
        duration: 0.35,
        ease: 'power2.out',
      }, 0);
      timeline.to(portraitPlane, {
        x: -12,
        y: -3,
        scale: 1.02,
        duration: 0.6,
        ease: 'power3.in',
      }, 0.35);
    }
    if (orbitPlane) {
      timeline.to(orbitPlane, {
        x: -3,
        y: 1,
        duration: 0.35,
        ease: 'power2.out',
      }, 0);
      timeline.to(orbitPlane, {
        x: -6,
        y: 2,
        duration: 0.6,
        ease: 'power3.in',
      }, 0.35);
    }
  }

  timeline.call(() => context.setPhase('arc-approach'), [], 0.35);
  timeline.call(() => context.setPhase('paper-crossing'), [], 0.95);
  timeline.to(curtain, {
    x: 0,
    duration: 0.22,
    ease: 'power2.in',
  }, 0.95);

  timeline.call(() => {
    context.setPhase('covered');
    context.onCovered();
    if (destinationCanvas) gsap.set(destinationCanvas, { autoAlpha: 1 });
  }, [], 1.17);

  // Open the landscape in one physical sheet movement. The target remains a
  // registered 40-layer composition underneath, with only its parent camera
  // settling into the exact reference pose.
  timeline.to(curtain, {
    x: 3 * viewportWidth,
    duration: 0.26,
    ease: 'power4.in',
  }, 1.17);

  if (destinationCanvas) {
    timeline.to(destinationCanvas, {
      x: 13,
      y: 6,
      scale: 1.065,
      rotation: 0.18,
      duration: 0.26,
      ease: 'power2.out',
    }, 1.17);
    timeline.to(destinationCanvas, {
      x: 4,
      y: 2,
      scale: 1.025,
      rotation: 0.04,
      duration: 0.47,
      ease: 'power2.out',
    }, 1.43);
    timeline.to(destinationCanvas, {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: 'power2.out',
    }, 1.9);
  }

  timeline.call(() => context.setPhase('horizon-opens'), [], 1.25);
  timeline.call(() => context.setPhase('world-settles'), [], 1.43);
  timeline.call(() => context.setPhase('title-returns-to-lock'), [], 1.9);
  timeline.call(() => context.setPhase('arrived'), [], 2.2);

  // Hold the final registered pose for 300ms before cleanup and handoff.
  timeline.to({}, { duration: 0.3 }, 2.2);
  timeline.call(() => {
    if (sourceStage) gsap.set(sourceStage, { clearProps: 'transform,transformOrigin' });
    if (sourceDepthPlanes.length > 0) {
      gsap.set(sourceDepthPlanes, { clearProps: 'transform,transformOrigin' });
    }
    if (sourceRoot) gsap.set(sourceRoot, { clearProps: 'perspective,transformStyle' });
    if (destinationCanvas) {
      gsap.set(destinationCanvas, { clearProps: 'transform,transformOrigin' });
    }
    // The orchestrator removes the curtain immediately after this callback.
    gsap.set(curtain, { autoAlpha: 0 });
    gsap.set(curtain, { clearProps: 'transform' });
    context.setPhase('complete');
    context.onComplete();
  }, [], 2.5);

  return timeline;
}
