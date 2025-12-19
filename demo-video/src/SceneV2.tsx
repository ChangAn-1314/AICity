import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { ScreenOnlyV2 } from './components/ScreenOnlyV2';
import { Sparkles } from '@react-three/drei';
import { CameraControllerV2 } from './components/CameraControllerV2';
import { Titles3DV2 } from './components/Titles3DV2';
import { Hotspot3DV2 } from './components/Hotspot3DV2';
import React, { Suspense } from 'react';

export const SceneV2: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#f5f5f7' }}>
      <ThreeCanvas width={width} height={height}>
        <Suspense fallback={null}>
          <CameraControllerV2 />
          
          {/* Manual Lighting Setup for Premium Look */}
          <ambientLight intensity={0.8} />
          
          <spotLight 
            position={[30, 40, 30]} 
            intensity={1.5} 
            angle={0.5} 
            penumbra={1} 
            color="#ffffff" 
            castShadow
          />
          
          <pointLight position={[-20, 0, 20]} intensity={0.8} color="#fff8e1" />
          
          <spotLight 
            position={[0, 30, -20]} 
            intensity={3} 
            color="#ffffff" 
            angle={0.6} 
            penumbra={0.5}
          />
          
          <pointLight position={[0, -20, 10]} intensity={1.5} color="#e3f2fd" />

          <Sparkles count={80} scale={60} size={2} speed={0.3} opacity={0.4} color="#94a3b8" />

          {/* Reusing ScreenOnly as it just displays the screen content */}
          <ScreenOnlyV2 />
          
          <Titles3DV2 />
          <Hotspot3DV2 />
        </Suspense>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
