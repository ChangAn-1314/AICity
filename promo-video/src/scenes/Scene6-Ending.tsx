import React from "react";
import {
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
  staticFile,
  Easing,
} from "remotion";
import {Video} from "@remotion/media";
import {COLORS, FONTS} from "../config";

export const Scene6Ending: React.FC = () => {
  const frame = useCurrentFrame();

  const videoOpacity = interpolate(
    frame, [0, 24, 210, 240], [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  const videoScale = interpolate(
    frame, [0, 90], [0.94, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease)}
  );

  const titleOpacity = interpolate(
    frame, [110, 140], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );
  const titleY = interpolate(
    frame, [110, 140], [15, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease)}
  );

  const subtitleOpacity = interpolate(
    frame, [145, 175], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  const lineProgress = interpolate(
    frame, [180, 220], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad)}
  );
  const lineOpacity = interpolate(
    frame, [180, 200], [0, 0.6],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  const competitionOpacity = interpolate(
    frame, [205, 232], [0, 0.5],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg,
    }}>
      <AbsoluteFill style={{
        transform: `scale(${videoScale})`,
        opacity: videoOpacity,
      }}>
        <Video
          src={staticFile("video/logo结束.mp4")}
          objectFit="cover"
          muted
          style={{width: "100%", height: "100%"}}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >

        <div style={{opacity: titleOpacity, transform: `translateY(${titleY}px)`}}>
          <h1 style={{
            fontFamily: FONTS.title, fontSize: 52, fontWeight: 500,
            color: COLORS.textPrimary, margin: 0, letterSpacing: "0.15em",
            textAlign: "center",
            textShadow: "0 6px 20px rgba(0,0,0,0.45)",
          }}>
            智舆
          </h1>
        </div>

        <div style={{
          fontFamily: FONTS.body, fontSize: 20, fontWeight: 400,
          color: COLORS.textSecondary, opacity: subtitleOpacity,
          letterSpacing: "0.25em", textAlign: "center",
          textShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}>
          让城市治理更智慧
        </div>

        <div style={{
          position: "relative", width: 200, height: 1,
          backgroundColor: COLORS.border, opacity: lineOpacity,
        }}>
          <div style={{
            position: "absolute", left: 0, top: 0,
            width: `${lineProgress * 100}%`, height: "100%",
            background: COLORS.secondary,
          }} />
        </div>

        <div style={{
          fontFamily: FONTS.body, fontSize: 16, fontWeight: 400,
          color: COLORS.textMuted, opacity: competitionOpacity,
          letterSpacing: "0.2em",
          textShadow: "0 4px 16px rgba(0,0,0,0.35)",
        }}>
          2025 讯飞杯
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
