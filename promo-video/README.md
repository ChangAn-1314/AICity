# 智舆 - 产品演示视频

苹果发布会风格的 1 分钟产品演示视频，使用 Remotion 制作。

## 项目信息

- **分辨率**: 1920x1080
- **帧率**: 30fps
- **时长**: 60秒 (1800帧)
- **风格**: 苹果发布会 / 赛博朋克暗色系

## 镜头列表

| 镜头 | 时长 | 内容 | 转场 |
|------|------|------|------|
| Scene1 | 0-8s | 开场粒子城市 | fade |
| Scene2 | 8-14s | Logo品牌亮相 | slide from-bottom |
| Scene3 | 14-26s | 全景地图 + 热点标记 | clockWipe |
| Scene4 | 26-36s | AI分析引擎 (词云+折线图) | fade |
| Scene5 | 36-44s | 3D现场还原 | slide from-right |
| Scene6 | 44-53s | 决策推演树 | wipe |
| Scene7 | 53-60s | 结尾CTA | - |

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动预览

```bash
pnpm studio
```

浏览器会自动打开 `http://localhost:3000`

### 3. 渲染视频

```bash
pnpm render
```

输出文件: `out/promo.mp4`

## 音频文件

音频文件需要手动添加到 `public/` 目录：

- `public/bgm/bgm-placeholder.mp3` - 背景音乐 (120 BPM, 科技感)
- `public/voiceover/voiceover-placeholder.mp3` - 配音

详见 `public/AUDIO_README.md` 中的完整配音文案和BGM需求。

**临时方案**: 如果没有音频文件，视频仍可正常预览和渲染（静音）。

## 字体

项目使用 Google Fonts，首次运行时会自动下载：

- **Noto Sans SC** (中文标题/正文)
- **Inter Tight** (英文)
- **JetBrains Mono** (等宽数据)

## 技术栈

- **Remotion** 4.0.446 - React 视频框架
- **Three.js** + **@remotion/three** - 3D 粒子动画
- **@remotion/transitions** - 镜头转场
- **@remotion/google-fonts** - 字体加载

## 项目结构

```
promo-video/
├── src/
│   ├── scenes/           # 7个镜头组件
│   ├── components/       # 通用组件 (TypewriterText, GlassPanel)
│   ├── config.ts         # 全局配置 (颜色/字体/时长)
│   ├── Composition.tsx   # 主组合
│   ├── Root.tsx          # Remotion 入口
│   └── index.ts
├── public/
│   ├── assets/images/    # logo.png
│   ├── bgm/              # 背景音乐 (待添加)
│   └── voiceover/        # 配音 (待添加)
├── package.json
├── tsconfig.json
└── remotion.config.ts
```

## 配音文案

完整配音文案 (7段，总时长约50-55秒):

1. 每一座城市，都有自己的声音。在数据洪流中，谁在倾听？
2. 智舆——AI驱动的城市舆情态势感知与决策推演平台。
3. 实时接入社交媒体、新闻媒体、自媒体全网数据源，七乘二十四小时持续监测城市舆情脉搏，精准定位每一个热点事件。
4. 大模型深度分析舆情语义，微调专业模型组成矩阵，覆盖多城市多省份，实时生成舆情洞察报告。
5. AI根据文字、照片、视频自动还原事件现场三维模型，嵌入城市地图实时展示，一目了然。
6. 智能决策推演引擎，模拟官方声明、社区互动、静默监控等多种应对策略，量化预测舆情走向。讯飞星火语音实时播报预警。
7. 智舆，让城市治理更智慧。

## 调整参数

所有时长、颜色、字体配置集中在 `src/config.ts`：

```typescript
export const SCENE_DURATIONS = {
  scene1: 240,   // 修改镜头1时长
  scene2: 180,
  // ...
};

export const COLORS = {
  cyan: "#06b6d4",  // 修改主题色
  // ...
};
```

## 注意事项

1. **首次运行较慢**: Google Fonts 需要下载，Three.js 需要编译
2. **内存占用**: 3D 场景和粒子系统需要较多内存，建议 8GB+ RAM
3. **渲染时间**: 1800帧 @ 1080p 约需 5-10 分钟（取决于硬件）
4. **音频同步**: 如果添加了配音，需根据实际语速微调各镜头的 `SCENE_DURATIONS`

## 故障排查

### 字体加载失败
```bash
# 清除缓存重试
rm -rf node_modules/.remotion
pnpm studio
```

### Three.js 渲染黑屏
检查 `ThreeCanvas` 的 `width` 和 `height` 是否正确设置。

### 转场卡顿
降低粒子数量 `PARTICLE_COUNT` (Scene1-Opening.tsx)。

## 后续优化

- [ ] 添加真实 BGM 和配音
- [ ] 根据配音时长微调镜头时长
- [ ] 优化 Scene3 地图场景（可考虑用真实地图截图）
- [ ] 添加更多微动效（如镜头6的决策树节点闪烁）
- [ ] 渲染 4K 版本 (3840x2160)

## License

2025 讯飞杯参赛作品
