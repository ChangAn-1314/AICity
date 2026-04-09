# 演示模式使用指南

## 功能说明

在 AICityFornt 项目中添加了"演示模式"按钮，点击后自动播放所有视频需要展示的动画序列，方便直接录屏。

## 使用步骤

### 1. 启动前端项目

```bash
cd D:\A_Files\A_Code\A_Program\A_Competitions\2025_XunFeiCup\AICity\AICityFornt
pnpm dev
```

### 2. 打开浏览器

访问 http://localhost:5173

### 3. 点击演示按钮

右上角会出现一个蓝色的"播放演示"按钮，点击后会自动执行：

**场景3：地图全景动画** (12秒)
- 0-2s: 全国视图 (zoom=4)
- 2-4s: 自动 zoom 到信阳市 (zoom=14)
- 4-5s: 切换到 3D 视角 (pitch=70)
- 5-7s: 热点标记逐个弹出
- 7-9s: 左侧新闻面板滑入
- 9-12s: 保持最终状态

### 4. 录制视频

**方法1：使用 Windows 游戏栏**
1. Win+G 打开游戏栏
2. 点击录制按钮（或 Win+Alt+R）
3. 点击"播放演示"按钮
4. 等待动画完成
5. Win+Alt+R 停止录制
6. 视频保存在 `C:\Users\用户名\Videos\Captures\`

**方法2：使用 OBS Studio**
1. 打开 OBS Studio
2. 添加来源 → 窗口捕获 → 选择浏览器窗口
3. 设置输出：1920x1080, 30fps, MP4
4. 开始录制
5. 点击"播放演示"按钮
6. 等待动画完成
7. 停止录制

### 5. 保存视频

将录制的视频重命名为 `map-overview.mp4`，保存到：
```
D:\A_Files\A_Code\A_Program\A_Competitions\2025_XunFeiCup\AICity\promo-video\public\recordings\map-overview.mp4
```

### 6. 在 Remotion 中使用

视频已经可以在 Remotion 中使用了（Scene3-MapOverview.tsx 已经准备好使用 Video 组件）。

---

## 演示按钮功能

- **播放演示**: 开始自动播放动画序列
- **进度条**: 显示当前演示进度 (0-100%)
- **停止**: 中途停止演示

---

## 注意事项

1. **录制前准备**:
   - 关闭浏览器开发者工具 (F12)
   - 确保网络稳定（地图瓦片需要加载）
   - 清除浏览器缓存避免闪烁

2. **录制设置**:
   - 分辨率：1920x1080
   - 帧率：30fps
   - 格式：MP4 (H.264)

3. **录制时机**:
   - 等待地图完全加载后再点击"播放演示"
   - 录制开始后立即点击"播放演示"
   - 等待进度条到 100% 后再停止录制

---

## 扩展其他场景

如果需要录制其他场景（AI分析、决策模拟），可以在 `useDemoMode.ts` 中添加对应的动画序列：

```typescript
const executeScene4Demo = async () => {
  // AI分析场景动画
}

const executeScene6Demo = async () => {
  // 决策模拟场景动画
}
```

然后在 AppShell.vue 中添加对应的按钮。

---

## 已完成的修改

✅ 创建 `src/composables/useDemoMode.ts` - 演示模式逻辑
✅ 创建 `src/components/features/Demo/DemoButton.vue` - 演示按钮组件
✅ 修改 `src/components/layout/AppShell.vue` - 集成演示按钮

现在可以直接使用了！
