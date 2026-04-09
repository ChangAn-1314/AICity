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
import {COLORS, VIDEO} from "../config";

export const Scene1Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  // 视频淡入淡出
  const videoOpacity = interpolate(
    frame,
    [0, 30, 210, 240],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }
  );

  // 3D摄像机俯冲效果 - 从远处快速接近
  const cameraZ = interpolate(
    frame,
    [0, 120],
    [50, 5],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1), // easeOutExpo
    }
  );

  const cameraY = interpolate(
    frame,
    [0, 120],
    [20, 0],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    }
  );

  // 视频缩放 - 配合摄像机运动
  const videoScale = interpolate(
    frame,
    [0, 120],
    [0.6, 1],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    }
  );

  // 粒子旋转
  const particleRotation = frame * 0.005;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* 3D 场景 - 摄像机俯冲 */}
      <ThreeCanvas
        width={width}
        height={height}
        camera={{
          position: [0, cameraY, cameraZ],
          fov: 75,
        }}
        style={{position: "absolute", zIndex: 1}}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        
        {/* 3D 网格背景 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[100, 100, 50, 50]} />
          <meshBasicMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>

        {/* 粒子效果 */}
        <points rotation={[0, particleRotation, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={1000}
              array={new Float32Array(
                Array.from({length: 3000}, (_, i) => {
                  const angle = (i / 1000) * Math.PI * 2;
                  const radius = 20 + Math.random() * 30;
                  return [
                    Math.cos(angle) * radius + (Math.random() - 0.5) * 10,
                    Math.random() * 40 - 20,
                    Math.sin(angle) * radius + (Math.random() - 0.5) * 10,
                  ][i % 3];
                })
              )}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.3}
            color="#22d3ee"
            transparent
            opacity={0.6}
            sizeAttenuation
          />
        </points>
      </ThreeCanvas>

      {/* Logo 视频 */}
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
          }}
        >
          <Video
            src={staticFile("video/logo开场.mp4")}
            style={{
              width: width * 0.8,
              height: height * 0.8,
              objectFit: "contain",
            }}
            muted
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
