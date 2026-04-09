import React, {useLayoutEffect} from "react";
import {useThree} from "@react-three/fiber";
import * as THREE from "three";

export const MovingCamera: React.FC<{
  position: [number, number, number];
  lookAt?: [number, number, number];
  fov?: number;
}> = ({position, lookAt = [0, 0, 0], fov = 50}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  useLayoutEffect(() => {
    camera.position.set(position[0], position[1], position[2]);
    camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, position[0], position[1], position[2], lookAt[0], lookAt[1], lookAt[2], fov]);

  return null;
};
