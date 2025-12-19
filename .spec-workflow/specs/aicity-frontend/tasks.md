# Tasks Document - AICity Frontend

## 1. 基础设施

- [x] 1.1 创建 Pinia Store 基础结构

  - File: `src/stores/index.js`, `src/stores/sentiment.js`, `src/stores/map.js`, `src/stores/voice.js`
  - 创建 Pinia 实例和基础 Store
  - 定义 sentimentStore、mapStore、voiceStore 的 state/actions
  - Purpose: 为全局状态管理提供基础
  - _Leverage: src/main.js (已有 Pinia 引入)_
  - _Requirements: REQ-8_
  - _Prompt: Role: Vue.js Developer | Task: Create Pinia store infrastructure with sentimentStore, mapStore, voiceStore following REQ-8 | Success: Stores created and exported, state reactive_

  > **注**: sceneStore (场景还原) 在 11.4 任务中单独创建，因其依赖 REQ-10 功能

- [x] 1.2 创建 API 接口封装

  - File: `src/api/index.js`, `src/api/sentiment.js`, `src/api/map.js`, `src/api/decision.js`
  - 封装舆情数据、地图、决策模拟相关 API 调用
  - 使用 axios 或 fetch 封装请求
  - Purpose: 统一 API 调用入口
  - _Leverage: 无现有 API 模块_
  - _Requirements: REQ-2, REQ-3, REQ-5_
  - _Prompt: Role: Frontend Developer | Task: Create API layer with sentiment.js (getHotspots, getHotspotDetail, getAnalysis), map.js (getCityData, getRegionBoundary), decision.js (getOptions, simulate, customSimulate) | Success: API functions exported and callable_

  > **依赖说明**: 此任务和 1.1 为基础设施任务，必须在 2.x-7.x 功能模块任务之前完成

- [x] 1.3 创建工具函数模块
  - File: `src/utils/index.js`, `src/utils/format.js`, `src/utils/map.js`
  - 日期格式化、数字格式化、地图坐标转换等
  - Purpose: 提供通用工具函数
  - _Leverage: 无现有工具模块_
  - _Requirements: All_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: JavaScript Developer specializing in utility libraries | Task: Create utility modules with format.js (formatDate, formatNumber, formatLevel) and map.js (lngLatToCoords, calcDistance) | Restrictions: Pure functions only, no side effects, include JSDoc comments | Success: Utilities exported and importable, all functions have proper types/docs | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

## 2. 地图模块增强

- [x] 2.1 增强 CityMap3D-AMap 热点标记功能

  - File: `src/components/features/Map/CityMap3D-AMap.vue`
  - 优化热点标记渲染，添加级别颜色区分
  - 添加标记点击事件处理
  - Purpose: 实现 REQ-1 的热点展示功能
  - _Leverage: src/components/features/Map/CityMap3D-AMap.vue (现有代码)_
  - _Requirements: REQ-1_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: GIS Developer with AMap experience | Task: Enhance CityMap3D-AMap.vue hotspot markers with level-based colors (high=red, medium=orange, low=green), click events emitting hotspot-click, following REQ-1 | Restrictions: Do not break existing map initialization, maintain shallowRef pattern for map instance, keep component under 500 lines | Success: Markers display with correct colors, click events fire with hotspot data | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 2.2 添加地图热力图层

  - File: `src/components/features/Map/CityMap3D-AMap.vue`
  - 集成 AMap.HeatMap 插件
  - 根据舆情密度显示热力分布
  - Purpose: 直观展示舆情热度分布
  - _Leverage: src/components/features/Map/CityMap3D-AMap.vue_
  - _Requirements: REQ-1_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: GIS Developer with heatmap visualization experience | Task: Add AMap.HeatMap layer to CityMap3D-AMap.vue showing sentiment density, with toggleable visibility, following REQ-1 | Restrictions: Load HeatMap plugin dynamically, do not affect map performance, provide toggle control | Success: Heatmap renders based on hotspot data, can be toggled on/off | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 2.3 添加区域边界高亮
  - File: `src/components/features/Map/CityMap3D-AMap.vue`
  - 使用 AMap.DistrictSearch 获取行政区边界
  - 实现省/市/区/县层级切换
  - Purpose: 支持层级穿透展示
  - _Leverage: src/components/features/Map/CityMap3D-AMap.vue_
  - _Requirements: REQ-1_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: GIS Developer with AMap DistrictSearch experience | Task: Add district boundary highlighting using AMap.DistrictSearch, support province/city/district/county levels with smooth transitions, following REQ-1 | Restrictions: Cache boundary data to avoid repeated API calls, handle search errors gracefully | Success: Boundaries display correctly, level switching works smoothly | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

## 3. 舆情监测模块

