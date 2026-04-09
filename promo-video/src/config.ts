import {loadFont as loadNotoSansSC} from "@remotion/google-fonts/NotoSansSC";
import {loadFont as loadInterTight} from "@remotion/google-fonts/InterTight";
import {loadFont as loadJetBrainsMono} from "@remotion/google-fonts/JetBrainsMono";

const {fontFamily: zhFont} = loadNotoSansSC("normal", {
  weights: ["400", "700", "900"],
});

const {fontFamily: enFont} = loadInterTight("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const {fontFamily: monoFont} = loadJetBrainsMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const FONTS = {
  zh: zhFont,
  en: enFont,
  mono: monoFont,
  title: zhFont,       // 标题用 Noto Sans SC 900
  body: zhFont,        // 正文用 Noto Sans SC 400/700
  data: monoFont,      // 数据用 JetBrains Mono
} as const;

// 项目配色 (来自 cyberpunk.css)
export const COLORS = {
  bg: "#0f172a",                    // slate-900
  bgPanel: "rgba(15, 23, 42, 0.6)", // slate-900/60
  cyan: "#06b6d4",                  // cyan-500
  cyanLight: "#22d3ee",             // cyan-400
  cyanGlow: "rgba(6, 182, 212, 0.5)",
  purple: "#d946ef",                // fuchsia-500
  purpleGlow: "rgba(217, 70, 239, 0.5)",
  emerald: "#10b981",               // emerald-500
  emeraldGlow: "rgba(16, 185, 129, 0.5)",
  red: "#ef4444",                   // red-500
  amber: "#f59e0b",                 // amber-500
  textPrimary: "#f8fafc",           // slate-50
  textSecondary: "#94a3b8",         // slate-400
  textMuted: "#64748b",             // slate-500
  border: "rgba(255, 255, 255, 0.1)",
} as const;

// 视频常量
export const VIDEO = {
  WIDTH: 1920,
  HEIGHT: 1080,
  FPS: 30,
  TOTAL_FRAMES: 1800,     // 60s
  BPM: 120,               // BGM 节奏
  BEAT_FRAMES: 15,         // 每拍帧数 (30fps / 2beats per sec)
  BAR_FRAMES: 60,          // 每小节帧数 (4拍)
} as const;

// 镜头时长 (帧)
export const SCENE_DURATIONS = {
  scene1: 240,   // 0-8s     开场粒子城市
  scene2: 180,   // 8-14s    品牌亮相
  scene3: 360,   // 14-26s   全景地图
  scene4: 300,   // 26-36s   AI分析
  scene5: 240,   // 36-44s   3D现场还原
  scene6: 270,   // 44-53s   决策推演
  scene7: 210,   // 53-60s   结尾CTA
} as const;

// 转场时长
export const TRANSITION_FRAMES = 15;
