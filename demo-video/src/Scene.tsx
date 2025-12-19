import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { ScreenOnly } from './components/ScreenOnly';
import { Sparkles } from '@react-three/drei';
import { CameraController } from './components/CameraController';
import { Titles3D } from './components/Titles3D';
import { Hotspot3D } from './components/Hotspot3D';
import React, { Suspense } from 'react';

export const MainScene: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#f5f5f7' }}>
      <ThreeCanvas width={width} height={height}>
        <Suspense fallback={null}>
          <CameraController />
          
          {/* Manual Lighting Setup for Premium Look */}
          <ambientLight intensity={0.8} />
          
          {/* Key Light: Soft cool light from top-right */}
          <spotLight 
            position={[30, 40, 30]} 
            intensity={1.5} 
            angle={0.5} 
            penumbra={1} 
            color="#ffffff" 
            castShadow
          />
          
          {/* Fill Light: Warm light from left to soften shadows */}
          <pointLight position={[-20, 0, 20]} intensity={0.8} color="#fff8e1" />
          
          {/* Rim Light: Bright back light to highlight edges */}
          <spotLight 
            position={[0, 30, -20]} 
            intensity={3} 
            color="#ffffff" 
            angle={0.6} 
            penumbra={0.5}
          />
          
          {/* Bottom Light: To illuminate the bottom edge during the fly-over */}
          <pointLight position={[0, -20, 10]} intensity={1.5} color="#e3f2fd" />

          {/* Sparkles for atmosphere - Subtle dark/grey particles for light background */}
          <Sparkles count={80} scale={60} size={2} speed={0.3} opacity={0.4} color="#94a3b8" />

          <ScreenOnly />
          <Titles3D />
          <Hotspot3D />
        </Suspense>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
