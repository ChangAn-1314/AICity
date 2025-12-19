# Tasks Document - Backend API

## Phase 1: 项目初始化与基础框架

- [ ] 1.1 初始化 FastAPI 项目结构
  - Files: `AICityBack/app/main.py`, `AICityBack/pyproject.toml`, `AICityBack/requirements.txt`
  - 创建 FastAPI 应用入口，配置 CORS、异常处理中间件
  - 配置 pyproject.toml 和 requirements.txt 依赖
  - Purpose: 建立后端项目基础结构
  - _Leverage: structure.md 中定义的目录结构_
  - _Requirements: REQ-1, REQ-7_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Python Backend Developer specializing in FastAPI | Task: Initialize FastAPI project with proper structure following structure.md, create main.py with CORS, exception handlers, and basic health check endpoint | Restrictions: Follow existing directory structure, use async patterns, do not hardcode configurations | _Leverage: .spec-workflow/steering/structure.md, .spec-workflow/steering/tech.md | Success: FastAPI app starts successfully, /health endpoint returns 200, CORS configured for frontend origin | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 1.2 配置环境变量和核心设置
  - Files: `AICityBack/app/core/config.py`, `AICityBack/.env.example`
  - 使用 pydantic-settings 管理环境配置
  - 定义数据库、Redis、讯飞 API 等配置项
  - Purpose: 集中管理应用配置
  - _Leverage: tech.md 中的技术选型_
  - _Requirements: REQ-1_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer with Python expertise | Task: Create configuration management using pydantic-settings with all required environment variables for database, Redis, XunFei APIs, JWT secrets | Restrictions: Never commit real secrets, use .env.example as template, validate all configs on startup | _Leverage: .spec-workflow/steering/tech.md | Success: App loads configs from .env, validation errors on missing required vars, .env.example documents all vars | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 1.3 设置数据库连接和 SQLAlchemy 配置
  - Files: `AICityBack/app/db/session.py`, `AICityBack/app/db/base.py`
  - 配置 asyncpg + SQLAlchemy 2.0 异步连接
  - 创建数据库会话依赖注入
  - Purpose: 建立数据库访问层基础
  - _Leverage: tech.md 中的 PostgreSQL + asyncpg_
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Database Engineer with SQLAlchemy expertise | Task: Configure async SQLAlchemy 2.0 with asyncpg driver, create session factory and dependency injection for FastAPI | Restrictions: Use async session only, implement proper connection pooling, handle connection lifecycle correctly | _Leverage: app/core/config.py | Success: Database connects successfully, sessions are properly managed and closed, dependency injection works in routes | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 1.4 配置 Alembic 数据库迁移
  - Files: `AICityBack/alembic.ini`, `AICityBack/alembic/env.py`
  - 初始化 Alembic 并配置异步支持
  - Purpose: 支持数据库模式版本控制
  - _Leverage: app/db/session.py_
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Database Administrator with migration expertise | Task: Initialize Alembic with async SQLAlchemy support, configure env.py for async migrations | Restrictions: Support both online and offline migrations, auto-generate from models | _Leverage: app/db/session.py, app/db/base.py | Success: alembic revision --autogenerate works, alembic upgrade head applies migrations | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

## Phase 2: 数据模型与认证系统

- [ ] 2.1 创建用户数据模型
  - Files: `AICityBack/app/models/user.py`, `AICityBack/app/models/__init__.py`
  - 定义 User SQLAlchemy 模型
  - 包含 id, username, email, hashed_password, role, is_active 字段
  - Purpose: 用户数据持久化
  - _Leverage: design.md 中的 User Model 定义_
  - _Requirements: REQ-1_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with ORM expertise | Task: Create User SQLAlchemy model following design.md specification with proper indexes and constraints | Restrictions: Use async-compatible model patterns, add created_at/updated_at timestamps | _Leverage: design.md User Model section | Success: Model creates table correctly, migrations generate successfully | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 2.2 创建认证 Pydantic Schemas
  - Files: `AICityBack/app/schemas/auth.py`, `AICityBack/app/schemas/__init__.py`
  - 定义 LoginRequest, TokenResponse, UserResponse 等 Schema
  - Purpose: API 请求/响应数据验证
  - _Leverage: Pydantic v2 patterns_
  - _Requirements: REQ-1_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Developer with Pydantic expertise | Task: Create authentication Pydantic schemas for login request, token response, user response with proper validation | Restrictions: Use Pydantic v2 syntax, add field descriptions for OpenAPI docs | _Leverage: design.md Authentication Service section | Success: Schemas validate correctly, OpenAPI docs show proper descriptions | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 2.3 实现 JWT 安全模块
  - Files: `AICityBack/app/core/security.py`
  - 实现 JWT token 创建、验证、刷新
  - 密码哈希 (bcrypt) 和验证
  - Purpose: 提供认证安全基础设施
  - _Leverage: python-jose, passlib_
  - _Requirements: REQ-1_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Security Engineer with JWT expertise | Task: Implement JWT token creation/verification with access and refresh tokens, password hashing using bcrypt | Restrictions: Use secure defaults, configurable expiration times, never log tokens | _Leverage: app/core/config.py for secrets | Success: Tokens generate and verify correctly, passwords hash and verify, refresh flow works | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 2.4 实现认证服务层
  - Files: `AICityBack/app/services/auth_service.py`
  - 实现 authenticate, verify_token, refresh_token 方法
  - Purpose: 封装认证业务逻辑
  - _Leverage: app/core/security.py, app/models/user.py_
  - _Requirements: REQ-1_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with authentication expertise | Task: Implement AuthService with authenticate, verify_token, refresh_token, get_current_user methods | Restrictions: Async methods only, proper error handling, don't expose internal errors | _Leverage: app/core/security.py, app/models/user.py | Success: Login returns tokens, token verification works, refresh generates new access token | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 2.5 创建认证 API 路由
  - Files: `AICityBack/app/api/v1/auth.py`, `AICityBack/app/api/deps.py`
  - 实现 POST /login, POST /refresh, GET /me 端点
  - 创建 get_current_user 依赖注入
  - Purpose: 暴露认证 API 端点
  - _Leverage: app/services/auth_service.py_
  - _Requirements: REQ-1_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Developer with FastAPI expertise | Task: Create auth API routes for login, token refresh, and get current user with proper dependency injection | Restrictions: Follow RESTful conventions, use OAuth2PasswordBearer, document all endpoints | _Leverage: app/services/auth_service.py, app/schemas/auth.py | Success: /api/v1/auth/login returns tokens, /api/v1/auth/me returns user info with valid token | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

