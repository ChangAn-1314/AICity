import React, {useMemo} from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Easing,
} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import * as THREE from "three";
import {COLORS, FONTS, VIDEO} from "../config";
import {TypewriterText} from "../components/TypewriterText";

const PARTICLE_COUNT = 3000;

const citylineY = (x: number): number => {
  const buildings = [
    {center: -0.6, width: 0.08, height: 0.7},
    {center: -0.45, width: 0.12, height: 0.5},
    {center: -0.3, width: 0.06, height: 0.9},
    {center: -0.15, width: 0.1, height: 0.6},
    {center: 0, width: 0.05, height: 1.0},
    {center: 0.12, width: 0.14, height: 0.55},
    {center: 0.25, width: 0.07, height: 0.8},
    {center: 0.4, width: 0.1, height: 0.45},
    {center: 0.55, width: 0.08, height: 0.65},
    {center: 0.7, width: 0.06, height: 0.75},
  ];
  let maxH = 0.1;
  for (const b of buildings) {
    if (Math.abs(x - b.center) < b.width / 2) {
      maxH = Math.max(maxH, b.height);
    }
  }
  return maxH;
};

const ParticleField: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 2;
      const maxY = citylineY(x);
      const y = Math.random() * maxY - 0.2;
      const z = (Math.random() - 0.5) * 0.5;
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  const scatterProgress = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const animatedPositions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const tx = positions[i * 3];
      const ty = positions[i * 3 + 1];
      const tz = positions[i * 3 + 2];
      arr[i * 3] = tx * scatterProgress;
      arr[i * 3 + 1] = ty * scatterProgress;
      arr[i * 3 + 2] = tz * scatterProgress;
    }
    return arr;
  }, [positions, scatterProgress]);

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cameraZ = interpolate(frame, [0, 240], [3, 2.2], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <ThreeCanvas width={VIDEO.WIDTH} height={VIDEO.HEIGHT}>
      <ambientLight intensity={0.3} />
      <perspectiveCamera
        position={[0, 0.2, cameraZ]}
        fov={50}
      />
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={animatedPositions}
            count={PARTICLE_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={COLORS.cyan}
          size={0.008}
          transparent
          opacity={opacity}
          sizeAttenuation
        />
      </points>
    </ThreeCanvas>
  );
};

export const Scene1Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const subtitleStart = 60;

  const fadeOutOpacity = interpolate(frame, [180, 225], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <div style={{position: "absolute", inset: 0, opacity: fadeOutOpacity}}>
        <ParticleField />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "25%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: fadeOutOpacity,
        }}
      >
        <TypewriterText
          text="每一座城市  都有自己的声音"
          startFrame={subtitleStart}
          speed={4}
          fontSize={52}
          color={COLORS.textPrimary}
          fontWeight="700"
          cursor={false}
        />
      </div>
    </AbsoluteFill>
  );
};
