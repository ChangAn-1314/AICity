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
    frame, [0, 300], [10, 0],
    {extrapolateRight: "clamp", easing: Easing.bezier(0.25, 0.1, 0.25, 1)}
  );
  const cameraY = interpolate(
    frame, [0, 300], [2, 0.3],
    {extrapolateRight: "clamp", easing: Easing.bezier(0.25, 0.1, 0.25, 1)}
  );
  const cameraZ = interpolate(
    frame, [0, 300], [6, 9],
    {extrapolateRight: "clamp", easing: Easing.bezier(0.25, 0.1, 0.25, 1)}
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
          reflectionOpacity={0.11}
          showShell
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
