import React from "react";
import {
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
  Easing,
  staticFile,
} from "remotion";
import {Video} from "@remotion/media";
import {COLORS} from "../config";

export const Scene1Opening: React.FC = () => {
  const frame = useCurrentFrame();

  const videoOpacity = interpolate(
    frame,
    [0, 15, 225, 240],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AbsoluteFill
        style={{
          opacity: videoOpacity,
        }}
      >
        <Video
          src={staticFile("video/logo开场.mp4")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          muted
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
