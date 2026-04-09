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

export const Scene2MapOverview: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const cameraZ = interpolate(
    frame,
    [0, 360],
    [14, 6],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  const cameraY = interpolate(
    frame,
    [0, 360],
    [8, 1],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  const cameraX = interpolate(
    frame,
    [0, 180, 360],
    [-2, 0, 2],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const titleOpacity = interpolate(
    frame,
    [60, 90, 300, 330],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  const titleY = interpolate(
    frame,
    [60, 90],
    [30, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.ease),
    }
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
          src="video/全国视图 旋转画面 （舆情气泡 连接线 全国轮廓）.mp4"
          position={[0, 0, 0]}
          width={16}
          height={9}
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.6, 0]}>
          <planeGeometry args={[60, 60, 30, 30]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.03} />
        </mesh>
      </ThreeCanvas>

      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 2,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <h2
          style={{
            fontFamily: FONTS.title,
            fontSize: 44,
            fontWeight: 600,
            color: COLORS.textPrimary,
            margin: 0,
            letterSpacing: "0.08em",
          }}
        >
          全国舆情态势
        </h2>
      </div>
    </AbsoluteFill>
  );
};
