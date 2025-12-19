# Project Structure

## Directory Organization

```
AICity/                              # 项目根目录
├── .spec-workflow/                  # Spec Workflow 配置
│   ├── approvals/                   # 审批记录
│   ├── specs/                       # 功能规格文档
│   ├── steering/                    # 项目引导文档
│   │   ├── product.md               # 产品概述
│   │   ├── tech.md                  # 技术栈
│   │   └── structure.md             # 项目结构 (本文档)
│   └── templates/                   # 文档模板
│
├── AICityFornt/                     # 前端项目 (Vue3 + Vite)
│   ├── public/                      # 静态资源
│   │   └── models/                  # 3D 模型文件 (GLB/GLTF)
│   ├── src/                         # 源代码
│   │   ├── api/                     # API 接口封装 (待实现)
│   │   ├── components/              # Vue 组件
│   │   │   ├── features/            # 功能组件
│   │   │   │   ├── Analysis/        # 舆情分析
│   │   │   │   ├── Map/             # 3D 地图
│   │   │   │   ├── Monitor/         # 实时监测
│   │   │   │   ├── Simulation/      # 决策模拟
│   │   │   │   ├── Admin/           # 后台管理 (Overlay)
│   │   │   │   └── Reports/         # 报表分析 (Overlay)
│   │   │   ├── layout/              # 布局组件
│   │   │   │   ├── AppShell.vue     # 应用外壳 (主布局)
│   │   │   │   ├── DynamicIsland.vue # 动态岛导航
│   │   │   │   └── AdminLayout.vue  # 后台管理布局
│   │   │   └── ui/                  # 通用 UI 组件
│   │   ├── router/                  # 路由配置 (单页应用入口)
│   │   ├── stores/                  # Pinia 状态管理 (待实现)
│   │   ├── App.vue                  # 根组件
│   │   ├── main.js                  # 入口文件
│   │   └── style.css                # 全局样式
│   ├── index.html                   # HTML 入口
│   ├── package.json                 # 依赖配置
│   ├── vite.config.js               # Vite 配置
│   ├── tailwind.config.js           # Tailwind 配置
│   └── postcss.config.js            # PostCSS 配置
│
├── AICityBack/                      # 后端项目 (FastAPI + Python)
│   ├── app/                         # FastAPI 应用核心
│   │   ├── api/                     # API 路由层
│   │   │   ├── v1/                  # API 版本 1
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py          # 认证授权
│   │   │   │   ├── sentiment.py     # 舆情数据
│   │   │   │   ├── analysis.py      # AI 分析
│   │   │   │   ├── decision.py      # 决策模拟
│   │   │   │   ├── scene.py         # 3D 场景
│   │   │   │   ├── crawler.py       # 数据采集
│   │   │   │   ├── voice.py         # 语音交互
│   │   │   │   ├── admin.py         # 后台管理
│   │   │   │   └── models.py        # 模型矩阵管理
│   │   │   ├── deps.py              # 依赖注入
│   │   │   └── router.py            # 路由汇总
│   │   ├── core/                    # 核心配置
│   │   │   ├── __init__.py
│   │   │   ├── config.py            # 环境配置
│   │   │   ├── security.py          # 安全/JWT
│   │   │   └── exceptions.py        # 异常处理
│   │   ├── models/                  # SQLAlchemy 模型
│   │   │   ├── __init__.py
│   │   │   ├── user.py              # 用户模型
│   │   │   ├── sentiment.py         # 舆情模型
│   │   │   ├── hotspot.py           # 热点模型
│   │   │   ├── analysis.py          # 分析结果模型
│   │   │   ├── scene.py             # 3D场景任务模型
│   │   │   ├── crawler.py           # 采集任务模型
│   │   │   ├── system_log.py        # 系统日志模型
│   │   │   └── adapter.py           # 模型适配器模型
│   │   ├── schemas/                 # Pydantic 模式
│   │   │   ├── __init__.py
│   │   │   ├── auth.py              # 认证模式
│   │   │   ├── sentiment.py         # 舆情模式
│   │   │   └── common.py            # 通用模式
│   │   ├── services/                # 业务服务层
│   │   │   ├── __init__.py
│   │   │   ├── sentiment_service.py # 舆情服务
│   │   │   ├── ai_service.py        # AI 分析服务
│   │   │   ├── decision_service.py  # 决策模拟服务
│   │   │   ├── scene_service.py     # 3D 场景服务
│   │   │   ├── voice_service.py     # 语音交互服务
│   │   │   ├── crawler_service.py   # 采集服务
│   │   │   ├── notification_service.py # 通知推送服务
│   │   │   ├── admin_service.py     # 后台管理服务
│   │   │   ├── model_service.py     # 模型矩阵服务
│   │   │   └── search_service.py    # 全文检索服务
│   │   ├── db/                      # 数据库
│   │   │   ├── __init__.py
│   │   │   ├── session.py           # 数据库会话
│   │   │   └── init_db.py           # 数据库初始化
│   │   ├── websocket/               # WebSocket 处理
│   │   │   ├── __init__.py
│   │   │   ├── manager.py           # 连接管理
│   │   │   └── events.py            # 事件处理
│   │   └── main.py                  # 应用入口
│   ├── agents/                      # LangGraph 多 Agent
│   │   ├── __init__.py
│   │   ├── graph.py                 # Agent 状态图
│   │   ├── nodes/                   # Agent 节点
│   │   │   ├── analyze.py           # 分析 Agent
│   │   │   ├── predict.py           # 预测 Agent
│   │   │   ├── decide.py            # 决策 Agent
│   │   │   └── simulate.py          # 模拟 Agent
│   │   └── prompts/                 # Prompt 模板
│   ├── crawler/                     # 数据采集模块
│   │   ├── __init__.py
│   │   ├── spiders/                 # Scrapy 爬虫
│   │   ├── pipelines.py             # 数据管道
│   │   └── settings.py              # 爬虫配置
│   ├── ai/                          # AI 模块
│   │   ├── __init__.py
│   │   ├── spark/                   # 讯飞星火封装
│   │   │   ├── client.py            # API 客户端
│   │   │   └── prompts.py           # 提示词模板
│   │   ├── voice/                   # 讯飞语音
│   │   │   ├── tts.py               # 语音合成
│   │   │   └── asr.py               # 语音识别
│   │   ├── scene3d/                 # 3D 生成
│   │   │   ├── tripo.py             # Tripo AI
│   │   │   └── triposr.py           # TripoSR 本地
│   │   ├── sentiment/               # 情感分析
│   │   │   └── analyzer.py          # 分析器
│   │   ├── rag/                     # RAG 检索增强
│   │   │   ├── __init__.py
│   │   │   ├── vector_store.py      # 向量库封装 (Chroma/Qdrant)
│   │   │   ├── embeddings.py        # 嵌入模型
│   │   │   └── retriever.py         # 检索器
│   │   └── models/                  # 模型矩阵管理
│   │       ├── __init__.py
│   │       └── adapter_manager.py   # LoRA 适配器管理
│   ├── tasks/                       # Celery 异步任务
│   │   ├── __init__.py
│   │   ├── celery_app.py            # Celery 实例
│   │   ├── crawler_tasks.py         # 采集任务
│   │   └── analysis_tasks.py        # 分析任务
│   ├── scheduler/                   # APScheduler 定时调度
│   │   ├── __init__.py
│   │   ├── config.py                # 调度器配置
│   │   ├── crawler_jobs.py          # 采集任务调度
│   │   └── handlers.py              # 任务触发处理
│   ├── storage/                     # MinIO 对象存储
│   │   ├── __init__.py
│   │   ├── minio_client.py          # MinIO 客户端
│   │   ├── scene_storage.py         # 3D 模型存储
│   │   └── adapter_storage.py       # 适配器存储
│   ├── tests/                       # 测试
│   │   ├── __init__.py
│   │   ├── conftest.py              # pytest 配置
│   │   ├── test_api/                # API 测试
│   │   └── test_services/           # 服务测试
│   ├── alembic/                     # 数据库迁移
│   │   ├── versions/                # 迁移版本
│   │   └── env.py                   # Alembic 配置
│   ├── .env.example                 # 环境变量模板
│   ├── alembic.ini                  # Alembic 配置
│   ├── pyproject.toml               # 项目配置 (PEP 621)
│   ├── requirements.txt             # Python 依赖
│   ├── requirements-dev.txt         # 开发依赖
│   └── Dockerfile                   # Docker 构建
│
├── AICityMind.md                    # 产品构思文档
├── main.md                          # 功能需求文档
├── stack.md                         # 技术栈详细文档
└── prototypestack.md                # 原型技术方案
```

