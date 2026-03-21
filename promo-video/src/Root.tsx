import { Composition } from 'remotion';
import { AICity } from './AICity';
import { AICityEnhanced } from './AICityEnhanced';
import { AICityFinal } from './AICityFinal';
import { AICityWithBGM } from './AICityWithBGM';
import { AICityBeatSync } from './AICityBeatSync';
import { AICityClimaxRedesign } from './AICityClimaxRedesign';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AICity"
        component={AICity}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AICityEnhanced"
        component={AICityEnhanced}
        durationInFrames={1650}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AICityFinal"
        component={AICityFinal}
        durationInFrames={1950}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AICityWithBGM"
        component={AICityWithBGM}
        durationInFrames={1950}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AICityBeatSync"
        component={AICityBeatSync}
        durationInFrames={2138}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AICityClimaxRedesign"
        component={AICityClimaxRedesign}
        durationInFrames={1778}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
