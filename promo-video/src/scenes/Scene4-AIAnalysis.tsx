import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Easing,
} from "remotion";
import {COLORS, FONTS} from "../config";
import {GlassPanel} from "../components/GlassPanel";
import {TypewriterText} from "../components/TypewriterText";

const KEYWORDS = [
  {text: "道路施工", size: 48, x: 960, y: 300},
  {text: "交通拥堵", size: 36, x: 750, y: 380},
  {text: "市民热议", size: 42, x: 1150, y: 350},
  {text: "信阳毛尖", size: 38, x: 850, y: 480},
  {text: "高铁新城", size: 40, x: 1080, y: 460},
  {text: "南湾湖", size: 32, x: 920, y: 550},
  {text: "规划方案", size: 30, x: 1020, y: 240},
  {text: "景区预约", size: 28, x: 780, y: 280},
  {text: "春茶采摘", size: 34, x: 1120, y: 520},
];

const TREND_DATA = [
  {x: 0, y: 0.6},
  {x: 0.15, y: 0.55},
  {x: 0.3, y: 0.7},
  {x: 0.45, y: 0.65},
  {x: 0.6, y: 0.8},
  {x: 0.75, y: 0.75},
  {x: 0.9, y: 0.85},
  {x: 1, y: 0.9},
];

export const Scene4AIAnalysis: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const wordCloudProgress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const chartProgress = interpolate(frame, [60, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const cardSlide = interpolate(frame, [150, 180], [200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const cardOpacity = interpolate(frame, [150, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitle1Opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitle2Opacity = interpolate(frame, [90, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitle3Opacity = interpolate(frame, [150, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pathLength = 800;
  const pathDashOffset = interpolate(chartProgress, [0, 1], [pathLength, 0]);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {KEYWORDS.map((kw, idx) => {
          const delay = idx * 5;
          const kwSpring = spring({
            frame: frame - delay,
            fps,
            config: {damping: 15},
          });
          const scale = interpolate(kwSpring, [0, 1], [0, 1]);
          const opacity = interpolate(kwSpring, [0, 1], [0, 1]);

          return (
            <div
              key={kw.text}
              style={{
                position: "absolute",
                left: kw.x,
                top: kw.y,
                transform: `translate(-50%, -50%) scale(${scale * wordCloudProgress})`,
                opacity: opacity * wordCloudProgress,
                fontFamily: FONTS.zh,
                fontSize: kw.size,
                fontWeight: "700",
                color: COLORS.cyanLight,
                textShadow: `0 0 10px ${COLORS.cyanGlow}`,
              }}
            >
              {kw.text}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          right: 80,
          top: 200,
          width: 500,
          height: 300,
          opacity: chartProgress,
        }}
      >
        <svg width="500" height="300" viewBox="0 0 500 300">
          <title>舆情趋势图</title>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={COLORS.cyan} />
              <stop offset="100%" stopColor={COLORS.purple} />
            </linearGradient>
          </defs>

          <line
            x1={50}
            y1={250}
            x2={450}
            y2={250}
            stroke={COLORS.border}
            strokeWidth={1}
          />
          <line
            x1={50}
            y1={50}
            x2={50}
            y2={250}
            stroke={COLORS.border}
            strokeWidth={1}
          />

          <path
            d={TREND_DATA.map((p, i) => {
              const x = 50 + p.x * 400;
              const y = 250 - p.y * 200;
              return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
            }).join(" ")}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            strokeDasharray={pathLength}
            strokeDashoffset={pathDashOffset}
            strokeLinecap="round"
          />

          {TREND_DATA.map((p) => {
            const x = 50 + p.x * 400;
            const y = 250 - p.y * 200;
            const idx = TREND_DATA.indexOf(p);
            const dotDelay = 120 + idx * 10;
            const dotOpacity = interpolate(frame, [dotDelay, dotDelay + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <circle
                key={`dot-${x}-${y}`}
                cx={x}
                cy={y}
                r={5}
                fill={COLORS.cyan}
                opacity={dotOpacity}
              />
            );
          })}
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: "50%",
          transform: `translateX(-50%) translateY(${cardSlide}px)`,
          width: 700,
          opacity: cardOpacity,
        }}
      >
        <GlassPanel>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 14,
              color: COLORS.cyanLight,
              marginBottom: 12,
            }}
          >
            AI 洞察分析
          </div>
          <TypewriterText
            text="情感倾向: 负面 62%  中性 25%  正面 13%"
            startFrame={180}
            speed={2}
            fontSize={18}
            color={COLORS.textPrimary}
            fontWeight="400"
            cursor={false}
          />
          <div style={{height: 8}} />
          <TypewriterText
            text="热点话题: 道路施工、交通拥堵 (关注度 ↑ 35%)"
            startFrame={220}
            speed={2}
            fontSize={18}
            color={COLORS.textPrimary}
            fontWeight="400"
            cursor={false}
          />
        </GlassPanel>
      </div>

      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.zh,
            fontSize: 36,
            fontWeight: "700",
            color: COLORS.textPrimary,
            opacity: subtitle1Opacity,
          }}
        >
          大模型深度语义分析
        </div>
      </div>
    </AbsoluteFill>
  );
};
