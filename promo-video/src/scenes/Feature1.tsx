import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

export const Feature1: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
  const titleY = interpolate(frame, [0, 30], [50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const descOpacity = interpolate(frame, [30, 50], [0, 1]);

  const box1Opacity = interpolate(frame, [60, 80], [0, 1]);
  const box1Scale = interpolate(frame, [60, 80], [0.8, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const box2Opacity = interpolate(frame, [80, 100], [0, 1]);
  const box2Scale = interpolate(frame, [80, 100], [0.8, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const box3Opacity = interpolate(frame, [100, 120], [0, 1]);
  const box3Scale = interpolate(frame, [100, 120], [0.8, 1], {
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
          AI场景还原
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
          在地图上看见新闻现场
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 40,
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 300,
            height: 300,
            background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.2) 0%, rgba(0, 113, 227, 0.05) 100%)',
            borderRadius: 20,
            border: '2px solid rgba(0, 113, 227, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: box1Opacity,
            transform: `scale(${box1Scale})`,
          }}
        >
          <div
            style={{
              fontSize: 64,
              marginBottom: 20,
            }}
          >
            📝
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#fff',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            文字转3D
          </div>
        </div>

        <div
          style={{
            width: 300,
            height: 300,
            background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.2) 0%, rgba(0, 113, 227, 0.05) 100%)',
            borderRadius: 20,
            border: '2px solid rgba(0, 113, 227, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: box2Opacity,
            transform: `scale(${box2Scale})`,
          }}
        >
          <div
            style={{
              fontSize: 64,
              marginBottom: 20,
            }}
          >
            🖼️
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#fff',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            图片转3D
          </div>
        </div>

        <div
          style={{
            width: 300,
            height: 300,
            background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.2) 0%, rgba(0, 113, 227, 0.05) 100%)',
            borderRadius: 20,
            border: '2px solid rgba(0, 113, 227, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: box3Opacity,
            transform: `scale(${box3Scale})`,
          }}
        >
          <div
            style={{
              fontSize: 64,
              marginBottom: 20,
            }}
          >
            🎬
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#fff',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            视频转3D
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
