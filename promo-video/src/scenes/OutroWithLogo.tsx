import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile } from 'remotion';

export const OutroWithLogo: React.FC = () => {
  const frame = useCurrentFrame();

  const logoOpacity = interpolate(frame, [0, 30], [0, 1]);
  const logoScale = interpolate(frame, [0, 40], [0.8, 1], {
    extrapolateRight: 'clamp',
  });
  const textOpacity = interpolate(frame, [40, 70], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            marginBottom: 50,
          }}
        >
          <Img
            src={staticFile('images/logo.png')}
            style={{
              width: 350,
              height: 'auto',
              filter: 'drop-shadow(0 0 50px rgba(0, 113, 227, 0.7))',
            }}
          />
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#666',
            opacity: textOpacity,
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          AICity - 智慧城市舆情监测系统
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#444',
            opacity: textOpacity,
            marginTop: 20,
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          讯飞星火驱动 · AI全景感知 · 3D沙盘推演
        </div>
      </div>
    </AbsoluteFill>
  );
};
