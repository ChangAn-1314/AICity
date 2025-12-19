# Requirements Document - AICity Frontend

## Introduction

智舆前端系统是 AI 城市舆情态势监测感知与决策推演系统的用户交互层，负责提供 3D 可视化展示、舆情数据呈现、用户交互和实时通信功能。

本文档定义前端系统的功能需求和非功能需求，为后续设计和开发提供依据。

## Alignment with Product Vision

根据 `product.md` 定义的产品目标，前端系统需要支持：

- **实时舆情监测**：展示多平台、多形式的舆情内容
- **3D 地图可视化**：高德地图 3D 展示舆情态势，区域热力图与建筑高亮
- **AI 智能分析**：展示分析结果、情感分析、关键词
- **决策模拟**：交互式决策面板，支持用户自定义决策推演
- **语音交互**：集成讯飞 TTS/ASR 实现语音播报和输入

## Requirements

### REQ-1: 3D 地图可视化

**User Story:** 作为城市管理者，我希望在 3D 地图上直观查看舆情分布，以便快速定位热点区域。

#### Acceptance Criteria

1. WHEN 用户打开应用 THEN 系统 SHALL 加载高德 3D 地图并显示默认城市视图
2. WHEN 舆情数据加载完成 THEN 系统 SHALL 在地图上显示舆情热点标记
3. WHEN 用户点击热点标记 THEN 系统 SHALL 显示舆情详情面板
4. IF 舆情级别为高 THEN 系统 SHALL 使用红色高亮标记
5. WHEN 用户切换城市 THEN 系统 SHALL 平滑过渡到目标城市视图
6. WHEN 用户缩放地图 THEN 系统 SHALL 根据缩放级别调整显示粒度（省/市/区/县）

### REQ-2: 舆情热点展示

**User Story:** 作为用户，我希望查看舆情热点的详细信息，以便了解事件详情和发展趋势。

#### Acceptance Criteria

1. WHEN 热点标记被点击 THEN 系统 SHALL 显示包含标题、来源、时间、情感倾向的详情卡片
2. WHEN 舆情数据更新 THEN 系统 SHALL 实时刷新热点标记和统计数据
3. IF 舆情包含图片/视频 THEN 系统 SHALL 在详情面板中展示媒体预览
4. WHEN 用户筛选舆情级别 THEN 系统 SHALL 仅显示符合条件的热点

### REQ-3: 实时新闻滚动

**User Story:** 作为用户，我希望看到实时滚动的舆情新闻，以便及时了解最新动态。

#### Acceptance Criteria

1. WHEN 应用启动 THEN 系统 SHALL 显示新闻滚动条组件
2. WHEN 新舆情到达 THEN 系统 SHALL 将新条目添加到滚动列表
3. WHEN 用户点击新闻条目 THEN 系统 SHALL 在地图上定位并高亮对应热点
4. IF 新闻为紧急预警 THEN 系统 SHALL 使用醒目样式突出显示

### REQ-4: AI 分析洞察

**User Story:** 作为决策者，我希望查看 AI 对舆情的分析洞察，以便辅助决策。

#### Acceptance Criteria

1. WHEN 舆情被选中 THEN 系统 SHALL 显示 AI 分析卡片
2. WHEN AI 分析完成 THEN 系统 SHALL 展示情感分析结果（正面/负面/中性）
3. WHEN AI 分析完成 THEN 系统 SHALL 展示关键词云图
4. WHEN AI 分析完成 THEN 系统 SHALL 展示趋势预测图表

### REQ-5: 决策模拟面板

**User Story:** 作为管理者，我希望进行决策模拟推演，以便评估不同决策的效果。

#### Acceptance Criteria

1. WHEN 用户选择舆情事件 THEN 系统 SHALL 显示决策选项列表
2. WHEN 用户选择决策方案 THEN 系统 SHALL 触发 AI 模拟并展示预测结果
3. WHEN 模拟完成 THEN 系统 SHALL 显示多场景对比图表
4. IF 用户自定义决策 THEN 系统 SHALL 接受自定义输入并进行模拟

### REQ-6: 语音交互

**User Story:** 作为用户，我希望通过语音与系统交互，以便解放双手进行操作。

#### Acceptance Criteria

