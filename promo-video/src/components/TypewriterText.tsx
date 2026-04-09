import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import {FONTS, COLORS} from "../config";

export const TypewriterText: React.FC<{
  text: string;
  startFrame?: number;
  speed?: number; // frames per character
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  cursor?: boolean;
}> = ({
  text,
  startFrame = 0,
  speed = 3,
  fontSize = 48,
  color = COLORS.textPrimary,
  fontWeight = "700",
  cursor = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const elapsed = Math.max(0, frame - startFrame);
  const charsToShow = Math.min(Math.floor(elapsed / speed), text.length);
  const displayText = text.slice(0, charsToShow);
  const isTyping = charsToShow < text.length && elapsed > 0;

  const cursorOpacity = cursor
    ? Math.round((elapsed % (fps / 2)) / (fps / 2)) === 0
      ? 1
      : 0
    : 0;

  return (
    <div
      style={{
        fontFamily: FONTS.zh,
        fontSize,
        fontWeight,
        color,
        letterSpacing: "0.05em",
        lineHeight: 1.4,
        whiteSpace: "pre-wrap",
      }}
    >
      {displayText}
      {(isTyping || (cursor && charsToShow === text.length)) && (
        <span
          style={{
            opacity: cursorOpacity,
            color: COLORS.secondary,
            fontWeight: "100",
          }}
        >
          |
        </span>
      )}
    </div>
  );
};
