# Requirements Document - Backend API

## Introduction

本文档定义了 **智舆** AI 城市舆情态势监测系统的后端 API 服务需求。后端基于 FastAPI 构建，提供舆情数据管理、AI 分析、决策模拟、3D 场景生成、语音交互等核心能力，通过 RESTful API 和 WebSocket 与前端通信。

## Alignment with Product Vision

根据 `product.md` 的产品目标：
- **实时监测**：后端提供舆情数据 CRUD 和实时推送能力
- **AI 智能分析**：集成讯飞星火 4.0 进行舆情分析和情感识别
- **决策模拟**：通过 LangGraph 多 Agent 实现趋势预测和决策推演
- **3D 现场还原**：调用 Tripo AI 生成舆情现场 3D 模型
- **语音交互**：集成讯飞 TTS/ASR 实现语音播报和输入

## Requirements

### REQ-1: 认证授权系统

**User Story:** 作为系统管理员，我希望有安全的用户认证系统，以便控制系统访问权限。

#### Acceptance Criteria

1. WHEN 用户提交有效的用户名和密码 THEN 系统 SHALL 返回 JWT access_token 和 refresh_token
2. WHEN 用户携带有效 JWT 访问受保护 API THEN 系统 SHALL 允许访问并返回请求数据
3. WHEN JWT 过期 THEN 系统 SHALL 返回 401 状态码并提示重新登录
4. WHEN 用户使用 refresh_token 请求刷新 THEN 系统 SHALL 返回新的 access_token
5. IF 用户角色为管理员 THEN 系统 SHALL 允许访问管理端点

### REQ-2: 舆情数据管理

**User Story:** 作为舆情分析师，我希望能够管理舆情热点数据，以便追踪和分析城市舆情态势。

#### Acceptance Criteria

1. WHEN 请求获取热点列表 THEN 系统 SHALL 返回分页的舆情热点数据，支持按城市、时间、热度筛选
2. WHEN 请求单个热点详情 THEN 系统 SHALL 返回完整的热点信息，包括来源、内容、情感分析结果
3. WHEN 创建新热点 THEN 系统 SHALL 验证数据完整性并存入数据库
4. WHEN 更新热点状态 THEN 系统 SHALL 更新数据库并通过 WebSocket 通知前端
5. WHEN 删除热点 THEN 系统 SHALL 软删除数据并保留历史记录

### REQ-3: AI 舆情分析

**User Story:** 作为舆情分析师，我希望系统能自动分析舆情内容，以便快速了解舆情态势和情感倾向。

#### Acceptance Criteria

1. WHEN 提交舆情内容进行分析 THEN 系统 SHALL 调用讯飞星火 API 返回情感分析结果
2. WHEN 分析完成 THEN 系统 SHALL 返回情感倾向（正面/中性/负面）、关键词、摘要
3. WHEN 请求批量分析 THEN 系统 SHALL 使用 Celery 异步处理并通过 WebSocket 推送进度
4. IF 讯飞 API 调用失败 THEN 系统 SHALL 返回降级结果并记录错误日志

### REQ-4: 决策模拟系统

**User Story:** 作为决策者，我希望系统能预测舆情走向并模拟决策效果，以便制定应对方案。

#### Acceptance Criteria

1. WHEN 请求趋势预测 THEN 系统 SHALL 基于历史数据和 AI 分析返回未来 24/48/72 小时预测
2. WHEN 提交决策方案进行模拟 THEN 系统 SHALL 通过 LangGraph 多 Agent 执行模拟推演
3. WHEN 模拟完成 THEN 系统 SHALL 返回多场景演化结果（乐观/中性/悲观）
4. WHEN 请求自定义决策模拟 THEN 系统 SHALL 允许用户输入自定义参数进行推演

### REQ-5: 3D 场景生成

**User Story:** 作为用户，我希望能通过 AI 还原舆情现场 3D 场景，以便直观了解事件情况。

#### Acceptance Criteria

1. WHEN 提交文字描述生成 3D THEN 系统 SHALL 调用 Tripo AI 返回 GLB 模型下载链接
2. WHEN 提交图片生成 3D THEN 系统 SHALL 调用 Tripo AI 处理图片并返回模型
3. WHEN 生成任务进行中 THEN 系统 SHALL 提供状态查询接口返回进度
4. WHEN 模型生成完成 THEN 系统 SHALL 存储到 MinIO 并通过 WebSocket 通知前端
5. IF 生成失败 THEN 系统 SHALL 返回错误原因并支持重试

### REQ-6: 语音交互服务

**User Story:** 作为用户，我希望能通过语音与系统交互，以便更便捷地获取信息和发出指令。

#### Acceptance Criteria

