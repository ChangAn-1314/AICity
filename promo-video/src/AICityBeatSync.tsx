import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
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

/**
 * 基于 BGM 节拍同步的视频版本 - 精确卡点版
 * 
 * BGM 信息:
 * - Apple Horizon.mp3
 * - BPM: 122.3
 * - 最强峰值: 16.779秒 (能量 0.4441)
 * 
 * 核心调整: 让"智舆系统"在 15秒22帧 (15.733秒) 突然出现
 * 
 * 场景时间轴:
 * 1. 开场 Logo:        0.00s -  6.00s (180帧)
 * 2. 问题场景:         6.50s - 14.33s (235帧)
 * 3. 产品介绍:        15.00s - 26.03s (331帧) - ⭐ 15.733秒"智舆系统"突然出现
 * 4. AI场景还原:      26.43s - 33.83s (222帧)
 * 5. 地图钻取:        34.43s - 42.43s (240帧)
 * 6. 智能决策:        42.93s - 50.93s (240帧)
 * 7. 数据可视化:      51.53s - 59.53s (240帧)
 * 8. 结尾 Slogan:     60.20s - 65.20s (150帧)
 * 9. 尾声 Logo:       66.03s - 71.03s (150帧)
 * 
 * 总时长: 约 71秒 (2138帧)
 */

export const AICityBeatSync: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 背景音乐 - 从头开始播放 */}
      <Audio
        src={staticFile('musc/Apple Horizon.mp3')}
        volume={0.4}
        startFrom={0}
      />

      <TransitionSeries>
        {/* 1. 开场 Logo - 180帧 (6.00秒) */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <OpeningWithLogo />
        </TransitionSeries.Sequence>

        {/* 转场: 6.00s - fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* 2. 问题场景 - 235帧 (7.83秒) */}
        <TransitionSeries.Sequence durationInFrames={235}>
          <Problem />
        </TransitionSeries.Sequence>

        {/* 转场: 14.33s - slide from-right，使用推荐的 smooth 配置 */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={springTiming({ 
            config: { damping: 200 }, // 推荐配置：smooth, no bounce
            durationInFrames: 20
          })}
        />

        {/* 3. 产品介绍 - 331帧 (11.03秒) - 从 15.00秒 开始 */}
        {/* ⭐ 15.733秒 (场景内第22帧) "智舆系统"突然出现 */}
        {/* 16.779秒 是最强峰值 */}
        <TransitionSeries.Sequence durationInFrames={331}>
          <ProductWithScreenshots />
        </TransitionSeries.Sequence>

        {/* 转场: 27.03s - fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        {/* 4. AI场景还原 - 222帧 (7.40秒) */}
        <TransitionSeries.Sequence durationInFrames={222}>
          <Feature1WithScreenshots />
        </TransitionSeries.Sequence>

        {/* 转场: 34.83s - slide from-left，使用推荐的 smooth 配置 */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-left' })}
          timing={springTiming({ 
            config: { damping: 200 },
            durationInFrames: 18
          })}
        />

        {/* 5. 地图钻取 - 240帧 (8.00秒) */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <MapDrillDown />
        </TransitionSeries.Sequence>

        {/* 转场: 43.43s - fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* 6. 智能决策 - 240帧 (8.00秒) */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <Feature2WithScreenshots />
        </TransitionSeries.Sequence>

        {/* 转场: 51.93s - slide from-bottom，使用推荐的 smooth 配置 */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={springTiming({ 
            config: { damping: 200 },
            durationInFrames: 18
          })}
        />

        {/* 7. 数据可视化 - 240帧 (8.00秒) */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <DataVisualization />
        </TransitionSeries.Sequence>

        {/* 转场: 60.53s - fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* 8. 结尾 Slogan - 150帧 (5.00秒) */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <Ending />
        </TransitionSeries.Sequence>

        {/* 转场: 66.20s - fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 25 })}
        />

        {/* 9. 尾声 Logo - 150帧 (5.00秒) */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <OutroWithLogo />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