## 前端组件结构

### components/features/ - 功能组件

按业务功能划分，每个功能一个目录：

```
features/
├── Map/                             # 3D 地图模块
│   ├── CityMap3D.vue                # 地图主组件 (备用)
│   └── CityMap3D-AMap.vue           # 高德地图版本 (主力，唯一方案)
│
├── Analysis/                        # 舆情分析模块
│   ├── InsightCard.vue              # 分析洞察卡片
│   ├── KeywordCloud.vue             # 关键词云图
│   └── TrendChart.vue               # 趋势预测图表
│
├── Monitor/                         # 实时监测模块
│   ├── NewsTicker.vue               # 新闻滚动条
│   ├── HotspotDetail.vue            # 舆情详情面板
│   └── FilterPanel.vue              # 舆情筛选面板
│
├── Simulation/                      # 决策模拟模块
│   ├── DecisionPanel.vue            # 决策面板
│   ├── SimulationResult.vue         # 模拟结果展示
│   └── CustomDecision.vue           # 自定义决策输入
│
├── Voice/                           # 语音交互模块
│   └── VoiceButton.vue              # 语音交互按钮
│
└── Scene/                           # 场景还原模块
    └── SceneReconstruction.vue      # AI 现场还原组件
```

### components/layout/ - 布局组件