- [x] 3.1 增强 NewsTicker 实时更新

  - File: `src/components/features/Monitor/NewsTicker.vue`
  - 接入 sentimentStore 数据
  - 添加新消息动画效果
  - Purpose: 实现 REQ-3 实时新闻滚动
  - _Leverage: src/components/features/Monitor/NewsTicker.vue, src/stores/sentiment.js_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with animation experience | Task: Enhance NewsTicker.vue to connect with sentimentStore, add slide-in animation for new items, emit item-click event, following REQ-3 | Restrictions: Use CSS transitions, do not use heavy animation libraries, maintain smooth scrolling | Success: Ticker displays store data, new items animate in, clicks emit events | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 3.2 创建舆情详情面板

  - File: `src/components/features/Monitor/HotspotDetail.vue`
  - 显示舆情标题、来源、时间、内容
  - 支持图片/视频预览
  - Purpose: 实现 REQ-2 详情展示
  - _Leverage: src/components/ui/GlassPanel.vue_
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with UI component expertise | Task: Create HotspotDetail.vue component showing hotspot title, source, time, content, media preview using GlassPanel as base, following REQ-2 | Restrictions: Use Element Plus components, handle missing media gracefully, keep responsive design | Success: Detail panel displays all hotspot fields, media previews work | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 3.3 添加舆情筛选功能
  - File: `src/components/features/Monitor/FilterPanel.vue`
  - 按级别、分类、时间筛选
  - 与 sentimentStore 联动
  - Purpose: 实现 REQ-2 筛选功能
  - _Leverage: src/stores/sentiment.js_
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with form handling expertise | Task: Create FilterPanel.vue with level (high/medium/low), category, and time range filters, update sentimentStore filters, following REQ-2 | Restrictions: Use Element Plus form components, debounce filter changes, persist filter state | Success: Filters update store, hotspots list reflects filters | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

## 4. AI 分析模块

- [x] 4.1 增强 InsightCard 数据展示

  - File: `src/components/features/Analysis/InsightCard.vue`
  - 接入 sentimentStore 分析数据
  - 添加情感分析可视化
  - Purpose: 实现 REQ-4 分析展示
  - _Leverage: src/components/features/Analysis/InsightCard.vue, src/stores/sentiment.js_
  - _Requirements: REQ-4_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with data visualization experience | Task: Enhance InsightCard.vue to display sentiment analysis (positive/negative/neutral gauge), connect to sentimentStore.analysis, following REQ-4 | Restrictions: Use ECharts for gauge chart, handle loading state, show placeholder when no data | Success: Sentiment gauge displays correctly, updates with store data | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 4.2 创建关键词云图组件

  - File: `src/components/features/Analysis/KeywordCloud.vue`
  - 使用 ECharts wordCloud 扩展
  - 展示舆情关键词
  - Purpose: 实现 REQ-4 关键词展示
  - _Leverage: echarts, echarts-wordcloud_
  - _Requirements: REQ-4_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Data Visualization Developer with ECharts experience | Task: Create KeywordCloud.vue using echarts-wordcloud extension, display keywords from sentimentStore.analysis.keywords, following REQ-4 | Restrictions: Install echarts-wordcloud if needed, handle empty keywords array, make responsive | Success: Word cloud renders keywords with proper sizing, updates on data change | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 4.3 创建趋势预测图表
  - File: `src/components/features/Analysis/TrendChart.vue`
  - 使用 ECharts 折线图
  - 展示历史趋势和预测曲线
  - Purpose: 实现 REQ-4 趋势预测
  - _Leverage: echarts_
  - _Requirements: REQ-4_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Data Visualization Developer with ECharts experience | Task: Create TrendChart.vue using ECharts line chart, show historical trend (solid line) and prediction (dashed line), following REQ-4 | Restrictions: Use ECharts options properly, handle resize, show loading state | Success: Chart renders with historical and predicted data, responsive | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

## 5. 决策模拟模块

- [x] 5.1 增强 DecisionPanel 交互

  - File: `src/components/features/Simulation/DecisionPanel.vue`
  - 添加决策选项列表
  - 实现选项选择和模拟触发
  - Purpose: 实现 REQ-5 决策选择
  - _Leverage: src/components/features/Simulation/DecisionPanel.vue_
  - _Requirements: REQ-5_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with interactive UI experience | Task: Enhance DecisionPanel.vue with decision options list, selection state, simulate button emitting decision-select and simulate events, following REQ-5 | Restrictions: Use Element Plus Radio/Button groups, show risk level indicators, maintain clean UI | Success: Options selectable, simulate button triggers event with selected option | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 5.2 创建模拟结果展示组件

  - File: `src/components/features/Simulation/SimulationResult.vue`
  - 展示多场景对比（乐观/中性/悲观）
  - 使用 ECharts 柱状图对比
  - Purpose: 实现 REQ-5 结果展示
  - _Leverage: echarts, src/components/ui/GlassPanel.vue_
  - _Requirements: REQ-5_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Data Visualization Developer | Task: Create SimulationResult.vue showing optimistic/neutral/pessimistic scenarios comparison using ECharts bar chart, display recommendation text, following REQ-5 | Restrictions: Use grouped bar chart, color code scenarios, handle loading state | Success: Results display with scenario comparison, recommendation visible | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 5.3 添加自定义决策输入
  - File: `src/components/features/Simulation/CustomDecision.vue`
  - 文本输入自定义决策
  - 调用 AI 进行模拟
  - Purpose: 实现 REQ-5 自定义决策
  - _Leverage: src/api/decision.js_
  - _Requirements: REQ-5_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer | Task: Create CustomDecision.vue with text input for custom decision description, submit button calling decisionApi.customSimulate, following REQ-5 | Restrictions: Validate input length, show loading during simulation, handle API errors | Success: Custom input submits, simulation results return | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

