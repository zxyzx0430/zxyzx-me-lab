import React from "react";
import {Composition} from "remotion";
import {NetworkMotion} from "./NetworkMotion";
import {NetworkD} from "./NetworkD";
import {NetworkObsidianV5} from "./NetworkObsidianV5";
export const RemotionRoot:React.FC=()=> <React.Fragment>
 <Composition id="NetworkA" component={NetworkMotion} durationInFrames={144} fps={24} width={720} height={900} defaultProps={{variant:"A" as const}}/>
 <Composition id="NetworkB" component={NetworkMotion} durationInFrames={144} fps={24} width={720} height={900} defaultProps={{variant:"B" as const}}/>
 <Composition id="NetworkC" component={NetworkMotion} durationInFrames={144} fps={24} width={720} height={900} defaultProps={{variant:"C" as const}}/>
 <Composition id="NetworkD" component={NetworkD} durationInFrames={288} fps={24} width={720} height={900}/>
 <Composition id="NetworkV5" component={NetworkObsidianV5} durationInFrames={408} fps={24} width={720} height={900}/>
</React.Fragment>;
