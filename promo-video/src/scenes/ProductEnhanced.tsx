import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

export const ProductEnhanced: React.FC = () => {
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

  // 地图点动画
  const dots = [
    { x: 200, y: 150, delay: 100 },
    { x: 400, y: 200, delay: 110 },
    { x: 600, y: 180, delay: 120 },
    { x: 350, y: 280, delay: 130 },
  ];

  // 扫描线动画
  const scanLineY = interpolate(frame, [90, 240], [0, 400], {
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
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          zIndex: 2,
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
            background: 'linear-gradient(135deg, #fff 0%, #0071e3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
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
            textShadow: '0 0 30px rgba(0, 113, 227, 0.8)',
          }}
        >
          用AI的眼睛看城市
        </p>
      </div>

      {/* 3D地图容器 */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: `translateX(-50%) scale(${mapScale}) perspective(1000px) rotateX(5deg)`,
          opacity: mapOpacity,
          width: 800,
          height: 400,
          background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.15) 0%, rgba(0, 113, 227, 0.05) 100%)',
          borderRadius: 20,
          border: '2px solid rgba(0, 113, 227, 0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0, 113, 227, 0.4)',
        }}
      >
        {/* 网格背景 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(0, 113, 227, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 113, 227, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* 扫描线 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: scanLineY,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #0071e3, transparent)',
            boxShadow: '0 0 20px #0071e3',
          }}
        />

        {/* 动态点 */}
        {dots.map((dot, index) => {
          const dotOpacity = interpolate(
            frame,
            [dot.delay, dot.delay + 20],
            [0, 1],
            { extrapolateRight: 'clamp' }
          );
          const dotScale = interpolate(
            frame,
            [dot.delay, dot.delay + 20],
            [0, 1],
            {
              easing: Easing.out(Easing.back(2)),
              extrapolateRight: 'clamp',
            }
          );
          const pulse = Math.sin((frame - dot.delay) * 0.2) * 0.3 + 1;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: dot.x,
                top: dot.y,
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#0071e3',
                opacity: dotOpacity,
                transform: `scale(${dotScale * pulse})`,
                boxShadow: '0 0 20px #0071e3',
              }}
            >
              {/* 波纹效果 */}
              <div
                style={{
                  position: 'absolute',
                  inset: -10,
                  borderRadius: '50%',
                  border: '2px solid #0071e3',
                  opacity: 0.5,
                  animation: `pulse 2s infinite`,
                }}
              />
            </div>
          );
        })}

        <div
          style={{
            fontSize: 32,
            color: '#666',
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            zIndex: 1,
          }}
        >
          3D地图可视化
        </div>
      </div>
    </AbsoluteFill>
  );
};
