import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Img, staticFile } from 'remotion';

export const MapDrillDown: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
  const titleY = interpolate(frame, [0, 30], [50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const descOpacity = interpolate(frame, [30, 50], [0, 1]);

  // 四级地图依次展示
  const maps = [
    { file: 'ui_drill_1_national.png', label: '全国视图', delay: 60 },
    { file: 'ui_drill_2_province.png', label: '省级视图', delay: 120 },
    { file: 'ui_drill_3_city.png', label: '市级视图', delay: 180 },
  ];

  const currentMapIndex = Math.min(
    Math.floor(interpolate(frame, [60, 240], [0, 3], { extrapolateRight: 'clamp' })),
    2
  );

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
          四级区域穿透
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
          全国 → 省 → 市 → 县 精准下钻
        </p>
      </div>

      {/* 地图截图轮播 */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 1200,
          height: 600,
        }}
      >
        {maps.map((map, index) => {
          const isActive = currentMapIndex === index;
          const mapOpacity = interpolate(
            frame,
            [map.delay, map.delay + 30, map.delay + 60, map.delay + 90],
            [0, 1, 1, index === 2 ? 1 : 0],
            { extrapolateRight: 'clamp' }
          );
          const mapScale = interpolate(
            frame,
            [map.delay, map.delay + 30],
            [1.1, 1],
            {
              easing: Easing.out(Easing.cubic),
              extrapolateRight: 'clamp',
            }
          );

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: mapOpacity,
                transform: `scale(${mapScale}) perspective(1000px) rotateX(3deg)`,
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 40px 100px rgba(0, 113, 227, 0.6)',
                border: '3px solid rgba(0, 113, 227, 0.5)',
              }}
            >
              <Img
                src={staticFile(`ui/${map.file}`)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* 标签 */}
              <div
                style={{
                  position: 'absolute',
                  top: 30,
                  left: 30,
                  padding: '15px 35px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  borderRadius: 15,
                  border: '2px solid rgba(0, 113, 227, 0.6)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span
                  style={{
                    fontSize: 28,
                    color: '#0071e3',
                    fontWeight: 600,
                    fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  {map.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
