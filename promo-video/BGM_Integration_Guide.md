# 智舆系统宣传片 - BGM 集成说明

## 已完成的工作

### 1. BGM 文件
- **文件位置**: `public/musc/Apple Horizon.mp3`
- **文件大小**: 2.4 MB
- **音乐风格**: Apple 风格电子氛围音乐

### 2. 创建的组件
- **文件**: `src/AICityWithBGM.tsx`
- **功能**: 在 AICityFinal 基础上添加背景音乐
- **音量设置**: 35% (0.35)

### 3. 音频配置

```typescript
<Audio
  src={staticFile('musc/Apple Horizon.mp3')}
  volume={0.35}
  startFrom={0}
/>
```

**参数说明:**
- `volume={0.35}` - 音量设置为 35%,确保不盖过画面重点
- `startFrom={0}` - 从音频开头开始播放

### 4. 渲染命令

```bash
# 渲染带 BGM 的完整版本
pnpm build:bgm

# 输出文件
out/aicity-promo-with-bgm.mp4
```

## 可用的视频版本

| 版本 | 命令 | 输出文件 | 特点 |
|------|------|---------|------|
| 基础版 | `pnpm build` | aicity-promo.mp4 | 简单动画,无截图 |
| 增强版 | `pnpm build:enhanced` | aicity-promo-enhanced.mp4 | 专业转场 |
| 最终版 | `pnpm build:final` | aicity-promo-final.mp4 | 实际截图,无音乐 |
| BGM版 | `pnpm build:bgm` | aicity-promo-with-bgm.mp4 | 完整版+背景音乐 |

## 音量调整建议

如果需要调整音量,编辑 `src/AICityWithBGM.tsx`:

```typescript
// 更轻柔 (20%)
volume={0.2}

// 标准 (35%) - 当前设置
volume={0.35}

// 更响亮 (50%)
volume={0.5}
```

## 高级音量控制

如果需要动态音量变化(例如高潮部分音量提升):

```typescript
import { useCurrentFrame, interpolate } from 'remotion';

const frame = useCurrentFrame();

// 在高潮部分(42.83秒 = 1285帧)提升音量
const volume = interpolate(
  frame,
  [0, 1285, 1525, 1950],
  [0.3, 0.3, 0.45, 0.25],
  { extrapolateRight: 'clamp' }
);

<Audio
  src={staticFile('musc/Apple Horizon.mp3')}
  volume={volume}
  startFrom={0}
/>
```

## 音频淡入淡出

如果需要淡入淡出效果:

```typescript
const frame = useCurrentFrame();

// 开场淡入 (0-2秒)
const fadeIn = interpolate(frame, [0, 60], [0, 0.35], {
  extrapolateRight: 'clamp',
});

// 结尾淡出 (最后3秒)
const fadeOut = interpolate(frame, [1860, 1950], [0.35, 0], {
  extrapolateLeft: 'clamp',
});

const volume = Math.min(fadeIn, fadeOut);

<Audio
  src={staticFile('musc/Apple Horizon.mp3')}
  volume={volume}
  startFrom={0}
/>
```

## 音频裁剪

如果 BGM 时长与视频不匹配:

```typescript
// 只使用音频的前 62.33 秒
<Audio
  src={staticFile('musc/Apple Horizon.mp3')}
  volume={0.35}
  startFrom={0}
  endAt={1870} // 62.33秒 * 30fps
/>
```

## 预览

在渲染前预览:

```bash
# 启动 Remotion Studio
pnpm start

# 在浏览器中选择 "AICityWithBGM" 组合
# 点击播放按钮预览效果
```

## 渲染状态

当前正在渲染: `aicity-promo-with-bgm.mp4`
预计完成时间: 约 15-20 分钟

## 文件结构

```
promo-video/
├── public/
│   ├── images/
│   │   └── logo.png
│   ├── ui/
│   │   ├── ui_main_interface.png
│   │   ├── ui_drill_1_national.png
│   │   ├── ui_drill_2_province.png
│   │   ├── ui_drill_3_city.png
│   │   ├── 3d_scene.png
│   │   ├── ui_ai_analysis.png
│   │   ├── ui_decision_sim.png
│   │   ├── ui_wordcloud.png
│   │   └── ui_trend_analysis.png
│   └── musc/
│       └── Apple Horizon.mp3  ← BGM 文件
├── src/
│   ├── AICityWithBGM.tsx      ← 带 BGM 的组件
│   └── ...
└── out/
    └── aicity-promo-with-bgm.mp4  ← 输出文件
```

## 注意事项

1. **版权**: 确保 BGM 有合法使用授权
2. **音量平衡**: 背景音乐不应盖过重要的视觉信息
3. **格式兼容**: MP3 格式在所有浏览器中都有良好支持
4. **文件大小**: 添加音频后视频文件会增大约 2-3 MB

## 故障排除

### 问题 1: 听不到声音
- 检查浏览器音量设置
- 确认 `volume` 参数不为 0
- 检查音频文件路径是否正确

### 问题 2: 音频不同步
- 确认视频时长与音频匹配
- 使用 `startFrom` 和 `endAt` 精确控制

### 问题 3: 渲染失败
- 检查音频文件是否损坏
- 尝试转换为标准 MP3 格式 (44.1kHz, 128-320kbps)

---

创建时间: 2025-03-12
状态: 渲染中
预计完成: 15-20 分钟