## 6. 语音交互模块

- [x] 6.1 创建语音交互 Store

  - File: `src/stores/voice.js`
  - 管理语音状态（监听中/播放中）
  - 封装讯飞 API 调用逻辑
  - Purpose: 为语音交互提供状态管理
  - _Leverage: src/stores/index.js_
  - _Requirements: REQ-6_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with WebSocket experience | Task: Create voiceStore with isListening, isSpeaking, transcript states, startListening/stopListening/speak actions (mock for now), following REQ-6 | Restrictions: Prepare WebSocket connection structure for future XunFei integration, handle state transitions properly | Success: Store created with all states and actions, can be used by components | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 6.2 创建语音交互组件

  - File: `src/components/features/Voice/VoiceButton.vue`
  - 麦克风按钮，点击开始/停止录音
  - 显示录音状态动画
  - Purpose: 实现 REQ-6 语音输入入口
  - _Leverage: src/stores/voice.js, src/components/ui/NeonButton.vue_
  - _Requirements: REQ-6_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with audio/animation experience | Task: Create VoiceButton.vue with microphone icon, toggle listening state on click, show pulse animation when listening, using voiceStore, following REQ-6 | Restrictions: Use CSS animations, handle browser permissions gracefully, show status indicator | Success: Button toggles listening, animation shows state, store updates | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 6.3 创建语音指令解析
  - File: `src/utils/voiceCommand.js`
  - 解析语音转文字结果
  - 映射到系统操作（切换城市、查看详情等）
  - Purpose: 实现 REQ-6 语音指令
  - _Leverage: src/stores/map.js, src/stores/sentiment.js_
  - _Requirements: REQ-6_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: NLP Developer | Task: Create voiceCommand.js with parseCommand function recognizing commands like "切换到[城市]", "显示[级别]舆情", "播报预警", returning action objects, following REQ-6 | Restrictions: Use simple keyword matching for now, handle unrecognized commands gracefully, support Chinese commands | Success: Commands parsed to action objects, can trigger store actions | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

## 7. 布局与集成

- [x] 7.1 增强 AppShell 布局

  - File: `src/components/layout/AppShell.vue`
  - 优化侧边栏和主内容区布局
  - 添加响应式断点处理
  - Purpose: 实现 REQ-7 布局优化
  - _Leverage: src/components/layout/AppShell.vue_
  - _Requirements: REQ-7_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with responsive design expertise | Task: Enhance AppShell.vue layout with collapsible sidebar, responsive breakpoints (mobile/tablet/desktop), slot-based content areas, following REQ-7 | Restrictions: Use TailwindCSS breakpoints, maintain existing slot structure, smooth transitions | Success: Layout adapts to screen sizes, sidebar collapses on mobile | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 7.2 增强 DynamicIsland 导航

  - File: `src/components/layout/DynamicIsland.vue`
  - 添加功能模块切换
  - 显示当前状态指示
  - Purpose: 实现 REQ-7 导航功能
  - _Leverage: src/components/layout/DynamicIsland.vue_
  - _Requirements: REQ-7_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with navigation UI experience | Task: Enhance DynamicIsland.vue with module switching (Map/Monitor/Analysis/Simulation), active state indicator, status badges, following REQ-7 | Restrictions: Use Element Plus icons, smooth hover effects, maintain floating design | Success: Navigation switches views, active state visible, badges update | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 7.3 组件集成与数据流测试
  - File: `src/App.vue`
  - 集成所有功能模块
  - 验证组件间数据流
  - Purpose: 完成整体集成
  - _Leverage: All components and stores_
  - _Requirements: All_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Senior Frontend Developer | Task: Integrate all components in App.vue, verify data flow between Map-Monitor-Analysis-Simulation modules through Pinia stores, test all REQ scenarios | Restrictions: Do not modify individual component logic, focus on wiring and integration, add console logs for debugging | Success: All components render, data flows correctly, user interactions work end-to-end | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

## 8. WebSocket 实时通信

