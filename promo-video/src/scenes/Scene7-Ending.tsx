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

const TAGS = ["实时监测", "深度分析", "智能决策"];

export const Scene7Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoSpring = spring({
    frame: frame - 30,
    fps,
    config: {damping: 10, stiffness: 100},
  });

  const logoScale = interpolate(logoSpring, [0, 1], [0.5, 1]);
  const logoOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tag1Opacity = interpolate(frame, [75, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tag2Opacity = interpolate(frame, [90, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tag3Opacity = interpolate(frame, [105, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tagOpacities = [tag1Opacity, tag2Opacity, tag3Opacity];

  const ctaOpacity = interpolate(frame, [135, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const competitionOpacity = interpolate(frame, [165, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineProgress = interpolate(frame, [165, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const glowPulse = Math.sin((frame / 30) * Math.PI) * 0.2 + 0.8;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.cyanGlow} 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          opacity: logoOpacity * 0.3 * glowPulse,
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
          gap: 60,
        }}
      >
        <Img
          src={staticFile("assets/images/logo.png")}
          style={{
            width: 200,
            height: 200,
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            objectFit: "contain",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: 40,
            alignItems: "center",
          }}
        >
          {TAGS.map((tag, i) => (
            <div
              key={tag}
              style={{
                fontFamily: FONTS.zh,
                fontSize: 28,
                fontWeight: "700",
                color: COLORS.textPrimary,
                opacity: tagOpacities[i],
                padding: "8px 24px",
                border: `2px solid ${COLORS.cyan}`,
                borderRadius: 24,
                boxShadow: `0 0 20px ${COLORS.cyanGlow}`,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        <div
          style={{
            fontFamily: FONTS.zh,
            fontSize: 32,
            fontWeight: "400",
            color: COLORS.textSecondary,
            opacity: ctaOpacity,
            letterSpacing: "0.1em",
          }}
        >
          让城市治理更智慧
        </div>

        <div
          style={{
            position: "relative",
            width: 400,
            height: 2,
            backgroundColor: COLORS.border,
            opacity: competitionOpacity,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: `${lineProgress * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.purple})`,
              boxShadow: `0 0 10px ${COLORS.cyanGlow}`,
            }}
          />
        </div>

        <div
          style={{
            fontFamily: FONTS.zh,
            fontSize: 24,
            fontWeight: "400",
            color: COLORS.textMuted,
            opacity: competitionOpacity,
          }}
        >
          2025 讯飞杯
        </div>
      </div>
    </AbsoluteFill>
  );
};
