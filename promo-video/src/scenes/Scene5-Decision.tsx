import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  Easing,
} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import {COLORS, FONTS} from "../config";
import {MovingCamera} from "../components/MovingCamera";
import {VideoScreen} from "../components/VideoScreen";

export const Scene5Decision: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const cameraZ = interpolate(
    frame,
    [0, 300],
    [14, 6],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  const cameraY = interpolate(
    frame,
    [0, 300],
    [8, 1],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  const titleOpacity = interpolate(
    frame,
    [45, 75, 255, 285],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
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
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <ThreeCanvas
        width={width}
        height={height}
        style={{position: "absolute", zIndex: 0}}
      >
        <MovingCamera position={[0, cameraY, cameraZ]} fov={50} />
        <ambientLight intensity={0.8} />

        <VideoScreen
          src="video/ai决策演示.mp4"
          position={[0, 0, 0]}
          width={16}
          height={9}
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.6, 0]}>
          <planeGeometry args={[60, 60, 30, 30]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.025} />
        </mesh>
      </ThreeCanvas>

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
