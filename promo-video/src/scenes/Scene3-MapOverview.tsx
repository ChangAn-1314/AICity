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

export const Scene3MapOverview: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const cameraX = interpolate(
    frame,
    [0, 180, 360],
    [-5, 0, 5],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const cameraY = interpolate(
    frame,
    [0, 180, 360],
    [3, 0, -2],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const cameraZ = interpolate(
    frame,
    [0, 120],
    [15, 8],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const videoOpacity = interpolate(
    frame,
    [0, 30, 330, 360],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const videoScale = interpolate(
    frame,
    [0, 120],
    [1.2, 1],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const planeRotation = frame * 0.002;

  const titleOpacity = interpolate(
    frame,
    [60, 90, 300, 330],
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
          position: [cameraX, cameraY, cameraZ],
          fov: 60,
        }}
        style={{position: "absolute", zIndex: 1}}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 10]} intensity={0.6} />
        
        <mesh rotation={[-Math.PI / 2, 0, planeRotation]} position={[0, -3, 0]}>
          <planeGeometry args={[80, 80, 40, 40]} />
          <meshBasicMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, -planeRotation * 0.5]} position={[0, -3.1, 0]}>
          <planeGeometry args={[100, 100, 50, 50]} />
          <meshBasicMaterial
            color="#d946ef"
            wireframe
            transparent
            opacity={0.08}
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
        <div
          style={{
            transform: `scale(${videoScale})`,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Video
            src={staticFile("video/全国视图 旋转画面 （舆情气泡 连接线 全国轮廓）.mp4")}
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
          top: 80,
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
          全国舆情态势一览
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
          实时监测 · 智能分析 · 精准预警
        </p>
      </div>
    </AbsoluteFill>
  );
};