```
layout/
├── AppShell.vue                     # 应用外壳 (主布局)
└── DynamicIsland.vue                # 动态岛导航
```

### components/ui/ - 通用 UI 组件

```
ui/
├── GlassPanel.vue                   # 玻璃面板 (毛玻璃效果)
├── NeonButton.vue                   # 霓虹按钮
└── DataFlowLine.vue                 # 数据流光效果
```

## 功能模块结构

### stores/ - Pinia 状态管理

```
stores/
├── index.js                         # Pinia 实例导出
├── sentiment.js                     # 舆情状态 (hotspots, analysis)
├── map.js                           # 地图状态 (city, zoom, center)
├── voice.js                         # 语音状态 (listening, speaking)
└── scene.js                         # 场景还原状态 (generating, models)
```

### api/ - API 接口封装

```
api/
├── index.js                         # API 统一导出
├── sentiment.js                     # 舆情 API (getHotspots, getAnalysis)
├── map.js                           # 地图 API (getCityData, getBoundary)
├── decision.js                      # 决策 API (simulate, customSimulate)
└── scene.js                         # 场景还原 API (generate3D)
```

### services/ - 服务层

```
services/
├── websocket.js                     # WebSocket 服务 (Socket.io 封装)
└── voice.js                         # 语音服务 (讯飞 API 封装)
```

### composables/ - 组合式函数

```
composables/
├── useFocusMode.js                  # 聚焦模式管理
├── useStaggeredEntrance.js          # 错落入场动画
└── useWebSocket.js                  # WebSocket 响应式封装
```

### utils/ - 工具函数

```
utils/
├── index.js                         # 工具函数统一导出
├── format.js                        # 格式化 (日期、数字、级别)
├── map.js                           # 地图工具 (坐标转换、距离计算)
└── voiceCommand.js                  # 语音指令解析
```

### styles/ - 全局样式

```
styles/
├── main.css                         # 主样式入口
├── cyberpunk.css                    # 赛博朋克主题样式
└── animations.css                   # 动画效果样式
```

## Naming Conventions

### Files

