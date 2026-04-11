import React, {Suspense} from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  Easing,
  staticFile,
} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import {useTexture} from "@react-three/drei";
import {COLORS, FONTS} from "../config";
import {MovingCamera} from "../components/MovingCamera";
import {StudioLights} from "../components/StudioLights";
import {VideoScreen} from "../components/VideoScreen";

const LogoPlane: React.FC<{
  opacity: number;
  scale: number;
  position: [number, number, number];
}> = ({opacity, scale, position}) => {
  const texture = useTexture(staticFile("video/logonew.png"));
  return (
    <mesh position={position} scale={[scale, scale, scale]}>
      <planeGeometry args={[2.2, 2.2]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        toneMapped={false}
      />
    </mesh>
  );
};

export const Scene6Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const videoScale = interpolate(
    frame, [0, 140], [6.5, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );
  const videoZ = interpolate(
    frame, [0, 140], [5.5, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );
  const videoX = interpolate(
    frame, [0, 140], [2.0, -2.8],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );
  const videoRotY = interpolate(
    frame, [0, 140], [-Math.PI * 0.55, 0.2],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );

  const logoOpacity = interpolate(
    frame, [120, 155], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  const logoScale = interpolate(
    frame, [120, 160], [1.4, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );

  const titleOpacity = interpolate(
    frame, [145, 175], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  const titleY = interpolate(
    frame, [145, 175], [18, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.out(Easing.ease)},
  );

  const subtitleOpacity = interpolate(
    frame, [170, 200], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  const competitionOpacity = interpolate(
    frame, [200, 225], [0, 0.55],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <ThreeCanvas
        width={width}
        height={height}
        style={{position: "absolute"}}
      >
        <MovingCamera position={[0, 0, 10]} lookAt={[0, 0, 0]} fov={50} />
        <StudioLights />

        <group
          position={[videoX, 0, videoZ]}
          rotation={[0, videoRotY, 0]}
          scale={[videoScale, videoScale, videoScale]}
        >
          <VideoScreen
            src="video/全国视图 旋转画面 （舆情气泡 连接线 全国轮廓）.mp4"
            position={[0, 0, 0]}
            width={9}
            height={6}
            showReflection={false}
            showShell
            shellDepth={0.12}
            shellRadius={0.18}
          />
        </group>

        <Suspense fallback={null}>
          <LogoPlane
            opacity={logoOpacity}
            scale={logoScale}
            position={[3.2, 1.2, 0]}
          />
        </Suspense>
      </ThreeCanvas>

      <div
        style={{
          position: "absolute",
          right: "6%",
          bottom: "28%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 18,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.title,
            fontSize: 64,
            fontWeight: 600,
            color: COLORS.textPrimary,
            letterSpacing: "0.14em",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            lineHeight: 1,
          }}
        >
          智舆
        </div>

        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 22,
            fontWeight: 400,
            color: COLORS.textSecondary,
            letterSpacing: "0.2em",
            opacity: subtitleOpacity,
          }}
        >
          让城市治理更智慧
        </div>

        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 17,
            fontWeight: 400,
            color: COLORS.textMuted,
            letterSpacing: "0.18em",
            opacity: competitionOpacity,
          }}
        >
          2025 讯飞杯
        </div>
      </div>
    </AbsoluteFill>
  );
};
