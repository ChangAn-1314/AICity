import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const logoOpacity = interpolate(frame, [0, 30], [0, 1]);
  const textOpacity = interpolate(frame, [30, 60], [0, 1]);

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
            fontSize: 120,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 40,
            opacity: logoOpacity,
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          智舆
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
      </div>
    </AbsoluteFill>
  );
};
