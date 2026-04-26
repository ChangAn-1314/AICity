import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from "remotion";
import {SCENE_DURATIONS, COLORS, VIDEO, FONTS} from "./config";
import {Scene1Opening} from "./scenes/Scene1-Opening";
import {Scene2MapOverview} from "./scenes/Scene2-MapOverview";
import {Scene3AIAnalysis} from "./scenes/Scene3-AIAnalysis";
import {Scene4Scene3D} from "./scenes/Scene4-Scene3D";
import {Scene5Decision} from "./scenes/Scene5-Decision";
import {Scene6Ending} from "./scenes/Scene6-Ending";

const BLACK_FRAMES = 30;
const FADE_FRAMES = 15;
const BGM_FADE_OUT_FRAMES = 120;
const BGM_DIP_FRAMES = 30;
const BGM_NORMAL = 0.28;
const BGM_DIP = 0.096;

const SUBTITLE_FADE_IN = 8;
const SUBTITLE_FADE_OUT = 8;

type SubtitleLine = {
  text: string;
  from: number;
  to: number;
};

const SUBTITLES: {scene: number; lines: SubtitleLine[]}[] = [
  {scene: 2, lines: [
    {text: "千万条舆情汇聚 谁能看见全貌", from: 30, to: 180},
    {text: "智舆 以全国视野感知城市脉搏", from: 190, to: 340},
  ]},
  {scene: 3, lines: [
    {text: "不只是看见 更是理解", from: 30, to: 170},
    {text: "AI深度分析 精准定位关键线索", from: 180, to: 340},
  ]},
  {scene: 4, lines: [
    {text: "还原真实 不止于平面", from: 25, to: 140},
    {text: "三维重建 细节触手可及", from: 150, to: 280},
  ]},
  {scene: 5, lines: [
    {text: "从感知到决策", from: 30, to: 160},
    {text: "AI推演每一步可能 让选择不再靠猜", from: 170, to: 370},
    {text: "提前预判 精准施策 把主动权握在手中", from: 380, to: 570},
  ]},
  {scene: 6, lines: [
  ]},
];

const Subtitle: React.FC<{
  lines: SubtitleLine[];
  durationInFrames: number;
}> = ({lines, durationInFrames}) => {
  const frame = useCurrentFrame();

  const activeLine = lines.find(
    (l) => frame >= l.from && frame <= l.to,
  );

  if (!activeLine) return null;

  const lineDuration = activeLine.to - activeLine.from;
  const lineFrame = frame - activeLine.from;
  const lineOpacity = interpolate(
    lineFrame,
    [0, SUBTITLE_FADE_IN, lineDuration - SUBTITLE_FADE_OUT, lineDuration],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  const globalOpacity = interpolate(
    frame,
    [0, FADE_FRAMES, durationInFrames - FADE_FRAMES, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity: lineOpacity * globalOpacity,
          fontFamily: `${FONTS.en}, "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif`,
          fontSize: 36,
          fontWeight: 400,
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.6,
          letterSpacing: "0.08em",
          textShadow: "0 2px 16px rgba(0,0,0,0.85), 0 0 48px rgba(0,0,0,0.5)",
        }}
      >
        {activeLine.text}
      </div>
    </div>
  );
};

const BlackScreen: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: "#000000"}} />
);

