import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Img, staticFile } from 'remotion';

export const ProductWithScreenshots: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 使用秒数定义时间，然后转换为帧（最佳实践）
  const TITLE_START_SEC = 22 / fps;
  const TITLE_DURATION_SEC = 0.5;
  const SUBTITLE_START_SEC = TITLE_START_SEC + 1.0;
  const SUBTITLE_DURATION_SEC = 0.5;
  const SCREENSHOT_START_SEC = SUBTITLE_START_SEC + 0.5;
  const SCREENSHOT_DURATION_SEC = 1.0;

  // 转换为帧
  const titleStart = TITLE_START_SEC * fps;
  const titleEnd = titleStart + TITLE_DURATION_SEC * fps;
  const subtitleStart = SUBTITLE_START_SEC * fps;
  const subtitleEnd = subtitleStart + SUBTITLE_DURATION_SEC * fps;
  const screenshotStart = SCREENSHOT_START_SEC * fps;
  const screenshotEnd = screenshotStart + SCREENSHOT_DURATION_SEC * fps;

  // 标题从右侧快速飞入
  const titleOpacity = interpolate(frame, [titleStart, titleStart + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const titleX = interpolate(frame, [titleStart, titleEnd], [500, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const titleScale = interpolate(frame, [titleStart, titleEnd], [0.9, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 副标题从右侧飞入
  const subtitleOpacity = interpolate(frame, [subtitleStart, subtitleStart + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const subtitleX = interpolate(frame, [subtitleStart, subtitleEnd], [500, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 截图动画
  const screenshot1Opacity = interpolate(frame, [screenshotStart, screenshotStart + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const screenshot1Scale = interpolate(frame, [screenshotStart, screenshotEnd], [1.1, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const screenshot1Y = interpolate(frame, [screenshotStart, screenshotEnd], [30, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
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
          transform: `translateX(${titleX}px) scale(${titleScale})`,
          zIndex: 2,
          marginBottom: 80,
          willChange: 'transform, opacity', // 性能优化
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
            transform: `translateX(${subtitleX}px)`,
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            textShadow: '0 0 30px rgba(0, 113, 227, 0.8)',
            willChange: 'transform, opacity', // 性能优化
          }}
        >
          用AI的眼睛看城市
        </p>
      </div>

      {/* 主界面截图 */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: '50%',
          transform: `translateX(-50%) translateY(${screenshot1Y}px) scale(${screenshot1Scale}) perspective(1000px) rotateX(5deg)`,
          opacity: screenshot1Opacity,
          width: 1200,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0, 113, 227, 0.5)',
          border: '3px solid rgba(0, 113, 227, 0.4)',
          willChange: 'transform, opacity', // 性能优化
        }}
      >
        <Img
          src={staticFile('ui/ui_main_interface.png')}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
