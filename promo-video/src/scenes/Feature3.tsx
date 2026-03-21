import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

export const Feature3: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
  const titleY = interpolate(frame, [0, 30], [50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const descOpacity = interpolate(frame, [30, 50], [0, 1]);

  const stat1Opacity = interpolate(frame, [60, 80], [0, 1]);
  const stat1Scale = interpolate(frame, [60, 80], [0.5, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const stat2Opacity = interpolate(frame, [80, 100], [0, 1]);
  const stat2Scale = interpolate(frame, [80, 100], [0.5, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const stat3Opacity = interpolate(frame, [100, 120], [0, 1]);
  const stat3Scale = interpolate(frame, [100, 120], [0.5, 1], {
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
      <div style={{ textAlign: 'center', marginBottom: 100 }}>
        <h2
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: '#fff',
            margin: 0,
            marginBottom: 20,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          实时监测预警
        </h2>
        <p
          style={{
            fontSize: 36,
            color: '#999',
            margin: 0,
            opacity: descOpacity,
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          多源数据,分钟级响应
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 60,
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            opacity: stat1Opacity,
            transform: `scale(${stat1Scale})`,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: '#0071e3',
              marginBottom: 20,
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            7+
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#999',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            数据源平台
          </div>
        </div>

        <div
          style={{
            textAlign: 'center',
            opacity: stat2Opacity,
            transform: `scale(${stat2Scale})`,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: '#0071e3',
              marginBottom: 20,
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            90%+
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#999',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            情感分析准确率
          </div>
        </div>

        <div
          style={{
            textAlign: 'center',
            opacity: stat3Opacity,
            transform: `scale(${stat3Scale})`,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: '#0071e3',
              marginBottom: 20,
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            分钟级
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#999',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            预警响应
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
