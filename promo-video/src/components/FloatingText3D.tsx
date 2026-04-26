import React from "react";
import {interpolate, Easing} from "remotion";
import {Html} from "@react-three/drei";
import {COLORS} from "../config";

type FloatingText3DProps = {
  label: string;
  sublabel?: string;
  frame: number;
  appearFrame: number;
  disappearFrame?: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  fontSize?: number;
  subfontSize?: number;
  color?: string;
  subColor?: string;
  vertical?: boolean;
};

export const FloatingText3D: React.FC<FloatingText3DProps> = ({
  label,
  sublabel,
  frame,
  appearFrame,
  disappearFrame,
  position,
  rotation = [0, 0, 0],
  fontSize = 0.38,
  subfontSize = 0.18,
  color = COLORS.textPrimary,
  subColor = COLORS.textSecondary,
  vertical = false,
}) => {
  const fadeInDuration = 25;
  const fadeOutDuration = disappearFrame ? 20 : 0;

  const opacity = interpolate(
    frame,
    [
      appearFrame,
      appearFrame + fadeInDuration,
      ...(disappearFrame ? [disappearFrame, disappearFrame + fadeOutDuration] : []),
    ],
    [
      0,
      1,
      ...(disappearFrame ? [1, 0] : []),
    ],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  const slideY = interpolate(
    frame,
    [appearFrame, appearFrame + fadeInDuration],
    [0.3, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease)},
  );

  const scaleVal = interpolate(
    frame,
    [appearFrame, appearFrame + fadeInDuration],
    [0.92, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease)},
  );

  if (opacity <= 0) return null;

  const pxFontSize = Math.round(fontSize * 150);
  const pxSubFontSize = Math.round(subfontSize * 150);

  return (
    <group
      position={[position[0], position[1] + slideY, position[2]]}
      rotation={rotation}
      scale={[scaleVal, scaleVal, scaleVal]}
    >
      <Html
        position={[0, 0, 0]}
        center
        transform
        scale={0.25}
        style={{
          pointerEvents: "none",
          opacity,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: vertical ? "row" : "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter Tight', 'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC', sans-serif",
            textAlign: "center",
            gap: vertical ? "10px" : "6px",
            whiteSpace: "nowrap",
            transform: "scale(4)",
          }}
        >
          <div
            style={{
              fontSize: `${pxFontSize}px`,
              color,
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: "0.04em",
              writingMode: vertical ? "vertical-rl" : undefined,
              ...(vertical && sublabel ? {} : {}),
            }}
          >
            {label}
          </div>
          {sublabel && (
            <div
              style={{
                fontSize: `${pxSubFontSize}px`,
                color: subColor,
                fontWeight: 400,
                lineHeight: 1.3,
                letterSpacing: "0.02em",
                opacity: 0.7,
                writingMode: vertical ? "vertical-rl" : undefined,
              }}
            >
              {sublabel}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};
