import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  staticFile,
  Easing,
} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import {Html} from "@react-three/drei";
import {COLORS, FONTS} from "../config";
import {MovingCamera} from "../components/MovingCamera";
import {StudioLights} from "../components/StudioLights";
import {VideoScreen} from "../components/VideoScreen";

export const Scene6Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const videoScale = interpolate(
    frame, [0, 140], [6.5, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );
  const videoZ = interpolate(
    frame, [0, 140], [5.5, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );
  const videoX = interpolate(
    frame, [0, 140], [2.0, -2.8],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );
  const videoY = interpolate(
    frame, [0, 140, 240], [0, 0, -2.6],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.inOut(Easing.ease)},
  );
  const videoRotY = interpolate(
    frame, [0, 140], [-Math.PI * 0.55, 0.2],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );

  const logoScale = interpolate(
    frame, [110, 160], [2.5, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );
  const logoOpacity = interpolate(
    frame, [110, 145], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  const titleScale = interpolate(
    frame, [140, 185], [1.8, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );
  const titleOpacity = interpolate(
    frame, [140, 170], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  const subtitleOpacity = interpolate(
    frame, [175, 205], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  const competitionOpacity = interpolate(
    frame, [205, 230], [0, 0.6],
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
          position={[videoX, videoY, videoZ]}
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

        <group position={[3.4, 0.1, 0]}>
          <Html transform sprite={false} center>
            <div style={{
              width: 520,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 44,
              transform: `scale(${logoScale})`,
              opacity: Math.max(logoOpacity, titleOpacity, subtitleOpacity, competitionOpacity),
            }}>
              <img
                src={staticFile("video/logonew.png")}
                alt="智舆 logo"
                style={{
                  width: 180,
                  height: 180,
                  objectFit: "contain",
                  opacity: logoOpacity,
                  display: "block",
                }}
              />

              <div style={{
                opacity: titleOpacity,
                transform: `scale(${titleScale})`,
                transformOrigin: "center center",
              }}>
                <div style={{
                  fontFamily: FONTS.title,
                  fontSize: 72,
                  fontWeight: 600,
                  color: COLORS.textPrimary,
                  letterSpacing: "0.12em",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}>
                  智舆
                </div>
              </div>

              <div style={{
                fontFamily: FONTS.body,
                fontSize: 26,
                fontWeight: 400,
                color: COLORS.textSecondary,
                opacity: subtitleOpacity,
                letterSpacing: "0.2em",
                textAlign: "center",
                whiteSpace: "nowrap",
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
                textAlign: "center",
                whiteSpace: "nowrap",
              }}>
                2025 讯飞杯
              </div>
            </div>
          </Html>
        </group>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
