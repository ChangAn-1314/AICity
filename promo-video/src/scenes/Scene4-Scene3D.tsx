import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  Easing,
  staticFile,
} from "remotion";
import {Video} from "@remotion/media";
import {ThreeCanvas} from "@remotion/three";
import {COLORS, FONTS} from "../config";
import {MovingCamera} from "../components/MovingCamera";

export const Scene4Scene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const cameraAngle = interpolate(
    frame,
    [0, 300],
    [0, Math.PI * 0.4],
    {
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const cameraRadius = interpolate(
    frame,
    [0, 150, 300],
    [12, 9, 11],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const cameraY = interpolate(
    frame,
    [0, 150, 300],
    [4, 1, 2.5],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const videoOpacity = interpolate(
    frame,
    [0, 30, 270, 300],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const videoRotateY = interpolate(
    frame,
    [0, 300],
    [-8, 8],
    {
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const titleOpacity = interpolate(
    frame,
    [45, 75, 255, 285],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const titleY = interpolate(
    frame,
    [45, 75],
    [20, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.ease),
    }
  );

  const subtitleOpacity = interpolate(
    frame,
    [75, 105, 255, 285],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <ThreeCanvas
        width={width}
        height={height}
        style={{position: "absolute", zIndex: 0, opacity: 0.25}}
      >
        <MovingCamera
          position={[
            Math.sin(cameraAngle) * cameraRadius,
            cameraY,
            Math.cos(cameraAngle) * cameraRadius,
          ]}
          fov={50}
        />
        <ambientLight intensity={0.1} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[70, 70, 35, 35]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.025}
          />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>
      </ThreeCanvas>

      <AbsoluteFill
        style={{
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: videoOpacity,
          perspective: "1400px",
        }}
      >
        <div
          style={{
            transform: `rotateY(${videoRotateY}deg)`,
            width: "88%",
            height: "80%",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 35px 70px rgba(0,0,0,0.55), 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          <Video
            src={staticFile("video/3d场景还原展示.mp4")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            muted
          />
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 2,
        }}
      >
        <h2
          style={{
            fontFamily: FONTS.title,
            fontSize: 44,
            fontWeight: 600,
            color: COLORS.textPrimary,
            margin: 0,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            letterSpacing: "0.08em",
          }}
        >
          3D 场景还原
        </h2>
        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: 22,
            fontWeight: 400,
            color: COLORS.textSecondary,
            margin: "16px 0 0 0",
            opacity: subtitleOpacity,
            letterSpacing: "0.15em",
          }}
        >
          文本 · 图片 · 视频 → 三维重建
        </p>
      </div>
    </AbsoluteFill>
  );
};
