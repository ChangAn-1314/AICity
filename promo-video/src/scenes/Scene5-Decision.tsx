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

  const cameraX = interpolate(
    frame,
    [0, 90, 240, 300],
    [6.8, 5.2, 2.3, 1.1],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraY = interpolate(
    frame,
    [0, 90, 240, 300],
    [1.2, 1.05, 0.9, 0.84],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraZ = interpolate(
    frame,
    [0, 90, 240, 300],
    [8.1, 8.15, 8.25, 8.3],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <ThreeCanvas width={width} height={height} style={{position: "absolute"}}>
        <MovingCamera position={[cameraX, cameraY, cameraZ]} lookAt={[0, 0, 0]} fov={50} />
        <StudioLights />
        <VideoScreen
          src="video/ai决策演示.mp4"
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          width={16}
          height={9}
          showReflection
          reflectionOpacity={0.05}
          showShell
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
