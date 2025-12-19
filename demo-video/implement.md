# 项目演示视频实施方案 (Apple Style)

## 1. 核心技术选型
采用 **Remotion** (React-based Video Generation) 结合 **Three.js** 进行纯代码视频制作。
- **Remotion**: 用于时间轴管理、视频合成与渲染。
- **React Three Fiber (@remotion/three)**: 用于加载 3D 样机模型 (iPhone/MacBook) 并构建 3D 场景。
- **Web 技术**: 全程使用 TypeScript/React/CSS，无需 AE 或 Premiere。

## 2. 视觉风格定义 (Apple Style)
- **极简主义**: 纯白或深灰背景，无杂乱元素。
- **高级质感**: 3D 设备具有逼真的金属反光和玻璃质感 (PBR 材质)。
- **平滑运镜**: 使用带有缓动 (Easing) 的摄像机平移、推拉、旋转。
- **动态光影**: 柔和的演播室布光 (Studio Lighting)。

## 3. 具体实施步骤

### 第一阶段：素材准备 (内容录制)
为了保证演示的流畅性和高画质（尤其是 3D 地图和动画），建议先将前端操作录制为视频素材，再作为纹理贴图映射到 3D 样机上。
*虽然 Remotion 支持 Puppeteer 实时抓取，但对于 WebGL 重度应用（如 AICity 的地图），预录制能保证 60fps 的流畅度。*

**录制脚本规划 (建议录制分辨率: 1920x1080 或 4K):**
1.  **登录与进入**: 从登录页点击登录，平滑过渡到管理大屏。
2.  **大屏概览**: 鼠标悬停在“动态岛”导航栏，展示各个模块。
3.  **核心功能演示 - 3D 地图**:
    -   点击“地图模式”。
    -   演示“高空下潜” (Fly-to) 动画（从全国视角飞入信阳）。
    -   展示边界呼吸灯效和建筑全息效果。
4.  **数据分析交互**: 点击图表或切换数据维度的操作。

### 第二阶段：工程搭建 (demo-video 目录)
1.  **初始化项目**:
    ```bash
    npx create-remotion@latest --template=three
    ```
2.  **目录结构**:
    ```
    src/
    ├── assets/
    │   ├── models/       # iPhone15.glb, Macbook.glb
    │   └── videos/       # screen_recording.mp4 (录制的 AICity 操作)
    ├── components/
    │   ├── PhoneModel.tsx # 封装 3D 手机组件，包含 VideoTexture
    │   └── Scene.tsx      # 3D 场景设定 (光照, 环境)
    └── Composition.tsx    # 主视频时间轴编排
    ```

### 第三阶段：场景编排与运镜 (关键点)

#### 场景 1: 开场 (Intro)
-   **画面**: 设备从画面下方缓慢浮起，略微旋转展示金属边框光泽。
-   **屏幕**: 显示 AICity 的 Logo 或登录页。
-   **运镜**: 摄像机由远及近，Focus 在屏幕中心。

#### 场景 2: 功能演示 (Feature Walkthrough)
-   **画面**: 屏幕内容播放预录制的“地图下潜”片段。
-   **交互模拟**:
    -   当视频中出现“点击”动作时，3D 设备可以配合做一个微小的“点击震动”或“倾斜”反馈。
    -   **运镜配合**:
        -   当展示地图细节时，摄像机推近 (Zoom In) 到屏幕局部。
        -   当切换页面时，摄像机快速平移 (Whip Pan) 或旋转设备角度。

#### 场景 3: 动态特写 (Close-ups)
-   利用 3D 摄像机的景深 (Depth of Field) 效果，虚化背景和设备边缘，聚焦在屏幕的关键数据面板上。

### 第四阶段：渲染与输出
-   配置输出参数: 1080p, 60fps, H.264。
-   执行渲染命令生成最终 MP4。

## 4. 当前进度 (Progress)
- [x] **工程搭建**: 已初始化 Remotion + Three.js 项目 (`demo-video/`).
    -   **修复**: 解决了 `three-mesh-bvh` 与新版 Three.js 的依赖冲突。
    -   **修复**: 移除了导致网络错误的 HDRI 环境贴图，改为手动演播室布光。
- [x] **素材集成**:
    -   已集成用户提供的 iMac 2021 3D 模型 (`public/models/imac`).
- [x] **组件开发**:
    -   `IMac.tsx` (已废弃): 原计划使用 iMac 3D 样机，后应需求更改为纯屏幕展示。
    -   `ScreenOnly.tsx` (New): 实现了纯净的 3D 屏幕组件，保留了原有的动效（旋转、悬浮、震动），去除了 iMac 模型外壳。
    -   `Scene.tsx`: 调整了场景引用，用 `ScreenOnly` 替换了 `IMac`。
- [ ] **素材替换 (Waiting)**:
    -   请将 AICity 的屏幕录制视频命名为 `screen.mp4` 并放入 `public/videos/`.
    -   **注意**: 放入文件后，请在 `src/components/ScreenOnly.tsx` 中取消注释 `useVideoTexture` 相关代码。
- [x] **脚本编排 (Script Implementation)**:
    -   已调整总时长为 2400 帧 (80秒)。
    -   `CameraController.tsx`: 实现了推拉、平移、环绕、特写等 7 个场景的运镜。
    -   `Overlay.tsx`: 集成了分场景的字幕与标题动画。
    -   `ScreenOnly.tsx`: 适配了脚本中的交互动画逻辑。
- [ ] **渲染输出**: 运行 `npm run build` 生成视频。

## 5. 最终渲染指南 (Final Render Guide)

### 重要说明
**Live Preview (Html iframe) 模式仅用于开发调试**。由于 Remotion 的渲染机制，`Html` 组件创建的 CSS 叠加层不会被捕获到导出的视频中。**最终视频必须使用 Video Texture 模式**。

### 步骤 A: 录制屏幕素材
1.  **启动前端**: 确保 AICity 在 `http://localhost:5173` 运行。
2.  **录制操作视频**: 
    *   使用 OBS / QuickTime / 系统录屏工具。
    *   分辨率: **1920x1080** (Full HD)。
    *   帧率: **30fps** (与视频配置一致)。
    *   按照 `video.md` 的脚本流程录制，包括：
        - 登录界面 -> 主地图 -> 搜索城市 -> 查看舆情 -> AI分析 -> 管理后台。
    *   时长建议: **60-80秒** (可在 Remotion 中裁剪)。
3.  **保存文件**:
    *   命名为 `screen.mp4`。
    *   放入 `demo-video/public/videos/` 目录。

### 步骤 B: 启用视频纹理
1.  打开 `src/components/ScreenOnly.tsx`。
2.  找到顶部配置:
    ```tsx
    const USE_VIDEO_TEXTURE = false;
    ```
3.  改为 `true`:
    ```tsx
    const USE_VIDEO_TEXTURE = true;
    ```
4.  取消注释视频纹理代码:
    ```tsx
    const videoTexture = USE_VIDEO_TEXTURE ? useVideoTexture(staticFile('/videos/screen.mp4')) : null;
    ```
5.  更新 mesh 材质使用 `videoTexture`:
    ```tsx
    <meshBasicMaterial map={USE_VIDEO_TEXTURE ? videoTexture : placeholderTexture} />
    ```

### 步骤 B: 预览与导出
1.  **预览**:
    ```bash
    npm start
    ```
    在浏览器中检查运镜和字幕是否与画面同步。

2.  **导出**:
    ```bash
    npm run build
    ```
    生成的视频将位于 `demo-video/out/` 目录。
