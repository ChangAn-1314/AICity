# 录制前端界面指南

## 目标
录制 AICityFornt 项目的实际运行画面，嵌入到 Remotion 视频中。

## 需要录制的场景

### 场景3: 地图全景 (14s-26s, 360帧)
**录制内容**: 高德地图 3D 视图 + 热点标记 + 侧边新闻面板

**录制步骤**:
1. 启动 AICityFornt 项目
   ```bash
   cd AICityFornt
   pnpm dev
   ```

2. 打开浏览器 http://localhost:5173

3. 准备录制状态:
   - 确保地图已加载完成
   - 设置初始视角: zoom=4 (全国视图), pitch=0
   - 隐藏不需要的UI元素（如果有）

4. 使用 OBS Studio 或浏览器录屏:
   - 分辨率: 1920x1080
   - 帧率: 30fps
   - 时长: 至少 12 秒

5. 录制动作序列:
   - 0-2s: 保持全国视图
   - 2-4s: zoom 从 4 逐渐推进到 14
   - 4-5s: pitch 从 0 调整到 70 (3D视角)
   - 5-7s: 热点标记逐个出现
   - 7-9s: 左侧新闻面板滑入
   - 9-12s: 保持最终状态

6. 导出视频:
   - 格式: MP4 (H.264)
   - 文件名: `map-overview.mp4`
   - 保存到: `promo-video/public/recordings/`

### 场景4: AI分析界面 (26s-36s, 300帧)
**录制内容**: 词云 + 趋势图 + AI洞察卡片

**录制步骤**:
1. 导航到分析页面
2. 录制词云动画 + 图表绘制过程
3. 时长: 10秒
4. 保存为: `ai-analysis.mp4`

### 场景6: 决策模拟界面 (44s-53s, 270帧)
**录制内容**: 决策面板 + 模拟结果

**录制步骤**:
1. 导航到决策模拟页面
2. 录制决策选择 + 结果展示过程
3. 时长: 9秒
4. 保存为: `decision-simulation.mp4`

---

## 替代方案: 使用 Playwright 自动录制

如果手动录制不方便，可以用 Playwright 自动化：

```typescript
// scripts/record-scenes.ts
import { chromium } from 'playwright';

async function recordMapScene() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: './public/recordings/',
      size: { width: 1920, height: 1080 }
    }
  });
  
  const page = await context.newPage();
  await page.goto('http://localhost:5173');
  
  // 等待地图加载
  await page.waitForSelector('.amap-container');
  
  // 执行动画序列
  await page.evaluate(() => {
    // 调用地图 API 执行 zoom 动画
    // window.mapInstance.setZoomAndCenter(14, [114.0, 32.1], true, 2000);
  });
  
  await page.waitForTimeout(12000); // 录制 12 秒
  
  await context.close();
  await browser.close();
}

recordMapScene();
```

运行:
```bash
cd AICityFornt
pnpm add -D playwright
npx tsx scripts/record-scenes.ts
```

---

## 在 Remotion 中使用录制的视频

修改 `Scene3-MapOverview.tsx`:

```tsx
import {Video, staticFile} from "remotion";

export const Scene3MapOverview: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Video
        src={staticFile("recordings/map-overview.mp4")}
        startFrom={0}
        endAt={360}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      
      {/* 叠加字幕 */}
      <div style={{position: "absolute", top: 50, ...}}>
        <TypewriterText text="实时接入全网数据源" ... />
      </div>
    </AbsoluteFill>
  );
};
```

---

## 优点
- ✅ 完全保留真实界面效果
- ✅ 包含真实的地图3D动画
- ✅ 无需重写 Vue 组件
- ✅ 高德地图正常运行

## 注意事项
- 录制时确保网络稳定（地图瓦片加载）
- 录制前清除浏览器缓存，避免闪烁
- 使用固定的测试数据，避免随机性
- 录制时关闭浏览器开发者工具