- [x] 8.1 创建 WebSocket 服务

  - File: `src/services/websocket.js`
  - 封装 Socket.io 连接
  - 处理连接/断开/重连
  - Purpose: 为实时更新提供基础
  - _Leverage: socket.io-client (已安装)_
  - _Requirements: REQ-3, REQ-8_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with WebSocket experience | Task: Create websocket.js service wrapping Socket.io with connect/disconnect/reconnect logic, event subscription pattern, following REQ-3 and REQ-8 | Restrictions: Auto-reconnect with exponential backoff, max 5 retries, emit connection status events | Success: WebSocket connects, reconnects on disconnect, events can be subscribed | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 8.2 集成实时数据更新

  - File: `src/stores/sentiment.js`
  - 订阅 WebSocket 舆情更新事件
  - 实时更新 hotspots 数据
  - Purpose: 实现 REQ-3 实时更新
  - _Leverage: src/services/websocket.js, src/stores/sentiment.js_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer | Task: Integrate WebSocket service in sentimentStore, subscribe to hotspot-update events, merge new data into hotspots array, following REQ-3 | Restrictions: Handle duplicate entries, maintain array reactivity, update loading states | Success: New hotspots appear in real-time, store updates correctly | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 8.3 创建 useWebSocket 组合式函数

  - File: `src/composables/useWebSocket.js`
  - 提供响应式 WebSocket 状态 (connected, error)
  - 封装 subscribe/unsubscribe 逻辑
  - Purpose: 为组件提供便捷的 WebSocket 集成
  - _Leverage: src/services/websocket.js_
  - _Requirements: REQ-3, REQ-8_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with Composition API expertise | Task: Create useWebSocket composable with reactive connected/error states, subscribe(event, callback) and unsubscribe(event) methods, auto-cleanup on unmount | Restrictions: Use ref for reactive state, return cleanup function, handle multiple subscriptions | Success: Composable provides reactive connection state, subscriptions work, cleanup on unmount | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

## 9. UI/UX 视觉效果 (UI.md & UX.md)

- [x] 9.1 实现聚焦模式 (Focus Mode)

  - File: `src/composables/useFocusMode.js`, `src/components/layout/AppShell.vue`
  - 点击事件时非相关 UI 降低透明度 (Dimming)
  - 背景模糊，突出当前聚焦内容
  - Purpose: 实现 UX.md 定义的聚焦模式交互
  - _Leverage: src/components/layout/AppShell.vue, src/stores/sentiment.js_
  - _Requirements: UX 设计规范_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with CSS animation expertise | Task: Create useFocusMode composable managing focus state, when hotspot selected dim other UI elements (opacity: 0.3), blur background, highlight focused panel, integrate in AppShell | Restrictions: Use CSS transitions for smooth effect, provide global state via composable, allow escape key to exit focus mode | Success: Clicking hotspot dims surrounding UI, focus panel highlighted, escape exits focus mode | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 9.2 实现数据流光效果 (Data Flow Animation)

  - File: `src/components/ui/DataFlowLine.vue`, `src/styles/animations.css`
  - 组件连接处流动光线效果
  - 暗示数据正在传输和 AI 正在推理
  - Purpose: 实现 UX.md 定义的数据流光效果
  - _Leverage: TailwindCSS animations_
  - _Requirements: UX 设计规范_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: CSS Animation Developer | Task: Create DataFlowLine.vue component with flowing light animation using CSS gradients and keyframes, add to connections between Map-Analysis-Simulation panels, create animations.css with reusable animation classes | Restrictions: Use CSS only (no JS animation libraries), optimize for performance, support different directions | Success: Light flows along connection lines, animation smooth at 60fps, can indicate active data transfer | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 9.3 增强赛博朋克视觉主题

  - File: `src/styles/cyberpunk.css`, `src/components/ui/GlassPanel.vue`
  - 添加霓虹边框光效 (Neon Glow)
  - 添加扫描线效果 (Scanline)
  - 优化毛玻璃卡片样式
  - Purpose: 强化 UI.md 定义的赛博朋克风格
  - _Leverage: src/components/ui/GlassPanel.vue, TailwindCSS_
  - _Requirements: UI 设计规范_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: UI Developer with Cyberpunk aesthetics expertise | Task: Create cyberpunk.css with neon glow effects (cyan/purple gradients), scanline overlay, enhance GlassPanel.vue with hover glow border animation, add shadow-cyan-500/20 glow | Restrictions: Follow UI.md color system exactly, use CSS custom properties for theme colors, ensure readability not compromised | Success: Cards have neon glow on hover, subtle scanline overlay visible, cyberpunk aesthetic achieved | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 9.4 实现脉冲标记动画 (Pulse Markers)

  - File: `src/components/features/Map/CityMap3D-AMap.vue`
  - 热点标记使用脉冲动画 (animate-ping)
  - 高级别事件脉冲更明显
  - Purpose: 实现 UX.md 定义的脉冲光点标记
  - _Leverage: src/components/features/Map/CityMap3D-AMap.vue, TailwindCSS_
  - _Requirements: REQ-1, UX 设计规范_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: GIS Developer with animation experience | Task: Enhance map markers in CityMap3D-AMap.vue with CSS pulse animation, high-level hotspots have larger/faster pulse (animate-ping), use AMap custom marker with HTML overlay | Restrictions: Do not affect map performance, pulse color matches level (red/orange/green), animation should be subtle not distracting | Success: Map markers pulse based on level, animation smooth, visually indicates urgency | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 9.5 实现加载动画 (Staggered Entrance)

  - File: `src/composables/useStaggeredEntrance.js`, `src/components/layout/AppShell.vue`
  - 页面进入时卡片依次错落上浮
  - 使用 Vue Transition Group
  - Purpose: 实现 UI.md 定义的加载动画
  - _Leverage: Vue TransitionGroup, TailwindCSS_
  - _Requirements: UI 设计规范_
  - _Prompt: Role: Vue.js Developer | Task: Create useStaggeredEntrance composable with staggered fade-in-up animation | Success: Page loads with cards animating in sequence_

