import React from "react";
import {useThree} from "@react-three/fiber";
import * as THREE from "three";

export const MovingCamera: React.FC<{
  position: [number, number, number];
  lookAt?: [number, number, number];
  fov?: number;
}> = ({position, lookAt = [0, 0, 0], fov = 50}) => {
  const {camera} = useThree();

  const cam = camera as THREE.PerspectiveCamera;
  cam.position.set(position[0], position[1], position[2]);
  cam.lookAt(lookAt[0], lookAt[1], lookAt[2]);
  if (cam.fov !== fov) {
    cam.fov = fov;
    cam.updateProjectionMatrix();
  }

  return null;
};