1. WHEN 请求语音合成 THEN 系统 SHALL 调用讯飞 TTS 返回音频流
2. WHEN 提交语音进行识别 THEN 系统 SHALL 调用讯飞 ASR 返回识别文本
3. WHEN 请求语音预警播报 THEN 系统 SHALL 生成预警文本并转为语音推送
4. WHEN 长音频需要转写 THEN 系统 SHALL 调用讯飞 LFASR 异步处理

### REQ-7: 实时通信

**User Story:** 作为用户，我希望能实时收到舆情更新和预警通知，以便及时响应。

#### Acceptance Criteria

1. WHEN 前端建立 WebSocket 连接 THEN 系统 SHALL 维护连接并支持房间订阅
2. WHEN 新舆情入库 THEN 系统 SHALL 向订阅用户推送 `new_sentiment` 事件
3. WHEN 热度变化超过阈值 THEN 系统 SHALL 推送 `heat_change` 事件
4. WHEN 触发预警条件 THEN 系统 SHALL 推送 `alert` 事件并触发 TTS 播报
5. WHEN 分析任务完成 THEN 系统 SHALL 推送 `analysis_complete` 事件

### REQ-8: 数据采集管理

**User Story:** 作为系统管理员，我希望能管理数据采集任务，以便控制舆情数据来源。

#### Acceptance Criteria

1. WHEN 创建采集任务 THEN 系统 SHALL 配置采集源、关键词、频率并启动 Celery 任务
2. WHEN 查询采集状态 THEN 系统 SHALL 返回任务运行状态、采集数量、最近更新时间
3. WHEN 暂停/恢复采集任务 THEN 系统 SHALL 控制 Celery 任务状态
4. WHEN 采集到新数据 THEN 系统 SHALL 清洗入库并触发分析流程

### REQ-9: 城市模型矩阵管理

**User Story:** 作为系统管理员，我希望能管理多城市/多省份的 AI 模型适配器，以便针对不同区域提供更精准的舆情分析。

#### Acceptance Criteria

1. WHEN 请求特定城市舆情分析 THEN 系统 SHALL 自动加载该城市对应的 LoRA 适配器
2. WHEN 切换分析区域 THEN 系统 SHALL 热切换适配器，切换时间 < 1 秒
3. WHEN 查询可用适配器 THEN 系统 SHALL 返回已训练的城市/省份适配器列表
4. WHEN 上传新适配器 THEN 系统 SHALL 验证格式并注册到模型矩阵
5. IF 目标城市无专属适配器 THEN 系统 SHALL 回退使用省级或基座模型

### REQ-10: 后台管理

**User Story:** 作为系统管理员，我希望有后台管理功能，以便管理用户、查看日志和系统配置。

#### Acceptance Criteria

1. WHEN 管理员请求用户列表 THEN 系统 SHALL 返回分页的用户数据
2. WHEN 创建/禁用用户 THEN 系统 SHALL 更新用户状态并记录操作日志
3. WHEN 查询系统日志 THEN 系统 SHALL 返回按时间范围筛选的操作日志
4. WHEN 查询系统统计 THEN 系统 SHALL 返回舆情数量、分析次数、用户活跃度等指标

## Non-Functional Requirements

### Code Architecture and Modularity

- **Single Responsibility Principle**: 每个 API 路由模块专注单一业务领域
- **Modular Design**: 服务层、数据层、API 层分离，支持独立测试
- **Dependency Management**: 使用 FastAPI 依赖注入管理数据库连接和服务实例
- **Clear Interfaces**: Pydantic Schema 定义清晰的请求/响应接口

### Performance

- **API 响应时间**: < 500ms (非 AI 接口)
- **WebSocket 延迟**: < 1s
- **并发支持**: 100+ 并发连接
- **数据库查询**: 使用索引优化，单次查询 < 100ms

### Security

- **JWT 认证**: 所有受保护端点需要有效 token
- **API Key 保护**: 讯飞等第三方 API Key 存储在环境变量，不暴露给前端
- **输入验证**: 所有请求参数通过 Pydantic 严格验证
- **SQL 注入防护**: 使用 SQLAlchemy ORM 参数化查询

### Reliability

- **错误处理**: 统一异常处理中间件，返回标准错误格式
- **日志记录**: 结构化日志，记录请求、响应、错误信息
- **重试机制**: 第三方 API 调用失败自动重试 (最多 3 次)
- **降级策略**: AI 服务不可用时返回缓存或默认结果

### Usability

- **API 文档**: 自动生成 OpenAPI/Swagger 文档
- **错误消息**: 返回清晰的错误描述和建议操作
- **版本控制**: API 版本号前缀 `/api/v1`
