# 方案总结：复用前端代码实现真实界面展示

## 三种方案对比

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **1. iframe 嵌入** | 完全真实、可控制动画 | 需要前端项目同时运行、渲染慢 | ⭐⭐⭐ |
| **2. 录屏视频** | 简单快速、渲染快 | 无法动态控制、文件大 | ⭐⭐⭐⭐⭐ |
| **3. 截图序列** | 文件小、可控 | 不够流畅、需要大量截图 | ⭐⭐ |

**最终推荐：方案2（录屏视频）**

---

## 方案2：录屏视频（推荐）

### 步骤1：启动前端项目

```bash
cd D:\A_Files\A_Code\A_Program\A_Competitions\2025_XunFeiCup\AICity\AICityFornt
pnpm dev
```

### 步骤2：录制场景

使用 **OBS Studio** 或 **浏览器自带录屏**：

#### 场景3：地图全景 (需要录制 12秒)

1. 打开 http://localhost:5173
2. 准备初始状态：
   - 地图 zoom=4 (全国视图)
   - pitch=0 (平面视角)
3. 开始录制，执行动作：
   - 0-2s: 保持全国视图
   - 2-4s: 手动 zoom 到信阳市 (zoom=14)
   - 4-5s: 调整 pitch 到 70 (3D视角)
   - 5-7s: 等待热点标记出现
   - 7-9s: 等待侧边面板滑入
   - 9-12s: 保持最终状态
4. 停止录制
5. 导出为 `map-overview.mp4`
6. 放到 `promo-video/public/recordings/map-overview.mp4`

#### 场景4：AI分析 (需要录制 10秒)

1. 导航到分析页面
2. 录制词云动画 + 图表绘制
3. 保存为 `ai-analysis.mp4`

#### 场景6：决策模拟 (需要录制 9秒)

1. 导航到决策页面
2. 录制决策选择 + 结果展示
3. 保存为 `decision-simulation.mp4`

### 步骤3：修改 Remotion 场景

```tsx
// src/scenes/Scene3-MapOverview.tsx
import {Video, staticFile, AbsoluteFill} from "remotion";

export const Scene3MapOverview: React.FC = () => {
  const frame = useCurrentFrame();
  
  const subtitleOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* 真实前端录屏 */}
      <Video
        src={staticFile("recordings/map-overview.mp4")}
        startFrom={0}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      
      {/* 叠加字幕 */}
      <div style={{
        position: "absolute",
        top: 60,
        left: 0,
        right: 0,
        textAlign: "center",
        pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: FONTS.zh,
          fontSize: 36,
          fontWeight: "700",
          color: COLORS.textPrimary,
          opacity: subtitleOpacity,
          textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}>
          实时接入全网数据源
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

### 步骤4：更新 Composition

```tsx
// src/Composition.tsx
import {Scene3MapOverview} from "./scenes/Scene3-MapOverview"; // 使用录屏版本
```

---

## 方案1：iframe 嵌入（备选）

如果需要动态控制，使用 iframe 方案。

### 前端项目修改

在 `AICityFornt/src/components/features/Map/CityMap3D-AMap.vue` 的 `onMounted` 中添加：

```javascript
import {initRemotionBridge} from '@/utils/remotionBridge'

onMounted(async () => {
  // ... 原有地图初始化代码 ...
  
  // 添加 Remotion 桥接
  initRemotionBridge(mapInstance.value, mapStore)
})
```

### Remotion 场景使用

```tsx
import {Scene3MapOverviewIframe} from "./scenes/Scene3-MapOverview-Iframe";
```

**注意**：
- 需要前端项目在 http://localhost:5173 运行
- 渲染视频时会很慢（每帧都要等 iframe 加载）
- 不推荐用于最终渲染，仅用于开发预览

---

## 录屏技巧

### 使用 OBS Studio

1. 下载：https://obsproject.com/
2. 添加来源 → 窗口捕获 → 选择浏览器窗口
3. 设置 → 输出：
   - 录像格式：MP4
   - 编码器：x264
   - 比特率：8000 Kbps
   - 分辨率：1920x1080
   - 帧率：30fps
4. 开始录制

### 使用浏览器自带录屏（Chrome）

1. F12 打开开发者工具
2. Ctrl+Shift+P → 输入 "screenshot"
3. 选择 "Capture full size screenshot"
4. 或使用扩展：Loom, Screencastify

### 使用 Windows 游戏栏

1. Win+G 打开游戏栏
2. 点击录制按钮
3. Win+Alt+R 停止录制
4. 视频保存在 `C:\Users\用户名\Videos\Captures\`

---

## 当前状态

✅ 已创建 iframe 方案代码：
- `src/scenes/Scene3-MapOverview-Iframe.tsx`
- `AICityFornt/src/utils/remotionBridge.js`

✅ 已创建录屏指南：
- `RECORDING_GUIDE.md`

⏳ 待完成：
1. 录制 3 个场景的视频
2. 放到 `public/recordings/` 目录
3. 修改 Composition.tsx 使用录屏版本

---

## 推荐流程

1. **先用录屏方案**完成视频制作（快速、效果好）
2. 如果需要微调动画，再考虑 iframe 方案
3. 最终渲染时使用录屏视频（渲染速度快）
