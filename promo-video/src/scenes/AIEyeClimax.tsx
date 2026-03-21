import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring, Img, staticFile } from 'remotion';

/**
 * 核心高潮场景：AI 的眼睛看见舆情
 * 
 * 时间轴（基于 30fps）：
 * - 帧 0-12 (0.0-0.4s, 15.371-15.797s): Logo "智舆" 震撼出现
 * - 帧 12-26 (0.4-0.9s, 15.797-16.288s): "AI 的眼睛" 文字浮现
 * - 帧 26-42 (0.9-1.4s, 16.288-16.779s): 眼睛图标睁开动画
 * - 帧 42-57 (1.4-1.9s, 16.779-17.269s): ⭐ 最强峰值 - 扫描光波爆发
 * - 帧 57-71 (1.9-2.4s, 17.269-17.760s): 数据流汇聚，"看见舆情"
 * - 帧 71-86 (2.4-2.9s, 17.760-18.251s): 3D 地图展开
 * - 帧 86-100 (2.9-3.3s, 18.251-18.741s): 热点标记弹出
 * - 帧 100-115 (3.3-3.9s, 18.741-19.232s): 地图旋转展示
 * 
 * 总时长: 115 帧 (3.83 秒)
 */

export const AIEyeClimax: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 关键帧定义
  const LOGO_START = 0;
  const LOGO_END = 12;
  const TEXT_START = 12;
  const TEXT_END = 26;
  const EYE_START = 26;
  const EYE_OPEN = 42;
  const SCAN_START = 42;
  const SCAN_END = 57;
  const DATA_START = 57;
  const DATA_END = 71;
  const MAP_START = 71;
  const MAP_END = 86;
  const HOTSPOT_START = 86;
  const HOTSPOT_END = 100;
  const ROTATE_START = 100;

  // 1. Logo "智舆" 动画
  const logoScale = interpolate(
    frame,
    [LOGO_START, LOGO_END],
    [0.5, 1.2],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.back(1.5)),
    }
  );

  const logoOpacity = interpolate(
    frame,
    [LOGO_START, LOGO_START + 5, LOGO_END],
    [0, 1, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Logo 闪光效果
  const logoFlash = interpolate(
    frame,
    [LOGO_START, LOGO_START + 3, LOGO_START + 6],
    [0, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // 2. "AI 的眼睛" 文字动画
  const textY = interpolate(
    frame,
    [TEXT_START, TEXT_END],
    [100, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    }
  );

  const textOpacity = interpolate(
    frame,
    [TEXT_START, TEXT_START + 8],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // 3. 眼睛图标动画
  const eyeScale = spring({
    frame: frame - EYE_START,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  const eyeOpacity = interpolate(
    frame,
    [EYE_START, EYE_START + 5],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // 眼睛睁开动画（眼皮高度）
  const eyeOpenProgress = interpolate(
    frame,
    [EYE_START, EYE_OPEN],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // 4. 扫描光波爆发（最强峰值）
  const scanScale = interpolate(
    frame,
    [SCAN_START, SCAN_END],
    [0.5, 3],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    }
  );

  const scanOpacity = interpolate(
    frame,
    [SCAN_START, SCAN_START + 5, SCAN_END],
    [0, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // 屏幕震动效果
  const shakeX = frame >= SCAN_START && frame < SCAN_END
    ? Math.sin(frame * 2) * 5 * (1 - (frame - SCAN_START) / (SCAN_END - SCAN_START))
    : 0;

  const shakeY = frame >= SCAN_START && frame < SCAN_END
    ? Math.cos(frame * 2.5) * 5 * (1 - (frame - SCAN_START) / (SCAN_END - SCAN_START))
    : 0;

  // 5. 数据流动画
  const dataOpacity = interpolate(
    frame,
    [DATA_START, DATA_START + 8],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // 6. "看见舆情" 文字
  const seeTextOpacity = interpolate(
    frame,
    [DATA_START + 5, DATA_START + 12],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // 7. 3D 地图展开
  const mapScale = interpolate(
    frame,
    [MAP_START, MAP_END],
    [0.3, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.back(1.2)),
    }
  );

  const mapOpacity = interpolate(
    frame,
    [MAP_START, MAP_START + 8],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // 8. 热点标记弹出
  const hotspotProgress = interpolate(
    frame,
    [HOTSPOT_START, HOTSPOT_END],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // 9. 地图旋转
  const mapRotateY = interpolate(
    frame,
    [ROTATE_START, ROTATE_START + 15],
    [0, 15],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* 背景粒子效果 */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 100, 255, 0.1) 0%, transparent 70%)',
        }}
      />

      {/* 1. Logo "智舆" */}
      {frame >= LOGO_START && frame < TEXT_END && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: 180,
              fontWeight: 'bold',
              color: '#fff',
              opacity: logoOpacity,
              transform: `scale(${logoScale})`,
              textShadow: `0 0 ${logoFlash * 50}px rgba(255, 255, 255, ${logoFlash})`,
              fontFamily: 'sans-serif',
            }}
          >
            智舆
          </div>
        </AbsoluteFill>
      )}

      {/* 2. "AI 的眼睛" 文字 */}
      {frame >= TEXT_START && frame < EYE_OPEN && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 200,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              background: 'linear-gradient(90deg, #00d4ff, #0066ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              opacity: textOpacity,
              transform: `translateY(${textY}px)`,
              fontFamily: 'sans-serif',
            }}
          >
            AI 的眼睛
          </div>
        </AbsoluteFill>
      )}

      {/* 3. 眼睛图标 */}
      {frame >= EYE_START && frame < DATA_END && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 300,
              height: 150,
              position: 'relative',
              opacity: eyeOpacity,
              transform: `scale(${eyeScale})`,
            }}
          >
            {/* 眼睛外轮廓 */}
            <div
              style={{
                width: '100%',
                height: '100%',
                border: '4px solid #00d4ff',
                borderRadius: '50%',
                position: 'absolute',
                boxShadow: '0 0 30px rgba(0, 212, 255, 0.6)',
              }}
            />
            
            {/* 瞳孔 */}
            <div
              style={{
                width: 80,
                height: 80,
                background: 'radial-gradient(circle, #00d4ff 0%, #0066ff 100%)',
                borderRadius: '50%',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 40px rgba(0, 212, 255, 0.8)',
              }}
            />

            {/* 眼皮（睁开动画）*/}
            <div
              style={{
                width: '100%',
                height: `${(1 - eyeOpenProgress) * 100}%`,
                background: '#000',
                position: 'absolute',
                top: 0,
                left: 0,
                borderRadius: '50%',
              }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* 4. 扫描光波爆发（最强峰值）*/}
      {frame >= SCAN_START && frame < SCAN_END && (
        <>
          {/* 光波1 */}
          <AbsoluteFill
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 300,
                height: 300,
                border: '3px solid #00d4ff',
                borderRadius: '50%',
                opacity: scanOpacity,
                transform: `scale(${scanScale})`,
                boxShadow: '0 0 50px rgba(0, 212, 255, 0.8)',
              }}
            />
          </AbsoluteFill>

          {/* 光波2 */}
          <AbsoluteFill
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 300,
                height: 300,
                border: '2px solid #0066ff',
                borderRadius: '50%',
                opacity: scanOpacity * 0.7,
                transform: `scale(${scanScale * 1.2})`,
                boxShadow: '0 0 40px rgba(0, 102, 255, 0.6)',
              }}
            />
          </AbsoluteFill>

          {/* 粒子爆发效果 */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const distance = scanScale * 200;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 10,
                  height: 10,
                  background: '#00d4ff',
                  borderRadius: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  opacity: scanOpacity,
                  boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)',
                }}
              />
            );
          })}
        </>
      )}

      {/* 5. 数据流动画 */}
      {frame >= DATA_START && frame < MAP_END && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: dataOpacity,
          }}
        >
          {/* 数据流线条 */}
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const startDistance = 600;
            const endDistance = 100;
            const progress = (frame - DATA_START) / (DATA_END - DATA_START);
            const distance = startDistance - (startDistance - endDistance) * progress;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 2,
                  height: 40,
                  background: 'linear-gradient(180deg, transparent, #00d4ff)',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle}rad)`,
                  opacity: 0.6,
                }}
              />
            );
          })}
        </AbsoluteFill>
      )}

      {/* 6. "看见舆情" 文字 */}
      {frame >= DATA_START + 5 && frame < MAP_END && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 300,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              color: '#fff',
              opacity: seeTextOpacity,
              textShadow: '0 0 20px rgba(0, 212, 255, 0.6)',
              fontFamily: 'sans-serif',
            }}
          >
            看见舆情
          </div>
        </AbsoluteFill>
      )}

      {/* 7. 3D 地图（使用实际截图）*/}
      {frame >= MAP_START && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 800,
              height: 600,
              opacity: mapOpacity,
              transform: `scale(${mapScale}) perspective(1000px) rotateY(${mapRotateY}deg)`,
            }}
          >
            <Img
              src={staticFile('ui/ui_drill_1_national.png')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'brightness(1.2) contrast(1.1)',
              }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* 8. 热点标记 */}
      {frame >= HOTSPOT_START && (
        <>
          {[
            { x: 400, y: 300 },
            { x: 600, y: 400 },
            { x: 800, y: 350 },
            { x: 500, y: 500 },
            { x: 700, y: 250 },
          ].map((pos, i) => {
            const delay = i * 3;
            const show = frame >= HOTSPOT_START + delay;
            const progress = Math.min(1, (frame - HOTSPOT_START - delay) / 10);
            
            if (!show) return null;
            
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y,
                  width: 20,
                  height: 20,
                  background: '#ff3366',
                  borderRadius: '50%',
                  opacity: progress,
                  transform: `scale(${progress})`,
                  boxShadow: '0 0 20px rgba(255, 51, 102, 0.8)',
                }}
              />
            );
          })}
        </>
      )}
    </AbsoluteFill>
  );
};
