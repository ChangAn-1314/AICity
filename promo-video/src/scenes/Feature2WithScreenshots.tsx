import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Img, staticFile } from 'remotion';

export const Feature2WithScreenshots: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
  const titleY = interpolate(frame, [0, 30], [50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const descOpacity = interpolate(frame, [30, 50], [0, 1]);

  const leftScreenOpacity = interpolate(frame, [60, 85], [0, 1]);
  const leftScreenX = interpolate(frame, [60, 85], [-100, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const rightScreenOpacity = interpolate(frame, [75, 100], [0, 1]);
  const rightScreenX = interpolate(frame, [75, 100], [100, 0], {
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 100, zIndex: 2 }}>
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
            textShadow: '0 0 40px rgba(0, 113, 227, 0.5)',
          }}
        >
          智能决策推演
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
          多Agent协作,科学决策
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 40,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 80,
        }}
      >
        {/* AI分析截图 */}
        <div
          style={{
            opacity: leftScreenOpacity,
            transform: `translateX(${leftScreenX}px) perspective(1000px) rotateY(5deg)`,
            width: 550,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0, 113, 227, 0.5)',
            border: '2px solid rgba(0, 113, 227, 0.4)',
          }}
        >
          <Img
            src={staticFile('ui/ui_ai_analysis.png')}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>

        {/* 决策模拟截图 */}
        <div
          style={{
            opacity: rightScreenOpacity,
            transform: `translateX(${rightScreenX}px) perspective(1000px) rotateY(-5deg)`,
            width: 550,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0, 113, 227, 0.5)',
            border: '2px solid rgba(0, 113, 227, 0.4)',
          }}
        >
          <Img
            src={staticFile('ui/ui_decision_sim.png')}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
