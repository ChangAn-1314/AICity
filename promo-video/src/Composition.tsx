import React from "react";
import {AbsoluteFill} from "remotion";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {SCENE_DURATIONS, TRANSITION_FRAMES, COLORS} from "./config";
import {Scene1Opening} from "./scenes/Scene1-Opening";
import {Scene2MapOverview} from "./scenes/Scene2-MapOverview";
import {Scene3AIAnalysis} from "./scenes/Scene3-AIAnalysis";
import {Scene4Scene3D} from "./scenes/Scene4-Scene3D";
import {Scene5Decision} from "./scenes/Scene5-Decision";
import {Scene6Ending} from "./scenes/Scene6-Ending";

const FADE = () => fade();
const TIMING = () => linearTiming({durationInFrames: TRANSITION_FRAMES});

export const PromoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene1}>
          <Scene1Opening />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={FADE()} timing={TIMING()} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene2}>
          <Scene2MapOverview />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={FADE()} timing={TIMING()} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene3}>
          <Scene3AIAnalysis />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={FADE()} timing={TIMING()} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene4}>
          <Scene4Scene3D />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={FADE()} timing={TIMING()} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene5}>
          <Scene5Decision />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={FADE()} timing={TIMING()} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene6}>
          <Scene6Ending />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
