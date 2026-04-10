import {loadFont as loadInterTight} from "@remotion/google-fonts/InterTight";
import {loadFont as loadJetBrainsMono} from "@remotion/google-fonts/JetBrainsMono";

const zhFont = '"Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif';

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

// 项目配色 (苹果发布会风格：银灰+玻璃+冷白光)
export const COLORS = {
  bg: "#0a0a0a",                    // 深黑背景
  bgPanel: "rgba(255, 255, 255, 0.05)", // 玻璃面板
  primary: "#e5e5e5",               // 冷白主色
  secondary: "#a1a1a1",             // 银灰次要色
  accent: "#ffffff",                // 纯白强调色
  glass: "rgba(255, 255, 255, 0.08)", // 玻璃质感
  glassStroke: "rgba(255, 255, 255, 0.15)", // 玻璃边框
  textPrimary: "#f5f5f5",           // 主文字
  textSecondary: "#a1a1a1",         // 次要文字
  textMuted: "#737373",             // 弱化文字
  border: "rgba(255, 255, 255, 0.1)",
  shadow: "rgba(0, 0, 0, 0.5)",
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

// 镜头时长 (帧) - 6个场景
export const SCENE_DURATIONS = {
  scene1: 240,   // 0-8s     Logo开场
  scene2: 360,   // 8-20s    全国视图
  scene3: 360,   // 20-32s   信阳AI分析
  scene4: 300,   // 32-42s   3D场景还原
  scene5: 300,   // 42-52s   AI决策推演
  scene6: 240,   // 52-60s   结尾CTA
} as const;

// 转场时长
export const TRANSITION_FRAMES = 30;
