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
import {COLORS, FONTS} from "../config";

export const Scene2ProductName: React.FC = () => {
  const frame = useCurrentFrame();

  const logoScale = interpolate(
    frame,
    [0, 45],
    [0.3, 1],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    }
  );

  const logoOpacity = interpolate(
    frame,
    [0, 30],
    [0, 1],
    {
      extrapolateRight: "clamp",
    }
  );

  const titleY = interpolate(
    frame,
    [30, 75],
    [100, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    }
  );

  const titleOpacity = interpolate(
    frame,
    [30, 60],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const subtitleY = interpolate(
    frame,
    [60, 105],
    [50, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    }
  );

  const subtitleOpacity = interpolate(
    frame,
    [60, 90],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 60,
      }}
    >
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
        }}
      >
        <Img
          src={staticFile("video/logonew.png")}
          style={{
            width: 400,
            height: 400,
            objectFit: "contain",
            filter: `drop-shadow(0 0 40px ${COLORS.cyanGlow})`,
          }}
        />
      </div>

      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: FONTS.title,
            fontSize: 96,
            fontWeight: 900,
            color: COLORS.textPrimary,
            margin: 0,
            textShadow: `0 0 30px ${COLORS.cyanGlow}`,
            letterSpacing: "0.05em",
          }}
        >
          智舆
        </h1>
      </div>

      <div
        style={{
          transform: `translateY(${subtitleY}px)`,
          opacity: subtitleOpacity,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: 36,
            fontWeight: 400,
            color: COLORS.textSecondary,
            margin: 0,
            letterSpacing: "0.1em",
          }}
        >
          AI城市舆情态势监测感知与决策推演系统
        </p>
      </div>
    </AbsoluteFill>
  );
};
