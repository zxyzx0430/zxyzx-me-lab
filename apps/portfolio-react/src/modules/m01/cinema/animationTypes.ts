import type { WorldName } from '../WorldStatic';

/** Shared DOM contract for the two independently authored preview timelines. */
export type CinemaTimelineContext = {
  world: WorldName;
  sourceRoot: HTMLElement | null;
  sourceStage: HTMLElement | null;
  curtain: HTMLElement;
  destinationCanvas: HTMLElement | null;
  setPhase: (phase: string) => void;
  onCovered: () => void;
  onComplete: () => void;
};
