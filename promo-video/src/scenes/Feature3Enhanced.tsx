import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

const CountUp: React.FC<{ from: number; to: number; startFrame: number; endFrame: number; suffix?: string }> = ({
  from,
  to,
  startFrame,
  endFrame,
  suffix = '',
}) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [startFrame, endFrame], [from, to], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return <>{Math.floor(value)}{suffix}</>;
};

export const Feature3Enhanced: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
  const titleY = interpolate(frame, [0, 30], [50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const descOpacity = interpolate(frame, [30, 50], [0, 1]);

  const stats = [
    { label: '数据源平台', value: 7, suffix: '+', delay: 60 },
    { label: '情感分析准确率', value: 90, suffix: '%+', delay: 80 },
    { label: '预警响应', value: 1, suffix: '分钟级', delay: 100 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 雷达扫描背景 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
        }}
      >
        {[...Array(5)].map((_, i) => {
          const size = 200 + i * 150;
          const opacity = interpolate(
            frame,
            [i * 10, i * 10 + 60],
            [0, 0.5],
            { extrapolateRight: 'clamp' }
          );
          const scale = interpolate(
            frame,
            [i * 10, i * 10 + 60],
            [0.5, 1],
            { extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                borderRadius: '50%',
                border: '2px solid #0071e3',
                opacity,
                transform: `scale(${scale})`,
              }}
            />
          );
        })}
      </div>

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
          实时监测预警
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
          多源数据,分钟级响应
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 80,
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        {stats.map((stat, index) => {
          const statOpacity = interpolate(
            frame,
            [stat.delay, stat.delay + 20],
            [0, 1],
            { extrapolateRight: 'clamp' }
          );
          const statScale = interpolate(
            frame,
            [stat.delay, stat.delay + 30],
            [0.5, 1],
            {
              easing: Easing.out(Easing.back(1.5)),
              extrapolateRight: 'clamp',
            }
          );

          // 光晕效果
          const glowIntensity = Math.sin((frame - stat.delay) * 0.1) * 0.5 + 0.5;

          return (
            <div
              key={index}
              style={{
                textAlign: 'center',
                opacity: statOpacity,
                transform: `scale(${statScale})`,
                position: 'relative',
              }}
            >
              {/* 背景光晕 */}
              <div
                style={{
                  position: 'absolute',
                  inset: -40,
                  background: `radial-gradient(circle, rgba(0, 113, 227, ${glowIntensity * 0.3}) 0%, transparent 70%)`,
                  borderRadius: '50%',
                  filter: 'blur(30px)',
                }}
              />

              <div
                style={{
                  fontSize: 96,
                  fontWeight: 700,
                  color: '#0071e3',
                  marginBottom: 20,
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  textShadow: '0 0 40px rgba(0, 113, 227, 0.8)',
                  position: 'relative',
                }}
              >
                {index === 2 ? (
                  stat.suffix
                ) : (
                  <CountUp
                    from={0}
                    to={stat.value}
                    startFrame={stat.delay}
                    endFrame={stat.delay + 40}
                    suffix={stat.suffix}
                  />
                )}
              </div>
              <div
                style={{
                  fontSize: 32,
                  color: '#999',
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  position: 'relative',
                }}
              >
                {stat.label}
              </div>

              {/* 进度条 */}
              <div
                style={{
                  marginTop: 20,
                  width: 200,
                  height: 4,
                  backgroundColor: 'rgba(0, 113, 227, 0.2)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    backgroundColor: '#0071e3',
                    width: `${interpolate(
                      frame,
                      [stat.delay, stat.delay + 40],
                      [0, 100],
                      { extrapolateRight: 'clamp' }
                    )}%`,
                    boxShadow: '0 0 10px #0071e3',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
