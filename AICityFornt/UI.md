### 1. 设计理念 (Design Concept)

- **核心主题**: `Cyberpunk` (赛博朋克) + `Glassmorphism` (毛玻璃拟态) + `Data Vis` (数据可视化)。
- **视觉关键词**: 沉浸式、半透明、霓虹光效、全息投影、流动感。
- **用户体验**: 强调信息的层级与直观展示，通过微交互提升操作的反馈感。

### 2. 色彩系统 (Color System)

采用深色模式作为基底，以突显光效和数据图表。

- **背景色 (Background)**:
  - `Base`: `#0F172A` (Slate 900) - 深邃的蓝黑色，作为主背景。
  - `Overlay`: `rgba(15, 23, 42, 0.6)` - 用于遮罩或叠加层。
- **主色调 (Primary)**:
  - `Cyber Blue`: `#06B6D4` (Cyan 500) -> `#22D3EE` (Cyan 400) - 用于核心数据、选中状态、科技线条。
- **强调色 (Accent)**:
  - `Neon Purple`: `#A855F7` (Purple 500) - 用于辅助图形、渐变光晕。
  - `Alert Red`: `#EF4444` (Red 500) - 用于警报、异常状态。
  - `Success Green`: `#10B981` (Emerald 500) - 用于健康、通畅状态。
- **中性色 (Neutral)**:
  - `Text Primary`: `#F8FAFC` (Slate 50) - 主要文字。
  - `Text Secondary`: `#94A3B8` (Slate 400) - 次要标签、说明文字。
  - `Glass Border`: `rgba(255, 255, 255, 0.1)` - 用于卡片描边。

### 3. 布局结构 (Layout Structure)

采用 **Bento Grid (便当盒布局)** 或 **Dashboard (仪表盘布局)** 风格，利用 CSS Grid/Flex 实现全响应式适配。

- **断点策略**:

  - `Desktop (lg/xl)`: 完整的三栏布局（侧边栏 + 核心地图 + 右侧面板）。
  - `Mobile (xs/sm)`: 单列布局。地图作为背景，功能面板折叠，通过底部抽屉或浮动按钮唤起。

- **底层 (Layer 0)**: 动态背景 (`LiquidBackground`) 或 3D 城市地图模型。
- **顶层 (Layer 1)**: 悬浮的半透明玻璃卡片 (`GlassCard`)。
  - **顶部 (Header)**: 全局状态栏（时间、天气、系统通知、用户档案）。
  - **顶侧 (Sidebar)**: 导航菜单（概览、交通、能源、安防、设置）。
  - **中心 (Main View)**: 核心交互区（3D 地图、实时监控画面、主数据大屏）。
  - **右侧/底部 (Widgets)**: 数据模块（关键指标 KPI、实时日志、控制面板）。
- **覆盖层 (Layer 2/Admin)**: **全屏模态 (Admin Overlay)**。
  - 位于所有内容之上，但在系统通知之下。
  - 背景使用极高模糊度 (`backdrop-blur-2xl`) 和深色遮罩 (`bg-slate-900/90`)，以完全聚焦管理任务。
  - 包含独立的侧边栏和内容区，但保持与主界面一致的 Glassmorphism 风格。

### 4. 关键组件设计 (Component Design)

#### A. 玻璃面板 (GlassPanel)

所有面板采用统一的毛玻璃效果，确保背景可见，增强空间感。组件路径: `src/components/ui/GlassPanel.vue`

- **样式**:
  - 背景: `bg-slate-900/40` (高模糊度 `backdrop-blur-xl`)
  - 边框: `border border-white/10`
  - 圆角: `rounded-2xl` or `rounded-3xl`
  - 阴影: `shadow-lg shadow-cyan-500/10` (带微弱色光的阴影)

#### B. 导航 (Navigation)

- **方案**: 顶部 `DynamicIsland` (灵动岛) 风格导航，整合状态与菜单，节省空间。

#### C. 数据可视化 (Charts & Metrics)

- **仪表盘**: 环形进度条，使用青色到紫色的渐变。
- **波形图**: 模拟声波或心跳，展示实时流量/能耗。
- **地图标记**: 在 3D 地图上使用脉冲光点 (`animate-ping`) 标记事件地点。

#### D. 字体排版 (Typography)

- **字体**: `Inter` 或 `Orbitron` (用于标题/数字，增加科技感)。
- **数字**: 等宽字体 (Monospaced)，确保数字跳动时布局不抖动。

### 5. 交互与动效 (Interaction & Animation)

- **Hover 效果**: 鼠标悬停卡片时，边框亮度增加，背景轻微提亮 (`hover:bg-white/5`)，或出现光标跟随效果 (Spotlight effect)。
- **加载动画**: 页面进入时，卡片依次错落上浮 (`staggered fade-in-up`)。
- **数据更新**: 数字变化时采用滚动计数器动画 (Counter up)。
- **背景**: 缓慢流动的极光或网格线条，营造“城市呼吸”的感觉。

### 6. 技术实现建议 (Tech Stack Recommendation)

基于当前采用的技术栈 (Vue 3 + Tailwind):

- **框架**: Vue 3 + Vite (Composition API)
- **布局**: CSS Grid / Flexbox + TailwindCSS
- **样式**: Tailwind CSS (大量使用 opacity modifiers, backdrop-blur, gradients)
  - Example: `bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-md border border-white/10`
- **UI 组件**: Element Plus (企业级组件库)
- **图标**: `@element-plus/icons-vue` (加上发光滤镜 `drop-shadow`)
- **图表**: `ECharts` (功能强大，支持 3D 和词云)
- **3D/地图**: `高德 JS API 2.0` (3D 地图) + `Three.js` (GLCustomLayer 3D 模型)
- **动画**: CSS Transitions + Vue Transition (轻量级动画方案)
- **状态管理**: Pinia