1. WHEN 用户点击语音按钮 THEN 系统 SHALL 启动讯飞 ASR 语音识别
2. WHEN 语音识别完成 THEN 系统 SHALL 将语音转为文字指令并执行
3. WHEN 系统有重要预警 THEN 系统 SHALL 使用讯飞 TTS 语音播报
4. IF 语音识别失败 THEN 系统 SHALL 显示错误提示并允许重试

### REQ-7: 应用布局与导航

**User Story:** 作为用户，我希望有清晰的界面布局和导航，以便快速找到所需功能。

#### Acceptance Criteria

1. WHEN 应用加载 THEN 系统 SHALL 显示主布局框架（AppShell）
2. WHEN 用户点击导航项 THEN 系统 SHALL 切换到对应功能视图
3. WHEN 窗口大小变化 THEN 系统 SHALL 自适应调整布局
4. IF 用户处于移动端 THEN 系统 SHALL 显示移动端优化布局

### REQ-8: 状态管理

**User Story:** 作为开发者，我希望有统一的状态管理，以便各组件间数据同步。

#### Acceptance Criteria

1. WHEN 舆情数据变化 THEN 系统 SHALL 通过 Pinia Store 同步到所有订阅组件
2. WHEN 用户选择城市 THEN 系统 SHALL 更新全局城市状态
3. WHEN 用户登录/登出 THEN 系统 SHALL 更新认证状态
4. IF 网络断开 THEN 系统 SHALL 保持本地状态直到重连

### REQ-9: UI/UX 视觉效果

**User Story:** 作为用户，我希望系统具有沉浸式的赛博朋克风格界面，以获得专业的"城市大脑"指挥舱体验。

#### Acceptance Criteria

1. WHEN 用户点击舆情热点 THEN 系统 SHALL 进入聚焦模式，降低非相关 UI 透明度
2. WHEN 数据正在传输 THEN 系统 SHALL 显示流动光线效果暗示数据流动
3. WHEN 热点事件显示在地图上 THEN 系统 SHALL 使用脉冲动画标记，高级别事件脉冲更明显
4. WHEN 页面加载 THEN 系统 SHALL 使用错落上浮动画依次显示各面板
5. WHEN 鼠标悬停卡片 THEN 系统 SHALL 显示霓虹边框光效
6. IF 用户按 ESC 键 THEN 系统 SHALL 退出聚焦模式

### REQ-10: AI 现场还原

**User Story:** 作为决策者，我希望能够通过 AI 还原舆情事件现场的 3D 场景，以便更直观地理解事件全貌。

#### Acceptance Criteria

1. WHEN 用户选择舆情热点 THEN 系统 SHALL 提供"现场还原"按钮
2. WHEN 用户点击"现场还原" THEN 系统 SHALL 调用 AI 3D 生成服务 (Tripo AI)
3. WHEN 3D 模型生成完成 THEN 系统 SHALL 在地图上叠加显示全息影像
4. WHEN 3D 模型加载中 THEN 系统 SHALL 显示加载进度和预览骨架
5. IF 3D 生成失败 THEN 系统 SHALL 显示错误提示并提供重试选项
6. WHEN 显示 3D 模型 THEN 系统 SHALL 支持旋转、缩放交互

## Non-Functional Requirements

### Code Architecture and Modularity

- **Single Responsibility Principle**: 每个 Vue 组件只负责单一功能
- **Modular Design**: 组件按 features/layout/ui 三层划分
- **Dependency Management**: 使用 Pinia 管理跨组件状态
- **Clear Interfaces**: 组件间通过 Props/Events 通信

### Performance

- **首屏加载**: < 3 秒
- **3D 地图渲染**: 60 FPS
- **实时数据更新**: < 1 秒延迟
- **组件切换**: 无明显卡顿

### Security

- **API Key 保护**: 讯飞/高德 API Key 不暴露在前端代码
- **XSS 防护**: 对用户输入进行转义
- **HTTPS**: 所有 API 请求使用 HTTPS

### Reliability

- **错误处理**: 所有 API 调用有错误处理和用户提示
- **断线重连**: WebSocket 断线自动重连
- **降级策略**: 3D 地图加载失败时显示 2D 备选

### Usability

- **响应式设计**: 支持桌面端和移动端
- **加载反馈**: 长时间操作显示加载指示器
- **操作反馈**: 用户操作有即时视觉反馈
- **无障碍**: 支持键盘导航和屏幕阅读器
