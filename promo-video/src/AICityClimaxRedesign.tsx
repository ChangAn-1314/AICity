import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { OpeningWithLogo } from './scenes/OpeningWithLogo';
import { Problem } from './scenes/Problem';
import { AIEyeClimax } from './scenes/AIEyeClimax';
import { Feature1WithScreenshots } from './scenes/Feature1WithScreenshots';
import { MapDrillDown } from './scenes/MapDrillDown';
import { Feature2WithScreenshots } from './scenes/Feature2WithScreenshots';
import { DataVisualization } from './scenes/DataVisualization';
import { Ending } from './scenes/Ending';
import { OutroWithLogo } from './scenes/OutroWithLogo';

/**
 * 智舆宣传片 - 高潮重新设计版本
 * 
 * 核心理念：在 16 秒音乐高潮处展示"AI 的眼睛看见舆情"
 * 
 * 场景时间轴：
 * 1. 开场 Logo:           0.053s -  3.755s (111帧) - 节拍 1-8
 * 2. 问题引入:            3.755s -  9.653s (176帧) - 节拍 8-20
 * 3. 过渡:                9.653s - 15.371s (171帧) - 节拍 20-32
 * 4. 【核心高潮】AI眼睛:  15.371s - 19.232s (115帧) - 节拍 32-40 ⭐
 * 5. AI场景还原:         19.232s - 25.131s (176帧) - 节拍 40-52
 * 6. 地图钻取:           25.131s - 33.003s (236帧) - 节拍 52-68
 * 7. 智能决策:           33.003s - 40.875s (236帧) - 节拍 68-84
 * 8. 数据可视化:         40.875s - 48.683s (234帧) - 节拍 84-100
 * 9. Slogan:             48.683s - 54.443s (172帧) - 节拍 100-112
 * 10. 结尾 Logo:         54.443s - 59.339s (146帧) - 节拍 112-122
 * 
 * 总时长: 59.29秒 (1778帧)
 * 
 * 关键时刻：
 * - 15.371s: 高潮开始，Logo "智舆" 震撼出现
 * - 16.779s: 最强峰值，眼睛扫描光波爆发
 * - 17.760s: 3D 地图展开
 */

export const AICityClimaxRedesign: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 背景音乐 */}
      <Audio
        src={staticFile('musc/Apple Horizon.mp3')}
        volume={0.4}
        startFrom={0}
      />

      <TransitionSeries>
        {/* 1. 开场 Logo - 111帧 (3.7秒) */}
        <TransitionSeries.Sequence durationInFrames={111}>
          <OpeningWithLogo />
        </TransitionSeries.Sequence>

        {/* 转场: 3.755s - fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        {/* 2. 问题引入 - 176帧 (5.9秒) */}
        <TransitionSeries.Sequence durationInFrames={176}>
          <Problem />
        </TransitionSeries.Sequence>

        {/* 转场: 9.653s - slide from-right */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={springTiming({ 
            config: { damping: 200, stiffness: 100 },
            durationInFrames: 18
          })}
        />

        {/* 3. 过渡 - 需要新的解决方案 - 171帧 (5.7秒) */}
        <TransitionSeries.Sequence durationInFrames={171}>
          <Problem />
        </TransitionSeries.Sequence>

        {/* 转场: 15.371s - flash + scale (进入高潮) */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 8 })}
        />

        {/* 4. 【核心高潮】AI 的眼睛 - 115帧 (3.83秒) ⭐⭐⭐ */}
        <TransitionSeries.Sequence durationInFrames={115}>
          <AIEyeClimax />
        </TransitionSeries.Sequence>

        {/* 转场: 19.232s - fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        {/* 5. AI场景还原 - 176帧 (5.9秒) */}
        <TransitionSeries.Sequence durationInFrames={176}>
          <Feature1WithScreenshots />
        </TransitionSeries.Sequence>

        {/* 转场: 25.131s - slide from-left */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-left' })}
          timing={springTiming({ 
            config: { damping: 200, stiffness: 100 },
            durationInFrames: 18
          })}
        />

        {/* 6. 地图钻取 - 236帧 (7.9秒) */}
        <TransitionSeries.Sequence durationInFrames={236}>
          <MapDrillDown />
        </TransitionSeries.Sequence>

        {/* 转场: 33.003s - fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* 7. 智能决策 - 236帧 (7.9秒) */}
        <TransitionSeries.Sequence durationInFrames={236}>
          <Feature2WithScreenshots />
        </TransitionSeries.Sequence>

        {/* 转场: 40.875s - slide from-bottom */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={springTiming({ 
            config: { damping: 200, stiffness: 100 },
            durationInFrames: 18
          })}
        />

        {/* 8. 数据可视化 - 234帧 (7.8秒) */}
        <TransitionSeries.Sequence durationInFrames={234}>
          <DataVisualization />
        </TransitionSeries.Sequence>

        {/* 转场: 48.683s - fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* 9. Slogan - 172帧 (5.7秒) */}
        <TransitionSeries.Sequence durationInFrames={172}>
          <Ending />
        </TransitionSeries.Sequence>

        {/* 转场: 54.443s - fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 25 })}
        />

        {/* 10. 结尾 Logo - 146帧 (4.9秒) */}
        <TransitionSeries.Sequence durationInFrames={146}>
          <OutroWithLogo />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
