import { Composition } from 'remotion';
import { M01Scene } from './M01Scene';
export function RemotionRoot() {
  return <Composition id="M01PosterEntrance" component={M01Scene} width={1672} height={941} fps={30} durationInFrames={150}/>;
}
