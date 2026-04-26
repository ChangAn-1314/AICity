import React, {Suspense, useEffect} from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  Easing,
  staticFile,
} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import {useTexture, Html} from "@react-three/drei";
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
  const logoAspect = 3130 / 3675;
  const planeHeight = 2.2;
  const planeWidth = planeHeight * logoAspect;

  useEffect(() => {
    texture.premultiplyAlpha = true;
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <mesh position={position} scale={[scale, scale, scale]}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        toneMapped={false}
        alphaTest={0.1}
      />
    </mesh>
  );
};

const LogoTextPanel: React.FC<{
  titleOpacity: number;
  subtitleOpacity: number;
  competitionOpacity: number;
  logoPos: [number, number, number];
}> = ({titleOpacity, subtitleOpacity, competitionOpacity, logoPos}) => {
  const planeHeight = 2.2;
  const offsetY = planeHeight / 2 + 1.3;

  return (
    <Html
      position={[logoPos[0], logoPos[1] - offsetY, logoPos[2]]}
      center
      transform
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.title,
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: "0.16em",
            opacity: titleOpacity,
            lineHeight: 1,
            textShadow: "0 0 40px rgba(255,255,255,0.12)",
          }}
        >
          智舆
        </div>

        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 12,
            fontWeight: 400,
            color: COLORS.textSecondary,
            letterSpacing: "0.2em",
            opacity: subtitleOpacity,
          }}
        >
          让舆情监测更智慧
        </div>

        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 10,
            fontWeight: 400,
            color: COLORS.textMuted,
            letterSpacing: "0.18em",
            opacity: competitionOpacity,
          }}
        >
          2026 挑战杯
        </div>
      </div>
    </Html>
  );
};

export const Scene6Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const blurAmount = interpolate(
    frame,
    [0, 120],
    [20, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.25, 1, 0.5, 1)},
  );

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
    frame, [0, 140], [2.0, -2.2],
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

  const logoX = 4.8;
  const logoY = 1.0;

  const titleOpacity = interpolate(
    frame, [160, 190], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  const subtitleOpacity = interpolate(
    frame, [190, 215], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  const competitionOpacity = interpolate(
    frame, [215, 235], [0, 0.55],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg
        width={0}
        height={0}
        style={{position: "absolute"}}
      >
        <filter id="scene6-gaussian">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blurAmount} />
        </filter>
      </svg>

      <ThreeCanvas
        width={width}
        height={height}
        style={{position: "absolute", filter: "url(#scene6-gaussian)"}}
      >
        <MovingCamera position={[0, 0, 10]} lookAt={[0, 0, 0]} fov={50} />
        <StudioLights />

        <group
          position={[videoX, 0, videoZ]}
          rotation={[0, videoRotY, 0]}
          scale={[videoScale, videoScale, videoScale]}
        >
          <VideoScreen
            src="video/全国视图 旋转画面  结尾.mp4"
            position={[0, 0, 0]}
            width={9}
            height={6}
            showReflection={false}
            showShell
            shellDepth={0.12}
            shellRadius={0.18}
            startFrom={90}
          />
        </group>

        <Suspense fallback={null}>
          <LogoPlane
            opacity={logoOpacity}
            scale={logoScale}
            position={[logoX, logoY, 0]}
          />
        </Suspense>

        <LogoTextPanel
          titleOpacity={titleOpacity}
          subtitleOpacity={subtitleOpacity}
          competitionOpacity={competitionOpacity}
          logoPos={[logoX, logoY, 0]}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
