import React from "react";
import {Composition} from "remotion";
import {NetworkMotion} from "./NetworkMotion";
export const RemotionRoot:React.FC=()=> <React.Fragment>
 <Composition id="NetworkA" component={NetworkMotion} durationInFrames={144} fps={24} width={720} height={900} defaultProps={{variant:"A" as const}}/>
 <Composition id="NetworkB" component={NetworkMotion} durationInFrames={144} fps={24} width={720} height={900} defaultProps={{variant:"B" as const}}/>
 <Composition id="NetworkC" component={NetworkMotion} durationInFrames={144} fps={24} width={720} height={900} defaultProps={{variant:"C" as const}}/>
</React.Fragment>;
