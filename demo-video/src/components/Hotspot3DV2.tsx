import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { Html, Billboard, Line } from '@react-three/drei';
import * as THREE from 'three';

export const Hotspot3DV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Visible during Analysis (1200-1500)
  const startFrame = 1200;
  const endFrame = 1500;
  
  if (frame < startFrame || frame > endFrame) return null;

  const scale = spring({
    frame: frame - startFrame - 30,
    fps,
    config: { damping: 15, stiffness: 120 },
    from: 0,
    to: 1,
  });

  const floatY = Math.sin(frame / 20) * 0.5;

  // Analysis panel is on the right side of the screen
  // Screen Z=0.02.
  const targetPos = new THREE.Vector3(12, 0, 0.05); // Pointing to right panel
  const cardPos = new THREE.Vector3(18, 5, 5); // Floating top-right relative to camera

  const points = [targetPos, new THREE.Vector3(cardPos.x, cardPos.y + floatY, cardPos.z)];

  return (
    <group>
      <Line
        points={points}
        color="#00ffff"
        lineWidth={2}
        transparent
        opacity={0.6}
      />

      <Billboard
        position={[cardPos.x, cardPos.y + floatY, cardPos.z]}
        follow={true}
        lockX={false} lockY={false} lockZ={false}
      >
        <group scale={scale}>
          <Html
            transform
            style={{
              width: '320px',
              backgroundColor: 'rgba(0, 26, 51, 0.85)',
              border: '2px solid #00ffff',
              padding: '20px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              color: 'white',
              pointerEvents: 'none',
              userSelect: 'none',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 25px rgba(0, 255, 255, 0.25)',
              borderRadius: '12px'
            }}
          >
            <div style={{ 
              color: '#00ffff', fontSize: '24px', fontWeight: 'bold',
              borderBottom: '1px solid rgba(0, 255, 255, 0.3)', paddingBottom: '10px'
            }}>
              智能研判分析
            </div>
            
            <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#e0e0e0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>情感倾向:</span>
                <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>负面 (82%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>关键实体:</span>
                <span style={{ fontFamily: 'monospace' }}>车辆碰撞, 拥堵</span>
              </div>
              <div style={{ marginTop: '10px' }}>
                <span style={{ display: 'block', marginBottom: '5px', fontSize: '12px', opacity: 0.8 }}>实时热度趋势:</span>
                <div style={{ 
                  height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)',
                  position: 'relative', overflow: 'hidden', borderRadius: '2px'
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, height: '100%', width: '75%',
                    background: 'linear-gradient(90deg, #00ffff, #ff00ff)',
                    boxShadow: '0 0 10px #00ffff'
                  }} />
                </div>
              </div>
            </div>
          </Html>
        </group>
      </Billboard>
      
      <mesh position={targetPos} rotation={[Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.2, 0.5, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.5 + Math.sin(frame/5)*0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