const FadingScene: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
}> = ({durationInFrames, children}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, FADE_FRAMES, durationInFrames - FADE_FRAMES, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const s1 = 0;
const b1 = s1 + SCENE_DURATIONS.scene1;
const s2 = b1 + BLACK_FRAMES;
const b2 = s2 + SCENE_DURATIONS.scene2;
const s3 = b2 + BLACK_FRAMES;
const b3 = s3 + SCENE_DURATIONS.scene3;
const s4 = b3 + BLACK_FRAMES;
const b4 = s4 + SCENE_DURATIONS.scene4;
const s5 = b4 + BLACK_FRAMES;
const b5 = s5 + SCENE_DURATIONS.scene5;
const s6 = b5 + BLACK_FRAMES;

const sceneStarts: Record<number, number> = {2: s2, 3: s3, 4: s4, 5: s5, 6: s6};
const sceneDurations: Record<number, number> = {
  2: SCENE_DURATIONS.scene2,
  3: SCENE_DURATIONS.scene3,
  4: SCENE_DURATIONS.scene4,
  5: SCENE_DURATIONS.scene5,
  6: SCENE_DURATIONS.scene6,
};

export const PromoVideo: React.FC = () => {
  const frame = useCurrentFrame();

  const bgmVolume = interpolate(
    frame,
    [
      0, s6,
      s6 + BGM_DIP_FRAMES,
      VIDEO.TOTAL_FRAMES - BGM_FADE_OUT_FRAMES, VIDEO.TOTAL_FRAMES,
    ],
    [
      BGM_NORMAL, BGM_NORMAL,
      BGM_DIP, BGM_DIP,
      0,
    ],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  return (
    <AbsoluteFill style={{backgroundColor: "#000000"}}>
      <Audio src={staticFile("bgm/minimax mu-2.6-260412.mp3")} volume={bgmVolume} />

      <Sequence from={s2} durationInFrames={VIDEO.TOTAL_FRAMES - s2}>
        <Audio src={staticFile("bgm/Scene2.2.wav")} volume={1} />
      </Sequence>
      <Sequence from={s3} durationInFrames={VIDEO.TOTAL_FRAMES - s3}>
        <Audio src={staticFile("bgm/Scene3.1.wav")} volume={1} />
      </Sequence>
      <Sequence from={s4} durationInFrames={VIDEO.TOTAL_FRAMES - s4}>
        <Audio src={staticFile("bgm/Scene4.1.wav")} volume={1} />
      </Sequence>
      <Sequence from={s5} durationInFrames={VIDEO.TOTAL_FRAMES - s5}>
        <Audio src={staticFile("bgm/Scene5.1.wav")} volume={1} />
      </Sequence>
      <Sequence from={s6 + 90} durationInFrames={VIDEO.TOTAL_FRAMES - s6 - 90}>
        <Audio src={staticFile("bgm/Scene6.2.wav")} volume={1} />
      </Sequence>

      <Sequence from={s1} durationInFrames={SCENE_DURATIONS.scene1}>
        <FadingScene durationInFrames={SCENE_DURATIONS.scene1}>
          <Scene1Opening />
        </FadingScene>
      </Sequence>
      <Sequence from={b1} durationInFrames={BLACK_FRAMES}>
        <BlackScreen />
      </Sequence>

      <Sequence from={s2} durationInFrames={SCENE_DURATIONS.scene2}>
        <FadingScene durationInFrames={SCENE_DURATIONS.scene2}>
          <Scene2MapOverview />
        </FadingScene>
        <Subtitle lines={SUBTITLES[0].lines} durationInFrames={SCENE_DURATIONS.scene2} />
      </Sequence>
      <Sequence from={b2} durationInFrames={BLACK_FRAMES}>
        <BlackScreen />
      </Sequence>

      <Sequence from={s3} durationInFrames={SCENE_DURATIONS.scene3}>
        <FadingScene durationInFrames={SCENE_DURATIONS.scene3}>
          <Scene3AIAnalysis />
        </FadingScene>
        <Subtitle lines={SUBTITLES[1].lines} durationInFrames={SCENE_DURATIONS.scene3} />
      </Sequence>
      <Sequence from={b3} durationInFrames={BLACK_FRAMES}>
        <BlackScreen />
      </Sequence>

      <Sequence from={s4} durationInFrames={SCENE_DURATIONS.scene4}>
        <FadingScene durationInFrames={SCENE_DURATIONS.scene4}>
          <Scene4Scene3D />
        </FadingScene>
        <Subtitle lines={SUBTITLES[2].lines} durationInFrames={SCENE_DURATIONS.scene4} />
      </Sequence>
      <Sequence from={b4} durationInFrames={BLACK_FRAMES}>
        <BlackScreen />
      </Sequence>

      <Sequence from={s5} durationInFrames={SCENE_DURATIONS.scene5}>
        <FadingScene durationInFrames={SCENE_DURATIONS.scene5}>
          <Scene5Decision />
        </FadingScene>
        <Subtitle lines={SUBTITLES[3].lines} durationInFrames={SCENE_DURATIONS.scene5} />
      </Sequence>
      <Sequence from={b5} durationInFrames={BLACK_FRAMES}>
        <BlackScreen />
      </Sequence>

      <Sequence from={s6} durationInFrames={SCENE_DURATIONS.scene6}>
        <FadingScene durationInFrames={SCENE_DURATIONS.scene6}>
          <Scene6Ending />
        </FadingScene>
        <Subtitle lines={SUBTITLES[4].lines} durationInFrames={SCENE_DURATIONS.scene6} />
      </Sequence>
    </AbsoluteFill>
  );
};