- [x] 9.6 创建样式入口文件

  - File: `src/styles/main.css`
  - 导入 TailwindCSS 指令
  - 导入 cyberpunk.css 和 animations.css
  - 定义 CSS 自定义属性 (主题色)
  - Purpose: 提供统一的样式入口
  - _Leverage: TailwindCSS, src/styles/_
  - _Requirements: UI 设计规范_
  - _Prompt: Role: CSS Developer | Task: Create main.css importing Tailwind directives, cyberpunk.css, animations.css, define CSS custom properties for theme colors | Success: main.css is single entry point, all styles load correctly_

## 10. 测试

- [x] 10.1 配置 Vitest 测试环境

  - File: `vitest.config.js`, `package.json`
  - 安装 Vitest 和 @vue/test-utils
  - 配置测试环境和覆盖率报告
  - Purpose: 为单元测试和集成测试提供基础
  - _Leverage: Vite 配置_
  - _Requirements: 非功能需求 - 代码质量_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer with testing expertise | Task: Configure Vitest testing environment, install vitest @vue/test-utils @testing-library/vue, create vitest.config.js with jsdom environment, add test scripts to package.json | Restrictions: Use Vitest (not Jest), configure coverage with v8, set up path aliases matching vite.config.js | Success: npm run test works, coverage report generates, Vue components can be mounted | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 10.2 Store 单元测试

  - File: `src/stores/__tests__/sentiment.test.js`, `src/stores/__tests__/map.test.js`
  - 测试 Store 的 state 和 actions
  - 测试异步操作和错误处理
  - Purpose: 确保状态管理逻辑正确
  - _Leverage: src/stores/sentiment.js, src/stores/map.js_
  - _Requirements: REQ-8_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer with Pinia testing experience | Task: Write unit tests for sentimentStore (fetchHotspots, selectHotspot, analyzeHotspot actions) and mapStore (setCity, setView actions), test state mutations and async behavior | Restrictions: Use setActivePinia for store isolation, mock API calls, test both success and error cases | Success: All store actions tested, coverage > 80%, tests run in isolation | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 10.3 工具函数单元测试

  - File: `src/utils/__tests__/format.test.js`, `src/utils/__tests__/map.test.js`
  - 测试格式化函数和地图工具函数
  - 覆盖边界情况
  - Purpose: 确保工具函数正确性
  - _Leverage: src/utils/format.js, src/utils/map.js_
  - _Requirements: All_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer with unit testing expertise | Task: Write unit tests for format.js (formatDate, formatNumber, formatLevel) and map.js (lngLatToCoords, calcDistance), test edge cases like null/undefined inputs | Restrictions: Pure function testing, no mocks needed, achieve 100% coverage for utilities | Success: All utility functions tested, edge cases covered, tests pass | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 10.4 组件单元测试

  - File: `src/components/__tests__/InsightCard.test.js`, `src/components/__tests__/NewsTicker.test.js`
  - 测试组件渲染和交互
  - 测试 Props 和 Events
  - Purpose: 确保 UI 组件行为正确
  - _Leverage: @vue/test-utils, src/components/features/_
  - _Requirements: REQ-3, REQ-4_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend QA Engineer with Vue testing experience | Task: Write component tests for InsightCard.vue (props rendering, sentiment display) and NewsTicker.vue (item rendering, click events), use @vue/test-utils mount/shallowMount | Restrictions: Mock store dependencies, test user interactions with fireEvent, snapshot testing optional | Success: Components render correctly with props, events emit properly, tests pass | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 10.5 API 模块单元测试

  - File: `src/api/__tests__/sentiment.test.js`, `src/api/__tests__/decision.test.js`
  - 测试 API 调用和错误处理
  - Mock 网络请求
  - Purpose: 确保 API 层正确性
  - _Leverage: src/api/sentiment.js, src/api/decision.js_
  - _Requirements: REQ-2, REQ-5_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend QA Engineer with API testing experience | Task: Write unit tests for sentiment API (getHotspots, getAnalysis) and decision API (simulate), mock fetch/axios responses, test error handling | Restrictions: Use vi.mock for HTTP mocking, test network errors, test response parsing | Success: API functions tested, error handling verified, mocks work correctly | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 10.6 集成测试 - Store 与 API

  - File: `src/__tests__/integration/storeApi.test.js`
  - 测试 Store 调用 API 的完整流程
  - 测试数据流从 API 到 Store 到组件
  - Purpose: 验证模块间协作
  - _Leverage: src/stores/, src/api/_
  - _Requirements: REQ-2, REQ-8_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Integration Test Engineer | Task: Write integration tests verifying sentimentStore.fetchHotspots calls sentimentApi.getHotspots and updates state correctly, test full data flow from API response to store state | Restrictions: Mock only external HTTP, test real store-API interaction, verify state updates | Success: Integration flow works end-to-end, data transforms correctly, state consistent | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 10.7 集成测试 - 组件与 Store

  - File: `src/__tests__/integration/componentStore.test.js`
  - 测试组件从 Store 获取数据并渲染
  - 测试用户操作触发 Store 更新
  - Purpose: 验证 UI 与状态的集成
  - _Leverage: src/components/, src/stores/_
  - _Requirements: REQ-1, REQ-3_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Integration Test Engineer | Task: Write integration tests for InsightCard reading from sentimentStore, NewsTicker displaying store hotspots, user click updating selectedHotspot in store | Restrictions: Use real store with mock API, test reactive updates, verify two-way binding | Success: Components reflect store state, user actions update store, UI reactive | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 10.8 E2E 测试配置 (可选)

  - File: `playwright.config.js`, `e2e/`
  - 配置 Playwright 或 Cypress
  - 编写关键用户流程测试
  - Purpose: 端到端验证用户场景
  - _Leverage: Playwright_
  - _Requirements: All_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: E2E Test Engineer with Playwright experience | Task: Configure Playwright for Vue app, write E2E tests for critical user flows: 1) Page load with map 2) Click hotspot shows detail 3) Filter hotspots 4) Decision simulation | Restrictions: Use Playwright (not Cypress), configure CI-friendly settings, use page object pattern | Success: E2E tests run in browser, critical flows verified, tests reliable | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

