import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  Easing,
} from "remotion";
import {COLORS, FONTS} from "../config";
import {GlassPanel} from "../components/GlassPanel";

const STRATEGIES = [
  {id: "A", name: "官方声明", prob: 85, color: COLORS.emerald, angle: -30},
  {id: "B", name: "社区互动", prob: 72, color: COLORS.cyan, angle: 0},
  {id: "C", name: "静默监控", prob: 45, color: COLORS.red, angle: 30},
];

export const Scene6Decision: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const rootOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const branchGrowth = interpolate(frame, [30, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const nodeAOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nodeBOpacity = interpolate(frame, [75, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nodeCOpacity = interpolate(frame, [90, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const selectHighlight = interpolate(frame, [120, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const resultSlide = interpolate(frame, [150, 180], [300, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const resultOpacity = interpolate(frame, [150, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const waveformOpacity = interpolate(frame, [180, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitle1Opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitle2Opacity = interpolate(frame, [75, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitle3Opacity = interpolate(frame, [180, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const centerX = 960;
  const centerY = 400;
  const branchLength = 250;

  const waveformBars = Array.from({length: 40}, (_, i) => {
    const barFrame = (frame - 180 + i * 2) % 30;
    const height = Math.abs(Math.sin((barFrame / 30) * Math.PI * 2)) * 60 + 10;
    return {height, id: `bar-${i}`};
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{position: "absolute", inset: 0}}
      >
        <title>决策树</title>
        <defs>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={centerX}
          cy={centerY}
          r={40}
          fill={COLORS.bg}
          stroke={COLORS.cyan}
          strokeWidth={3}
          opacity={rootOpacity}
          filter="url(#glow2)"
        />
        <text
          x={centerX}
          y={centerY + 6}
          textAnchor="middle"
          fill={COLORS.textPrimary}
          fontSize={16}
          fontFamily={FONTS.zh}
          opacity={rootOpacity}
        >
          舆情事件
        </text>

        {STRATEGIES.map((strategy, idx) => {
          const angle = (strategy.angle * Math.PI) / 180;
          const endX = centerX + Math.cos(angle) * branchLength * branchGrowth;
          const endY = centerY + Math.sin(angle) * branchLength * branchGrowth;

          const nodeOpacity =
            idx === 0 ? nodeAOpacity : idx === 1 ? nodeBOpacity : nodeCOpacity;

          const isSelected = idx === 0;
          const dimmed = selectHighlight > 0 && !isSelected ? 0.3 : 1;

          return (
            <g key={strategy.id} opacity={dimmed}>
              <line
                x1={centerX}
                y1={centerY}
                x2={endX}
                y2={endY}
                stroke={strategy.color}
                strokeWidth={isSelected && selectHighlight > 0 ? 4 : 2}
                opacity={branchGrowth}
              />

              <circle
                cx={endX}
                cy={endY}
                r={35}
                fill={COLORS.bg}
                stroke={strategy.color}
                strokeWidth={isSelected && selectHighlight > 0 ? 3 : 2}
                opacity={nodeOpacity}
                filter={isSelected && selectHighlight > 0 ? "url(#glow2)" : undefined}
              />
              <text
                x={endX}
                y={endY - 5}
                textAnchor="middle"
                fill={COLORS.textPrimary}
                fontSize={14}
                fontFamily={FONTS.zh}
                opacity={nodeOpacity}
              >
                {strategy.name}
              </text>
              <text
                x={endX}
                y={endY + 12}
                textAnchor="middle"
                fill={strategy.color}
                fontSize={16}
                fontFamily={FONTS.mono}
                fontWeight="700"
                opacity={nodeOpacity}
              >
                {strategy.prob}%
              </text>
            </g>
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: "50%",
          transform: `translateX(-50%) translateY(${resultSlide}px)`,
          width: 600,
          opacity: resultOpacity,
        }}
      >
        <GlassPanel>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 14,
              color: COLORS.emerald,
              marginBottom: 12,
            }}
          >
            模拟结果 - 策略A: 官方声明
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              fontFamily: FONTS.zh,
              fontSize: 20,
            }}
          >
            <div>
              <span style={{color: COLORS.textMuted}}>舆情影响</span>
              <span
                style={{
                  color: COLORS.emerald,
                  fontFamily: FONTS.mono,
                  fontSize: 28,
                  fontWeight: "700",
                  marginLeft: 12,
                }}
              >
                -15%
              </span>
            </div>
            <div>
              <span style={{color: COLORS.textMuted}}>情感值</span>
              <span
                style={{
                  color: COLORS.cyan,
                  fontFamily: FONTS.mono,
                  fontSize: 28,
                  fontWeight: "700",
                  marginLeft: 12,
                }}
              >
                +8
              </span>
            </div>
          </div>
        </GlassPanel>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 80,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 4,
          opacity: waveformOpacity,
        }}
      >
        {waveformBars.map((bar) => (
          <div
            key={bar.id}
            style={{
              width: 16,
              height: bar.height,
              backgroundColor: COLORS.cyan,
              opacity: 0.7,
              borderRadius: 2,
            }}
          />
        ))}
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
          智能决策推演引擎
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.zh,
            fontSize: 24,
            fontWeight: "400",
            color: COLORS.textSecondary,
            opacity: subtitle2Opacity,
          }}
        >
          模拟多种应对策略 · 预测舆情走向
        </div>
      </div>
    </AbsoluteFill>
  );
};
