import React, { useRef } from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CameraControllerV2: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Screen dimensions: 40 (width) x 22.5 (height)
  // Center is (0,0,0)

  // =============================================================================
  // 1. Intro (0-8s) [0-240]
  // Dolly In: Far -> Mid
  // =============================================================================
  const introZ = interpolate(frame, [0, 240], [80, 45], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const introY = interpolate(frame, [0, 240], [-10, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // =============================================================================
  // 2. UI/UX (8-15s) [240-450]
  // Truck: Follow mouse features (General exploration)
  // =============================================================================
  const uiX = interpolate(frame, [240, 450], [-10, 10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });
  const uiZ = interpolate(frame, [240, 450], [40, 35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // =============================================================================
  // 3. 3D Map (15-30s) [450-900]
  // Orbit + Zoom: Spiral dive
  // =============================================================================
  const mapProgress = interpolate(frame, [450, 900], [0, 1], { extrapolateRight: 'clamp' });
  const mapAngle = mapProgress * Math.PI * 2; // Full rotation
  const mapRadius = interpolate(mapProgress, [0, 1], [40, 20]); // Spiral in
  const mapX = Math.sin(mapAngle) * mapRadius;
  const mapZ = Math.cos(mapAngle) * mapRadius;
  const mapY = interpolate(frame, [450, 900], [10, 0], { extrapolateRight: 'clamp' });

  // =============================================================================
  // 4. Monitor (30-40s) [900-1200]
  // Focus Left Panel
  // =============================================================================
  const monitorX = interpolate(frame, [900, 1200], [-12, -12], { extrapolateRight: 'clamp' });
  const monitorY = interpolate(frame, [900, 1200], [0, 0], { extrapolateRight: 'clamp' });
  const monitorZ = interpolate(frame, [900, 1200], [25, 20], { 
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease) 
  });
  // Slight tilt to look at left
  const monitorTargetX = -12;

  // =============================================================================
  // 5. Analysis (40-50s) [1200-1500]
  // Focus Right Panel
  // =============================================================================
  // Transition from Left to Right
  const analysisX = interpolate(frame, [1200, 1500], [12, 12], { extrapolateRight: 'clamp' });
  const analysisZ = interpolate(frame, [1200, 1500], [25, 18], { 
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease)
  });
  const analysisTargetX = 12;

  // =============================================================================
  // 6. Scene Gen (50-65s) [1500-1950]
  // Orbit around center (3D model)
  // =============================================================================
  const sceneGenProgress = interpolate(frame, [1500, 1950], [0, 1], { extrapolateRight: 'clamp' });
  const sceneGenAngle = sceneGenProgress * Math.PI; // Half rotation
  const sceneGenRadius = 30;
  const sceneGenX = Math.sin(sceneGenAngle) * sceneGenRadius;
  const sceneGenZ = Math.cos(sceneGenAngle) * sceneGenRadius;
  const sceneGenY = interpolate(frame, [1500, 1700, 1950], [5, 10, 5]);

  // =============================================================================
  // 7. Prediction (65-75s) [1950-2250]
  // Focus Bottom (Trend)
  // =============================================================================
  const predX = 0;
  const predY = interpolate(frame, [1950, 2250], [-8, -8], { extrapolateRight: 'clamp' });
  const predZ = interpolate(frame, [1950, 2250], [30, 25], { extrapolateRight: 'clamp' });
  const predTargetY = -8;

  // =============================================================================
  // 8. Simulation (75-90s) [2250-2700]
  // Slight push in to Center/Right
  // =============================================================================
  const simX = interpolate(frame, [2250, 2700], [5, 8], { extrapolateRight: 'clamp' });
  const simY = 0;
  const simZ = interpolate(frame, [2250, 2700], [35, 25], { extrapolateRight: 'clamp' });
  const simTargetX = 5;

  // =============================================================================
  // 9. Report (90-98s) [2700-2940]
  // Static / Overview
  // =============================================================================
  const reportX = 0;
  const reportY = 0;
  const reportZ = 40;

  // =============================================================================
  // 10. Admin (98-105s) [2940-3150]
  // Quick Pans
  // =============================================================================
  const adminX = interpolate(frame, [2940, 3150], [-15, 15], { easing: Easing.inOut(Easing.ease) });
  const adminY = 0;
  const adminZ = 35;

  // =============================================================================
  // 11. Voice (105-115s) [3150-3450]
  // Focus Bottom Right
  // =============================================================================
  const voiceX = 15;
  const voiceY = -10;
  const voiceZ = 20;
  const voiceTargetX = 15;
  const voiceTargetY = -10;

  // =============================================================================
  // 12. Outro (115-130s) [3450-3900]
  // Dolly Out
  // =============================================================================
  const outroZ = interpolate(frame, [3450, 3900], [40, 150], {
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.exp),
  });
  const outroY = interpolate(frame, [3450, 3900], [0, 20], { extrapolateRight: 'clamp' });


  // =============================================================================
  // Master Switch
  // =============================================================================
  let x = 0, y = 0, z = 50;
  let tx = 0, ty = 0, tz = 0;

  if (frame < 240) {
    x = 0; y = introY; z = introZ;
  } else if (frame < 450) {
    x = uiX; y = 0; z = uiZ;
  } else if (frame < 900) {
    x = mapX; y = mapY; z = mapZ;
  } else if (frame < 1200) {
    x = monitorX; y = monitorY; z = monitorZ;
    tx = monitorTargetX;
  } else if (frame < 1500) {
    x = analysisX; y = 0; z = analysisZ;
    tx = analysisTargetX;
  } else if (frame < 1950) {
    x = sceneGenX; y = sceneGenY; z = sceneGenZ;
  } else if (frame < 2250) {
    x = predX; y = predY; z = predZ;
    ty = predTargetY;
  } else if (frame < 2700) {
    x = simX; y = simY; z = simZ;
    tx = simTargetX;
  } else if (frame < 2940) {
    x = reportX; y = reportY; z = reportZ;
  } else if (frame < 3150) {
    x = adminX; y = adminY; z = adminZ;
  } else if (frame < 3450) {
    x = voiceX; y = voiceY; z = voiceZ;
    tx = voiceTargetX; ty = voiceTargetY;
  } else {
    x = 0; y = outroY; z = outroZ;
  }

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(tx, ty, tz);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[x, y, z]}
      fov={35}
    />
  );
};
