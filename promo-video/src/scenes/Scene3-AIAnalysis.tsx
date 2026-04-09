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

export const Scene3AIAnalysis: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const cameraX = interpolate(
    frame,
    [0, 360],
    [-4, 4],
    {
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const cameraY = interpolate(
    frame,
    [0, 180, 360],
    [5, 1, 3],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const cameraZ = interpolate(
    frame,
    [0, 360],
    [12, 7],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  const titleOpacity = interpolate(
    frame,
    [45, 75, 300, 330],
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
    [75, 105, 300, 330],
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
        <MovingCamera position={[cameraX, cameraY, cameraZ]} fov={50} />
        <ambientLight intensity={0.8} />

        <VideoScreen
          src="video/信阳视图 双十二舆情气泡展开 展示ai分析 词云 ai预测.mp4"
          position={[0, 0, 0]}
          width={16}
          height={9}
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.6, 0]}>
          <planeGeometry args={[80, 80, 40, 40]} />
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
          AI 智能分析
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
          情感识别 · 趋势预测 · 深度洞察
        </p>
      </div>
    </AbsoluteFill>
  );
};
