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
import {StudioLights} from "../components/StudioLights";
import {VideoScreen} from "../components/VideoScreen";

export const Scene4Scene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const cameraAngle = interpolate(
    frame, [0, 300], [-0.4, Math.PI * 0.5],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)}
  );
  const cameraRadius = interpolate(
    frame, [0, 150, 300], [11, 7, 9],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)}
  );
  const cameraY = interpolate(
    frame, [0, 150, 300], [4, 0.5, 2],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)}
  );

  const videoRotY = interpolate(
    frame, [0, 300], [0, 0.15],
    {extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease)}
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <ThreeCanvas width={width} height={height} style={{position: "absolute"}}>
        <MovingCamera
          position={[
            Math.sin(cameraAngle) * cameraRadius,
            cameraY,
            Math.cos(cameraAngle) * cameraRadius,
          ]}
          lookAt={[0, 0, 0]}
          fov={50}
        />
        <StudioLights />
        <VideoScreen
          src="video/3d场景还原展示.mp4"
          position={[0, 0, 0]}
          rotation={[0, videoRotY, 0]}
          width={16}
          height={9}
          showReflection
          reflectionOpacity={0.12}
          showShell
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
