import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1]);
  const titleScale = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const line1Opacity = interpolate(frame, [40, 60], [0, 1]);
  const line2Opacity = interpolate(frame, [60, 80], [0, 1]);
  const line3Opacity = interpolate(frame, [80, 100], [0, 1]);
  const line4Opacity = interpolate(frame, [100, 120], [0, 1]);

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
      <div style={{ textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 84,
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            marginBottom: 60,
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          智舆系统
        </h2>

        <div style={{ fontSize: 42, lineHeight: 1.6 }}>
          <p
            style={{
              color: '#ccc',
              margin: 0,
              marginBottom: 20,
              opacity: line1Opacity,
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            用AI的眼睛<span style={{ color: '#0071e3' }}>看城市</span>
          </p>
          <p
            style={{
              color: '#ccc',
              margin: 0,
              marginBottom: 20,
              opacity: line2Opacity,
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            用3D的方式<span style={{ color: '#0071e3' }}>懂舆情</span>
          </p>
          <p
            style={{
              color: '#ccc',
              margin: 0,
              marginBottom: 20,
              opacity: line3Opacity,
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            用智能的大脑<span style={{ color: '#0071e3' }}>做决策</span>
          </p>
          <p
            style={{
              color: '#ccc',
              margin: 0,
              opacity: line4Opacity,
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            让城市管理更<span style={{ color: '#0071e3' }}>智慧</span>
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
