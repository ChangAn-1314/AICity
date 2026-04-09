import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  Easing,
} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import {COLORS} from "../config";
import {MovingCamera} from "../components/MovingCamera";
import {VideoScreen} from "../components/VideoScreen";

export const Scene3AIAnalysis: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const t = frame / 360;
  const arcAngle = interpolate(
    t, [0, 1], [-0.6, 0.6],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );
  const radius = interpolate(
    frame, [0, 180, 360], [10, 7, 9],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)}
  );
  const cameraY = interpolate(
    frame, [0, 180, 360], [3, 0.5, 2],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)}
  );

  const cameraX = Math.sin(arcAngle) * radius;
  const cameraZ = Math.cos(arcAngle) * radius;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <ThreeCanvas width={width} height={height} style={{position: "absolute"}}>
        <MovingCamera position={[cameraX, cameraY, cameraZ]} lookAt={[0, 0, 0]} fov={50} />
        <ambientLight intensity={1} />
        <VideoScreen
          src="video/信阳视图 双十二舆情气泡展开 展示ai分析 词云 ai预测.mp4"
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          width={16}
          height={9}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
