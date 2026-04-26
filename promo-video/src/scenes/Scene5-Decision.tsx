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

export const Scene5Decision: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const videoAspect = 526 / 1138;
  const screenHeight = 9;
  const screenWidth = screenHeight * videoAspect;

  const blurAmount = interpolate(
    frame,
    [0, 150],
    [18, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.25, 1, 0.5, 1)},
  );

  const cameraX = 0;
  const cameraY = interpolate(
    frame, [0, 600], [4.5, -0.5],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraZ = 2.6;

  const lookAtX = 0;
  const lookAtY = cameraY - Math.sin(Math.PI / 3) * 2;
  const lookAtZ = -Math.cos(Math.PI / 3) * 2;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg width={0} height={0} style={{position: "absolute"}}>
        <filter id="scene5-gaussian">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blurAmount} />
        </filter>
      </svg>
      <ThreeCanvas width={width} height={height} style={{position: "absolute", filter: "url(#scene5-gaussian)"}}>
        <MovingCamera position={[cameraX, cameraY, cameraZ]} lookAt={[lookAtX, lookAtY, lookAtZ]} fov={50} />
        <StudioLights />
        <VideoScreen
          src="video/ai决策演示.mp4"
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          width={screenWidth}
          height={screenHeight}
          showReflection
          reflectionOpacity={0.05}
          showShell
        />
        <FloatingText3D
          label="AI 决策推演"
          frame={frame}
          appearFrame={40}
          disappearFrame={600}
          position={[1.3, -0.2, 0.5]}
          rotation={[0, 0, 0]}
          fontSize={0.28}
          vertical
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
