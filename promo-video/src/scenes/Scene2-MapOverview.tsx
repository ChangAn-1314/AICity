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

const VideoPlane: React.FC<{src: string; width: number; height: number}> = ({
  src,
  width,
  height,
}) => {
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[16, 9]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
};

export const Scene2MapOverview: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const cameraZ = interpolate(
    frame,
    [0, 360],
    [14, 8],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  const cameraY = interpolate(
    frame,
    [0, 360],
    [6, 1.5],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  const cameraX = interpolate(
    frame,
    [0, 180, 360],
    [-1.5, 0, 1.5],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
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
    [0, 360],
    [1.15, 1],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  const videoPerspective = interpolate(
    frame,
    [0, 360],
    [8, 2],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  const videoRotateX = interpolate(
    frame,
    [0, 360],
    [12, 0],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  const titleOpacity = interpolate(
    frame,
    [60, 90, 300, 330],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
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
        camera={{
          position: [cameraX, cameraY, cameraZ],
          fov: 50,
        }}
        style={{position: "absolute", zIndex: 0, opacity: 0.4}}
      >
        <ambientLight intensity={0.2} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
          <planeGeometry args={[60, 60, 30, 30]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.04}
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
          perspective: `${1200 + videoPerspective * 100}px`,
        }}
      >
        <div
          style={{
            transform: `scale(${videoScale}) rotateX(${videoRotateX}deg)`,
            transformOrigin: "center bottom",
            width: "92%",
            height: "85%",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)",
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
