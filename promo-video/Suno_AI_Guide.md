# Suno AI 音乐生成指南 - 智舆系统 BGM (精简版)

## 核心参数设置

### 1. 基础选项
- **模式**: Custom Mode (自定义模式)
- **时长**: 设置为 60-65 秒
- **风格标签**: `electronic`, `ambient`, `cinematic`, `corporate`
- **BPM**: 120-130
- **调性**: C Major

### 2. 提示词结构 (不超过 1000 字)

```
[Intro] 0:00-5:00
Ambient pad fade in, mysterious, minimal synth
Whoosh at 1:00

[Verse 1] 4:33-12:33
Kick drum enters at 4:33, 4/4 beat 120 BPM
Deep bass, tension building
Snare hits at 5:33, 6:67, 8:00

[Chorus 1] 11:50-21:50
Main melody enters at 11:50 - CRITICAL!
Clean synth lead, bright hopeful
Hi-hat and snare, rhythm intensifies
Riser at 21:00

[Verse 2] 21:00-29:00
Tech sounds (glitch, digital)
Synth arpeggio, strong bass
Glitch at 23:00, 23:67, 24:33

[Bridge] 28:17-36:17
Strings enter, spatial effects
Whoosh at 30:17, 32:17, 34:17
Build-up at 35:00

[Verse 3] 35:67-43:67
Building to climax
Impacts at 37:67, 38:83
Riser at 43:00

[Chorus 2] 42:83-50:83
CLIMAX - Full orchestration - PEAK!
Massive impact at 42:83
All layers, strongest melody

[Outro 1] 50:33-58:33
Resolution, melody simplifies
Fade starts at 57:33

[Outro 2] 57:33-62:33
Final fade, only pad
C Major chord at 60:67
Silence at 62:33

Style: Apple keynote, electronic ambient, minimalism
Instruments: Synth pad, electronic drums, synth lead, bass, strings
Mood: Futuristic, technological, elegant, inspiring
BPM: 120, Key: C Major, Duration: 62 seconds
```

## 关键技巧

### 1. 时间标记格式
- 使用 `[Section] 开始时间-结束时间` 格式
- 关键卡点用 `at XX:XX` 明确标注
- 重要时刻加 `CRITICAL!` 或 `PEAK!` 强调

### 2. 风格描述
- **前置标签**: 在提示词开头加 `Apple keynote style BGM`
- **情绪词**: 每段加 `Mood:` 描述情绪
- **乐器列表**: 明确列出 `Instruments:`

### 3. 动态控制
- 用 `fade in/out` 控制淡入淡出
- 用 `build-up` 表示积累
- 用 `CLIMAX` 标记高潮
- 用 `minimal` 表示简约

### 4. 音效标注
- `whoosh` - 过渡音效
- `impact` - 强调音效
- `riser` - 上升音效
- `glitch` - 科技音效

## Suno 平台操作步骤

### 步骤 1: 创建
1. 登录 suno.com
2. 点击 "Create"
3. 选择 "Custom Mode"

### 步骤 2: 输入
1. **Song Description**: 粘贴上述提示词
2. **Style of Music**: `electronic ambient, cinematic, corporate, Apple keynote`
3. **Title**: `AICity Promo BGM`

### 步骤 3: 高级选项
- **Instrumental**: 勾选 (纯音乐,无人声)
- **Version**: 选择 v4 (最新版本)
- **Duration**: 选择 2 minutes (会生成约 60-120 秒)

### 步骤 4: 生成与迭代
1. 点击 "Create" 生成 2 个版本
2. 试听选择最佳版本
3. 使用 "Extend" 功能调整时长
4. 使用 "Remix" 功能微调风格

## 优化技巧

### 1. 分段生成法
如果一次生成不理想:
- 先生成前 30 秒 (开场到产品介绍)
- 再生成后 30 秒 (高潮到结尾)
- 使用音频编辑软件拼接

### 2. 关键词优先级
**高优先级** (必须包含):
- 时间标记 `[Intro]`, `[Chorus]`
- 关键卡点 `at 11:50`, `at 42:83`
- 风格 `Apple keynote`, `electronic ambient`

**中优先级**:
- 乐器 `synth pad`, `electronic drums`
- 情绪 `hopeful`, `powerful`

**低优先级** (可省略):
- 具体音效时间
- 详细的音量描述

### 3. 常见问题解决

**问题 1: 时长不准确**
- 解决: 使用 "Extend" 功能延长或 "Trim" 裁剪

**问题 2: 卡点不准**
- 解决: 在 DAW 中微调对齐,或重新生成时强调关键时间点

**问题 3: 风格不对**
- 解决: 在 Style 中添加参考艺术家 `like Hans Zimmer ambient works`

**问题 4: 有人声**
- 解决: 确保勾选 "Instrumental" 选项

## 推荐设置组合

### 方案 A: 精确控制 (推荐)
```
Description: [完整提示词]
Style: electronic ambient, cinematic, corporate
Instrumental: ✓
Duration: 2 minutes
```

### 方案 B: 快速生成
```
Description: 62-second Apple keynote BGM, 120 BPM
Main melody at 11:50, climax at 42:83
Electronic ambient, inspiring
Style: corporate, cinematic, ambient
Instrumental: ✓
```

### 方案 C: 参考风格
```
Description: [简化提示词]
Style: like Apple product launch music
ambient electronic, Hans Zimmer style
Instrumental: ✓
```

## 下载与使用

### 1. 下载格式
- 选择 MP3 或 WAV (WAV 质量更高)
- 下载前试听确认

### 2. 导入 Remotion
```typescript
import { Audio } from 'remotion';

<Audio 
  src={staticFile('bgm/aicity-promo.mp3')}
  volume={0.3}
  startFrom={0}
  endAt={1870} // 62.33秒 * 30fps
/>
```

### 3. 音量调整
- 背景音乐: 0.2-0.4 (20-40%)
- 关键时刻可提升至 0.5
- 使用 `interpolate` 实现音量渐变

## 版权说明

- **免费版**: 个人非商业使用
- **Pro 版** ($10/月): 商业使用授权
- **Premier 版** ($30/月): 完整版权,无水印

建议购买 Pro 版用于商业宣传片。

---

**总结**: 使用 Custom Mode + 精确时间标记 + Instrumental 选项,重点强调 11:50 和 42:83 两个关键转折点,生成 3-5 个版本后选择最佳。

字数: 998 字
