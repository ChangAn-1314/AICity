import React from "react";
import {
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
  Img,
  staticFile,
  Easing,
} from "remotion";
import {Video} from "@remotion/media";
import {COLORS, FONTS} from "../config";

export const Scene6Ending: React.FC = () => {
  const frame = useCurrentFrame();

  const bgVideoOpacity = interpolate(
    frame,
    [0, 30],
    [0, 0.15],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const logoScale = interpolate(
    frame,
    [15, 60],
    [0.5, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    }
  );

  const logoOpacity = interpolate(
    frame,
    [15, 45],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const titleOpacity = interpolate(
    frame,
    [75, 105],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const titleY = interpolate(
    frame,
    [75, 105],
    [20, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.ease),
    }
  );

  const subtitleOpacity = interpolate(
    frame,
    [105, 135],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const lineOpacity = interpolate(
    frame,
    [165, 195],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const lineProgress = interpolate(
    frame,
    [165, 210],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const competitionOpacity = interpolate(
    frame,
    [195, 225],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AbsoluteFill style={{opacity: bgVideoOpacity, zIndex: 0}}>
        <Video
          src={staticFile("video/信阳视图-全国视图 缩放画面 舆情展示.mp4")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(6px) brightness(0.3)",
          }}
          muted
        />
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 50,
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
              width: 160,
              height: 160,
              objectFit: "contain",
              filter: "drop-shadow(0 0 20px rgba(255,255,255,0.15))",
            }}
          />
        </div>

        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <h1
            style={{
              fontFamily: FONTS.title,
              fontSize: 64,
              fontWeight: 600,
              color: COLORS.textPrimary,
              margin: 0,
              letterSpacing: "0.12em",
              textAlign: "center",
            }}
          >
            智舆
          </h1>
        </div>

        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 26,
            fontWeight: 400,
            color: COLORS.textSecondary,
            opacity: subtitleOpacity,
            letterSpacing: "0.2em",
            textAlign: "center",
          }}
        >
          让城市治理更智慧
        </div>

        <div
          style={{
            position: "relative",
            width: 300,
            height: 1,
            backgroundColor: COLORS.border,
            opacity: lineOpacity,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: `${lineProgress * 100}%`,
              height: "100%",
              background: COLORS.primary,
              boxShadow: "0 0 8px rgba(255,255,255,0.3)",
            }}
          />
        </div>

        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 20,
            fontWeight: 400,
            color: COLORS.textMuted,
            opacity: competitionOpacity,
            letterSpacing: "0.15em",
          }}
        >
          2025 讯飞杯
        </div>
      </div>
    </AbsoluteFill>
  );
};
