import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Img,
  staticFile,
  Easing,
} from "remotion";
import {COLORS, FONTS} from "../config";

export const Scene2ProductName: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoSpring = spring({
    frame: frame - 15,
    fps,
    config: {damping: 12, stiffness: 100},
  });

  const logoScale = interpolate(logoSpring, [0, 1], [0.3, 1]);
  const logoBlur = interpolate(frame, [15, 45], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [60, 90], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const glowScale = interpolate(
    frame,
    [0, 60, 120, 180],
    [0.8, 1.2, 0.9, 1.1],
    {extrapolateRight: "clamp"},
  );
  const glowOpacity = interpolate(frame, [0, 30], [0, 0.4], {
    extrapolateRight: "clamp",
  });

  const exitScale = interpolate(frame, [150, 180], [1, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const exitX = interpolate(frame, [150, 180], [0, -600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(frame, [150, 180], [0, -300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.cyanGlow} 0%, transparent 70%)`,
          transform: `translate(-50%, -50%) scale(${glowScale})`,
          opacity: glowOpacity,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${exitX}px, ${exitY}px) scale(${exitScale})`,
        }}
      >
        <Img
          src={staticFile("assets/images/logo.png")}
          style={{
            width: 240,
            height: 240,
            transform: `scale(${logoScale})`,
            filter: `blur(${logoBlur}px)`,
            objectFit: "contain",
          }}
        />

        <div
          style={{
            marginTop: 40,
            fontFamily: FONTS.zh,
            fontSize: 32,
            fontWeight: "400",
            color: COLORS.textSecondary,
            letterSpacing: "0.15em",
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          AI城市舆情态势监测感知与决策推演系统
        </div>
      </div>
    </AbsoluteFill>
  );
};