## Phase 3: 舆情数据管理

- [ ] 3.1 创建舆情数据模型
  - Files: `AICityBack/app/models/sentiment.py`, `AICityBack/app/models/hotspot.py`
  - 定义 Hotspot, AnalysisResult SQLAlchemy 模型
  - Purpose: 舆情数据持久化
  - _Leverage: design.md 中的数据模型定义_
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Database Developer with SQLAlchemy expertise | Task: Create Hotspot and AnalysisResult models following design.md with proper relationships, indexes, and JSON fields | Restrictions: Use PostgreSQL JSON type for arrays, add proper indexes for query performance | _Leverage: design.md Data Models section | Success: Models migrate correctly, relationships work, JSON fields store/retrieve properly | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 3.2 创建舆情 Pydantic Schemas
  - Files: `AICityBack/app/schemas/sentiment.py`
  - 定义 HotspotCreate, HotspotUpdate, HotspotResponse, HotspotFilter 等
  - Purpose: 舆情 API 数据验证
  - _Leverage: Pydantic v2_
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Developer with Pydantic expertise | Task: Create Pydantic schemas for Hotspot CRUD operations with filtering, pagination support | Restrictions: Use Pydantic v2, add validators for coordinates, enum for sentiment values | _Leverage: design.md Hotspot Model | Success: Schemas validate all fields correctly, enums restrict values, coordinates validate format | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 3.3 实现舆情服务层
  - Files: `AICityBack/app/services/sentiment_service.py`
  - 实现 CRUD 操作、统计查询、筛选过滤
  - Purpose: 封装舆情业务逻辑
  - _Leverage: app/models/sentiment.py, app/db/session.py_
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with service layer expertise | Task: Implement SentimentService with CRUD methods, filtering, pagination, and statistics queries | Restrictions: Async methods, use SQLAlchemy select for queries, soft delete support | _Leverage: app/models/sentiment.py, design.md Sentiment Service | Success: All CRUD operations work, filters apply correctly, pagination returns proper results | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 3.4 创建舆情 API 路由
  - Files: `AICityBack/app/api/v1/sentiment.py`
  - 实现 GET/POST/PUT/DELETE /hotspots 端点
  - 实现 GET /hotspots/statistics 端点
  - Purpose: 暴露舆情管理 API
  - _Leverage: app/services/sentiment_service.py_
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Developer with FastAPI expertise | Task: Create sentiment API routes for CRUD operations with filtering, pagination, and statistics endpoint | Restrictions: Require authentication, use dependency injection, proper HTTP status codes | _Leverage: app/services/sentiment_service.py, app/api/deps.py | Success: All CRUD endpoints work, filters and pagination functional, statistics returns aggregated data | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

## Phase 3.5: Elasticsearch 全文检索集成

