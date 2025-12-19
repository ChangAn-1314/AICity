import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { Html, Billboard, Line } from '@react-three/drei';
import * as THREE from 'three';

export const Hotspot3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Visible only in Scene 4 (1050 - 1500)
  const startFrame = 1050;
  const endFrame = 1500;
  
  if (frame < startFrame || frame > endFrame) return null;

  // Animation: Pop in
  const scale = spring({
    frame: frame - startFrame - 30, // Delay slightly to let camera settle
    fps,
    config: { damping: 15, stiffness: 120 },
    from: 0,
    to: 1,
  });

  // Floating animation
  const floatY = Math.sin(frame / 20) * 0.5;

  // Target position (Building location on the screen plane)
  // Screen is at Z=0.02. Let's pick a spot on the "Right Panel" side (X > 0)
  // We set Z to 0.05 to ensure it's slightly in front of the screen (0.02) to avoid clipping.
  const targetPos = new THREE.Vector3(8, -2, 0.05);
  const cardPos = new THREE.Vector3(14, 2, 5); // Floating above and to the right

  // Points for the connection line
  const points = [targetPos, new THREE.Vector3(cardPos.x, cardPos.y + floatY, cardPos.z)];

  return (
    <group>
      {/* Connection Line */}
      <Line
        points={points}       // Array of points
        color="#00ffff"       // Default
        lineWidth={2}         // In pixels (default)
        transparent
        opacity={0.6}
      />

      {/* Holographic Card */}
      <Billboard
        position={[cardPos.x, cardPos.y + floatY, cardPos.z]}
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <group scale={scale}>
          <Html
            transform
            style={{
              width: '300px',
              backgroundColor: 'rgba(0, 26, 51, 0.8)',
              border: '2px solid #00ffff',
              padding: '16px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              color: 'white',
              pointerEvents: 'none',
              userSelect: 'none',
              transform: 'translate(-50%, -50%)', // Center the card
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)', // Add glow
              borderRadius: '8px'
            }}
          >
            <div style={{ 
              color: '#00ffff', 
              fontSize: '24px', 
              fontWeight: 'bold',
              borderBottom: '1px solid rgba(0, 255, 255, 0.3)',
              paddingBottom: '8px',
              marginBottom: '8px'
            }}>
              AI 建筑分析
            </div>
            
            <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#e0e0e0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>建筑ID:</span>
                <span style={{ fontFamily: 'monospace' }}>BD-2025-XF</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>实时能耗:</span>
                <span style={{ color: '#00ff00' }}>452 kW/h</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>人员密度:</span>
                <span style={{ color: '#ffcc00' }}>中等</span>
              </div>
            </div>

            {/* Animated Graph Placeholder */}
            <div style={{ 
              height: '4px', 
              width: '100%', 
              background: 'rgba(255,255,255,0.1)',
              marginTop: '8px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '60%',
                background: '#00ff00',
                boxShadow: '0 0 10px #00ff00'
              }} />
            </div>
          </Html>
        </group>
      </Billboard>
      
      {/* Target Point Pulse */}
      <mesh position={targetPos} rotation={[Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.2, 0.5, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.5 + Math.sin(frame/5)*0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