## 11. AI 现场还原 (REQ-10)

- [x] 11.1 创建场景还原 API 封装

  - File: `src/api/scene.js`
  - 封装 Tripo AI 3D 生成服务调用
  - 实现生成、状态查询、模型加载接口
  - Purpose: 为 AI 现场还原提供 API 层
  - _Leverage: 无现有 API_
  - _Requirements: REQ-10_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Developer with 3D service experience | Task: Create scene.js API with generate3D(hotspotId, description), getModelStatus(taskId), loadModel(modelUrl) functions, mock Tripo AI responses for now | Restrictions: Async/await pattern, handle long-running task polling, include retry logic | Success: API functions callable, return mock 3D model data, polling works | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 11.2 创建场景还原组件

  - File: `src/components/features/Scene/SceneReconstruction.vue`
  - 显示"现场还原"按钮和 3D 模型查看器
  - 集成 Three.js 渲染 3D 模型
  - Purpose: 实现 REQ-10 的 UI 交互
  - _Leverage: Three.js, src/api/scene.js_
  - _Requirements: REQ-10_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: 3D Developer with Three.js expertise | Task: Create SceneReconstruction.vue with "现场还原" button, loading progress, Three.js model viewer with orbit controls, integrate with sceneApi, following REQ-10 | Restrictions: Use GLTFLoader for models, handle loading states, provide fallback for WebGL errors | Success: Button triggers generation, model displays with rotation/zoom, loading state visible | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 11.3 集成场景还原到地图

  - File: `src/components/features/Map/CityMap3D-AMap.vue`
  - 在地图上叠加显示 3D 全息影像
  - 使用高德 GLCustomLayer 渲染
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: GIS Developer with Three.js integration experience | Task: Integrate 3D models into CityMap3D-AMap.vue using AMap.GLCustomLayer, position models at hotspot coordinates, add holographic glow effect, following REQ-10 | Restrictions: Do not break existing map functionality, optimize for performance, handle model cleanup on unmount | Success: 3D models render on map at correct location, holographic effect visible, smooth interaction | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 11.4 创建场景还原 Store

  - File: `src/stores/scene.js`
  - 管理场景还原状态 (生成中/已完成/错误)
  - 缓存已生成的 3D 模型
  - Purpose: 为场景还原提供状态管理
  - _Leverage: src/stores/index.js_
  - _Requirements: REQ-10_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with Pinia experience | Task: Create sceneStore with generating, models (cache), currentModel states, generateScene and loadCachedModel actions, following REQ-10 | Restrictions: Cache models by hotspotId, clear cache on memory pressure, handle concurrent generation requests | Success: Store manages scene state, caching works, actions trigger API calls | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

## 12. 路由与布局系统 (REQ-11)

