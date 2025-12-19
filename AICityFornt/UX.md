# AI City 智能舆情决策系统 UX 设计方案

## 1. 设计目标 (Design Goals)

- **沉浸式指挥感**: 让用户（政府/企业决策者）感觉自己处于一个全知全能的“城市大脑”指挥舱中。
- **数据降噪**: 在炫酷的视觉下，确保核心舆情数据依然清晰可读，避免视觉干扰。
- **闭环决策**: 引导用户完成从“发现问题”到“解决问题”的完整闭环。

## 2. 用户画像与核心场景 (Personas & Scenarios)

- **核心用户**: 政府城市管理者 / 企业公关负责人
- **核心场景**:
  - **平态监视**: 挂在大屏上，实时查看城市舆情热力图，关注异常波动。
  - **危态处置**: 突发热点事件，需要快速定位地点、还原现场、预测走向，并模拟决策后果。

## 3. 信息架构 (Information Architecture) - 结合 Bento Grid 布局

我们将 [main.md](cci:7://file:///d:/A_Files/A_Code/A_Program/A_Competitions/2025_XunFeiCup/AICity/main.md:0:0-0:0) 的功能映射到 [UI.md](cci:7://file:///d:/A_Files/A_Code/A_Program/A_Competitions/2025_XunFeiCup/AICity/prototype/Picture/Gemini2/UI.md:0:0-0:0) 定义的布局区域中：

| 功能模块             | 对应 UI 区域                | 交互形式                                                                          |
| :------------------- | :-------------------------- | :-------------------------------------------------------------------------------- |
| **全局导航/状态**    | **顶部 Header / 灵动岛**    | 始终可见，显示系统时间、当前城市（信阳/河南）、全网情绪指数。                     |
| **1. 实时监测**      | **左侧 Sidebar + 悬浮列表** | 实时滚动的舆情 News Ticker，热搜榜单。点击条目可联动地图。                        |
| **2. 地图可视化**    | **中心 Main View (核心)**   | 3D 城市模型。热点事件以“光柱”或“脉冲圈”标记在具体地理位置。                       |
| **3. LLM 分析/还原** | **右侧 Widget (上)**        | 选中事件后，展开分析面板。显示关键词云、事件摘要、3D 现场还原窗口。               |
| **4. 走向预测**      | **右侧 Widget (中)**        | 折线图/波形图，展示舆情热度“过去-现在-未来”的趋势预测。                           |
| **5. 决策模拟**      | **右侧/底部 Widget (下)**   | 交互式输入框/滑块。用户调整参数（如“发布公告”、“调动资源”），大模型反馈推演结果。 |

| **6. 后台管理** | **全屏覆盖层 (Overlay)** | 通过顶部灵动岛按钮触发，全屏毛玻璃覆盖层，不跳转页面，保持沉浸感。 |

## 4. 核心用户体验流程 (Core User Flow)

### 场景：突发舆情事件处置流程

...

### 场景：系统配置与数据管理 (Admin Flow)

- **入口**: 用户点击顶部灵动岛的“设置”图标。
- **交互**:
  - 主界面背景模糊变暗 (Backdrop Blur)。
  - "后台管理中心" 作为一个全屏覆盖层 (Modal Overlay) 平滑淡入。
  - 侧边栏提供 Dashboard, 热点管理, 系统设置等导航。
- **退出**: 点击关闭按钮或按 ESC，覆盖层淡出，无缝回到 3D 地图指挥界面。

## 5. 关键交互细节设计 (Micro-Interactions)

#### 阶段一：感知 (Monitoring)

- **视觉**: 3D 地图上某区域（如信阳市浉河区）出现红色脉冲警报。
- **交互**: 左侧实时列表弹出“突发”标签的新闻条目。
- **操作**: 用户点击地图上的红点，或点击列表条目。

#### 阶段二：分析 (Analysis & Reconstruction)

- **视觉**:
  - 地图视角自动平滑推拉 (Camera Zoom) 到事发地点。
  - 右侧面板滑出“事件详情卡片” (Glass Card)。
  - 如果可用，在地图上方弹窗通过 AI 生成的“现场 3D 还原”全息影像。
- **数据**: 显示大模型生成的“事件摘要”、“情绪占比”分析。

#### 阶段三：预测 (Prediction)

- **视觉**: 地图上显示动态箭头，预示舆情可能扩散的区域（如周边社区）。
- **数据**: 趋势图展示未来 24 小时热度预测曲线。
- **AI 建议**: 界面弹出 AI 助手建议：“建议立即发布官方通报”。

#### 阶段四：模拟与决策 (Simulation & Decision)

- **交互**: 用户打开“决策模拟器” (底部或侧边浮层)。
- **操作**: 用户输入/选择决策方案（例如：选择“发布辟谣公告” vs “冷处理”）。
- **反馈**:
  - 系统即时计算，地图上的红色警报区域根据模拟结果发生变化（变绿或扩散）。
  - 趋势图生成虚线分支，对比不同决策下的未来走向。

## 5. 关键交互细节设计 (Micro-Interactions)

- **聚焦模式 (Focus Mode)**: 当用户点击某个具体事件时，周围非相关 UI 自动降低不透明度 (Dimming)，背景地图模糊化，聚焦当前事件卡片。
- **数据流光 (Data Flow)**: 在组件连接处使用流动的光线效果，暗示数据正在实时传输和大模型正在推理。
- **语音交互 (Voice Command)**: 考虑到指挥大屏场景，增加语音唤醒 AI 的提示：“嘿 AI，模拟一下方案 B 的后果”。

## 6. 针对不同端的适配策略

- **响应式设计 (Responsive Design)**: 采用单一代码库，通过 CSS 媒体查询适配不同屏幕。
- **Web/PC 端 (核心)**: 全功能 3D 交互，悬浮面板布局，支持鼠标精细操作。
- **移动端 (Mobile)**:
  - **主页自适应**: 保持与 PC 端相同的 URL (`/`)。
  - **布局调整**: 侧边栏自动收起为汉堡菜单，悬浮面板转为底部抽屉 (Bottom Sheet) 或全屏卡片。
  - **交互优化**: 针对触摸操作优化点击区域，禁用复杂的 3D 交互或切换为轻量级地图模式。

## 7. UI/UX 原型建议结构 (Prototype Structure)

建议在 `src` 目录下建立以下结构来支撑 UX：

```
src/
  components/
    layout/
      AppShell.vue          // 整体布局容器 (包含背景、Header)
      DynamicIsland.vue     // 灵动岛导航
    features/
      Map/
        CityMap3D-AMap.vue  // 核心地图组件 (高德 3D)
      Monitor/
        NewsTicker.vue      // 左侧实时舆情流
        HotspotDetail.vue   // 舆情详情面板
        FilterPanel.vue     // 筛选面板
      Analysis/
        InsightCard.vue     // 右侧 AI 分析卡片
        KeywordCloud.vue    // 关键词云
        TrendChart.vue      // 趋势图表
      Simulation/
        DecisionPanel.vue   // 决策模拟控制台
        SimulationResult.vue // 模拟结果展示
      Voice/
        VoiceButton.vue     // 语音交互按钮
    ui/
      GlassPanel.vue        // 基础玻璃容器
      NeonButton.vue        // 交互按钮
  stores/
    sentiment.js            // 舆情状态管理
    map.js                  // 地图状态管理
    voice.js                // 语音状态管理
  api/
    sentiment.js            // 舆情 API
    decision.js             // 决策 API
  services/
    websocket.js            // WebSocket 服务
```

这个 UX 方案将 [main.md](cci:7://file:///d:/A_Files/A_Code/A_Program/A_Competitions/2025_XunFeiCup/AICity/main.md:0:0-0:0) 中比较抽象的“分析、预测、模拟”转化为了具体可视化的操作步骤，并结合了 [UI.md](cci:7://file:///d:/A_Files/A_Code/A_Program/A_Competitions/2025_XunFeiCup/AICity/prototype/Picture/Gemini2/UI.md:0:0-0:0) 的赛博朋克风格。
