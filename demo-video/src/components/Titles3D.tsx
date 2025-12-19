import React from 'react';
import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { Html, Float } from '@react-three/drei';

const SCENES = [
  { 
    start: 0, 
    end: 240, 
    title: '数智讯飞杯 2025', 
    subtitle: '重新定义城市管理',
    position: [5, 2, 40],
    rotation: [0, -0.1, 0],
    color: '#1d1d1f'
  },
  { 
    start: 240, 
    end: 540, 
    title: '极速响应，无缝衔接', 
    subtitle: '一键接入数字孪生世界',
    position: [-12, -8, 3],
    rotation: [0.3, 0, 0],
    color: '#1d1d1f'
  },
  { 
    start: 540, 
    end: 1050, 
    title: 'AMap 3D 引擎驱动', 
    subtitle: '从宏观到微观，尽在掌握',
    position: [0, 10, 5],
    rotation: [0, 0, 0],
    color: '#1d1d1f'
  },
  { 
    start: 1050, 
    end: 1500, 
    title: '实时感知，精准决策', 
    subtitle: '每一寸土地，皆有数据脉动',
    position: [8, 2, 12],
    rotation: [0, -0.2, 0],
    color: '#1d1d1f'
  },
  { 
    start: 1500, 
    end: 1950, 
    title: '趋势预测，沙盘推演', 
    subtitle: '洞察趋势，预见未来',
    position: [0, 2, 25],
    rotation: [0, 0, 0],
    color: '#1d1d1f'
  },
  { 
    start: 1950, 
    end: 2250, 
    title: 'AI 生成，还原现场', 
    subtitle: '文字即刻转化为三维视界',
    position: [0, 8, 20],
    rotation: [0, 0, 0],
    color: '#1d1d1f'
  },
  { 
    start: 2250, 
    end: 2400, 
    title: 'AI City 2025', 
    subtitle: 'Powered by Vue3 & Three.js',
    position: [0, 0, 35],
    rotation: [0, 0, 0],
    color: '#1d1d1f'
  },
];

export const Titles3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentScene = SCENES.find(s => frame >= s.start && frame < s.end);

  if (!currentScene) return null;

  // Fade in/out logic
  const opacity = interpolate(
    frame,
    [currentScene.start, currentScene.start + 30, currentScene.end - 30, currentScene.end],
    [0, 1, 1, 0]
  );

  return (
    <group position={currentScene.position as [number, number, number]} rotation={currentScene.rotation as [number, number, number]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Html
          transform
          style={{
            opacity,
            transition: 'opacity 0.5s',
            pointerEvents: 'none',
            userSelect: 'none',
            textAlign: 'center',
            width: '800px', // Fixed width to center text properly
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translate(-50%, -50%)', // Center the HTML element on the group position
            background: 'transparent', // Explicitly transparency
          }}
        >
          {/* Title */}
          <h1 style={{
            margin: 0,
            fontSize: '60px', // Scaled for 3D view
            fontWeight: 700,
            color: currentScene.color,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            textShadow: '0 4px 12px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap'
          }}>
            {currentScene.title}
          </h1>
          
          {/* Subtitle */}
          <h2 style={{
            margin: '10px 0 0 0',
            fontSize: '30px',
            fontWeight: 400,
            color: '#555555',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            textShadow: '0 2px 8px rgba(0,0,0,0.05)',
            whiteSpace: 'nowrap'
          }}>
            {currentScene.subtitle}
          </h2>
        </Html>
      </Float>
    </group>
  );
};
