# Technology Stack

> **文档定位**: 本文档为**最终技术决策文档**，记录项目采用的确定技术栈、版本和规范。技术选型调研和备选方案对比请参考 `stack.md`。

## Project Type

Web 应用程序 - AI 城市舆情态势监测感知与决策推演系统

采用前后端分离架构，前端负责 3D 可视化展示与用户交互，后端负责数据采集、AI 分析和业务逻辑处理。

## Core Technologies

### Primary Language(s)

**前端**

- **Language**: JavaScript (ES6+)
- **Runtime**: Browser (Chrome/Edge/Firefox)
- **Framework**: Vue 3.5

**后端**

- **Language**: Python 3.11+
- **Framework**: FastAPI 0.109+
- **Async Runtime**: asyncio + uvicorn
- **Task Queue**: Celery 5.3+

### Key Dependencies/Libraries

#### 前端核心依赖 (已采用)

| 库/框架                     | 版本    | 用途       |
| --------------------------- | ------- | ---------- |
| **Vue**                     | ^3.5.13 | 前端框架   |
| **Vite**                    | ^6.0.11 | 构建工具   |
| **Element Plus**            | ^2.9.3  | UI 组件库  |
| **@element-plus/icons-vue** | ^2.3.1  | 图标库     |
| **TailwindCSS**             | ^3.4.17 | 原子化 CSS |
| **Pinia**                   | ^2.3.1  | 状态管理   |
| **Socket.io-client**        | ^4.8.1  | 实时通信   |

#### 3D 可视化依赖 (已采用)

| 库/框架                     | 版本     | 用途                         | 状态     |
| --------------------------- | -------- | ---------------------------- | -------- |
| **@amap/amap-jsapi-loader** | ^1.0.1   | 高德地图加载器               | 主力方案 |
| **高德 JS API 2.0**         | 2.0      | 3D 地图引擎 (viewMode: '3D') | 主力方案 |
| **Three.js**                | ^0.181.2 | GLCustomLayer 3D 模型渲染    | 已采用   |
| **ECharts**                 | ^5.6.0   | 数据可视化图表               | 已采用   |

> **注**: 百度地图 GL API 已移除，统一使用高德地图 JS API 2.0 作为唯一地图方案。

#### 后端核心依赖

| 库/框架              | 版本     | 用途                   | 状态   |
| -------------------- | -------- | ---------------------- | ------ |
| **FastAPI**          | ^0.109   | Web 框架 (异步, 自动文档) | 待集成 |
| **Uvicorn**          | ^0.27    | ASGI 服务器            | 待集成 |
| **Celery**           | ^5.3     | 分布式任务队列         | 待集成 |
| **Redis**            | ^5.0     | 缓存/消息队列/Pub-Sub  | 待集成 |
| **SQLAlchemy**       | ^2.0     | ORM (异步支持)         | 待集成 |
| **Pydantic**         | ^2.6     | 数据验证               | 待集成 |
| **python-socketio**  | ^5.11    | WebSocket 实时推送     | 待集成 |
| **APScheduler**      | ^3.10    | 定时任务调度           | 待集成 |
| **httpx**            | ^0.27    | 异步 HTTP 客户端       | 待集成 |

#### 数据采集依赖

| 库/框架          | 版本   | 用途                    | 状态   |
| ---------------- | ------ | ----------------------- | ------ |
| **Scrapy**       | ^2.11  | 爬虫框架                | 待集成 |
| **MediaCrawler** | latest | 社媒多平台采集 (27k+星) | 待集成 |
| **Playwright**   | ^1.41  | 动态页面渲染            | 待集成 |
| **DrissionPage** | ^4.0   | 反爬处理                | 待集成 |

#### 数据存储依赖

| 库/框架              | 版本   | 用途              | 状态   |
| -------------------- | ------ | ----------------- | ------ |
| **PostgreSQL**       | 15+    | 关系型数据库      | 待集成 |
| **asyncpg**          | ^0.29  | 异步 PG 驱动      | 待集成 |
| **Elasticsearch**    | 8.x    | 全文检索引擎      | 待集成 |
| **MinIO**            | latest | 对象存储 (S3兼容) | 待集成 |
| **Chroma/Qdrant**    | latest | 向量数据库 (RAG)  | 待集成 |

#### AI/NLP 依赖

| 库/框架                      | 版本   | 用途                   | 状态   |
| ---------------------------- | ------ | ---------------------- | ------ |
| **讯飞星火 4.0 Ultra**       | -      | 舆情分析大模型 (128K)  | 待集成 |
| **讯飞星火 Lite**            | -      | 轻量任务 (永久免费)    | 待集成 |
| **讯飞 TTS**                 | -      | 语音合成播报 (流式WS)  | 待集成 |
| **讯飞 ASR**                 | -      | 语音识别输入 (实时WS)  | 待集成 |
| **讯飞 LFASR**               | -      | 长音频转写             | 待集成 |
| **LangGraph**                | ^0.1   | 多 Agent 决策框架      | 待集成 |
| **LangChain**                | ^0.1   | LLM 应用框架           | 待集成 |
| **HuggingFace Transformers** | ^4.37  | NLP 模型加载           | 待集成 |
| **PEFT + LoRA**              | ^0.8   | 城市模型矩阵微调       | 待集成 |
| **Chroma**                   | ^0.4   | RAG 向量检索           | 待集成 |

