import React, {useCallback, useState} from "react";
import {useThree} from "@react-three/fiber";
import {Video} from "@remotion/media";
import {staticFile, useRemotionEnvironment} from "remotion";
import {CanvasTexture} from "three";

const VIDEO_W = 1920;
const VIDEO_H = 1080;

export const VideoScreen: React.FC<{
  src: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  width?: number;
  height?: number;
}> = ({
  src,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  width = 16,
  height = 9,
}) => {
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
    [canvasStuff, isRendering, advance, invalidate],
  );

  const videoPath = staticFile(src);

  return (
    <>
      <Video src={videoPath} onVideoFrame={onVideoFrame} muted headless />
      <mesh position={position} rotation={rotation} scale={scale}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={canvasStuff.texture} toneMapped={false} />
      </mesh>
    </>
  );
};
