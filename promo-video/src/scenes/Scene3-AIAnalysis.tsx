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
    frame,
    [0, 90, 240, 360],
    [-3.8, -4.7, -0.9, -3.1],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraY = interpolate(
    frame,
    [0, 90, 240, 360],
    [3.3, 2.6, 0.95, 2.7],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraZ = interpolate(
    frame,
    [0, 90, 240, 360],
    [9.7, 8.9, 7.2, 9.2],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <ThreeCanvas width={width} height={height} style={{position: "absolute"}}>
        <MovingCamera position={[cameraX, cameraY, cameraZ]} lookAt={[0, 0, 0]} fov={50} />
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
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
