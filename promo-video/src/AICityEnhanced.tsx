import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { Opening } from './scenes/Opening';
import { Problem } from './scenes/Problem';
import { ProductEnhanced } from './scenes/ProductEnhanced';
import { Feature1Enhanced } from './scenes/Feature1Enhanced';
import { Feature2 } from './scenes/Feature2';
import { Feature3Enhanced } from './scenes/Feature3Enhanced';
import { Ending } from './scenes/Ending';
import { Outro } from './scenes/Outro';

export const AICityEnhanced: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <TransitionSeries>
        {/* 开场 - 5秒 */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <Opening />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* 问题场景 - 8秒 */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <Problem />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 200 } })}
        />

        {/* 产品介绍 - 10秒 */}
        <TransitionSeries.Sequence durationInFrames={300}>
          <ProductEnhanced />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* 核心功能1: AI场景还原 - 8秒 */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <Feature1Enhanced />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-left' })}
          timing={springTiming({ config: { damping: 200 } })}
        />

        {/* 核心功能2: 智能决策推演 - 8秒 */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <Feature2 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* 核心功能3: 实时监测预警 - 8秒 */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <Feature3Enhanced />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={springTiming({ config: { damping: 200 } })}
        />

        {/* 结尾 - 8秒 */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <Ending />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 30 })}
        />

        {/* 尾声 - 5秒 */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
