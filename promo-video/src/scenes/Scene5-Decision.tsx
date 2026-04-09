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

export const Scene5Decision: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const cameraZ = interpolate(
    frame,
    [0, 300],
    [14, 7],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  const cameraY = interpolate(
    frame,
    [0, 300],
    [8, 2],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
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

  const videoScale = interpolate(
    frame,
    [0, 300],
    [1.08, 1],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  const videoRotateX = interpolate(
    frame,
    [0, 300],
    [6, 0],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
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
        style={{position: "absolute", zIndex: 0, opacity: 0.3}}
      >
        <MovingCamera position={[0, cameraY, cameraZ]} fov={50} />
        <ambientLight intensity={0.15} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[60, 60, 30, 30]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.03}
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
            transform: `scale(${videoScale}) rotateX(${videoRotateX}deg)`,
            transformOrigin: "center bottom",
            width: "90%",
            height: "82%",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 35px 70px rgba(0,0,0,0.55), 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          <Video
            src={staticFile("video/ai决策演示.mp4")}
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
          top: 40,
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
          AI 决策推演
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
          多策略模拟 · 风险评估 · 最优方案
        </p>
      </div>
    </AbsoluteFill>
  );
};
