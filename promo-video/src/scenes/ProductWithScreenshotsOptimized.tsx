import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Img, staticFile } from 'remotion';

/**
 * 优化后的产品介绍场景
 * 
 * 优化点：
 * 1. 使用 fps 计算时间，而不是硬编码帧数
 * 2. 添加 extrapolate 防止值超出范围
 * 3. 使用推荐的 easing 曲线
 * 4. 优化动画时序
 */

export const ProductWithScreenshotsOptimized: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 时间常量（秒）
  const TITLE_START = 22 / fps; // 从第22帧开始
  const TITLE_DURATION = 0.5; // 0.5秒飞入动画
  const SUBTITLE_START = TITLE_START + 1.0; // 标题后1秒
  const SUBTITLE_DURATION = 0.5; // 0.5秒飞入动画
  const SCREENSHOT_START = SUBTITLE_START + 0.5; // 副标题后0.5秒
  const SCREENSHOT_DURATION = 1.0; // 1秒出现动画

  // 转换为帧
  const titleStartFrame = TITLE_START * fps;
  const titleEndFrame = titleStartFrame + TITLE_DURATION * fps;
  const subtitleStartFrame = SUBTITLE_START * fps;
  const subtitleEndFrame = subtitleStartFrame + SUBTITLE_DURATION * fps;
  const screenshotStartFrame = SCREENSHOT_START * fps;
  const screenshotEndFrame = screenshotStartFrame + SCREENSHOT_DURATION * fps;

  // 标题动画：从右侧快速飞入
  const titleOpacity = interpolate(
    frame,
    [titleStartFrame, titleStartFrame + 10],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const titleX = interpolate(
    frame,
    [titleStartFrame, titleEndFrame],
    [500, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const titleScale = interpolate(
    frame,
    [titleStartFrame, titleEndFrame],
    [0.9, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // 副标题动画：从右侧飞入
  const subtitleOpacity = interpolate(
    frame,
    [subtitleStartFrame, subtitleStartFrame + 10],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const subtitleX = interpolate(
    frame,
    [subtitleStartFrame, subtitleEndFrame],
    [500, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // 截图动画：缩放+上移
  const screenshotOpacity = interpolate(
    frame,
    [screenshotStartFrame, screenshotStartFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const screenshotScale = interpolate(
    frame,
    [screenshotStartFrame, screenshotEndFrame],
    [1.1, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const screenshotY = interpolate(
    frame,
    [screenshotStartFrame, screenshotEndFrame],
    [30, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 标题容器 */}
      <div
        style={{
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `translateX(${titleX}px) scale(${titleScale})`,
          zIndex: 2,
          marginBottom: 80,
          // 使用 will-change 提示浏览器优化
          willChange: 'transform, opacity',
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
        
        {/* 副标题 */}
        <p
          style={{
            fontSize: 42,
            color: '#0071e3',
            margin: 0,
            opacity: subtitleOpacity,
            transform: `translateX(${subtitleX}px)`,
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            textShadow: '0 0 30px rgba(0, 113, 227, 0.8)',
            willChange: 'transform, opacity',
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
          transform: `translateX(-50%) translateY(${screenshotY}px) scale(${screenshotScale}) perspective(1000px) rotateX(5deg)`,
          opacity: screenshotOpacity,
          width: 1200,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0, 113, 227, 0.5)',
          border: '3px solid rgba(0, 113, 227, 0.4)',
          willChange: 'transform, opacity',
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
