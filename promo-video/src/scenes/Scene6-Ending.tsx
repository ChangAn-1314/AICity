import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  Img,
  staticFile,
  Easing,
} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import {COLORS, FONTS} from "../config";
import {MovingCamera} from "../components/MovingCamera";
import {StudioLights} from "../components/StudioLights";
import {VideoScreen} from "../components/VideoScreen";

export const Scene6Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const videoScale = interpolate(
    frame, [0, 90], [4.5, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );
  const videoZ = interpolate(
    frame, [0, 90], [2, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );
  const videoX = interpolate(
    frame, [0, 90], [0, -4.5],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );
  const videoRotY = interpolate(
    frame, [0, 90], [0, 0.2],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );

  const logoScale = interpolate(
    frame, [70, 110], [2.5, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );
  const logoOpacity = interpolate(
    frame, [70, 95], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  const titleScale = interpolate(
    frame, [95, 130], [1.8, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );
  const titleOpacity = interpolate(
    frame, [95, 120], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  const subtitleOpacity = interpolate(
    frame, [130, 160], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  const competitionOpacity = interpolate(
    frame, [165, 195], [0, 0.6],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <ThreeCanvas
        width={width}
        height={height}
        style={{position: "absolute"}}
      >
        <MovingCamera
          position={[0, 0, 10]}
          lookAt={[0, 0, 0]}
          fov={50}
        />
        <StudioLights />
        <group
          position={[videoX, 0, videoZ]}
          rotation={[0, videoRotY, 0]}
          scale={[videoScale, videoScale, videoScale]}
        >
          <VideoScreen
            src="video/全国视图 旋转画面 （舆情气泡 连接线 全国轮廓）.mp4"
            position={[0, 0, 0]}
            width={9}
            height={6}
            showReflection={false}
            showShell
            shellDepth={0.12}
            shellRadius={0.18}
          />
        </group>
      </ThreeCanvas>

      <div style={{
        position: "absolute",
        right: "5%",
        top: 0,
        width: "40%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 44,
      }}>
        <div style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
        }}>
          <Img
            src={staticFile("video/logonew.png")}
            style={{
              width: 180,
              height: 180,
              objectFit: "contain",
            }}
          />
        </div>

        <div style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}>
          <h1 style={{
            fontFamily: FONTS.title,
            fontSize: 72,
            fontWeight: 600,
            color: COLORS.textPrimary,
            margin: 0,
            letterSpacing: "0.12em",
            textAlign: "center",
          }}>
            智舆
          </h1>
        </div>

        <div style={{
          fontFamily: FONTS.body,
          fontSize: 26,
          fontWeight: 400,
          color: COLORS.textSecondary,
          opacity: subtitleOpacity,
          letterSpacing: "0.2em",
          textAlign: "center",
        }}>
          让城市治理更智慧
        </div>

        <div style={{
          fontFamily: FONTS.body,
          fontSize: 20,
          fontWeight: 400,
          color: COLORS.textMuted,
          opacity: competitionOpacity,
          letterSpacing: "0.15em",
        }}>
          2025 讯飞杯
        </div>
      </div>
    </AbsoluteFill>
  );
};
