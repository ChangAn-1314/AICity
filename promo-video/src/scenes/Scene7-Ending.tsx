import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  Img,
  staticFile,
  Easing,
} from "remotion";
import {Video} from "@remotion/media";
import {ThreeCanvas} from "@remotion/three";
import {COLORS, FONTS} from "../config";

const TAGS = ["实时监测", "深度分析", "智能决策"];

export const Scene7Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const bgVideoOpacity = interpolate(
    frame,
    [0, 30],
    [0, 0.3],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const cameraZ = interpolate(
    frame,
    [0, 210],
    [18, 6],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    }
  );

  const particleRotation = frame * 0.006;

  const logoScale = interpolate(
    frame,
    [15, 60],
    [0.3, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    }
  );

  const logoOpacity = interpolate(
    frame,
    [15, 45],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const tagOpacities = TAGS.map((_, i) =>
    interpolate(
      frame,
      [75 + i * 15, 90 + i * 15],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    )
  );

  const ctaOpacity = interpolate(
    frame,
    [135, 150],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const competitionOpacity = interpolate(
    frame,
    [165, 180],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const lineProgress = interpolate(
    frame,
    [165, 195],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const glowPulse = Math.sin(frame * 0.1) * 0.15 + 0.85;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AbsoluteFill style={{opacity: bgVideoOpacity, zIndex: 0}}>
        <Video
          src={staticFile("video/信阳视图-全国视图 缩放画面 舆情展示.mp4")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(4px) brightness(0.5)",
          }}
          muted
        />
      </AbsoluteFill>

      <ThreeCanvas
        width={width}
        height={height}
        camera={{
          position: [0, 0, cameraZ],
          fov: 65,
        }}
        style={{position: "absolute", zIndex: 1}}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 5]} intensity={0.8} color="#06b6d4" />

        <points rotation={[0, particleRotation, particleRotation * 0.5]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={800}
              array={new Float32Array(
                Array.from({length: 2400}, (_, i) => {
                  const theta = Math.random() * Math.PI * 2;
                  const phi = Math.acos(2 * Math.random() - 1);
                  const r = 8 + Math.random() * 4;
                  return [
                    r * Math.sin(phi) * Math.cos(theta),
                    r * Math.sin(phi) * Math.sin(theta),
                    r * Math.cos(phi),
                  ][i % 3];
                })
              )}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.15}
            color="#22d3ee"
            transparent
            opacity={0.5}
            sizeAttenuation
          />
        </points>

        <points rotation={[particleRotation * 0.3, 0, -particleRotation * 0.7]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={500}
              array={new Float32Array(
                Array.from({length: 1500}, (_, i) => {
                  const theta = Math.random() * Math.PI * 2;
                  const phi = Math.acos(2 * Math.random() - 1);
                  const r = 12 + Math.random() * 6;
                  return [
                    r * Math.sin(phi) * Math.cos(theta),
                    r * Math.sin(phi) * Math.sin(theta),
                    r * Math.cos(phi),
                  ][i % 3];
                })
              )}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.1}
            color="#d946ef"
            transparent
            opacity={0.3}
            sizeAttenuation
          />
        </points>
      </ThreeCanvas>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 50,
        }}
      >
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity * glowPulse,
          }}
        >
          <Img
            src={staticFile("video/logonew.png")}
            style={{
              width: 200,
              height: 200,
              objectFit: "contain",
              filter: `drop-shadow(0 0 30px ${COLORS.cyanGlow})`,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 40,
            alignItems: "center",
          }}
        >
          {TAGS.map((tag, i) => (
            <div
              key={tag}
              style={{
                fontFamily: FONTS.zh,
                fontSize: 28,
                fontWeight: "700",
                color: COLORS.textPrimary,
                opacity: tagOpacities[i],
                padding: "8px 24px",
                border: `2px solid ${COLORS.cyan}`,
                borderRadius: 24,
                boxShadow: `0 0 20px ${COLORS.cyanGlow}`,
                backdropFilter: "blur(8px)",
                background: "rgba(6, 182, 212, 0.1)",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        <div
          style={{
            fontFamily: FONTS.zh,
            fontSize: 32,
            fontWeight: "400",
            color: COLORS.textSecondary,
            opacity: ctaOpacity,
            letterSpacing: "0.1em",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          让城市治理更智慧
        </div>

        <div
          style={{
            position: "relative",
            width: 400,
            height: 2,
            backgroundColor: COLORS.border,
            opacity: competitionOpacity,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: `${lineProgress * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.purple})`,
              boxShadow: `0 0 10px ${COLORS.cyanGlow}`,
            }}
          />
        </div>

        <div
          style={{
            fontFamily: FONTS.zh,
            fontSize: 24,
            fontWeight: "400",
            color: COLORS.textMuted,
            opacity: competitionOpacity,
          }}
        >
          2025 讯飞杯
        </div>
      </div>
    </AbsoluteFill>
  );
};
