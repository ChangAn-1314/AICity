import React, {useEffect, useRef} from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  Easing,
} from "remotion";
import {COLORS, FONTS} from "../config";

export const Scene3MapOverviewIframe: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const iframeWindow = iframe.contentWindow;
    
    if (!iframeWindow) return;

    const sendCommand = (command: string, data?: any) => {
      iframeWindow.postMessage({type: command, data}, '*');
    };

    if (frame === 0) {
      sendCommand('INIT_MAP', {zoom: 4, pitch: 0});
    } else if (frame >= 60 && frame <= 120) {
      const progress = (frame - 60) / 60;
      const zoom = interpolate(progress, [0, 1], [4, 14]);
      sendCommand('SET_ZOOM', {zoom});
    } else if (frame >= 120 && frame <= 150) {
      const progress = (frame - 120) / 30;
      const pitch = interpolate(progress, [0, 1], [0, 70]);
      sendCommand('SET_PITCH', {pitch});
    } else if (frame >= 150) {
      sendCommand('SHOW_HOTSPOTS');
    }
  }, [frame]);

  const iframeOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitle1Opacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <iframe
        ref={iframeRef}
        src="http://localhost:5173"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          opacity: iframeOpacity,
        }}
        title="AICityFornt Map"
      />

      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.zh,
            fontSize: 36,
            fontWeight: "700",
            color: COLORS.textPrimary,
            opacity: subtitle1Opacity,
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          实时接入全网数据源
        </div>
      </div>
    </AbsoluteFill>
  );
};
