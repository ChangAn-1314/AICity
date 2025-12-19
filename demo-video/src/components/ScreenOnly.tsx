import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVideoTexture, RoundedBox } from '@react-three/drei';
import { interpolate, useCurrentFrame, useVideoConfig, spring, Easing, staticFile } from 'remotion';
import { Group, CanvasTexture } from 'three';

// Configuration: Set to true when screen.mp4 is available
const USE_VIDEO_TEXTURE = false;

// Sub-component to safely use the useVideoTexture hook
const VideoScreenMaterial: React.FC<{ src: string }> = ({ src }) => {
  const videoTexture = useVideoTexture(src);
  return <meshBasicMaterial map={videoTexture} />;
};

export const ScreenOnly: React.FC = () => {
  const group = useRef<Group>(null);
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  
  // Placeholder gradient texture
  const placeholderTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d')!;
    
    // Light gradient background (Apple-style)
    const gradient = ctx.createLinearGradient(0, 0, 1920, 1080);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.5, '#f5f5f7');
    gradient.addColorStop(1, '#e5e5e5');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1920, 1080);
    
    // Grid lines - subtle grey
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 1920; i += 60) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 1080);
      ctx.stroke();
    }
    for (let i = 0; i < 1080; i += 60) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(1920, i);
      ctx.stroke();
    }
    
    // Center text - dark grey
    ctx.fillStyle = '#1d1d1f';
    const fontStack = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.font = `bold 72px ${fontStack}`;
    ctx.textAlign = 'center';
    ctx.fillText('AICity', 960, 480);
    ctx.font = `36px ${fontStack}`;
    ctx.fillStyle = '#86868b';
    ctx.fillText('screen.mp4', 960, 550);
    ctx.font = `24px ${fontStack}`;
    ctx.fillText('Place your screen recording in public/videos/', 960, 620);
    
    return new CanvasTexture(canvas);
  }, []);

  // --- Animation Logic (Identical to IMac.tsx for consistency) ---
  const entrance = spring({
    frame,
    fps,
    config: { damping: 200, mass: 2 },
    from: -5,
    to: 0,
    durationInFrames: 30,
  });

  // Intro Rotation: Start from slight angle and rotate to front
  const introRot = interpolate(
      frame,
      [0, 240],
      [Math.PI / 8, 0], 
      { extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) }
  );
  
  const idleRot = interpolate(
      frame,
      [240, durationInFrames],
      [0, 0.1], 
      { extrapolateLeft: 'clamp' }
  );

  const rotationY = frame < 240 ? introRot : idleRot;
  const hoverY = Math.sin(frame / 60) * 0.3; // Increased from 0.1 to 0.3
  
  // Click/Bounce Events
  const clicks = [300, 550, 1100, 1600];
  let pulse = 1;
  for (const clickFrame of clicks) {
      const p = interpolate(
          frame,
          [clickFrame, clickFrame + 5, clickFrame + 10],
          [1, 0.99, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
      if (p !== 1) pulse = p;
  }

  useFrame(() => {
    if (group.current) {
      group.current.position.y = entrance + hoverY; 
      group.current.rotation.y = rotationY;
      // Pulse animation affects the scale slightly
      group.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={group} dispose={null}>
        {/* 
          Screen Plane 
          Aspect Ratio 16:9. 
          Target Width: 40 units (to fill camera view)
          Target Height: 22.5 units
          HTML Content: 1280px x 720px
          Scale Factor: 40 / 1280 = 0.03125
        */}
        {/* Screen with texture */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[40, 22.5]} />
          {USE_VIDEO_TEXTURE ? (
            <VideoScreenMaterial src={staticFile('/videos/screen.mp4')} />
          ) : (
            <meshBasicMaterial map={placeholderTexture} />
          )}
        </mesh>
        
        {/* Black Bezel Background (slightly larger than screen) */}
        <mesh position={[0, 0, 0.01]}>
           <planeGeometry args={[40.5, 23]} />
           <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Metallic Body with Rounded Corners */}
        <RoundedBox args={[41, 23.5, 0.5]} radius={1} smoothness={4} position={[0, 0, -0.25]}>
           <meshStandardMaterial color="#e0e0e0" roughness={0.2} metalness={0.9} />
        </RoundedBox>
    </group>
  );
};