#### 3D 生成依赖

| 库/框架       | 用途                  | 状态   |
| ------------- | --------------------- | ------ |
| **Tripo AI**  | 文字/图片转 3D (API)  | 待集成 |
| **TripoSR**   | 单图转 3D (开源本地)  | 待集成 |
| **PyTorch**   | 深度学习框架          | 待集成 |

### Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      前端展示层 [已采用]                     │
│   Vue3 + Vite + 高德地图3D + Three.js + ECharts            │
│   Element Plus + TailwindCSS + Pinia + Socket.io           │
├─────────────────────────────────────────────────────────────┤
│                      后端服务层 [待集成]                     │
│        FastAPI + Celery + Redis + WebSocket                │
├─────────────────────────────────────────────────────────────┤
│                      AI分析层 [待集成]                       │
│   讯飞星火4.0 + LangGraph/CrewAI + LoRA微调 + RAG          │
├─────────────────────────────────────────────────────────────┤
│                      3D生成层 [待集成]                       │
│   Tripo AI / Meshy + 3D Gaussian Splatting + TripoSR       │
├─────────────────────────────────────────────────────────────┤
│                      语音交互层 [待集成]                     │
│   讯飞TTS + 讯飞ASR + 实时语音流式交互                      │
├─────────────────────────────────────────────────────────────┤
│                      数据采集层 [待集成]                     │
│            Scrapy + Playwright + 官方API接口                │
├─────────────────────────────────────────────────────────────┤
│                      数据存储层 [待集成]                     │
│          PostgreSQL + Elasticsearch + MinIO                │
└─────────────────────────────────────────────────────────────┘
```

### Data Storage (待集成)

- **Primary storage**: PostgreSQL (关系型数据，舆情元数据)
- **Search Engine**: Elasticsearch (全文检索)
- **Vector Database**: Chroma/Qdrant (向量检索，RAG)
- **Caching**: Redis (热点数据缓存)
- **Object Storage**: MinIO (图片/视频/3D 模型存储)
- **Data formats**: JSON (API 交互)，GLB/GLTF (3D 模型)

### External Integrations

#### 讯飞技术集成 (比赛加分项)

| 技术                   | 协议           | 用途                         |
| ---------------------- | -------------- | ---------------------------- |
| **讯飞星火 4.0 Ultra** | HTTP/WebSocket | 舆情分析、趋势预测、决策建议 |
| **讯飞星火 Lite**      | HTTP           | 轻量任务 (永久免费)          |
| **讯飞在线 TTS**       | WebSocket 流式 | 语音合成播报预警             |
| **讯飞实时 ASR**       | WebSocket 流式 | 语音输入交互                 |
| **讯飞语音转写 LFASR** | HTTP           | 视频/音频舆情内容提取        |

#### 地图服务

| 服务                    | 用途                        |
| ----------------------- | --------------------------- |
| **高德地图 JS API 2.0** | 3D 地图、区域边界、建筑高亮 |
| **高德 MCP 协议**       | AI Agent 地图操作           |

#### 3D 生成服务 (待集成)

| 服务         | 用途                |
| ------------ | ------------------- |
| **Tripo AI** | 文字/图片转 3D 模型 |
| **TripoSR**  | 单图转 3D (开源)    |

### Monitoring & Dashboard Technologies

- **Dashboard Framework**: Vue 3 + Element Plus
- **Real-time Communication**: Socket.io (WebSocket)
- **Visualization Libraries**: ECharts, Three.js (GLCustomLayer)
- **State Management**: Pinia

## Development Environment

### Build & Development Tools

- **Build System**: Vite 6.0
- **Package Management**: npm / pnpm
- **Development workflow**: Vite HMR (热模块替换)

### Code Quality Tools

- **Static Analysis**: ESLint (待配置)
- **Formatting**: Prettier (待配置)
- **Testing Framework**: Vitest (待配置)
- **Documentation**: JSDoc / VueDoc

### Version Control & Collaboration

- **VCS**: Git
- **Branching Strategy**: Feature Branch
- **Code Review Process**: Pull Request

### Dashboard Development

- **Live Reload**: Vite HMR
- **Port Management**: Vite 默认 5173，可配置
- **Multi-Instance Support**: 支持多端口运行

## Deployment & Distribution

- **Target Platform(s)**: Web (优先)，未来扩展桌面端/移动端
- **Distribution Method**: 静态资源部署 (Nginx/CDN)
- **Installation Requirements**: 现代浏览器 (Chrome 90+, Edge 90+, Firefox 88+)
- **Update Mechanism**: 静态资源更新

## Technical Requirements & Constraints

### Performance Requirements

- **首屏加载**: < 3 秒
- **3D 地图渲染**: 60 FPS
- **API 响应**: < 500ms
- **实时推送延迟**: < 1 秒

### Compatibility Requirements

- **Platform Support**: Windows, macOS, Linux (现代浏览器)
- **Browser Support**: Chrome 90+, Edge 90+, Firefox 88+, Safari 14+
- **Mobile Support**: 响应式设计，支持移动端浏览器访问 (Responsive Web)

### Security & Compliance

- **Security Requirements**: HTTPS, API Key 安全存储
- **Data Protection**: 敏感数据加密传输
- **API 安全**: 讯飞 API Key 不暴露在前端

### Scalability & Reliability

- **Expected Load**: 演示阶段小规模用户
- **Availability Requirements**: 演示稳定性优先
- **Growth Projections**: 从单城市扩展到省级到全国

## Technical Decisions & Rationale

### Decision Log

1. **Vue 3 + Vite**:

   - 选择原因：现代化开发体验，HMR 快，生态成熟
   - 备选方案：React + Next.js

2. **高德地图 JS API 2.0** (唯一地图方案):

   - 选择原因：国内数据全，3D 支持好，已支持 MCP 协议
   - 3D 能力：viewMode: '3D'，支持建筑高亮、区域边界、热力图
   - 3D 模型：通过 GLCustomLayer + Three.js 加载 AI 生成的 GLB 模型
   - 不使用 Cesium：减少依赖复杂度，高德 3D 已满足需求

3. **讯飞星火 4.0**:

   - 选择原因：比赛加分项，128K 上下文，中文效果好
   - 备选方案：DeepSeek-V3 API

4. **LangGraph**:

   - 选择原因：状态化多 Agent，适合复杂决策流程
   - 备选方案：CrewAI, AutoGen

5. **Element Plus**:
   - 选择原因：Vue 3 生态，企业级组件，文档完善
   - 备选方案：Naive UI

## Known Limitations

- **3D 性能**: 大规模 3D 场景可能存在性能瓶颈
- **数据源**: 目前依赖模拟数据，真实数据采集待实现
- **跨平台**: 当前仅支持 Web，桌面端/移动端需后续开发
- **离线支持**: 暂不支持离线使用

## 后端 API 设计规范

### RESTful API 规范

- **基础路径**: `/api/v1`
- **认证方式**: JWT Token (Bearer)
- **响应格式**: JSON
- **错误处理**: 统一错误响应结构

### WebSocket 规范

- **连接路径**: `/ws`
- **协议**: Socket.IO (兼容前端)
- **事件命名**: `snake_case`
- **心跳间隔**: 25 秒

### API 模块划分

| 模块路径              | 功能描述             |
| --------------------- | -------------------- |
| `/api/v1/auth`        | 认证授权             |
| `/api/v1/sentiment`   | 舆情数据 CRUD        |
| `/api/v1/analysis`    | AI 分析接口          |
| `/api/v1/decision`    | 决策模拟             |
| `/api/v1/scene`       | 3D 场景生成          |
| `/api/v1/crawler`     | 数据采集管理         |
| `/api/v1/voice`       | 语音交互             |
| `/api/v1/admin`       | 后台管理             |
| `/api/v1/models`      | 模型矩阵管理         |

### API 版本升级策略

**当前版本**: v1

**升级路径**:
1. **v1 -> v2 触发条件**:
   - 数据模型发生破坏性变更 (字段删除/类型变更)
   - 认证机制重大调整
   - 响应结构重构

2. **版本共存策略**:
   - 新版本发布后，旧版本保持 **6 个月** 兼容期
   - 在响应头中添加 `X-API-Deprecation-Warning` 提醒迁移
   - 旧版本文档标注废弃时间表

3. **升级实施**:
   ```
   /api/v1/*  -> 当前稳定版本
   /api/v2/*  -> 未来版本 (预留)
   ```

4. **客户端适配**:
   - 前端 `client.js` 中 `BASE_URL` 统一管理版本前缀
   - 支持环境变量覆盖: `VITE_API_VERSION=v2`

## 当前进度

```
前端展示层 ████████████████████ 100% 已采用
后端服务层 ░░░░░░░░░░░░░░░░░░░░   0% 待集成 <- 当前阶段
AI分析层   ░░░░░░░░░░░░░░░░░░░░   0% 待集成
3D生成层   ░░░░░░░░░░░░░░░░░░░░   0% 待集成
语音交互层 ░░░░░░░░░░░░░░░░░░░░   0% 待集成
数据采集层 ░░░░░░░░░░░░░░░░░░░░   0% 待集成
数据存储层 ░░░░░░░░░░░░░░░░░░░░   0% 待集成
```
