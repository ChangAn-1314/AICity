import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  Easing,
} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import {COLORS} from "../config";
import {MovingCamera} from "../components/MovingCamera";
import {StudioLights} from "../components/StudioLights";
import {VideoScreen} from "../components/VideoScreen";

export const Scene3AIAnalysis: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const cameraX = interpolate(
    frame, [0, 360], [-3.8, 1.0],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraY = 0;
  const cameraZ = 4.6;

  const lookAtX = cameraX;
  const lookAtY = 0;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <ThreeCanvas width={width} height={height} style={{position: "absolute"}}>
        <MovingCamera position={[cameraX, cameraY, cameraZ]} lookAt={[lookAtX, lookAtY, 0]} fov={50} />
        <StudioLights />
        <VideoScreen
          src="video/信阳视图 双十二舆情气泡展开 展示ai分析 词云 ai预测.mp4"
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          width={16}
          height={9}
          mode="curved"
          curvature={18}
          showReflection
          reflectionOpacity={0.06}
          showShell
          shellDepth={0.12}
          shellRadius={0.16}
          playbackRate={0.3}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
