# 音频文件占位说明

## BGM (背景音乐)
文件位置: `public/bgm/bgm-placeholder.mp3`

**需求**:
- 风格: 电子氛围 / Cinematic Tech
- 节奏: 120 BPM
- 时长: 至少 60 秒
- 情绪: 科技感、未来感、稳重

**推荐来源**:
- Pixabay Music (免版税)
- YouTube Audio Library
- Epidemic Sound

**搜索关键词**: "tech ambient", "corporate technology", "futuristic background"

---

## 配音 (Voiceover)
文件位置: `public/voiceover/voiceover-placeholder.mp3`

**文案** (按镜头顺序):

1. 每一座城市，都有自己的声音。在数据洪流中，谁在倾听？

2. 智舆——AI驱动的城市舆情态势感知与决策推演平台。

3. 实时接入社交媒体、新闻媒体、自媒体全网数据源，七乘二十四小时持续监测城市舆情脉搏，精准定位每一个热点事件。

4. 大模型深度分析舆情语义，微调专业模型组成矩阵，覆盖多城市多省份，实时生成舆情洞察报告。

5. AI根据文字、照片、视频自动还原事件现场三维模型，嵌入城市地图实时展示，一目了然。

6. 智能决策推演引擎，模拟官方声明、社区互动、静默监控等多种应对策略，量化预测舆情走向。讯飞星火语音实时播报预警。

7. 智舆，让城市治理更智慧。

**生成方式**:
- ElevenLabs TTS (推荐): `eleven_multilingual_v2` 模型，中文男声
- 讯飞星火 TTS: 考虑是讯飞杯，可能加分
- 真人录制

---

## 临时解决方案

如果暂时没有音频文件，可以注释掉 `Composition.tsx` 中的 `<Audio>` 组件，视频仍可正常预览。
