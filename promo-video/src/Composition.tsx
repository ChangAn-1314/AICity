import React from "react";
import {AbsoluteFill} from "remotion";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {slide} from "@remotion/transitions/slide";
import {clockWipe} from "@remotion/transitions/clock-wipe";
import {wipe} from "@remotion/transitions/wipe";
import {SCENE_DURATIONS, TRANSITION_FRAMES, COLORS} from "./config";
import {Scene1Opening} from "./scenes/Scene1-Opening";
import {Scene2ProductName} from "./scenes/Scene2-ProductName";
import {Scene3MapOverview} from "./scenes/Scene3-MapOverview";
import {Scene4AIAnalysis} from "./scenes/Scene4-AIAnalysis";
import {Scene5Scene3D} from "./scenes/Scene5-Scene3D";
import {Scene6Decision} from "./scenes/Scene6-Decision";
import {Scene7Ending} from "./scenes/Scene7-Ending";

export const PromoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene1}>
          <Scene1Opening />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene2}>
          <Scene2ProductName />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({direction: "from-bottom"})}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene3}>
          <Scene3MapOverview />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={clockWipe({width: 1920, height: 1080})}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene4}>
          <Scene4AIAnalysis />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene5}>
          <Scene5Scene3D />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({direction: "from-right"})}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene6}>
          <Scene6Decision />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe()}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene7}>
          <Scene7Ending />
        </TransitionSeries.Sequence>
      </TransitionSeries>


    </AbsoluteFill>
  );
};
