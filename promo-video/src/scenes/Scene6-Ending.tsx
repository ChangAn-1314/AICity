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

  const flipRotateY = interpolate(
    frame, [0, 75], [-Math.PI * 0.6, Math.PI * 0.12],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease)},
  );
  const flipX = interpolate(
    frame, [0, 75], [-12, -3.5],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease)},
  );
  const flipOpacity = interpolate(
    frame, [0, 30], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  const logoScale = interpolate(
    frame, [60, 105], [0.7, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease)},
  );
  const logoOpacity = interpolate(
    frame, [60, 90], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  const titleOpacity = interpolate(
    frame, [100, 130], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  const titleY = interpolate(
    frame, [100, 130], [15, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease)},
  );

  const subtitleOpacity = interpolate(
    frame, [135, 165], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  const competitionOpacity = interpolate(
    frame, [175, 205], [0, 0.5],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "50%",
        height: "100%",
      }}>
        <ThreeCanvas
          width={Math.round(width / 2)}
          height={height}
          style={{position: "absolute"}}
        >
          <MovingCamera position={[0, 0, 10]} lookAt={[-3.5, 0, 0]} fov={50} />
          <StudioLights />
          <group
            position={[flipX, 0, 0]}
            rotation={[0, flipRotateY, 0]}
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
          inset: 0,
          opacity: 1 - flipOpacity,
          backgroundColor: COLORS.bg,
          pointerEvents: "none",
        }} />
      </div>

      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: "50%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
      }}>
        <div style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
        }}>
          <Img
            src={staticFile("video/logonew.png")}
            style={{width: 120, height: 120, objectFit: "contain"}}
          />
        </div>

        <div style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}>
          <h1 style={{
            fontFamily: FONTS.title,
            fontSize: 52,
            fontWeight: 500,
            color: COLORS.textPrimary,
            margin: 0,
            letterSpacing: "0.15em",
            textAlign: "center",
          }}>
            智舆
          </h1>
        </div>

        <div style={{
          fontFamily: FONTS.body,
          fontSize: 20,
          fontWeight: 400,
          color: COLORS.textSecondary,
          opacity: subtitleOpacity,
          letterSpacing: "0.25em",
          textAlign: "center",
        }}>
          让城市治理更智慧
        </div>

        <div style={{
          fontFamily: FONTS.body,
          fontSize: 16,
          fontWeight: 400,
          color: COLORS.textMuted,
          opacity: competitionOpacity,
          letterSpacing: "0.2em",
        }}>
          2025 讯飞杯
        </div>
      </div>
    </AbsoluteFill>
  );
};
