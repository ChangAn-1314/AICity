import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
  const titleY = interpolate(frame, [0, 30], [50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const item1Opacity = interpolate(frame, [30, 50], [0, 1]);
  const item1X = interpolate(frame, [30, 50], [-50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const item2Opacity = interpolate(frame, [50, 70], [0, 1]);
  const item2X = interpolate(frame, [50, 70], [-50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const item3Opacity = interpolate(frame, [70, 90], [0, 1]);
  const item3X = interpolate(frame, [70, 90], [-50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const fadeOut = interpolate(frame, [210, 240], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeOut,
      }}
    >
      <div style={{ maxWidth: 1200, padding: 60 }}>
        <h2
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: '#fff',
            marginBottom: 80,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          城市管理者面临的挑战
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div
            style={{
              opacity: item1Opacity,
              transform: `translateX(${item1X}px)`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#0071e3',
                }}
              />
              <p
                style={{
                  fontSize: 48,
                  color: '#ccc',
                  margin: 0,
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                舆情信息分散,难以全面掌握
              </p>
            </div>
          </div>

          <div
            style={{
              opacity: item2Opacity,
              transform: `translateX(${item2X}px)`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#0071e3',
                }}
              />
              <p
                style={{
                  fontSize: 48,
                  color: '#ccc',
                  margin: 0,
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                缺乏可视化工具,无法直观感知
              </p>
            </div>
          </div>

          <div
            style={{
              opacity: item3Opacity,
              transform: `translateX(${item3X}px)`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#0071e3',
                }}
              />
              <p
                style={{
                  fontSize: 48,
                  color: '#ccc',
                  margin: 0,
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                决策缺乏数据支撑,风险难以预判
              </p>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
