import React, {useCallback, useMemo, useState} from "react";
import {useThree} from "@react-three/fiber";
import {RoundedBox} from "@react-three/drei";
import {Video} from "@remotion/media";
import {staticFile, useRemotionEnvironment} from "remotion";
import {CanvasTexture, DoubleSide, type Side} from "three";

const VIDEO_W = 1920;
const VIDEO_H = 1080;

type ScreenMode = "plane" | "curved";

type SharedProps = {
  src: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  width?: number;
  height?: number;
  mode?: ScreenMode;
  curvature?: number;
  showReflection?: boolean;
  reflectionOpacity?: number;
  reflectionOffset?: number;
  showShell?: boolean;
  shellDepth?: number;
  shellRadius?: number;
};

const useCanvasVideoTexture = (src: string) => {
  const [canvasStuff] = useState(() => {
    const canvas =
      typeof OffscreenCanvas !== "undefined"
        ? new OffscreenCanvas(VIDEO_W, VIDEO_H)
        : Object.assign(document.createElement("canvas"), {
            width: VIDEO_W,
            height: VIDEO_H,
          });

    const context = canvas.getContext("2d")!;
    const texture = new CanvasTexture(canvas as HTMLCanvasElement);
    return {context, texture};
  });

  const {invalidate, advance} = useThree();
  const {isRendering} = useRemotionEnvironment();

  const onVideoFrame = useCallback(
    (frame: CanvasImageSource) => {
      canvasStuff.context.drawImage(frame, 0, 0, VIDEO_W, VIDEO_H);
      canvasStuff.texture.needsUpdate = true;

      if (isRendering) {
        advance(performance.now());
      } else {
        invalidate();
      }
    },
    [advance, canvasStuff, invalidate, isRendering],
  );

  return {
    texture: canvasStuff.texture,
    onVideoFrame,
    videoPath: staticFile(src),
  };
};

const ScreenSurface: React.FC<{
  width: number;
  height: number;
  mode: ScreenMode;
  curvature: number;
  side?: Side;
  texture: CanvasTexture;
  opacity?: number;
}> = ({width, height, mode, curvature, side = DoubleSide, texture, opacity = 1}) => {
  if (mode === "curved") {
    return (
      <mesh>
        <cylinderGeometry
          args={[
            curvature,
            curvature,
            height,
            96,
            1,
            true,
            -Math.PI * 0.16,
            Math.PI * 0.32,
          ]}
        />
        <meshBasicMaterial map={texture} toneMapped={false} transparent opacity={opacity} side={side} />
      </mesh>
    );
  }

  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} transparent opacity={opacity} side={side} />
    </mesh>
  );
};

export const VideoScreen: React.FC<SharedProps> = ({
  src,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  width = 16,
  height = 9,
  mode = "plane",
  curvature = 18,
  showReflection = true,
  reflectionOpacity = 0.14,
  reflectionOffset = 0.45,
  showShell = true,
  shellDepth = 0.14,
  shellRadius = 0.22,
}) => {
  const {texture, onVideoFrame, videoPath} = useCanvasVideoTexture(src);

  const shellSize = useMemo(
    () => [width * 1.03, height * 1.04, shellDepth] as [number, number, number],
    [height, shellDepth, width],
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Video src={videoPath} onVideoFrame={onVideoFrame} muted headless />

      {showShell ? (
        <RoundedBox args={shellSize} radius={shellRadius} smoothness={6} position={[0, 0, -shellDepth / 2]}>
          <meshStandardMaterial
            color="#171717"
            metalness={0.45}
            roughness={0.38}
            transparent
            opacity={0.95}
          />
        </RoundedBox>
      ) : null}

      <ScreenSurface
        width={width}
        height={height}
        mode={mode}
        curvature={curvature}
        texture={texture}
      />

      {showReflection ? (
        <group position={[0, -height - reflectionOffset, 0]} scale={[1, -1, 1]}>
          <ScreenSurface
            width={width}
            height={height}
            mode={mode}
            curvature={curvature}
            texture={texture}
            opacity={reflectionOpacity}
          />
        </group>
      ) : null}

      {showReflection ? (
        <mesh position={[0, -height - reflectionOffset, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width * 1.12, height * 0.92]} />
          <meshStandardMaterial color="#0f0f0f" transparent opacity={0.12} roughness={0.24} metalness={0.08} />
        </mesh>
      ) : null}
    </group>
  );
};
