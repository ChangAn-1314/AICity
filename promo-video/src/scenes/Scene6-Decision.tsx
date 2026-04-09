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

export const Scene6Decision: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const cameraX = interpolate(
    frame,
    [0, 135, 270],
    [8, 0, -8],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const cameraZ = interpolate(
    frame,
    [0, 90],
    [15, 7],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const videoOpacity = interpolate(
    frame,
    [0, 30, 240, 270],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const sphereRotation = frame * 0.008;
  const ringRotation = frame * 0.004;

  const titleOpacity = interpolate(
    frame,
    [60, 90, 240, 270],
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
          position: [cameraX, 3, cameraZ],
          fov: 60,
        }}
        style={{position: "absolute", zIndex: 1}}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 10]} intensity={0.7} />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#d946ef" />

        <mesh rotation={[0, sphereRotation, 0]} position={[0, 0, 0]}>
          <sphereGeometry args={[3, 32, 32]} />
          <meshBasicMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>

        <mesh rotation={[Math.PI / 4, ringRotation, 0]} position={[0, 0, 0]}>
          <torusGeometry args={[5, 0.2, 16, 64]} />
          <meshBasicMaterial
            color="#d946ef"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>

        <mesh rotation={[0, -ringRotation * 0.7, Math.PI / 3]} position={[0, 0, 0]}>
          <torusGeometry args={[6, 0.15, 16, 64]} />
          <meshBasicMaterial
            color="#10b981"
            wireframe
            transparent
            opacity={0.25}
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
          src={staticFile("video/ai决策演示.mp4")}
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
            textShadow: `0 0 30px ${COLORS.emeraldGlow}, 0 4px 20px rgba(0,0,0,0.8)`,
          }}
        >
          AI决策推演系统
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
          多策略模拟 · 风险评估 · 最优方案推荐
        </p>
      </div>
    </AbsoluteFill>
  );
};
