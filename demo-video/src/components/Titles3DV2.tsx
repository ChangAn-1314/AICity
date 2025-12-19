import React from 'react';
import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { Html, Float } from '@react-three/drei';

const SCENES = [
  { 
    start: 0, end: 240, 
    title: '数智讯飞杯 2025', subtitle: 'AI City 智慧城市管理平台',
    position: [0, 2, 40], rotation: [0, 0, 0]
  },
  { 
    start: 240, end: 450, 
    title: '极简设计 · 沉浸体验', subtitle: '赛博朋克美学 重塑交互',
    position: [0, -5, 30], rotation: [0.2, 0, 0]
  },
  { 
    start: 450, end: 900, 
    title: 'AMap 3D 引擎', subtitle: '四级视域穿透',
    position: [0, 10, 5], rotation: [0, 0, 0]
  },
  { 
    start: 900, end: 1200, 
    title: '全网实时监测', subtitle: '秒级风险预警',
    position: [-10, 0, 20], rotation: [0, 0.3, 0]
  },
  { 
    start: 1200, end: 1500, 
    title: '星火大模型驱动', subtitle: '深度语义理解',
    position: [10, 0, 15], rotation: [0, -0.3, 0]
  },
  { 
    start: 1500, end: 1950, 
    title: 'AI 场景还原', subtitle: '文字即刻转三维',
    position: [0, 8, 25], rotation: [0, 0, 0]
  },
  { 
    start: 1950, end: 2250, 
    title: '舆情走向推演', subtitle: '预见未来',
    position: [0, -5, 20], rotation: [-0.2, 0, 0]
  },
  { 
    start: 2250, end: 2700, 
    title: '多Agent博弈', subtitle: '决策沙盘推演',
    position: [5, 5, 30], rotation: [0, -0.1, 0]
  },
  { 
    start: 2700, end: 2940, 
    title: '自动化研判报告', subtitle: '提效90%',
    position: [0, 0, 35], rotation: [0, 0, 0]
  },
  { 
    start: 2940, end: 3150, 
    title: '完善的后台管理', subtitle: '城市模型矩阵',
    position: [0, 5, 30], rotation: [0, 0, 0]
  },
  { 
    start: 3150, end: 3450, 
    title: '讯飞语音交互', subtitle: '动口不动手',
    position: [12, -8, 15], rotation: [0, -0.2, 0]
  },
  { 
    start: 3450, end: 3900, 
    title: 'AI City 2025', subtitle: '让城市管理更智慧',
    position: [0, 0, 40], rotation: [0, 0, 0]
  },
];

export const Titles3DV2: React.FC = () => {
  const frame = useCurrentFrame();
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
            width: '800px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translate(-50%, -50%)',
            background: 'transparent',
          }}
        >
          <h1 style={{
            margin: 0,
            fontSize: '60px',
            fontWeight: 700,
            color: '#1d1d1f',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            textShadow: '0 4px 12px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap'
          }}>
            {currentScene.title}
          </h1>
          
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
