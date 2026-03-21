import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from 'remotion';

export const OpeningWithLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const logoScale = spring({
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
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
        }}
      >
        <Img
          src={staticFile('images/logo.png')}
          style={{
            width: 400,
            height: 'auto',
            filter: 'drop-shadow(0 0 40px rgba(0, 113, 227, 0.6))',
          }}
        />
      </div>
      <div
        style={{
          opacity: subtitleOpacity,
          marginTop: 60,
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