- **Vue 组件**: `PascalCase.vue` (如 `CityMap3D.vue`)
- **JS 模块**: `camelCase.js` (如 `mapUtils.js`)
- **样式文件**: `kebab-case.css` (如 `style.css`)
- **配置文件**: `kebab-case.config.js` (如 `vite.config.js`)

### Code

- **组件名**: `PascalCase` (如 `CityMap3D`)
- **函数/方法**: `camelCase` (如 `initMap`)
- **常量**: `UPPER_SNAKE_CASE` (如 `AMAP_KEY`)
- **变量**: `camelCase` (如 `mapInstance`)
- **Props/Emits**: `camelCase` (如 `showPanel`)
- **CSS 类**: `kebab-case` (如 `glass-panel`)

## Import Patterns

### Import Order

```javascript
// 1. Vue 核心
import { ref, computed, onMounted } from "vue";

// 2. 第三方库
import AMapLoader from "@amap/amap-jsapi-loader";
import { ElMessage } from "element-plus";

// 3. 组件
import GlassPanel from "@/components/ui/GlassPanel.vue";

// 4. 工具函数
import { formatDate } from "@/utils/date";

// 5. 样式
import "./style.css";
```

### Path Aliases

```javascript
// vite.config.js 中配置
{
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@features': '/src/components/features',
      '@ui': '/src/components/ui'
    }
  }
}
```

## Code Structure Patterns

### Vue 组件结构 (Composition API)

```vue
<script setup>
// 1. Imports
import { ref, computed, onMounted, onUnmounted } from "vue";

// 2. Props & Emits
const props = defineProps({
  title: String,
});
const emit = defineEmits(["update"]);

// 3. Reactive State
const data = ref(null);
const loading = ref(false);

// 4. Computed
const displayData = computed(() => data.value?.items || []);

// 5. Methods
function handleClick() {
  emit("update", data.value);
}

// 6. Lifecycle
onMounted(() => {
  // 初始化
});

onUnmounted(() => {
  // 清理
});
</script>

<template>
  <!-- 模板内容 -->
</template>

<style scoped>
/* 组件样式 */
</style>
```

### 3D 地图组件模式

```javascript
// 地图组件核心结构
const container = ref(null); // DOM 容器
const mapInstance = shallowRef(null); // 地图实例 (shallowRef 避免深度响应)
const AMap = shallowRef(null); // 地图 SDK

onMounted(async () => {
  await initMap();
});

onUnmounted(() => {
  mapInstance.value?.destroy();
});

async function initMap() {
  // 1. 加载 SDK
  // 2. 创建地图实例
  // 3. 添加图层和控件
  // 4. 绑定事件
}
```

## Module Boundaries

### 前端模块划分