- [x] 12.1 配置 Vue Router

  - File: `src/router/index.js`
  - 安装 vue-router，配置路由实例
  - 定义路由表结构 (大屏、管理后台、移动端)
  - Purpose: 支持多页面应用路由
  - _Leverage: src/main.js_
  - _Requirements: REQ-11_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer | Task: Install vue-router, create router/index.js with routes for / (Dashboard), /login, /admin/*, /m/* | Restrictions: Use history mode, lazy load admin routes, configure route meta for auth | Success: Router works, navigation between pages functional | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 12.2 创建管理后台布局

  - File: `src/components/layout/AdminLayout.vue`
  - 创建后台管理通用布局 (侧边栏 + 顶栏 + 内容区)
  - 响应式设计，支持侧边栏折叠
  - Purpose: 为后台管理页面提供统一布局
  - _Leverage: src/components/layout/AppShell.vue_
  - _Requirements: REQ-11_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with admin panel experience | Task: Create AdminLayout.vue with sidebar navigation, top header with user menu, main content slot, responsive collapse | Restrictions: Reuse GlassPanel styles, support dark theme, use router-link for navigation | Success: Layout renders correctly, sidebar collapses on mobile, navigation works | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 12.3 增强布局响应式适配

  - File: `src/components/layout/AppShell.vue`
  - 优化 Flex/Grid 布局，确保在移动端 (xs/sm) 下自动堆叠或隐藏非核心面板
  - 将侧边栏和右侧面板改为抽屉模式或折叠模式
  - Purpose: 实现一套代码适配移动端
  - _Leverage: Tailwind CSS breakpoints_
  - _Requirements: REQ-11, REQ-15_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Refactor AppShell.vue for mobile responsiveness. Hide sidebar/right panel on small screens, add toggle buttons, ensure map takes full screen. | Restrictions: Use Tailwind classes (hidden md:flex), no separate mobile views | Success: UI adapts to resize, panels toggle on mobile | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

## 13. 认证模块 (REQ-12)

- [x] 13.1 创建认证 Store

  - File: `src/stores/auth.js`
  - 管理用户登录状态、token、权限信息
  - 实现 login、logout、checkAuth actions
  - Purpose: 为认证功能提供状态管理
  - _Leverage: src/stores/index.js_
  - _Requirements: REQ-12_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with auth experience | Task: Create authStore with user, token, permissions states, login/logout/checkAuth actions, persist token to localStorage | Restrictions: Handle token expiry, clear state on logout, use secure storage | Success: Auth state persists, login/logout works, permissions accessible | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 13.2 创建认证 API

  - File: `src/api/auth.js`
  - 封装登录、登出、获取用户信息、刷新 token 接口
  - Purpose: 为认证功能提供 API 层
  - _Leverage: src/api/client.js_
  - _Requirements: REQ-12_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create auth.js API with login(username, password), logout(), getUserInfo(), refreshToken() | Restrictions: Handle auth errors, support remember me, include mock responses | Success: API functions callable, mock auth works | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 13.3 创建登录页

  - File: `src/views/auth/LoginView.vue`
  - 登录表单 (用户名/密码)
  - 记住密码、验证码 (可选)
  - 赛博朋克风格设计
  - Purpose: 实现用户登录入口
  - _Leverage: src/components/ui/GlassPanel.vue, src/components/ui/NeonButton.vue_
  - _Requirements: REQ-12_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with UI/UX skills | Task: Create LoginView.vue with cyberpunk styled login form, username/password inputs, remember me checkbox, submit button, integrate with authStore | Restrictions: Form validation, loading state, error display, match existing theme | Success: Login form works, redirects on success, shows errors | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 13.4 创建路由守卫

  - File: `src/router/guards.js`
  - 实现认证守卫，未登录跳转登录页
  - 实现权限守卫，无权限显示 403
  - Purpose: 保护需要认证的路由
  - _Leverage: src/router/index.js, src/stores/auth.js_
  - _Requirements: REQ-12_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer | Task: Create guards.js with authGuard (redirect to /login if not authenticated), permissionGuard (check route meta.permissions), integrate into router | Restrictions: Handle async auth check, preserve redirect url, clear loading state | Success: Unauthenticated users redirected, unauthorized shown 403 | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

## 14. 后台管理模块 (REQ-13)

- [x] 14.1 创建管理首页组件

  - File: `src/components/features/Admin/AdminDashboard.vue`
  - 数据概览卡片 (热点总数、今日新增、处理中、已解决)
  - 快捷入口、最近活动列表
  - Purpose: 提供后台管理入口和概览 (AdminLayout 子组件)
  - _Leverage: src/components/ui/GlassPanel.vue_
  - _Requirements: REQ-13_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with dashboard experience | Task: Create AdminDashboard.vue with stat cards (key metrics), quick action buttons, recent activity list | Restrictions: Use GlassPanel for cards, fetch real stats from API, responsive grid, NO Vue Router dependencies | Success: Dashboard shows stats, quick actions emit events, activity list displays | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 14.2 创建热点管理组件

  - File: `src/components/features/Admin/HotspotManager.vue`
  - 热点数据列表 (表格)，支持搜索、筛选、分页
  - 新增/编辑/删除热点操作
  - Purpose: 实现热点数据 CRUD (AdminLayout 子组件)
  - _Leverage: src/api/sentiment.js_
  - _Requirements: REQ-13_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with table/form experience | Task: Create HotspotManager.vue with data table (columns: title, level, location, status, actions), search input, filters, pagination, add/edit modal form, delete confirmation | Restrictions: Use virtual scroll for large data, debounce search, optimistic UI updates, NO Vue Router dependencies | Success: Table displays data, CRUD operations work, pagination functional | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 14.3 创建事件管理组件

  - File: `src/components/features/Admin/EventManager.vue`
  - 事件处理流程 (待处理/处理中/已完成)
  - 事件详情、处理记录、状态变更
  - Purpose: 实现事件处理流程管理 (AdminLayout 子组件)
  - _Leverage: src/api/sentiment.js_
  - _Requirements: REQ-13_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer | Task: Create EventManager.vue with kanban-style workflow (pending/processing/resolved columns), event cards with drag-drop, detail drawer, status change actions | Restrictions: Optimistic updates, handle concurrent edits, show timeline, NO Vue Router dependencies | Success: Kanban displays events, drag changes status, detail shows history | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 14.4 创建用户管理组件

  - File: `src/components/features/Admin/UserManager.vue`
  - 用户列表，角色分配，状态管理
  - 新增/编辑用户，重置密码
  - Purpose: 实现用户账号管理 (AdminLayout 子组件)
  - _Leverage: src/api/auth.js_
  - _Requirements: REQ-13_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer | Task: Create UserManager.vue with user table (name, email, role, status), add/edit user modal, role select, reset password action, enable/disable toggle | Restrictions: Cannot delete self, admin role required, confirm destructive actions, NO Vue Router dependencies | Success: User CRUD works, role assignment functional, password reset works | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 14.5 创建系统设置组件

  - File: `src/components/features/Admin/SystemSettings.vue`
  - 系统参数配置 (告警阈值、刷新间隔等)
  - API 密钥管理、数据源配置
  - Purpose: 提供系统配置入口 (AdminLayout 子组件)
  - _Leverage: 无_
  - _Requirements: REQ-13_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer | Task: Create SystemSettings.vue with tabbed settings (General, Alerts, API Keys, Data Sources), form inputs for each setting, save/reset buttons | Restrictions: Validate inputs, confirm changes, show success/error feedback, NO Vue Router dependencies | Success: Settings display current values, changes save correctly, validation works | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 14.6 创建操作日志组件

  - File: `src/components/features/Admin/AuditLogs.vue`
  - 操作日志列表 (时间、用户、操作、详情)
  - 支持时间范围筛选、操作类型筛选
  - Purpose: 提供系统审计功能 (AdminLayout 子组件)
  - _Leverage: 无_
  - _Requirements: REQ-13_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer | Task: Create AuditLogs.vue with log table (timestamp, user, action, target, details), date range picker, action type filter, detail expansion | Restrictions: Paginate large datasets, export to CSV, NO Vue Router dependencies | Success: Logs display with filters, detail expandable, export works | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

## 15. 报表分析模块 (REQ-14)

- [x] 15.1 创建数据查询组件

  - File: `src/components/features/Reports/DataQuery.vue`
  - 历史数据检索 (时间范围、关键词、区域)
  - 查询结果列表，支持导出
  - Purpose: 实现历史数据查询 (AdminLayout 子组件)
  - _Leverage: src/api/sentiment.js_
  - _Requirements: REQ-14_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer | Task: Create DataQuery.vue with query form (date range, keywords, region select), results table, export button (CSV/Excel) | Restrictions: Limit result size, show loading, handle empty results, NO Vue Router dependencies | Success: Query returns results, export downloads file, filters work | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 15.2 创建统计报表组件

  - File: `src/components/features/Reports/StatisticsReport.vue`
  - 统计图表 (趋势图、分布图、对比图)
  - 时间粒度切换 (日/周/月)
  - Purpose: 实现数据统计分析 (AdminLayout 子组件)
  - _Leverage: src/components/features/Analysis/TrendChart.vue_
  - _Requirements: REQ-14_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer with ECharts experience | Task: Create StatisticsReport.vue with trend chart, pie chart (distribution), bar chart (comparison), granularity selector (day/week/month) | Restrictions: Reuse TrendChart patterns, lazy load charts, responsive layout, NO Vue Router dependencies | Success: Charts display data, granularity changes data, responsive on resize | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_

- [x] 15.3 创建报告生成组件

  - File: `src/components/features/Reports/ReportGenerator.vue`
  - 报告模板选择，数据范围配置
  - 生成 PDF/Excel 格式报告
  - Purpose: 实现报告导出功能 (AdminLayout 子组件)
  - _Leverage: 无_
  - _Requirements: REQ-14_
  - _Prompt: Implement the task for spec aicity-frontend, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Vue.js Developer | Task: Create ReportGenerator.vue with template selector, date range picker, format selector (PDF/Excel), preview panel, generate button | Restrictions: Show generation progress, handle large reports, queue long tasks, NO Vue Router dependencies | Success: Report generates, preview shows content, download works | Instructions: 1) Mark this task [-] in tasks.md before starting 2) After completion, use log-implementation tool to record artifacts 3) Mark task [x] when complete_
