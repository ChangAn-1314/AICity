import React from "react";
import {
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
  Img,
  staticFile,
  Easing,
} from "remotion";
import {COLORS, FONTS} from "../config";

export const Scene6Ending: React.FC = () => {
  const frame = useCurrentFrame();

  const logoScale = interpolate(
    frame, [30, 75], [0.8, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease)}
  );
  const logoOpacity = interpolate(
    frame, [30, 60], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  const titleOpacity = interpolate(
    frame, [90, 120], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );
  const titleY = interpolate(
    frame, [90, 120], [15, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease)}
  );

  const subtitleOpacity = interpolate(
    frame, [130, 160], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  const lineProgress = interpolate(
    frame, [170, 210], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad)}
  );
  const lineOpacity = interpolate(
    frame, [170, 190], [0, 0.6],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  const competitionOpacity = interpolate(
    frame, [200, 230], [0, 0.5],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 40,
    }}>
      <div style={{transform: `scale(${logoScale})`, opacity: logoOpacity}}>
        <Img
          src={staticFile("video/logonew.png")}
          style={{width: 120, height: 120, objectFit: "contain"}}
        />
      </div>

      <div style={{opacity: titleOpacity, transform: `translateY(${titleY}px)`}}>
        <h1 style={{
          fontFamily: FONTS.title, fontSize: 52, fontWeight: 500,
          color: COLORS.textPrimary, margin: 0, letterSpacing: "0.15em",
          textAlign: "center",
        }}>
          智舆
        </h1>
      </div>

      <div style={{
        fontFamily: FONTS.body, fontSize: 20, fontWeight: 400,
        color: COLORS.textSecondary, opacity: subtitleOpacity,
        letterSpacing: "0.25em", textAlign: "center",
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
      }}>
        2025 讯飞杯
      </div>
    </AbsoluteFill>
  );
};
