import React, {useCallback, useMemo, useState} from "react";
import {useThree} from "@react-three/fiber";
import {RoundedBox} from "@react-three/drei";
import {Video} from "@remotion/media";
import {staticFile, useRemotionEnvironment} from "remotion";
import {CanvasTexture, ClampToEdgeWrapping, DoubleSide, LinearFilter, LinearMipmapLinearFilter, SRGBColorSpace, type Side} from "three";

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
  startFrom?: number;
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
    texture.colorSpace = SRGBColorSpace;
    texture.generateMipmaps = false;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    return {context, texture};
  });

  const {invalidate, advance} = useThree();
  const {isRendering} = useRemotionEnvironment();

  const onVideoFrame = useCallback(
    (frame: CanvasImageSource) => {
      canvasStuff.context.clearRect(0, 0, VIDEO_W, VIDEO_H);
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
      <mesh position={[0, 0, -curvature]}>
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
  reflectionOpacity = 0.08,
  reflectionOffset = 0.45,
  showShell = true,
  shellDepth = 0.14,
  shellRadius = 0.22,
  startFrom = 0,
}) => {
  const {texture, onVideoFrame, videoPath} = useCanvasVideoTexture(src);

  const shellSize = useMemo(
    () => [width * 1.03, height * 1.04, shellDepth] as [number, number, number],
    [height, shellDepth, width],
  );

  const showShellForMode = showShell && mode === "plane";

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Video src={videoPath} onVideoFrame={onVideoFrame} muted headless trimBefore={startFrom} />

      {showShellForMode ? (
        <RoundedBox
          args={shellSize}
          radius={shellRadius}
          smoothness={6}
          position={[0, 0, -shellDepth * 0.8]}
          renderOrder={-1}
        >
          <meshStandardMaterial
            color="#151515"
            metalness={0.35}
            roughness={0.55}
            envMapIntensity={0.5}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={2}
            polygonOffsetUnits={2}
            toneMapped={false}
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
        <mesh position={[0, -height - reflectionOffset, -0.05]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-2}>
          <planeGeometry args={[width * 1.12, height * 0.92]} />
          <meshBasicMaterial color="#0a0a0a" transparent opacity={0.06} toneMapped={false} />
        </mesh>
      ) : null}
    </group>
  );
};
