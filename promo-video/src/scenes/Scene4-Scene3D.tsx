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

export const Scene4Scene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const cameraX = interpolate(
    frame,
    [0, 90, 240, 300],
    [-3.1, -1.2, 3.8, 6.8],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraY = interpolate(
    frame,
    [0, 90, 240, 300],
    [2.7, 2.0, 1.3, 1.2],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraZ = interpolate(
    frame,
    [0, 90, 240, 300],
    [9.2, 8.0, 7.4, 8.1],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );

  const videoRotY = interpolate(
    frame, [0, 300], [0, 0.15],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)}
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <ThreeCanvas width={width} height={height} style={{position: "absolute"}}>
        <MovingCamera
          position={[cameraX, cameraY, cameraZ]}
          lookAt={[0, 0, 0]}
          fov={50}
        />
        <StudioLights />
        <VideoScreen
          src="video/3d场景还原展示.mp4"
          position={[0, 0, 0]}
          rotation={[0, videoRotY, 0]}
          width={16}
          height={9}
          showReflection
          reflectionOpacity={0.06}
          showShell
        />
        <mesh position={[-5.2, 1.1, 2.1]} rotation={[0.08, 0.22, 0]}>
          <planeGeometry args={[2.2, 10.5]} />
          <meshBasicMaterial color="#080808" transparent opacity={0.05} />
        </mesh>
      </ThreeCanvas>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: interpolate(frame, [0, 45, 240, 300], [0, 0.06, 0.06, 0]),
          background: "radial-gradient(circle at 18% 40%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 24%, rgba(255,255,255,0) 58%)",
          filter: "blur(38px)",
        }}
      />
    </AbsoluteFill>
  );
};
