import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { OpeningWithLogo } from './scenes/OpeningWithLogo';
import { Problem } from './scenes/Problem';
import { ProductWithScreenshots } from './scenes/ProductWithScreenshots';
import { Feature1WithScreenshots } from './scenes/Feature1WithScreenshots';
import { MapDrillDown } from './scenes/MapDrillDown';
import { Feature2WithScreenshots } from './scenes/Feature2WithScreenshots';
import { DataVisualization } from './scenes/DataVisualization';
import { Ending } from './scenes/Ending';
import { OutroWithLogo } from './scenes/OutroWithLogo';

export const AICityFinal: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <TransitionSeries>
        {/* 开场 - Logo - 5秒 */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <OpeningWithLogo />
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

        {/* 产品介绍 - 主界面 - 10秒 */}
        <TransitionSeries.Sequence durationInFrames={300}>
          <ProductWithScreenshots />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* 核心功能1: AI场景还原 - 8秒 */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <Feature1WithScreenshots />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-left' })}
          timing={springTiming({ config: { damping: 200 } })}
        />

        {/* 核心功能2: 地图钻取 - 8秒 */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <MapDrillDown />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* 核心功能3: 智能决策 - 8秒 */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <Feature2WithScreenshots />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={springTiming({ config: { damping: 200 } })}
        />

        {/* 核心功能4: 数据可视化 - 8秒 */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <DataVisualization />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* 结尾 - Slogan - 8秒 */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <Ending />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 30 })}
        />

        {/* 尾声 - Logo - 5秒 */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <OutroWithLogo />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
