import React from "react";
import {COLORS} from "../config";

export const GlassPanel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({children, style}) => {
  return (
    <div
      style={{
        background: COLORS.bgPanel,
        backdropFilter: "blur(12px)",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: 24,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
