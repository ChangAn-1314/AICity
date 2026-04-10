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

export const Scene5Decision: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const videoAspect = 526 / 1138;
  const screenHeight = 9;
  const screenWidth = screenHeight * videoAspect;

  const cameraX = 0;
  const cameraY = interpolate(
    frame, [0, 300], [4.5, 0.2],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraZ = 2.6;

  const lookAtX = 0;
  const lookAtY = cameraY - Math.sin(Math.PI / 3) * 2;
  const lookAtZ = -Math.cos(Math.PI / 3) * 2;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <ThreeCanvas width={width} height={height} style={{position: "absolute"}}>
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
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
