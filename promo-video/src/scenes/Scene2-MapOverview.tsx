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

  const cameraX = interpolate(
    frame, [0, 360], [-4.5, 4.5],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraY = interpolate(
    frame, [0, 360], [-3.2, 3.2],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const cameraZ = interpolate(
    frame, [0, 360], [2.6, 2.6],
    {extrapolateRight: "clamp"},
  );

  const lookAtX = interpolate(
    frame, [0, 360], [-2.5, 2.5],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );
  const lookAtY = interpolate(
    frame, [0, 360], [-1.8, 1.8],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)},
  );

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
