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

export const Scene4Scene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const blurAmount = interpolate(
    frame,
    [0, 100],
    [12, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.25, 1, 0.5, 1)},
  );

  const t = frame / 300;
  const angle = interpolate(
    t, [0, 1], [-0.45, Math.PI * 0.42],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  const radius = interpolate(
    frame,
    [0, 75, 150, 225, 300],
    [5.2, 4.3, 3.6, 4.0, 5.0],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraX = Math.sin(angle) * radius;
  const cameraZ = Math.cos(angle) * radius;
  const cameraY = interpolate(
    frame,
    [0, 75, 150, 225, 300],
    [2.2, 1.4, 0.7, 1.0, 1.6],
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

  const textOffsetAngle = angle + 0.25;
  const textRadius = radius * 0.42;
  const textX = Math.sin(textOffsetAngle) * textRadius;
  const textZ = Math.cos(textOffsetAngle) * textRadius;
  const textY = cameraY + 0.8;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg width={0} height={0} style={{position: "absolute"}}>
        <filter id="scene4-gaussian">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blurAmount} />
        </filter>
      </svg>
      <ThreeCanvas width={width} height={height} style={{position: "absolute", filter: "url(#scene4-gaussian)"}}>
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
        <FloatingText3D
          label="3D 场景还原"
          frame={frame}
          appearFrame={30}
          disappearFrame={260}
          position={[textX-0.5, textY-1, textZ]}
          rotation={[0, videoRotY, 0]}
          fontSize={0.19}
        />
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
