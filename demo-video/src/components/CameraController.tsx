import React, { useRef } from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CameraController: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Screen dimensions for reference (40 x 22.5 units)
  const SCREEN_W = 40;
  const SCREEN_H = 22.5;

  // =============================================================================
  // Scene 1: Intro (0-8s) [0-240]
  // Dramatic entrance: Start from bottom-right corner, sweep up diagonally
  // =============================================================================
  const scene1Z = interpolate(frame, [0, 240], [80, 45], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1), // Smooth deceleration
  });
  const scene1X = interpolate(frame, [0, 240], [15, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const scene1Y = interpolate(frame, [0, 240], [-12, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  // Slight rotation during intro
  const scene1RotY = interpolate(frame, [0, 240], [-0.15, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  });
  
  // =============================================================================
  // Scene 2: Entry (8-18s) [240-540]
  // Logic moved directly to Master Switch for better control of "Walking" effect
  // =============================================================================

  // =============================================================================
  // Scene 3: Global View (18-35s) [540-1050]
  // Epic orbit: Spiral around + altitude change (helicopter shot)
  // =============================================================================
  const scene3Progress = interpolate(frame, [540, 1050], [0, 1], { 
    extrapolateLeft: 'clamp', 
    extrapolateRight: 'clamp' 
  });
  const scene3Angle = scene3Progress * Math.PI * 0.6; // More rotation (108 degrees)
  const scene3Radius = interpolate(scene3Progress, [0, 1], [50, 35]);
  const scene3X = Math.sin(scene3Angle) * scene3Radius;
  const scene3Z = Math.cos(scene3Angle) * scene3Radius;
  const scene3Y = interpolate(frame, [540, 800, 1050], [5, 15, 3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });

  // =============================================================================
  // Scene 4: Interaction (35-50s) [1050-1500]
  // Immersive close-up: Dive INTO the screen, focus on right panel (AI分析)
  // =============================================================================
  const scene4X = interpolate(frame, [1050, 1200, 1500], [0, 10, 8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });
  const scene4Y = interpolate(frame, [1050, 1300, 1500], [0, -3, 2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scene4Z = interpolate(frame, [1050, 1500], [35, 18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  // Dutch angle for dramatic effect
  const scene4RotZ = interpolate(frame, [1050, 1250, 1500], [0, 0.05, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // =============================================================================
  // Scene 5: Simulation (50-65s) [1500-1950]
  // Professional Scan: Steady Pan + Slow Dolly In (No wavy motion)
  // =============================================================================
  const scene5X = interpolate(frame, [1500, 1950], [-10, 10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease), // Smoother ease
  });
  
  // Steady height, slightly looking down
  const scene5Y = 0; 
  
  // Slow push in for immersion
  const scene5Z = interpolate(frame, [1500, 1950], [40, 30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  });

  // =============================================================================
  // Scene 6: AI 3D Gen (65-75s) [1950-2250]
  // 3-Stage Reveal: Input -> Process -> 3D Result
  // =============================================================================
  const scene6Cut1 = frame >= 1950 && frame < 2050; // Input phase
  const scene6Cut2 = frame >= 2050 && frame < 2150; // Processing phase
  const scene6Cut3 = frame >= 2150 && frame < 2250; // Result phase
  
  let scene6X = 0, scene6Y = 0, scene6Z = 38;
  let scene6TargetX = 0, scene6TargetY = 0, scene6TargetZ = 0;

  if (scene6Cut1) {
    // 1. Focus on Input (Top Center)
    scene6X = 0;
    scene6Y = 8; // Look at top of screen
    scene6Z = 25; // Closer
    scene6TargetY = 5;
  } else if (scene6Cut2) {
    // 2. Processing (Side Angle Orbit)
    // Rotate around to show "activity"
    const angle = interpolate(frame, [2050, 2150], [0.3, 0.8]);
    const radius = 35;
    scene6X = Math.sin(angle) * radius;
    scene6Z = Math.cos(angle) * radius;
    scene6Y = 0;
  } else if (scene6Cut3) {
    // 3. 3D Result (Low Angle "Hero" Shot)
    // Emphasize the "3D" nature of the result
    scene6X = interpolate(frame, [2150, 2250], [12, 10]);
    scene6Y = interpolate(frame, [2150, 2250], [-8, -6]);
    scene6Z = interpolate(frame, [2150, 2250], [18, 15]);
    // Look slightly up at the content
    scene6TargetY = 2;
  }

  // =============================================================================
  // Scene 7: Outro (75-80s) [2250-2400]
  // Cinematic pullback: Spiral out while rising
  // =============================================================================
  const scene7Progress = interpolate(frame, [2250, 2400], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scene7Angle = scene7Progress * Math.PI * 0.5;
  const scene7Z = interpolate(frame, [2250, 2400], [40, 120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.exp),
  });
  const scene7X = Math.sin(scene7Angle) * 20 * scene7Progress;
  const scene7Y = interpolate(frame, [2250, 2400], [0, 15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  });

  // =============================================================================
  // Master Scene Switching
  // =============================================================================
  let x = 0, y = 0, z = 45;
  let targetX = 0, targetY = 0, targetZ = 0;
  let roll = 0; // Dutch angle

  if (frame < 240) {
    // Scene 1: Intro - Dramatic sweep
    x = scene1X;
    y = scene1Y;
    z = scene1Z;
    // Look slightly up and center
    targetY = 2; 
  } else if (frame < 540) {
    // Scene 2: "Walking on Screen" (Left Panel)
    // Add Parallax: Drift X slightly from -14 to -10 while moving up
    // Start way below (-18) and walk up to (8)
    x = interpolate(frame, [240, 540], [-14, -10], { easing: Easing.inOut(Easing.ease) });
    y = interpolate(frame, [240, 540], [-18, 8], { easing: Easing.inOut(Easing.ease) });
    // Very close to surface ("Standing" height)
    z = interpolate(frame, [240, 540], [5, 8], { easing: Easing.inOut(Easing.ease) });
    
    // Look Straight Ahead (Forward along Y axis)
    // Target X matches Camera X to keep forward view
    targetX = x;
    targetY = 50; 
    targetZ = 0;
  } else if (frame < 1050) {
    // Scene 3: Epic orbit
    x = scene3X;
    y = scene3Y;
    z = scene3Z;
    // Look at center
  } else if (frame < 1500) {
    // Scene 4: Immersive close-up
    x = scene4X;
    y = scene4Y;
    z = scene4Z;
    roll = scene4RotZ;
    // Look at right panel focus area
    targetX = 8;
    targetY = 0;
  } else if (frame < 1950) {
    // Scene 5: Panoramic sweep
    x = scene5X;
    y = scene5Y;
    z = scene5Z;
  } else if (frame < 2250) {
    // Scene 6: Quick cuts
    x = scene6X;
    y = scene6Y;
    z = scene6Z;
    targetX = scene6TargetX;
    targetY = scene6TargetY;
    targetZ = scene6TargetZ;
  } else {
    // Scene 7: Cinematic pullback
    x = scene7X;
    y = scene7Y;
    z = scene7Z;
  }

  // Apply camera rotation via lookAt
  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(targetX, targetY, targetZ);
      
      // Apply roll (Dutch angle) if needed
      if (roll !== 0) {
        cameraRef.current.rotation.z = roll;
      }
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
