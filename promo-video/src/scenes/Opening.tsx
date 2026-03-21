import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const titleScale = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const subtitleOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
        }}
      >
        <h1
          style={{
            fontSize: 120,
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            letterSpacing: '-0.02em',
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          智舆
        </h1>
      </div>
      <div
        style={{
          opacity: subtitleOpacity,
          marginTop: 40,
        }}
      >
        <p
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: '#999',
            margin: 0,
            letterSpacing: '0.02em',
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          AI城市舆情态势监测感知与决策推演系统
        </p>
      </div>
    </AbsoluteFill>
  );
};
