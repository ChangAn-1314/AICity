import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useVideoTexture, Html } from '@react-three/drei';
import { interpolate, useCurrentFrame, useVideoConfig, spring, Easing } from 'remotion';
import { Group, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { staticFile } from 'remotion';

// Preload the model
useGLTF.preload(staticFile('/models/imac/scene.gltf'));

export const IMac: React.FC = () => {
  const group = useRef<Group>(null);
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Load Model
  const { scene } = useGLTF(staticFile('/models/imac/scene.gltf'));
  
  // Clone scene to avoid side effects if used multiple times (though here it's singular)
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // --- Animation Logic ---
  const entrance = spring({
    frame,
    fps,
    config: { damping: 200, mass: 2 },
    from: -10,
    to: 0,
    durationInFrames: 60,
  });

  // Intro Rotation: Start from side (approx 50 deg) and rotate to front (0 deg)
  // After Intro (240f), subtle wobble
  const introRot = interpolate(
      frame,
      [0, 240],
      [Math.PI / 3, 0], 
      { extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) }
  );
  
  const idleRot = interpolate(
      frame,
      [240, durationInFrames],
      [0, 0.1], // Subtle drift
      { extrapolateLeft: 'clamp' }
  );

  const rotationY = frame < 240 ? introRot : idleRot;

  const hoverY = Math.sin(frame / 60) * 0.1;
  
  // Multiple Click/Interaction Events
  // 300: Login Click
  // 550: Map Fly-to Start
  // 1100: Interaction
  // 1600: Analytics Switch
  const clicks = [300, 550, 1100, 1600];
  let pulse = 1;
  
  for (const clickFrame of clicks) {
      const p = interpolate(
          frame,
          [clickFrame, clickFrame + 5, clickFrame + 10],
          [1, 0.99, 1], // Subtle shrink and bounce
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
      if (p !== 1) pulse = p;
  }

  useFrame(() => {
    if (group.current) {
      group.current.position.y = entrance + hoverY - 1;
      group.current.rotation.y = rotationY;
      group.current.scale.setScalar(1.5 * pulse);
    }
  });

  // --- Video Texture & Material Setup ---
  // [Option A] Load the video texture from the public folder
  // const videoTexture = useVideoTexture(staticFile('/videos/screen.mp4'));
  // videoTexture.flipY = false;

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof Mesh) {
        // Apply shadows
        child.castShadow = true;
        child.receiveShadow = true;

        // Find Screen Mesh
        if (child.name === 'Screen_Screen_0' || child.name.includes('Screen_Screen')) {
          // [Option A] Apply Video Texture
          // child.material = new MeshStandardMaterial({
          //   map: videoTexture,
          //   roughness: 0.2,
          //   metalness: 0.1,
          //   emissive: 0xffffff,
          //   emissiveIntensity: 0.1
          // });
          
          // [Option B] Fallback / Live Preview Support
          // Keep original material or set to black for Iframe overlay
          child.material = new MeshStandardMaterial({
             color: '#000000',
             roughness: 0.2,
             metalness: 0.8
          });
        }
      }
    });
  }, [clonedScene]); // Removed videoTexture dependency

  return (
    <group ref={group} dispose={null}>
       {/* 
         Orientation Fix: Rotate -90 deg on Y to face Z axis.
         Scale Fix: 15 seems to be a good size for the scene.
       */}
       <group rotation={[0, -Math.PI / 2, 0]} scale={15}> 
          <primitive object={clonedScene} />
          
          {/* 
            Attach HTML to the screen. 
            Adjust values relative to the rotated/scaled model.
          */}
          <Html 
             transform 
             occlude 
             // Position relative to the model's local space
             // Since model is rotated -90Y, X becomes Z, Z becomes -X?
             // Let's trial and error or calculate:
             // Original: [0, 3.1, 0.1]
             position={[0.02, 0.31, 0.0]} 
             rotation={[0, Math.PI / 2, 0]} 
             scale={0.03} 
             style={{
               width: '1280px',
               height: '720px',
               backgroundColor: 'black',
             }}
           >
             <iframe 
               title="AICity Preview"
               src="http://localhost:5173" 
               style={{ 
                 width: '100%', 
                 height: '100%', 
                 border: 'none',
                 borderRadius: '10px'
               }} 
             />
           </Html>
       </group>
    </group>
  );
};
