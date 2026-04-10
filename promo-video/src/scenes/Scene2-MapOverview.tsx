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

export const Scene2MapOverview: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  // 150° 方向向量: cos(150°)=-0.866, sin(150°)=0.5
  const dirX = -0.866;
  const dirY = 0.5;
  const travel = interpolate(
    frame, [0, 360], [-6, 6],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );

  const cameraX = dirX * travel;
  const cameraY = interpolate(
    frame, [0, 360], [-4.0, 4.0],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraZ = 2.6;

  const lookAtX = cameraX + dirX * 1.5;
  const lookAtY = cameraY + dirY * 1.5;

  const titleOpacity = interpolate(
    frame, [60, 90, 300, 330], [0, 0.6, 0.6, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <ThreeCanvas width={width} height={height} style={{position: "absolute"}}>
        <MovingCamera position={[cameraX, cameraY, cameraZ]} lookAt={[lookAtX, lookAtY, 0]} fov={50} />
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
          全国舆情态势
        </span>
      </div>
    </AbsoluteFill>
  );
};
