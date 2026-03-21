import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Img, staticFile } from 'remotion';

export const DataVisualization: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
  const titleY = interpolate(frame, [0, 30], [50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const descOpacity = interpolate(frame, [30, 50], [0, 1]);

  const leftScreenOpacity = interpolate(frame, [60, 85], [0, 1]);
  const leftScreenX = interpolate(frame, [60, 85], [-80, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const rightScreenOpacity = interpolate(frame, [80, 105], [0, 1]);
  const rightScreenX = interpolate(frame, [80, 105], [80, 0], {
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
          智能数据分析
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
          话题云图 · 趋势预测 · 情感分析
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 50,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 80,
        }}
      >
        {/* 词云图 */}
        <div
          style={{
            opacity: leftScreenOpacity,
            transform: `translateX(${leftScreenX}px) perspective(1000px) rotateY(8deg)`,
            width: 520,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0, 113, 227, 0.5)',
            border: '2px solid rgba(0, 113, 227, 0.4)',
            background: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <Img
            src={staticFile('ui/ui_wordcloud.png')}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              padding: '10px 25px',
              background: 'rgba(0, 0, 0, 0.8)',
              borderRadius: 12,
              border: '2px solid rgba(0, 113, 227, 0.5)',
            }}
          >
            <span
              style={{
                fontSize: 22,
                color: '#0071e3',
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              话题云图
            </span>
          </div>
        </div>

        {/* 趋势分析 */}
        <div
          style={{
            opacity: rightScreenOpacity,
            transform: `translateX(${rightScreenX}px) perspective(1000px) rotateY(-8deg)`,
            width: 520,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0, 113, 227, 0.5)',
            border: '2px solid rgba(0, 113, 227, 0.4)',
            background: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <Img
            src={staticFile('ui/ui_trend_analysis.png')}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              padding: '10px 25px',
              background: 'rgba(0, 0, 0, 0.8)',
              borderRadius: 12,
              border: '2px solid rgba(0, 113, 227, 0.5)',
            }}
          >
            <span
              style={{
                fontSize: 22,
                color: '#0071e3',
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              趋势预测
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