- [ ] 3.5.1 配置 Elasticsearch 客户端
  - Files: `AICityBack/app/db/elasticsearch.py`
  - 配置 elasticsearch-py 异步客户端
  - 实现连接池和健康检查
  - Purpose: 建立 Elasticsearch 连接基础设施
  - _Leverage: elasticsearch[async], app/core/config.py_
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Search Infrastructure Engineer | Task: Configure elasticsearch-py AsyncElasticsearch client with connection pooling and health checks | Restrictions: Use async client, configure retry on failure, implement graceful connection handling | _Leverage: elasticsearch-py docs, app/core/config.py | Success: Client connects to ES cluster, health check passes, handles connection failures gracefully | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 3.5.2 创建舆情索引映射
  - Files: `AICityBack/app/db/es_mappings.py`
  - 定义 hotspots 索引的 mapping (title, content, keywords 等字段)
  - 配置中文分词器 (ik_max_word)
  - Purpose: 优化舆情全文检索性能
  - _Leverage: Elasticsearch mapping DSL_
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Search Engineer | Task: Create Elasticsearch index mapping for hotspots with Chinese analyzer (ik_max_word), proper field types | Restrictions: Use keyword for filters, text with ik analyzer for search, date for timestamps | _Leverage: ES mapping docs, design.md Hotspot model | Success: Index creates with correct mapping, Chinese text tokenizes properly, filters work on keyword fields | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 3.5.3 实现搜索服务层
  - Files: `AICityBack/app/services/search_service.py`
  - 实现全文搜索、高亮、聚合统计方法
  - 支持按城市、情感、时间范围过滤
  - Purpose: 封装 Elasticsearch 搜索业务逻辑
  - _Leverage: app/db/elasticsearch.py, app/db/es_mappings.py_
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Search Application Developer | Task: Implement SearchService with full-text search, highlighting, aggregations for sentiment distribution | Restrictions: Async methods, support pagination, return highlighted snippets, handle empty results | _Leverage: app/db/elasticsearch.py | Success: Search returns relevant results, highlights match terms, aggregations show sentiment distribution | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 3.5.4 同步舆情数据到 Elasticsearch
  - Files: `AICityBack/app/services/sentiment_service.py` (更新)
  - 在舆情 CRUD 操作后同步更新 ES 索引
  - 实现批量索引和增量同步
  - Purpose: 保持 PostgreSQL 和 ES 数据一致性
  - _Leverage: app/services/search_service.py, app/services/sentiment_service.py_
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Data Synchronization Engineer | Task: Integrate ES indexing into SentimentService CRUD operations, implement bulk sync for initial load | Restrictions: Async indexing, handle ES failures gracefully (don't fail main operation), implement retry | _Leverage: existing sentiment_service.py, search_service.py | Success: Creating hotspot indexes to ES, updates sync, deletes remove from index, bulk sync works | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

## Phase 4: WebSocket 实时通信

- [ ] 4.1 配置 Socket.IO 服务器
  - Files: `AICityBack/app/websocket/__init__.py`, `AICityBack/app/websocket/manager.py`
  - 集成 python-socketio 到 FastAPI
  - 实现连接管理器
  - Purpose: 建立 WebSocket 基础设施
  - _Leverage: python-socketio AsyncServer_
  - _Requirements: REQ-7_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with WebSocket expertise | Task: Configure python-socketio AsyncServer with FastAPI, create WebSocketManager for connection tracking | Restrictions: Use ASGI mode, configure CORS for frontend, implement heartbeat | _Leverage: app/main.py | Success: WebSocket connects from frontend, connection manager tracks active connections | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 4.2 实现 WebSocket 事件处理
  - Files: `AICityBack/app/websocket/events.py`
  - 实现 connect, disconnect, join_room, leave_room 事件
  - 实现 emit 和 broadcast 方法
  - Purpose: 处理客户端事件和消息推送
  - _Leverage: app/websocket/manager.py_
  - _Requirements: REQ-7_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Real-time Systems Developer | Task: Implement Socket.IO event handlers for connect/disconnect, room management, and message broadcasting | Restrictions: Handle disconnection gracefully, clean up room subscriptions, log events | _Leverage: app/websocket/manager.py | Success: Clients can join/leave rooms, messages broadcast to room members, disconnection cleans up | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 4.3 集成 WebSocket 推送到服务层
  - Files: `AICityBack/app/services/notification_service.py`
  - 创建通知服务，在舆情更新时触发 WebSocket 推送
  - Purpose: 业务事件驱动实时通知
  - _Leverage: app/websocket/manager.py, app/services/sentiment_service.py_
  - _Requirements: REQ-7_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with event-driven architecture expertise | Task: Create NotificationService to emit WebSocket events on hotspot create/update, heat changes, alerts | Restrictions: Async emit, don't block main operations, include event type and payload | _Leverage: app/websocket/manager.py, design.md WebSocket events | Success: Creating hotspot emits new_sentiment event, heat change emits heat_change event | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

## Phase 5: 讯飞 AI 服务集成

- [ ] 5.1 实现讯飞星火客户端
  - Files: `AICityBack/ai/spark/__init__.py`, `AICityBack/ai/spark/client.py`, `AICityBack/ai/spark/config.py`
  - 封装讯飞星火 4.0 API 调用 (WebSocket)
  - 支持普通对话和流式输出
  - Purpose: 提供 AI 大模型访问能力
  - _Leverage: 讯飞星火 WebSocket API_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: AI Integration Developer | Task: Create SparkClient with WebSocket-based chat and streaming methods for XunFei Spark 4.0 API | Restrictions: Handle auth signature correctly, implement reconnection, async generator for streaming | _Leverage: XunFei Spark API documentation, app/core/config.py | Success: Chat returns response, streaming yields chunks, handles API errors gracefully | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 5.2 创建舆情分析 Prompt 模板
  - Files: `AICityBack/ai/spark/prompts.py`
  - 定义情感分析、关键词提取、摘要生成的 Prompt
  - Purpose: 标准化 AI 分析请求
  - _Leverage: ai/spark/client.py_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Prompt Engineer | Task: Create prompt templates for sentiment analysis, keyword extraction, summary generation optimized for Chinese content | Restrictions: Use structured output format (JSON), include examples, handle edge cases | _Leverage: ai/spark/client.py | Success: Prompts generate consistent structured outputs, handle various content types | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 5.3 实现 AI 分析服务
  - Files: `AICityBack/app/services/ai_service.py`
  - 实现 analyze_sentiment, extract_keywords, generate_summary 方法
  - Purpose: 封装 AI 分析业务逻辑
  - _Leverage: ai/spark/client.py, ai/spark/prompts.py_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: AI Application Developer | Task: Implement AIService with sentiment analysis, keyword extraction, summary generation using SparkClient | Restrictions: Parse AI responses properly, handle failures gracefully, cache repeated requests | _Leverage: ai/spark/client.py, ai/spark/prompts.py | Success: Analysis returns structured results, handles API failures, caches improve performance | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 5.4 创建 AI 分析 API 路由
  - Files: `AICityBack/app/api/v1/analysis.py`
  - 实现 POST /analyze 端点
  - 支持同步分析和异步批量分析
  - Purpose: 暴露 AI 分析 API
  - _Leverage: app/services/ai_service.py_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Developer | Task: Create analysis API routes for single and batch sentiment analysis with async task support | Restrictions: Require authentication, validate input content, return task ID for batch operations | _Leverage: app/services/ai_service.py | Success: Single analysis returns results, batch returns task ID, results stored in database | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

## Phase 5.5: RAG 检索增强生成

- [ ] 5.5.1 实现向量库封装
  - Files: `AICityBack/ai/rag/__init__.py`, `AICityBack/ai/rag/vector_store.py`
  - 封装 Chroma/Qdrant 向量数据库操作
  - 支持文档索引、相似度检索、删除操作
  - Purpose: 提供统一的向量存储接口
  - _Leverage: chromadb, qdrant-client_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: ML Infrastructure Engineer | Task: Create VectorStore abstraction with Chroma/Qdrant backends for document indexing and similarity search | Restrictions: Support async operations, implement batch indexing, configurable similarity threshold | _Leverage: chromadb, qdrant-client docs | Success: Documents index correctly, similarity search returns relevant results, supports multiple collections | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 5.5.2 实现嵌入模型封装
  - Files: `AICityBack/ai/rag/embeddings.py`
  - 封装文本嵌入模型调用 (讯飞/本地模型)
  - 支持批量嵌入和缓存
  - Purpose: 提供文本向量化能力
  - _Leverage: 讯飞 Embedding API 或 sentence-transformers_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: NLP Engineer | Task: Create EmbeddingModel with XunFei API or local sentence-transformers for text vectorization | Restrictions: Support batch processing, implement caching, normalize vectors | _Leverage: XunFei Embedding API, sentence-transformers | Success: Text converts to vectors, batch processing works, cache reduces API calls | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 5.5.3 实现 RAG 检索器
  - Files: `AICityBack/ai/rag/retriever.py`
  - 实现基于向量相似度的文档检索
  - 支持过滤条件和重排序
  - Purpose: 提供上下文检索能力增强 AI 分析
  - _Leverage: ai/rag/vector_store.py, ai/rag/embeddings.py_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Information Retrieval Engineer | Task: Create RAGRetriever combining embeddings and vector store for context-aware document retrieval | Restrictions: Support metadata filtering, implement reranking, return relevance scores | _Leverage: ai/rag/vector_store.py, ai/rag/embeddings.py | Success: Query retrieves relevant documents, filtering works, reranking improves precision | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 5.5.4 集成 RAG 到 AI 分析服务
  - Files: `AICityBack/app/services/ai_service.py` (更新)
  - 在分析前检索相关历史舆情作为上下文
  - 增强 AI 分析的准确性和一致性
  - Purpose: 利用 RAG 提升分析质量
  - _Leverage: ai/rag/retriever.py, app/services/ai_service.py_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: AI Application Developer | Task: Integrate RAGRetriever into AIService for context-enhanced sentiment analysis | Restrictions: Retrieve top-k relevant documents, format context for prompts, handle empty results | _Leverage: ai/rag/retriever.py, existing ai_service.py | Success: Analysis uses retrieved context, improves consistency for similar events, handles no-context gracefully | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

## Phase 6: LangGraph 决策模拟

- [ ] 6.1 定义 Agent 状态和节点
  - Files: `AICityBack/agents/__init__.py`, `AICityBack/agents/state.py`, `AICityBack/agents/nodes/`
  - 定义 SentimentState TypedDict
  - 实现 analyze, predict, decide, simulate 节点函数
  - Purpose: 构建多 Agent 决策图节点
  - _Leverage: LangGraph, ai/spark/client.py_
  - _Requirements: REQ-4_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: AI Agent Developer with LangGraph expertise | Task: Create SentimentState and implement analyze, predict, decide, simulate agent nodes using SparkClient | Restrictions: Each node has single responsibility, state immutability, proper error handling | _Leverage: design.md Decision Service, ai/spark/client.py | Success: Each node processes state correctly, outputs proper format for next node | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 6.2 构建 LangGraph 状态图
  - Files: `AICityBack/agents/graph.py`
  - 创建 StateGraph，连接节点，编译执行图
  - Purpose: 编排多 Agent 决策流程
  - _Leverage: agents/nodes/, LangGraph StateGraph_
  - _Requirements: REQ-4_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: AI Workflow Engineer | Task: Create LangGraph StateGraph connecting analyze->predict->decide->simulate nodes with proper edges | Restrictions: Handle conditional edges, implement graph compilation, support async execution | _Leverage: agents/nodes/, design.md Decision Service architecture | Success: Graph compiles, executes full pipeline, outputs simulation results | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 6.3 实现决策模拟服务
  - Files: `AICityBack/app/services/decision_service.py`
  - 封装 LangGraph 调用，提供预测和模拟接口
  - Purpose: 封装决策模拟业务逻辑
  - _Leverage: agents/graph.py_
  - _Requirements: REQ-4_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Implement DecisionService with predict_trend, simulate_decision, custom_simulate methods using LangGraph | Restrictions: Async execution, proper result parsing, store results in database | _Leverage: agents/graph.py, app/models/analysis.py | Success: Prediction returns trend data, simulation returns multi-scenario results | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 6.4 创建决策模拟 API 路由
  - Files: `AICityBack/app/api/v1/decision.py`
  - 实现 POST /predict, POST /simulate 端点
  - Purpose: 暴露决策模拟 API
  - _Leverage: app/services/decision_service.py_
  - _Requirements: REQ-4_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Developer | Task: Create decision API routes for trend prediction and decision simulation with parameter validation | Restrictions: Require authentication, validate prediction hours (24/48/72), document response formats | _Leverage: app/services/decision_service.py | Success: Prediction returns forecast, simulation returns scenarios with probabilities | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

## Phase 7: 语音、3D 服务和模型管理

- [ ] 7.0 创建 SceneTask 数据模型
  - Files: `AICityBack/app/models/scene.py`
  - 定义 SceneTask SQLAlchemy 模型
  - 包含 id, hotspot_id, input_type, input_content, status, progress, model_url, error_message 字段
  - Purpose: 3D 场景生成任务持久化
  - _Leverage: design.md 中的 Scene Generation Task Model 定义_
  - _Requirements: REQ-5_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Database Developer | Task: Create SceneTask SQLAlchemy model following design.md specification for 3D generation task tracking | Restrictions: Use PostgreSQL-compatible types, add proper indexes for status queries | _Leverage: design.md SceneTask Model section | Success: Model creates table correctly, migrations generate successfully | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 7.1 实现讯飞 TTS 客户端
  - Files: `AICityBack/ai/voice/__init__.py`, `AICityBack/ai/voice/tts.py`
  - 封装讯飞在线 TTS WebSocket API
  - 支持流式音频输出
  - Purpose: 提供语音合成能力
  - _Leverage: 讯飞 TTS WebSocket API_
  - _Requirements: REQ-6_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Audio/Speech Developer | Task: Create TTSClient with streaming WebSocket connection to XunFei TTS API, support multiple voices | Restrictions: Handle audio chunks properly, implement reconnection, yield audio as async generator | _Leverage: XunFei TTS API docs, app/core/config.py | Success: Text converts to audio stream, multiple voices work, handles long text | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 7.2 实现讯飞 ASR 客户端
  - Files: `AICityBack/ai/voice/asr.py`
  - 封装讯飞实时 ASR WebSocket API
  - 支持流式音频输入
  - Purpose: 提供语音识别能力
  - _Leverage: 讯飞 ASR WebSocket API_
  - _Requirements: REQ-6_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Speech Recognition Developer | Task: Create ASRClient with streaming WebSocket connection to XunFei ASR API for real-time transcription | Restrictions: Handle audio format requirements, implement VAD, return incremental results | _Leverage: XunFei ASR API docs | Success: Audio stream transcribes to text, handles continuous speech, returns partial results | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 7.3 实现 Tripo AI 3D 生成客户端
  - Files: `AICityBack/ai/scene3d/__init__.py`, `AICityBack/ai/scene3d/tripo.py`
  - 封装 Tripo AI API 调用
  - 实现任务创建、状态查询、模型下载
  - Purpose: 提供 3D 模型生成能力
  - _Leverage: Tripo AI REST API_
  - _Requirements: REQ-5_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: 3D/Graphics Developer | Task: Create TripoClient with methods to create generation task, poll status, download GLB model from Tripo AI API | Restrictions: Handle API rate limits, implement polling with backoff, validate model format | _Leverage: Tripo AI API docs, app/core/config.py | Success: Text/image generates 3D task, status polling works, GLB downloads correctly | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 7.4 创建语音和场景 API 路由
  - Files: `AICityBack/app/api/v1/voice.py`, `AICityBack/app/api/v1/scene.py`
  - 实现 TTS/ASR 流式端点
  - 实现 3D 生成任务管理端点
  - Purpose: 暴露语音和 3D 服务 API
  - _Leverage: ai/voice/, ai/scene3d/, app/services/_
  - _Requirements: REQ-5, REQ-6_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Developer | Task: Create voice API for TTS/ASR streaming and scene API for 3D generation task management | Restrictions: Use StreamingResponse for audio, proper content types, async task handling | _Leverage: ai/voice/, ai/scene3d/ | Success: TTS streams audio, ASR accepts audio stream, 3D tasks create and track properly | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

## Phase 8: 异步任务和采集

- [ ] 8.0 创建 CrawlerTask 数据模型
  - Files: `AICityBack/app/models/crawler.py`
  - 定义 CrawlerTask SQLAlchemy 模型
  - 包含 id, name, source, keywords, schedule, is_active, last_run_at, next_run_at, total_collected 字段
  - Purpose: 采集任务持久化
  - _Leverage: design.md 中的 Crawler Task Model 定义_
  - _Requirements: REQ-8_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Database Developer | Task: Create CrawlerTask SQLAlchemy model following design.md specification for crawler task management | Restrictions: Use PostgreSQL JSON type for keywords array, add proper indexes | _Leverage: design.md CrawlerTask Model section | Success: Model creates table correctly, migrations generate successfully | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 8.1 配置 Celery 和 Redis
  - Files: `AICityBack/tasks/__init__.py`, `AICityBack/tasks/celery_app.py`
  - 初始化 Celery 应用，配置 Redis broker
  - Purpose: 建立异步任务基础设施
  - _Leverage: Celery, Redis_
  - _Requirements: REQ-8_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer with Celery expertise | Task: Initialize Celery application with Redis broker, configure task serialization and result backend | Restrictions: Use JSON serialization, configure retry policies, set up task routes | _Leverage: app/core/config.py | Success: Celery worker starts, tasks execute and return results via Redis | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 8.2 实现采集和分析异步任务
  - Files: `AICityBack/tasks/crawler_tasks.py`, `AICityBack/tasks/analysis_tasks.py`
  - 实现数据采集任务、批量分析任务
  - Purpose: 异步执行耗时操作
  - _Leverage: tasks/celery_app.py, app/services/_
  - _Requirements: REQ-3, REQ-8_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with async task expertise | Task: Create Celery tasks for data crawling and batch AI analysis with progress tracking | Restrictions: Handle task failures, implement retry, emit WebSocket progress updates | _Leverage: tasks/celery_app.py, app/services/ai_service.py | Success: Tasks execute async, progress updates emit via WebSocket, failures retry | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 8.3 创建采集管理 API
  - Files: `AICityBack/app/api/v1/crawler.py`, `AICityBack/app/services/crawler_service.py`
  - 实现采集任务 CRUD 和状态管理
  - Purpose: 管理数据采集任务
  - _Leverage: tasks/crawler_tasks.py_
  - _Requirements: REQ-8_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Developer | Task: Create crawler API for task CRUD, status query, pause/resume operations with CrawlerService | Restrictions: Admin only access, validate task configurations, handle task state transitions | _Leverage: tasks/crawler_tasks.py | Success: Tasks create/pause/resume, status queries work, admin authorization enforced | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

## Phase 8.5: APScheduler 定时调度集成

- [ ] 8.5.1 配置 APScheduler 调度器
  - Files: `AICityBack/scheduler/__init__.py`, `AICityBack/scheduler/config.py`
  - 初始化 AsyncIOScheduler，配置时区、持久化（使用 SQLAlchemy JobStore）
  - 注册应用启动/关闭钩子
  - Purpose: 建立定时调度基础设施
  - _Leverage: APScheduler 3.10+, SQLAlchemy_
  - _Requirements: REQ-8_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Initialize APScheduler AsyncIOScheduler with timezone config, SQLAlchemy job store for persistence, and FastAPI lifespan hooks | Restrictions: Use Asia/Shanghai timezone, ensure jobs survive restart, proper shutdown handling | _Leverage: APScheduler docs, app/db/session.py | Success: Scheduler starts with app, jobs persist across restarts, graceful shutdown | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 8.5.2 实现 CrawlerTask 调度同步
  - Files: `AICityBack/scheduler/crawler_jobs.py`
  - 将 CrawlerTask.schedule（cron 表达式）映射为 APScheduler CronTrigger
  - 任务新增/修改/删除时同步更新 scheduler
  - Purpose: 定时触发采集任务
  - _Leverage: app/scheduler/config.py, app/models/crawler.py_
  - _Requirements: REQ-8_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Create sync_crawler_jobs module to map CrawlerTask.schedule to APScheduler CronTrigger, handle CRUD sync | Restrictions: Parse cron expressions safely, idempotent job updates, handle invalid cron gracefully | _Leverage: APScheduler CronTrigger, app/models/crawler.py | Success: CrawlerTask with schedule triggers at correct times, job changes reflect immediately | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 8.5.3 调度器触发 Celery 任务
  - Files: `AICityBack/scheduler/handlers.py`
  - APScheduler job 回调触发 Celery task（含重试和幂等检查）
  - Purpose: 连接调度器与异步任务队列
  - _Leverage: scheduler/, tasks/crawler_tasks.py_
  - _Requirements: REQ-8_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Implement APScheduler job handlers that trigger Celery tasks with idempotency keys and retry logic | Restrictions: Prevent duplicate task submission, log job execution, handle Celery connection errors | _Leverage: app/scheduler/config.py, tasks/celery_app.py | Success: Scheduled jobs trigger Celery tasks reliably, no duplicates, failures logged | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

## Phase 8.6: MinIO 对象存储集成

- [ ] 8.6.1 配置 MinIO 客户端
  - Files: `AICityBack/storage/__init__.py`, `AICityBack/storage/minio_client.py`
  - 初始化 MinIO 客户端，配置连接参数和默认桶
  - 实现健康检查和桶初始化逻辑
  - Purpose: 建立对象存储基础设施
  - _Leverage: minio-py SDK_
  - _Requirements: REQ-5, REQ-9_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Create MinIOClient wrapper with connection config, health check, and bucket initialization (scenes, adapters) | Restrictions: Use environment variables for credentials, implement retry on connection failure, ensure buckets exist on startup | _Leverage: minio-py docs, app/core/config.py | Success: Client connects, health check passes, buckets auto-created | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 8.6.2 实现 3D 模型存储服务
  - Files: `AICityBack/storage/scene_storage.py`
  - 实现 GLB 模型上传、下载、presigned URL 生成
  - 集成到 SceneService：Tripo 生成完成后上传 MinIO，更新 SceneTask.model_url
  - Purpose: 持久化 3D 生成结果
  - _Leverage: storage/minio_client.py, app/services/scene_service.py_
  - _Requirements: REQ-5_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Create scene_storage module for GLB upload/download with presigned URLs, integrate with SceneService post-generation flow | Restrictions: Validate GLB format, set proper content-type, URL expiration 1 hour | _Leverage: app/storage/minio_client.py, ai/scene3d/tripo.py | Success: GLB uploads to MinIO, SceneTask.model_url points to presigned URL, download works | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 8.6.3 实现适配器存储服务
  - Files: `AICityBack/storage/adapter_storage.py`
  - 实现 LoRA 适配器文件上传、下载、路径管理
  - 集成到 ModelMatrixService：适配器注册时上传，加载时下载
  - Purpose: 管理城市模型适配器文件
  - _Leverage: storage/minio_client.py, app/services/model_service.py_
  - _Requirements: REQ-9_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Create adapter_storage module for LoRA adapter upload/download, integrate with ModelMatrixService for adapter lifecycle | Restrictions: Validate adapter format, organize by city_code, support version management | _Leverage: app/storage/minio_client.py, ai/models/adapter_manager.py | Success: Adapters upload to MinIO, AdapterInfo.adapter_path correct, load retrieves adapter | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 8.6.4 更新 Docker Compose 配置
  - Files: `AICityBack/docker-compose.yml` (更新)
  - 添加 MinIO 服务定义，配置持久化卷和网络
  - Purpose: 支持 MinIO 容器化部署
  - _Leverage: MinIO Docker image_
  - _Requirements: REQ-5, REQ-9_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer | Task: Add MinIO service to docker-compose.yml with persistent volume, proper networking, and environment config | Restrictions: Use official MinIO image, configure console port, set root credentials via env | _Leverage: MinIO Docker docs | Success: MinIO container starts with compose, data persists, app connects | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

## Phase 9: 后台管理和模型矩阵

- [ ] 9.0 创建系统日志和适配器数据模型
  - Files: `AICityBack/app/models/system_log.py`, `AICityBack/app/models/adapter.py`
  - 定义 SystemLog 和 AdapterInfo SQLAlchemy 模型
  - Purpose: 后台管理和模型矩阵数据持久化
  - _Leverage: design.md 中的 SystemLog 和 AdapterInfo Model 定义_
  - _Requirements: REQ-9, REQ-10_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Database Developer | Task: Create SystemLog and AdapterInfo SQLAlchemy models following design.md for admin and model matrix features | Restrictions: Use PostgreSQL JSON for details/metrics, add proper indexes for queries | _Leverage: design.md SystemLog and AdapterInfo sections | Success: Models create tables correctly, migrations generate successfully | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 9.1 实现后台管理服务
  - Files: `AICityBack/app/services/admin_service.py`
  - 实现用户管理、日志查询、系统统计方法
  - Purpose: 封装后台管理业务逻辑
  - _Leverage: app/models/user.py, app/models/system_log.py_
  - _Requirements: REQ-10_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Implement AdminService with user CRUD, system log queries, and statistics methods | Restrictions: Admin-only access, audit all operations, paginated queries | _Leverage: app/models/, design.md AdminService | Success: User management works, logs query with filters, statistics aggregates correctly | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 9.2 创建后台管理 API 路由
  - Files: `AICityBack/app/api/v1/admin.py`
  - 实现 GET/POST/PUT /users, GET /logs, GET /stats 端点
  - Purpose: 暴露后台管理 API
  - _Leverage: app/services/admin_service.py_
  - _Requirements: REQ-10_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Developer | Task: Create admin API routes for user management, system logs, and statistics with admin-only authorization | Restrictions: Require admin role, validate all inputs, audit operations | _Leverage: app/services/admin_service.py | Success: User CRUD endpoints work, logs return filtered results, stats return aggregated data | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 9.3 实现城市模型矩阵服务
  - Files: `AICityBack/app/services/model_service.py`, `AICityBack/ai/models/adapter_manager.py`
  - 实现适配器加载、切换、注册方法
  - Purpose: 管理城市 LoRA 适配器
  - _Leverage: PEFT, LoRA, ai/spark/client.py_
  - _Requirements: REQ-9_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: ML Engineer | Task: Implement ModelMatrixService and AdapterManager for LoRA adapter loading, hot-switching, and registration | Restrictions: Support hot-reload < 1s, implement fallback logic, validate adapter format | _Leverage: design.md ModelMatrixService, PEFT library | Success: Adapters load correctly, hot-switch works, fallback to base model works | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 9.4 创建模型矩阵 API 路由
  - Files: `AICityBack/app/api/v1/models.py`
  - 实现 GET /adapters, POST /adapters, PUT /adapters/load 端点
  - Purpose: 暴露模型矩阵管理 API
  - _Leverage: app/services/model_service.py_
  - _Requirements: REQ-9_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Developer | Task: Create model matrix API routes for listing, registering, and loading city adapters | Restrictions: Admin-only for registration, validate adapter uploads, return current adapter status | _Leverage: app/services/model_service.py | Success: Adapters list correctly, upload registers new adapter, load switches active adapter | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

## Phase 10: 路由汇总和测试

- [ ] 10.1 汇总所有 API 路由
  - Files: `AICityBack/app/api/v1/__init__.py`, `AICityBack/app/api/router.py`
  - 注册所有路由到主应用
  - 配置路由前缀和标签
  - Purpose: 完成 API 路由组织
  - _Leverage: 所有 app/api/v1/*.py 路由_
  - _Requirements: All_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Architect | Task: Create API router aggregating all v1 routes with proper prefixes, tags, and include in main app | Restrictions: Organize by domain, consistent naming, proper OpenAPI tags | _Leverage: All app/api/v1/*.py files | Success: All routes accessible under /api/v1, OpenAPI docs show organized endpoints | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 10.2 编写核心模块单元测试
  - Files: `AICityBack/tests/test_auth.py`, `AICityBack/tests/test_sentiment.py`
  - 测试认证和舆情核心功能
  - Purpose: 确保核心功能正确性
  - _Leverage: pytest, pytest-asyncio_
  - _Requirements: REQ-1, REQ-2_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Write unit tests for auth service and sentiment service with proper mocking and fixtures | Restrictions: Use pytest-asyncio, mock external services, test success and failure cases | _Leverage: pytest, app/services/ | Success: Tests pass, cover auth flow and CRUD operations, good coverage | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 10.3 编写 API 集成测试
  - Files: `AICityBack/tests/test_api.py`, `AICityBack/tests/conftest.py`
  - 测试完整 API 流程
  - Purpose: 验证 API 端到端功能
  - _Leverage: httpx AsyncClient, pytest_
  - _Requirements: All_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Write API integration tests using httpx AsyncClient with test database and fixtures | Restrictions: Isolate tests, clean up data, test auth flows end-to-end | _Leverage: pytest, httpx, app/main.py | Success: Integration tests pass, cover main user journeys, database cleaned between tests | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_

- [ ] 10.4 创建 Docker 配置
  - Files: `AICityBack/Dockerfile`, `AICityBack/docker-compose.yml`
  - 配置应用容器化部署
  - 包含 PostgreSQL、Redis、Celery worker
  - Purpose: 支持容器化部署
  - _Leverage: Docker, docker-compose_
  - _Requirements: All_
  - _Prompt: Implement the task for spec backend-api, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer | Task: Create Dockerfile for FastAPI app and docker-compose.yml with PostgreSQL, Redis, Celery worker services | Restrictions: Multi-stage build, non-root user, health checks, proper networking | _Leverage: requirements.txt | Success: docker-compose up starts all services, app connects to database and Redis | Instructions: First mark this task as in-progress [-] in tasks.md, implement the code, then use log-implementation tool to record details, finally mark as complete [x]_
