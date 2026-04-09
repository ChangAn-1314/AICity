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

export const Scene5Scene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const cameraZ = interpolate(
    frame,
    [0, 60, 180, 240],
    [20, 8, 6, 12],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const cameraY = interpolate(
    frame,
    [0, 60, 180, 240],
    [12, 4, 2, 6],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const cameraAngle = interpolate(
    frame,
    [0, 240],
    [0, Math.PI * 0.5],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const videoOpacity = interpolate(
    frame,
    [0, 30, 210, 240],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const gridPulse = Math.sin(frame * 0.05) * 0.05 + 0.15;
  const ringRotation = frame * 0.01;

  const titleOpacity = interpolate(
    frame,
    [30, 60, 210, 240],
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
        camera={{
          position: [
            Math.sin(cameraAngle) * cameraZ,
            cameraY,
            Math.cos(cameraAngle) * cameraZ,
          ],
          fov: 55,
        }}
        style={{position: "absolute", zIndex: 1}}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={0.8} />
        <pointLight position={[0, 5, 0]} intensity={0.6} color="#06b6d4" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[60, 60, 30, 30]} />
          <meshBasicMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={gridPulse}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, ringRotation]} position={[0, 3, 0]}>
          <torusGeometry args={[5, 0.15, 16, 64]} />
          <meshBasicMaterial
            color="#d946ef"
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>

        <mesh rotation={[Math.PI / 3, ringRotation, 0]} position={[0, 3, 0]}>
          <torusGeometry args={[4, 0.1, 16, 64]} />
          <meshBasicMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      </ThreeCanvas>

      <AbsoluteFill
        style={{
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: videoOpacity,
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
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 3,
          opacity: titleOpacity,
        }}
      >
        <h2
          style={{
            fontFamily: FONTS.title,
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.textPrimary,
            margin: 0,
            textShadow: `0 0 30px ${COLORS.cyanGlow}, 0 4px 20px rgba(0,0,0,0.8)`,
          }}
        >
          AI 3D场景还原
        </h2>
        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: 28,
            fontWeight: 400,
            color: COLORS.textSecondary,
            margin: "20px 0 0 0",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          文本 · 图片 · 视频 → 三维现场重建
        </p>
      </div>
    </AbsoluteFill>
  );
};
