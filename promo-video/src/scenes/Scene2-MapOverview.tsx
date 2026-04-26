import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  Easing,
} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import {COLORS, FONTS} from "../config";
import {MovingCamera} from "../components/MovingCamera";
import {StudioLights} from "../components/StudioLights";
import {VideoScreen} from "../components/VideoScreen";
import {FloatingText3D} from "../components/FloatingText3D";

export const Scene2MapOverview: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const blurAmount = interpolate(
    frame,
    [0, 120],
    [16, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp",
     easing: Easing.bezier(0.25, 1, 0.5, 1)},
  );

  const cameraX = 0;
  const cameraY = interpolate(
    frame, [0, 360], [-4.5, -0.2],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraZ = 2.6;

  const lookAtX = 0;
  const lookAtY = cameraY + Math.sin(Math.PI / 3) * 2;
  const lookAtZ = -Math.cos(Math.PI / 3) * 2;

  const titleOpacity = interpolate(
    frame, [60, 90, 300, 330], [0, 0.6, 0.6, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg width={0} height={0} style={{position: "absolute"}}>
        <filter id="scene2-gaussian">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blurAmount} />
        </filter>
      </svg>
      <ThreeCanvas width={width} height={height} style={{position: "absolute", filter: "url(#scene2-gaussian)"}}>
        <MovingCamera position={[cameraX, cameraY, cameraZ]} lookAt={[lookAtX, lookAtY, lookAtZ]} fov={50} />
        <StudioLights />
        <VideoScreen
          src="video/全国视图 旋转画面 （舆情气泡 连接线 全国轮廓）.mp4"
          position={[0, 0, 0]}
          rotation={[-0.3, 0, 0]}
          width={16}
          height={9}
          showReflection
          reflectionOpacity={0.05}
          showShell
          startFrom={1.5}
        />
        <FloatingText3D
          label="全国舆情态势"
          frame={frame}
          appearFrame={40}
          disappearFrame={320}
          position={[-1.0, 0.2, 0.3]}
          rotation={[-0.3, 0, 0]}
          fontSize={0.2}
          vertical
        />
      </ThreeCanvas>

      <div style={{
        position: "absolute", bottom: 60, left: 0, right: 0,
        textAlign: "center", opacity: titleOpacity,
      }}>
        <span style={{
          fontFamily: FONTS.body, fontSize: 20, fontWeight: 400,
          color: COLORS.textSecondary, letterSpacing: "0.3em",
        }}>
        </span>
      </div>
    </AbsoluteFill>
  );
};
