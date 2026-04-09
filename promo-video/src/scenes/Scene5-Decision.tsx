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
    [9.5, 7.4, 2.1, 1.0],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraY = interpolate(
    frame,
    [0, 90, 240, 300],
    [1.8, 1.55, 0.9, 0.82],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraZ = interpolate(
    frame,
    [0, 90, 240, 300],
    [7.2, 7.45, 8.15, 8.35],
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
        <mesh position={[5.6, 0.5, 3.2]} rotation={[0, -0.18, 0]}>
          <planeGeometry args={[2.8, 8.8]} />
          <meshBasicMaterial color="#060606" transparent opacity={0.04} />
        </mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
