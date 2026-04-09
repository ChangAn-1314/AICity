import React, {useMemo} from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  Easing,
} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import * as THREE from "three";
import {COLORS, FONTS, VIDEO} from "../config";
import {GlassPanel} from "../components/GlassPanel";

const Scene3DModel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const wireframeProgress = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const solidProgress = interpolate(frame, [60, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const rotation = interpolate(frame, [120, 240], [0, Math.PI * 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 1.5, 1);
    return geo;
  }, []);

  const wireframeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: COLORS.cyan,
      wireframe: true,
      transparent: true,
    });
  }, []);

  const solidMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: COLORS.cyan,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
    });
  }, []);

  const wireframeOpacity = wireframeProgress * (1 - solidProgress);
  const solidOpacity = solidProgress;

  return (
    <ThreeCanvas width={VIDEO.WIDTH} height={VIDEO.HEIGHT}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <perspectiveCamera position={[0, 0.5, 3]} fov={50} />

      <mesh
        geometry={geometry}
        material={wireframeMaterial}
        rotation={[0, rotation, 0]}
        material-opacity={wireframeOpacity}
      />
      <mesh
        geometry={geometry}
        material={solidMaterial}
        rotation={[0, rotation, 0]}
        material-opacity={solidOpacity}
      />
    </ThreeCanvas>
  );
};

export const Scene5Scene3D: React.FC = () => {
  const frame = useCurrentFrame();

  const newsOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const modelOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitle1Opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitle2Opacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitle3Opacity = interpolate(frame, [180, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shrinkScale = interpolate(frame, [180, 210], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const shrinkX = interpolate(frame, [180, 210], [0, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shrinkY = interpolate(frame, [180, 210], [0, -300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: "translateY(-50%)",
          width: 500,
          opacity: newsOpacity,
        }}
      >
        <GlassPanel>
          <div
            style={{
              fontFamily: FONTS.zh,
              fontSize: 14,
              color: COLORS.textMuted,
              marginBottom: 8,
            }}
          >
            来源: 微博 · 2026-04-09 10:32
          </div>
          <div
            style={{
              fontFamily: FONTS.zh,
              fontSize: 24,
              fontWeight: "700",
              color: COLORS.textPrimary,
              lineHeight: 1.6,
            }}
          >
            信阳市区羊山新区某路段施工围挡设置不当，引发市民通行不便
          </div>
          <div
            style={{
              marginTop: 16,
              fontFamily: FONTS.zh,
              fontSize: 16,
              color: COLORS.textSecondary,
              lineHeight: 1.8,
            }}
          >
            多位市民反映该路段施工围挡占据大半路面，导致早晚高峰期间严重拥堵...
          </div>
        </GlassPanel>
      </div>

      <div
        style={{
          position: "absolute",
          right: 100,
          top: "50%",
          width: 600,
          height: 600,
          transform: `translateY(-50%) translate(${shrinkX}px, ${shrinkY}px) scale(${shrinkScale})`,
          opacity: modelOpacity,
        }}
      >
        <Scene3DModel />
      </div>

      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.zh,
            fontSize: 36,
            fontWeight: "700",
            color: COLORS.textPrimary,
            opacity: subtitle1Opacity,
          }}
        >
          AI根据舆情内容自动还原现场
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.zh,
            fontSize: 28,
            fontWeight: "400",
            color: COLORS.textSecondary,
            opacity: subtitle2Opacity,
          }}
        >
          文字/图片/视频 → 3D模型
        </div>
      </div>
    </AbsoluteFill>
  );
};
