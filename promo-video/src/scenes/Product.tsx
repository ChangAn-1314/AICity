import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

export const Product: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
  const titleScale = interpolate(frame, [0, 30], [0.8, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1]);

  const mapOpacity = interpolate(frame, [60, 90], [0, 1]);
  const mapScale = interpolate(frame, [60, 100], [1.2, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const fadeOut = interpolate(frame, [270, 300], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        <h2
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            marginBottom: 30,
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          智舆系统
        </h2>
        <p
          style={{
            fontSize: 42,
            color: '#0071e3',
            margin: 0,
            opacity: subtitleOpacity,
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          用AI的眼睛看城市
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: `translateX(-50%) scale(${mapScale})`,
          opacity: mapOpacity,
          width: 800,
          height: 400,
          background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.1) 0%, rgba(0, 113, 227, 0.05) 100%)',
          borderRadius: 20,
          border: '2px solid rgba(0, 113, 227, 0.3)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: 32,
            color: '#666',
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          3D地图可视化
        </div>
      </div>
    </AbsoluteFill>
  );
};
