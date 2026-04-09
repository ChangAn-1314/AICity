import React from "react";
import {Environment, Lightformer} from "@react-three/drei";

export const StudioLights: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[0, 6, 8]} intensity={1.15} color="#ffffff" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3.2} color="#ffffff" position={[-7, 2.5, 6]} scale={[6, 10, 1]} />
        <Lightformer form="rect" intensity={2.6} color="#f5f5f5" position={[7, 1.4, 5]} scale={[4, 8, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#cfcfcf" position={[0, 7, 4]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={1.3} color="#8f8f8f" position={[0, -4.5, 5]} scale={[8, 2, 1]} />
      </Environment>
    </>
  );
};
