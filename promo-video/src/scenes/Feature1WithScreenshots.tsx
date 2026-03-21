import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Img, staticFile } from 'remotion';

export const Feature1WithScreenshots: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
  const titleY = interpolate(frame, [0, 30], [50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const descOpacity = interpolate(frame, [30, 50], [0, 1]);

  const screenshot3dOpacity = interpolate(frame, [60, 90], [0, 1]);
  const screenshot3dScale = interpolate(frame, [60, 90], [1.2, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const labelsOpacity = interpolate(frame, [100, 130], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 80, zIndex: 2 }}>
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

      {/* 3D场景还原截图 */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: `translateX(-50%) scale(${screenshot3dScale})`,
          opacity: screenshot3dOpacity,
          width: 1100,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0, 113, 227, 0.6)',
          border: '3px solid rgba(0, 113, 227, 0.5)',
        }}
      >
        <Img
          src={staticFile('ui/3d_scene.png')}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>

      {/* 功能标签 */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 30,
          opacity: labelsOpacity,
          zIndex: 3,
        }}
      >
        {['文字转3D', '图片转3D', '视频转3D'].map((label, index) => (
          <div
            key={index}
            style={{
              padding: '12px 30px',
              background: 'rgba(0, 113, 227, 0.2)',
              borderRadius: 20,
              border: '2px solid rgba(0, 113, 227, 0.5)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              style={{
                fontSize: 24,
                color: '#fff',
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
