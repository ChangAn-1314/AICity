import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { Opening } from './scenes/Opening';
import { Problem } from './scenes/Problem';
import { Product } from './scenes/Product';
import { Feature1 } from './scenes/Feature1';
import { Feature2 } from './scenes/Feature2';
import { Feature3 } from './scenes/Feature3';
import { Ending } from './scenes/Ending';
import { Outro } from './scenes/Outro';

export const AICity: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 开场 - 5秒 */}
      <Sequence from={0} durationInFrames={150}>
        <Opening />
      </Sequence>

      {/* 问题场景 - 8秒 */}
      <Sequence from={150} durationInFrames={240}>
        <Problem />
      </Sequence>

      {/* 产品介绍 - 10秒 */}
      <Sequence from={390} durationInFrames={300}>
        <Product />
      </Sequence>

      {/* 核心功能1: AI场景还原 - 8秒 */}
      <Sequence from={690} durationInFrames={240}>
        <Feature1 />
      </Sequence>

      {/* 核心功能2: 智能决策推演 - 8秒 */}
      <Sequence from={930} durationInFrames={240}>
        <Feature2 />
      </Sequence>

      {/* 核心功能3: 实时监测预警 - 8秒 */}
      <Sequence from={1170} durationInFrames={240}>
        <Feature3 />
      </Sequence>

      {/* 结尾 - 8秒 */}
      <Sequence from={1410} durationInFrames={240}>
        <Ending />
      </Sequence>

      {/* 尾声 - 5秒 */}
      <Sequence from={1650} durationInFrames={150}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
