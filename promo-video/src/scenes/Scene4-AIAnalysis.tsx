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

export const Scene4AIAnalysis: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const cameraZ = interpolate(
    frame,
    [0, 90],
    [12, 6],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const cameraRotationY = interpolate(
    frame,
    [90, 300],
    [0, Math.PI * 0.1],
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

  const gridRotation = frame * 0.003;

  const titleOpacity = interpolate(
    frame,
    [60, 90, 270, 300],
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
            Math.sin(cameraRotationY) * cameraZ,
            2,
            Math.cos(cameraRotationY) * cameraZ,
          ],
          fov: 65,
        }}
        style={{position: "absolute", zIndex: 1}}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={0.7} />
        
        <mesh rotation={[0, gridRotation, 0]} position={[0, -2, 0]}>
          <torusGeometry args={[8, 0.3, 16, 100]} />
          <meshBasicMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>

        <mesh rotation={[0, -gridRotation * 1.5, 0]} position={[0, -2, 0]}>
          <torusGeometry args={[6, 0.2, 16, 100]} />
          <meshBasicMaterial
            color="#d946ef"
            wireframe
            transparent
            opacity={0.2}
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
          src={staticFile("video/信阳视图 双十二舆情气泡展开 展示ai分析 词云 ai预测.mp4")}
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
            textShadow: `0 0 30px ${COLORS.purpleGlow}, 0 4px 20px rgba(0,0,0,0.8)`,
          }}
        >
          AI智能分析引擎
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
          深度学习 · 情感识别 · 趋势预测
        </p>
      </div>
    </AbsoluteFill>
  );
};

