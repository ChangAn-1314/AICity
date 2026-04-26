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
import {FloatingText3D} from "../components/FloatingText3D";

export const Scene3AIAnalysis: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const blurAmount = interpolate(
    frame,
    [0, 110],
    [14, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.25, 1, 0.5, 1)},
  );

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
      <svg width={0} height={0} style={{position: "absolute"}}>
        <filter id="scene3-gaussian">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blurAmount} />
        </filter>
      </svg>
      <ThreeCanvas width={width} height={height} style={{position: "absolute", filter: "url(#scene3-gaussian)"}}>
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
          playbackRate={0.4}
        />
        <FloatingText3D
          label="AI 智能分析"
          frame={frame}
          appearFrame={35}
          disappearFrame={320}
          position={[-0.6, -1.0, 0.3]}
          rotation={[0, 0, 0]}
          fontSize={0.2}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
