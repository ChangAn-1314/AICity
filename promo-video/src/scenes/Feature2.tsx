import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

export const Feature2: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
  const titleY = interpolate(frame, [0, 30], [50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const descOpacity = interpolate(frame, [30, 50], [0, 1]);

  const agent1Opacity = interpolate(frame, [60, 75], [0, 1]);
  const agent1Y = interpolate(frame, [60, 75], [30, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const agent2Opacity = interpolate(frame, [75, 90], [0, 1]);
  const agent2Y = interpolate(frame, [75, 90], [30, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const agent3Opacity = interpolate(frame, [90, 105], [0, 1]);
  const agent3Y = interpolate(frame, [90, 105], [30, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const agent4Opacity = interpolate(frame, [105, 120], [0, 1]);
  const agent4Y = interpolate(frame, [105, 120], [30, 0], {
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
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
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
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 40,
          maxWidth: 1000,
        }}
      >
        <div
          style={{
            padding: 40,
            background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.15) 0%, rgba(0, 113, 227, 0.05) 100%)',
            borderRadius: 20,
            border: '2px solid rgba(0, 113, 227, 0.3)',
            opacity: agent1Opacity,
            transform: `translateY(${agent1Y}px)`,
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: '#0071e3',
              marginBottom: 15,
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            分析Agent
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#999',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            深度解析舆情态势
          </div>
        </div>

        <div
          style={{
            padding: 40,
            background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.15) 0%, rgba(0, 113, 227, 0.05) 100%)',
            borderRadius: 20,
            border: '2px solid rgba(0, 113, 227, 0.3)',
            opacity: agent2Opacity,
            transform: `translateY(${agent2Y}px)`,
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: '#0071e3',
              marginBottom: 15,
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            预测Agent
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#999',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            预判发展趋势
          </div>
        </div>

        <div
          style={{
            padding: 40,
            background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.15) 0%, rgba(0, 113, 227, 0.05) 100%)',
            borderRadius: 20,
            border: '2px solid rgba(0, 113, 227, 0.3)',
            opacity: agent3Opacity,
            transform: `translateY(${agent3Y}px)`,
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: '#0071e3',
              marginBottom: 15,
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            决策Agent
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#999',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            生成应对方案
          </div>
        </div>

        <div
          style={{
            padding: 40,
            background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.15) 0%, rgba(0, 113, 227, 0.05) 100%)',
            borderRadius: 20,
            border: '2px solid rgba(0, 113, 227, 0.3)',
            opacity: agent4Opacity,
            transform: `translateY(${agent4Y}px)`,
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: '#0071e3',
              marginBottom: 15,
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            模拟Agent
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#999',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            推演决策效果
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