```
┌─────────────────────────────────────────────────────────┐
│                      App.vue                             │
│  ┌─────────────────────────────────────────────────────┐│
│  │                   AppShell.vue                      ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ ││
│  │  │   Monitor   │  │     Map     │  │  Analysis   │ ││
│  │  │  NewsTicker │  │  CityMap3D  │  │ InsightCard │ ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘ ││
│  │  ┌─────────────┐  ┌─────────────────────────────────┐│
│  │  │ Simulation  │  │           UI Components         ││
│  │  │DecisionPanel│  │    GlassPanel | NeonButton      ││
│  │  └─────────────┘  └─────────────────────────────────┘│
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 依赖方向

- **UI 组件** (`ui/`): 无依赖，被其他组件使用
- **布局组件** (`layout/`): 依赖 UI 组件
- **功能组件** (`features/`): 依赖 UI 组件、布局组件
- **API 模块** (`api/`): 独立，被功能组件调用
- **Store** (`stores/`): 独立，被功能组件使用

## Code Size Guidelines

- **单文件组件**: 建议 < 500 行，超过考虑拆分
- **函数/方法**: 建议 < 50 行
- **嵌套深度**: 最大 4 层
- **组件 Props**: 建议 < 10 个

## Documentation Standards

- **组件**: JSDoc 注释说明用途和 Props
- **复杂逻辑**: 行内注释说明
- **API 接口**: 文档化请求/响应格式
- **README**: 每个主要目录提供说明文件

## 后端模块结构

### app/api/ - API 路由层

```
api/
├── v1/                              # API 版本 1
│   ├── auth.py                      # 认证: login, register, refresh
│   ├── sentiment.py                 # 舆情 CRUD: hotspots, events
│   ├── analysis.py                  # AI 分析: analyze, predict
│   ├── decision.py                  # 决策模拟: simulate, custom
│   ├── scene.py                     # 3D 生成: generate, status
│   ├── crawler.py                   # 采集管理: tasks, sources
│   ├── voice.py                     # 语音: tts, asr
│   ├── admin.py                     # 后台: users, logs, stats
│   └── models.py                    # 模型矩阵: adapters, finetune
├── deps.py                          # 依赖注入 (get_db, get_current_user)
└── router.py                        # 路由汇总
```

### app/services/ - 业务服务层

```
services/
├── sentiment_service.py             # 舆情业务逻辑
├── ai_service.py                    # AI 调用封装
├── crawler_service.py               # 采集任务管理
├── scene_service.py                 # 3D 生成服务
└── notification_service.py          # 通知推送服务
```

### agents/ - LangGraph 多 Agent 决策

```
agents/
├── graph.py                         # 状态图定义
├── state.py                         # 状态类型定义
├── nodes/                           # Agent 节点
│   ├── analyze.py                   # 舆情分析 Agent
│   ├── predict.py                   # 走向预测 Agent
│   ├── decide.py                    # 决策生成 Agent
│   └── simulate.py                  # 决策模拟 Agent
└── prompts/                         # Prompt 模板
    ├── analyze.txt
    ├── predict.txt
    └── decide.txt
```

### ai/ - AI 能力封装

```
ai/
├── spark/                           # 讯飞星火封装
│   ├── client.py                    # WebSocket/HTTP 客户端
│   ├── prompts.py                   # 舆情分析 Prompt
│   └── config.py                    # API 配置
├── voice/                           # 讯飞语音
│   ├── tts.py                       # 流式语音合成
│   ├── asr.py                       # 实时语音识别
│   └── lfasr.py                     # 长音频转写
├── scene3d/                         # 3D 生成
│   ├── tripo.py                     # Tripo AI API
│   └── triposr.py                   # TripoSR 本地推理
└── sentiment/                       # 情感分析
    └── analyzer.py                  # BERT/星火分析器
```

## 后端命名规范

### 文件命名

- **Python 模块**: `snake_case.py`
- **类名**: `PascalCase`
- **函数/方法**: `snake_case`
- **常量**: `UPPER_SNAKE_CASE`
- **Pydantic 模式**: `PascalCase` + `Schema` 后缀 (如 `SentimentSchema`)
- **SQLAlchemy 模型**: `PascalCase` (如 `Sentiment`)

### API 路由命名

- **资源路径**: 复数名词 (`/sentiments`, `/hotspots`)
- **操作路径**: 动词 (`/analyze`, `/simulate`)
- **参数**: `snake_case`

## 待完善模块

### 前端

| 模块               | 状态   | 说明            |
| ------------------ | ------ | --------------- |
| `src/api/`         | 待创建 | API 接口封装    |
| `src/router/`      | 待创建 | Vue Router 配置 |
| `src/stores/`      | 待创建 | Pinia 状态管理  |
| `src/utils/`       | 待创建 | 工具函数        |
| `src/composables/` | 待创建 | 组合式函数      |

### 后端 (当前阶段重点)

| 模块                | 状态   | 优先级 | 说明             |
| ------------------- | ------ | ------ | ---------------- |
| `AICityBack/app/`   | 待创建 | P0     | FastAPI 核心应用 |
| `AICityBack/ai/`    | 待创建 | P1     | AI 能力封装      |
| `AICityBack/agents/`| 待创建 | P1     | LangGraph Agent  |
| `AICityBack/tasks/` | 待创建 | P2     | Celery 异步任务  |
| `AICityBack/crawler/`| 待创建 | P2     | 数据采集         |
