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


const HOTSPOTS = [
  {x: 820, y: 380, label: "信阳中心城区", level: "high", count: 8432},
  {x: 950, y: 320, label: "平桥区", level: "medium", count: 3201},
  {x: 760, y: 450, label: "浉河区", level: "high", count: 6715},
  {x: 1050, y: 400, label: "罗山县", level: "low", count: 1203},
  {x: 680, y: 350, label: "光山县", level: "medium", count: 2890},
];

const NEWS_ITEMS = [
  {source: "微博", title: "信阳市区道路施工引发市民热议", sentiment: "负面"},
  {source: "抖音", title: "信阳毛尖春茶采摘季正式开启", sentiment: "正面"},
  {source: "今日头条", title: "信阳高铁新城规划方案公示", sentiment: "中性"},
  {source: "微信", title: "南湾湖景区五一预约已满", sentiment: "正面"},
];

const levelColor = (level: string) => {
  if (level === "high") return COLORS.red;
  if (level === "medium") return COLORS.amber;
  return COLORS.emerald;
};

const HotspotMarker: React.FC<{
  x: number;
  y: number;
  label: string;
  level: string;
  count: number;
  delay: number;
}> = ({x, y, label, level, count, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const markerSpring = spring({
    frame: frame - delay,
    fps,
    config: {damping: 12},
  });

  const color = levelColor(level);
  const pulseRadius = interpolate(
    (frame - delay) % 30,
    [0, 30],
    [8, 24],
  );
  const pulseOpacity = interpolate(
    (frame - delay) % 30,
    [0, 30],
    [0.6, 0],
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${markerSpring})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: pulseRadius * 2,
          height: pulseRadius * 2,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          opacity: frame > delay ? pulseOpacity : 0,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: color,
          boxShadow: `0 0 12px ${color}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -35,
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          fontFamily: FONTS.zh,
          fontSize: 14,
          color: COLORS.textPrimary,
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: "2px 8px",
          borderRadius: 4,
          border: `1px solid ${color}`,
        }}
      >
        {label}{" "}
        <span style={{fontFamily: FONTS.mono, color}}>
          {count.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export const Scene3MapOverview: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const zoomProgress = interpolate(frame, [0, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const mapScale = interpolate(zoomProgress, [0, 1], [0.5, 1]);
  const mapOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const gridOpacity = interpolate(frame, [90, 120], [0, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const panelSlide = interpolate(frame, [210, 240], [400, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const panelOpacity = interpolate(frame, [210, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity1 = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleOpacity2 = interpolate(frame, [120, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleOpacity3 = interpolate(frame, [210, 225], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const newsScrollY = interpolate(frame, [240, 360], [0, -200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: mapOpacity,
          transform: `scale(${mapScale})`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              linear-gradient(${COLORS.cyan}22 1px, transparent 1px),
              linear-gradient(90deg, ${COLORS.cyan}22 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            opacity: gridOpacity,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 55% 45%, ${COLORS.cyan}15 0%, transparent 50%)`,
          }}
        />

        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          style={{position: "absolute", inset: 0}}
        >
          <title>城市边界</title>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {frame > 120 && (
            <path
              d="M 600 300 L 700 280 L 800 350 L 900 320 L 1000 380 L 1100 350 L 1150 400 L 1100 450 L 1000 470 L 900 440 L 800 480 L 700 420 L 650 380 Z"
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth={2}
              opacity={interpolate(frame, [120, 150], [0, 0.6], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
              filter="url(#glow)"
            />
          )}
        </svg>

        {HOTSPOTS.map((spot, i) => (
          <HotspotMarker
            key={spot.label}
            x={spot.x}
            y={spot.y}
            label={spot.label}
            level={spot.level}
            count={spot.count}
            delay={150 + i * 15}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 40,
          top: 120,
          bottom: 80,
          width: 320,
          opacity: panelOpacity,
          transform: `translateX(-${panelSlide}px)`,
        }}
      >
        <GlassPanel
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "rgba(15, 23, 42, 0.85)",
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 16,
              color: COLORS.cyanLight,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderBottom: `1px solid ${COLORS.border}`,
              paddingBottom: 12,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: COLORS.cyan,
              }}
            />
            实时舆情监控
          </div>

          <div style={{flex: 1, overflow: "hidden", position: "relative"}}>
            <div style={{transform: `translateY(${newsScrollY}px)`}}>
              {NEWS_ITEMS.map((item) => {
                const sentimentColor =
                  item.sentiment === "正面"
                    ? COLORS.emerald
                    : item.sentiment === "负面"
                      ? COLORS.red
                      : COLORS.textMuted;
                return (
                  <div
                    key={item.title}
                    style={{
                      padding: "12px 0",
                      borderBottom: `1px solid ${COLORS.border}`,
                      fontFamily: FONTS.zh,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: COLORS.textMuted,
                        marginBottom: 4,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{item.source}</span>
                      <span style={{color: sentimentColor}}>
                        {item.sentiment}
                      </span>
                    </div>
                    <div
                      style={{fontSize: 14, color: COLORS.textPrimary}}
                    >
                      {item.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassPanel>
      </div>

      <div
        style={{
          position: "absolute",
          top: 50,
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
            opacity: subtitleOpacity1,
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          实时接入全网数据源
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.zh,
            fontSize: 28,
            fontWeight: "400",
            color: COLORS.textSecondary,
            opacity: subtitleOpacity2,
          }}
        >
          7x24小时 城市舆情脉搏监测
        </div>
      </div>
    </AbsoluteFill>
  );
};
