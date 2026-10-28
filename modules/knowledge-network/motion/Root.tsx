import React from "react";
import {Composition} from "remotion";
import {NetworkObsidianV5} from "./NetworkObsidianV5";
export const RemotionRoot: React.FC = () => (
  <Composition
    id="KnowledgeNetworkV5"
    component={NetworkObsidianV5}
    durationInFrames={408}
    fps={24}
    width={720}
    height={900}
  />
);
