import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, useVideoConfig } from 'remotion';

export const Feature1Enhanced: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
  const titleY = interpolate(frame, [0, 30], [50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const descOpacity = interpolate(frame, [30, 50], [0, 1]);

  // 粒子效果背景
  const particleOpacity = interpolate(frame, [0, 60], [0, 0.3]);

  // 3D卡片动画
  const cards = [
    { delay: 60, icon: '📝', title: '文字转3D', desc: '10秒生成' },
    { delay: 80, icon: '🖼️', title: '图片转3D', desc: '场景重建' },
    { delay: 100, icon: '🎬', title: '视频转3D', desc: '关键帧还原' },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 动态背景网格 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: particleOpacity,
          backgroundImage: `
            linear-gradient(rgba(0, 113, 227, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 113, 227, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `perspective(500px) rotateX(60deg) scale(2)`,
          transformOrigin: 'center center',
        }}
      />

      <div style={{ textAlign: 'center', marginBottom: 100, zIndex: 1 }}>
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

      <div
        style={{
          display: 'flex',
          gap: 40,
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        {cards.map((card, index) => {
          const cardOpacity = interpolate(
            frame,
            [card.delay, card.delay + 20],
            [0, 1],
            { extrapolateRight: 'clamp' }
          );
          const cardScale = interpolate(
            frame,
            [card.delay, card.delay + 20],
            [0.8, 1],
            {
              easing: Easing.out(Easing.back(1.5)),
              extrapolateRight: 'clamp',
            }
          );
          const cardRotate = interpolate(
            frame,
            [card.delay, card.delay + 20],
            [-10, 0],
            { extrapolateRight: 'clamp' }
          );

          // 悬浮动画
          const floatY = Math.sin((frame - card.delay) * 0.05) * 5;

          return (
            <div
              key={index}
              style={{
                width: 300,
                height: 320,
                background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.2) 0%, rgba(0, 113, 227, 0.05) 100%)',
                borderRadius: 20,
                border: '2px solid rgba(0, 113, 227, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: cardOpacity,
                transform: `scale(${cardScale}) rotateY(${cardRotate}deg) translateY(${floatY}px)`,
                boxShadow: '0 20px 60px rgba(0, 113, 227, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  fontSize: 80,
                  marginBottom: 20,
                  filter: 'drop-shadow(0 0 20px rgba(0, 113, 227, 0.5))',
                }}
              >
                {card.icon}
              </div>
              <div
                style={{
                  fontSize: 32,
                  color: '#fff',
                  fontWeight: 600,
                  marginBottom: 10,
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: '#0071e3',
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                {card.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
