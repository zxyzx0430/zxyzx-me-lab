import { useLayoutEffect, useRef, useState } from 'react';
import { buildBeyondTimeline } from './beyondTimeline';
import { buildWithinTimeline } from './withinTimeline';
import type { WorldName } from '../WorldStatic';
import './film-travel.css';

type FilmTravelProps = {
  world: WorldName;
  onCovered: () => void;
  onComplete: () => void;
};

export function FilmTravel({ world, onCovered, onComplete }: FilmTravelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({ onCovered, onComplete });
  const [phase, setPhase] = useState('launch');
  callbacksRef.current = { onCovered, onComplete };

  useLayoutEffect(() => {
    const root = rootRef.current;
    const curtain = root?.querySelector<HTMLElement>('[data-cinema-curtain]');
    if (!root || !curtain) return undefined;

    const sourceRoot = document.querySelector<HTMLElement>('.m01-root');
    const sourceStage = sourceRoot?.querySelector<HTMLElement>('.cinema-stage') ?? null;
    const destinationCanvas = document.querySelector<HTMLElement>(`[data-layered-scene="${world}"]`);
    const sourcePlanes = sourceStage
      ? [...sourceStage.querySelectorAll<HTMLElement | SVGElement>(
          '.master-word-layer, .portrait-plane, .master-orbits, .poster-ink-orbits',
        )]
      : [];
    const styledNodes = [sourceRoot, sourceStage, ...sourcePlanes, curtain, destinationCanvas]
      .filter((node): node is HTMLElement | SVGElement => node !== null);
    const originalStyles = new Map(styledNodes.map((node) => [node, node.getAttribute('style')]));
    const originalTransitioning = sourceRoot?.getAttribute('data-transitioning') ?? null;
    const context = {
      world,
      sourceRoot,
      sourceStage,
      curtain,
      destinationCanvas,
      setPhase,
      onCovered: () => callbacksRef.current.onCovered(),
      onComplete: () => callbacksRef.current.onComplete(),
    };
    const timeline = world === 'within'
      ? buildWithinTimeline(context)
      : buildBeyondTimeline(context);

    const preventPageMove = (event: Event) => event.preventDefault();
    window.addEventListener('wheel', preventPageMove, { passive: false });
    window.addEventListener('touchmove', preventPageMove, { passive: false });
    timeline.play(0);

    return () => {
      window.removeEventListener('wheel', preventPageMove);
      window.removeEventListener('touchmove', preventPageMove);
      timeline.kill();
      for (const [node, style] of originalStyles) {
        if (style === null) node.removeAttribute('style');
        else node.setAttribute('style', style);
      }
      if (sourceRoot) {
        if (originalTransitioning === null) delete sourceRoot.dataset.transitioning;
        else sourceRoot.dataset.transitioning = originalTransitioning;
      }
    };
  }, [world]);

  return (
    <div
      ref={rootRef}
      className={`m01-cinema-transition m01-cinema-transition-${world}`}
      data-cinema-route={world}
      data-cinema-phase={phase}
      data-testid={`cinema-transition-${world}`}
      aria-hidden="true"
    >
      <div className={`m01-cinema-curtain m01-cinema-curtain-${world}`} data-cinema-curtain />
    </div>
  );
}
