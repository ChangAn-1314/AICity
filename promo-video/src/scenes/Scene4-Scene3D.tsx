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

  const t = frame / 300;
  const angle = interpolate(
    t, [0, 1], [-0.5, Math.PI * 0.65],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  const radius = interpolate(
    frame,
    [0, 75, 150, 225, 300],
    [3.8, 2.4, 1.8, 2.2, 3.4],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraX = Math.sin(angle) * radius;
  const cameraZ = Math.cos(angle) * radius;
  const cameraY = interpolate(
    frame,
    [0, 75, 150, 225, 300],
    [1.8, 0.6, -0.3, 0.2, 1.0],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );

  const lookAtX = Math.sin(angle) * 0.8;
  const lookAtY = interpolate(
    frame, [0, 150, 300], [0.5, -0.4, 0],
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
          lookAt={[lookAtX, lookAtY, 0]}
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
