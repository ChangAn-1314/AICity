根据项目需求和背景调查报告，为你推荐适合大学生团队的技术栈方案：

**最后更新**: 2025 年 12 月 3 日

> **文档定位**: 本文档 (`stack.md`) 为**技术选型参考文档**，记录技术调研结果、备选方案对比和选型理由。最终采用的技术决策请参考 `.spec-workflow/steering/tech.md`。

> **图例说明**: 已采用 | 待集成 | 备选方案

---

# AI+城市舆情分析系统技术栈

## 整体架构

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
│      MediaCrawler + Scrapy + Playwright + 官方API接口       │
├─────────────────────────────────────────────────────────────┤
│                      数据存储层 [待集成]                     │
│          PostgreSQL + Elasticsearch + MinIO                │
└─────────────────────────────────────────────────────────────┘
```

---

## 分层技术选型

### 1. 前端技术栈

| 功能模块       | 采用技术                 | 版本      | 状态   | 备选方案        |
| -------------- | ------------------------ | --------- | ------ | --------------- |
| **框架**       | Vue3 + Vite              | 3.5 / 6.0 | 已采用 | React + Next.js |
| **UI 组件**    | Element Plus + Icons     | 2.9       | 已采用 | Ant Design Vue  |
| **样式**       | TailwindCSS + SASS       | 3.4       | 已采用 | UnoCSS          |
| **3D 地图**    | 高德地图 JS API 2.0      | 2.0       | 已采用 | -               |
| **数据可视化** | ECharts                  | 5.6       | 已采用 | D3.js           |
| **3D 渲染**    | Three.js (GLCustomLayer) | 0.181     | 已采用 | Babylon.js      |
| **状态管理**   | Pinia                    | 2.3       | 已采用 | Vuex            |
| **实时通信**   | Socket.io-client         | 4.8       | 已采用 | -               |

> **注**: 百度地图 GL、MapV-Three、Cesium 已移除，统一使用高德地图 JS API 2.0。

**当前前端依赖 (package.json)**:

```json
{
  "dependencies": {
    "@amap/amap-jsapi-loader": "^1.0.1",
    "@element-plus/icons-vue": "^2.3.1",
    "echarts": "^5.6.0",
    "element-plus": "^2.9.3",
    "pinia": "^2.3.1",
    "socket.io-client": "^4.8.1",
    "three": "^0.181.2",
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "3d-tiles-renderer": "^0.4.18",
    "tailwindcss": "^3.4.17",
    "sass": "^1.83.4",
    "vite": "^6.0.11"
    // "vite-plugin-cesium": "^1.2.23"  // 暂不使用
  }
}
```

### 2. 后端技术栈

| 功能模块     | 推荐技术    | 状态   | 备选方案    | 理由                     |
| ------------ | ----------- | ------ | ----------- | ------------------------ |
| **Web 框架** | FastAPI     | 待集成 | Flask       | 异步支持好，自动文档生成 |
| **任务队列** | Celery      | 待集成 | RQ          | 定时采集、异步分析       |
| **消息队列** | Redis       | 待集成 | RabbitMQ    | 轻量级，兼做缓存         |
| **实时推送** | WebSocket   | 待集成 | SSE         | 舆情预警实时推送         |
| **定时任务** | APScheduler | 待集成 | Celery Beat | 定时舆情采集             |

### 3. AI/NLP 技术栈

| 功能模块       | 推荐技术                      | 状态   | 备选方案        | 理由                     |
| -------------- | ----------------------------- | ------ | --------------- | ------------------------ |
| **大模型 API** | **讯飞星火 4.0 Ultra**        | 待集成 | DeepSeek-V3 API | 赛事加分项，128K 上下文  |
| **NLP 框架**   | HuggingFace Transformers      | 待集成 | PaddleNLP       | 模型丰富，社区活跃       |
| **情感分析**   | BERT-wwm-Chinese / DistilBERT | 待集成 | RoBERTa-Chinese | 中文效果好，推理速度快   |
| **模型微调**   | LoRA + PEFT + Unsloth         | 待集成 | P-Tuning v2     | 低资源微调，城市模型矩阵 |
| **Agent 框架** | **LangGraph** / CrewAI        | 待集成 | AutoGen v0.4    | 状态化多 Agent，决策模拟 |
| **向量数据库** | Chroma / Qdrant               | 待集成 | Milvus Lite     | 轻量级，支持混合检索     |
| **RAG 框架**   | LlamaIndex                    | 待集成 | Haystack        | 知识库增强，舆情检索     |

### 4. 数据采集技术栈

| 功能模块         | 推荐技术          | 状态   | 备选方案      | 理由                         |
| ---------------- | ----------------- | ------ | ------------- | ---------------------------- |
| **爬虫框架**     | Scrapy            | 待集成 | BeautifulSoup | 分布式支持，效率高           |
| **社媒爬虫**     | **MediaCrawler**  | 待集成 | -             | 多平台一站式，零逆向，27k+星 |
| **动态渲染**     | Playwright        | 待集成 | Selenium      | 更快，API 更现代             |
| **新闻 API**     | 聚合数据/天行数据 | 待集成 | NewsAPI       | 国内新闻源丰富               |
| **社交媒体**     | 微博开放平台 API  | 待集成 | -             | 官方接口，合规               |
| **反爬处理**     | DrissionPage      | 待集成 | -             | 浏览器自动化                 |

#### MediaCrawler 详情

**GitHub**: https://github.com/NanmiCoder/MediaCrawler (27.7k+ Stars)

**支持平台**:
| 平台   | Cookie登录 | 二维码登录 | 关键词搜索 | 指定ID爬取 | 评论爬取 | 登录缓存 |
| ------ | ---------- | ---------- | ---------- | ---------- | -------- | -------- |
| 小红书 | ✅          | ✅          | ✅          | ✅          | ✅        | ✅        |
| 抖音   | ✅          | ✅          | ✅          | ✅          | ✅        | ✅        |
| 快手   | ✅          | ✅          | ✅          | ✅          | ✅        | ✅        |
| B站    | ✅          | ✅          | ✅          | ✅          | ✅        | ✅        |
| 微博   | ✅          | ✅          | ✅          | ✅          | ✅        | ✅        |
| 知乎   | ✅          | ✅          | ✅          | ✅          | ✅        | ✅        |
| 贴吧   | ✅          | ✅          | ✅          | ✅          | ✅        | ✅        |

**核心特性**:
- **零逆向**: 基于 Playwright 模拟真实浏览器，无需复杂的签名逆向
- **多平台**: 一套代码支持 7+ 主流社交媒体平台
- **登录态缓存**: 扫码登录后自动缓存，避免重复登录
- **IP代理池**: 支持代理池配置，防止封禁
- **数据持久化**: 支持 JSON/CSV/MySQL/MongoDB 多种存储方式
- **评论词云**: 内置词云生成功能

**快速启动**:
```bash
# 克隆项目
git clone https://github.com/NanmiCoder/MediaCrawler.git
cd MediaCrawler

# 使用 uv 安装依赖 (推荐)
uv sync

# 或使用 pip
pip install -r requirements.txt
playwright install

# 运行爬虫 (小红书为例)
python main.py --platform xhs --lt qrcode
```

**与本项目集成方案**:
```
社交媒体舆情采集流程
    │
    ├─→ MediaCrawler 采集 ──→ 小红书/抖音/微博/B站热点内容
    │                              └─→ 关键词搜索 / 指定话题监控
    │
    ├─→ 数据清洗 ──→ 提取文本、图片、视频、评论
    │
    ├─→ 讯飞星火分析 ──→ 情感分析 + 舆情走向预测
    │
    └─→ 前端可视化 ──→ 高德地图3D + ECharts展示
```

### 5. 数据存储技术栈

| 功能模块       | 推荐技术      | 状态   | 备选方案    | 理由                |
| -------------- | ------------- | ------ | ----------- | ------------------- |
| **关系数据库** | PostgreSQL    | 待集成 | MySQL       | 支持 JSON、全文检索 |
| **搜索引擎**   | Elasticsearch | 待集成 | Meilisearch | 舆情全文检索        |
| **缓存**       | Redis         | 待集成 | -           | 热点数据缓存        |
| **对象存储**   | MinIO         | 待集成 | 阿里云 OSS  | 图片/视频存储       |
| **时序数据**   | TimescaleDB   | 待集成 | InfluxDB    | 舆情趋势分析        |

### 6. 部署运维

| 功能模块     | 推荐技术                | 状态   | 备选方案 | 理由     |
| ------------ | ----------------------- | ------ | -------- | -------- |
| **容器化**   | Docker + Docker Compose | 待集成 | -        | 一键部署 |
| **云服务**   | 阿里云/腾讯云学生机     | 待集成 | -        | 成本低   |
| **反向代理** | Nginx                   | 待集成 | Caddy    | 稳定可靠 |
| **监控**     | Prometheus + Grafana    | 待集成 | -        | 系统监控 |
| **日志**     | ELK Stack (可选)        | 待集成 | Loki     | 日志分析 |

---

## 讯飞技术集成（加分项）

建议优先集成以下讯飞技术：

| 技术                    | 用途                         | 状态   | API 文档  | 说明                           |
| ----------------------- | ---------------------------- | ------ | --------- | ------------------------------ |
| **讯飞星火 4.0 Ultra**  | 舆情分析、趋势预测、决策建议 | 待集成 | spark-api | 128K 上下文，0.21 元/万 tokens |
| **讯飞星火 Lite**       | 轻量任务、日常对话           | 待集成 | spark-api | **永久免费**                   |
| **讯飞星火 Pro-128K**   | 长文本分析、文档理解         | 待集成 | spark-api | 0.21 元/万 tokens              |
| **讯飞语音转写(LFASR)** | 视频/音频舆情内容提取        | 待集成 | lfasr     | 支持多语种                     |
| **讯飞在线 TTS**        | 语音合成播报预警             | 待集成 | tts-api   | 流式 WebSocket                 |
| **讯飞实时 ASR**        | 语音输入交互                 | 待集成 | iat-api   | 实时转写                       |
| **讯飞 NLP**            | 情感分析、关键词提取         | 待集成 | nlp-api   | 中文效果优秀                   |

---

## AI 3D 场景生成技术栈 (新增)

根据 main.md 中“AI 根据文字/照片/视频生成现场 3D 模型”的需求，推荐以下技术栈：

### 1. 文字转 3D 模型

| 工具/服务        | 类型     | 生成速度  | 特点                              |
| ---------------- | -------- | --------- | --------------------------------- |
| **Tripo AI**     | API/网页 | ~10 秒    | 支持文字/图片/草图，输出 PBR 材质 |
| **Meshy**        | API/网页 | 2-15 分钟 | 文字转 3D，Blender/Unity 插件     |
| **Sloyd**        | API      | 实时      | 游戏资产优化，低多边形            |
| **3D AI Studio** | 网页     | 分钟级    | 简单易用，无需 API                |

### 2. 图片/视频转 3D 重建

| 技术                       | 类型     | 说明                              |
| -------------------------- | -------- | --------------------------------- |
| **TripoSR** (Stability AI) | 开源模型 | 单图转 3D，秒级生成，PyTorch 实现 |
| **3D Gaussian Splatting**  | 开源技术 | 实时场景重建，高质量渲染          |
| **Luma AI**                | API/App  | 视频转 3D，NeRF 技术              |
| **SAM 3D** (Meta)          | 开源     | 图像分割+3D 重建，2025 年新发布   |
| **Depth Anything V2**      | 开源模型 | 深度估计，2D 转 2.5D/3D           |

### 3. 推荐实现方案

```
舆情内容输入
    │
    ├─→ [文字舆情] ──→ Tripo AI API ──→ 3D模型(GLB/GLTF)
    │                            └─→ 讯飞星火提取场景描述
    │
    ├─→ [图片舆情] ──→ TripoSR/Tripo ──→ 3D模型
    │
    ├─→ [视频舆情] ──→ 关键帧提取 ──→ 3DGS/TripoSR ──→ 3D场景
    │                            └─→ 讯飞语音转写提取文字
    │
    └─→ [输出] ──→ Three.js渲染 / 高德地图3D叠加
```

---

## 语音交互技术栈 (新增)

根据 main.md 中“讯飞星火语音合成播报预警+语音交互”的需求：

| 功能模块     | 推荐技术             | API 类型       | 说明                        |
| ------------ | -------------------- | -------------- | --------------------------- |
| **语音合成** | 讯飞在线 TTS         | WebSocket 流式 | 支持多音色，超拟人 TTS 技术 |
| **语音识别** | 讯飞实时 ASR         | WebSocket 流式 | 实时转写，语音指令输入      |
| **语音转写** | 讯飞 LFASR           | HTTP           | 长音频转写，视频舆情提取    |
| **对话管理** | 讯飞星火 + LangGraph | HTTP/WS        | 多 Agent 语音对话管理       |

### 语音交互流程

```
用户语音输入
    │
    ├─→ 讯飞ASR实时转写 ──→ 文字指令
    │
    ├─→ 讯飞星火意图识别 ──→ 查询舆情/切换视图/开始模拟...
    │
    ├─→ 业务逻辑处理 ──→ 生成回复文本
    │
    └─→ 讯飞TTS语音合成 ──→ 音频流输出播放
```

---

## Agent 决策模拟技术栈 (新增)

根据 main.md 中“大模型走向预测+给出决策建议”和“用户选择或自定义决策 大模型进行决策模拟”的需求：

### 1. Agent 框架对比 (2025 年)

| 框架                  | 特点                   | 适用场景               | 推荐度     |
| --------------------- | ---------------------- | ---------------------- | ---------- |
| **LangGraph**         | 状态化多 Agent，图结构 | 复杂决策流程、多步推理 | ⭐⭐⭐⭐⭐ |
| **CrewAI**            | 角色协作、团队模拟     | 多角色决策模拟         | ⭐⭐⭐⭐   |
| **AutoGen v0.4** (MS) | 对话式多 Agent         | 研究原型、复杂对话     | ⭐⭐⭐     |
| **Smolagents** (HF)   | 轻量级，HF 生态        | 快速原型               | ⭐⭐⭐     |
| **OpenAI Swarm**      | 实验性，单机多 Agent   | 简单任务               | ⭐⭐       |

### 2. 决策模拟架构

```
舆情输入
    │
    ├─→ [分析Agent] ──→ 讯飞星火分析舆情走向、识别关键因素
    │
    ├─→ [预测Agent] ──→ 多场景演化预测 (乐观/中性/悲观)
    │
    ├─→ [决策Agent] ──→ 生成多套应对方案
    │
    ├─→ [模拟Agent] ──→ 模拟执行效果，评估风险与收益
    │
    └─→ [输出] ──→ 可视化决策树 + 模拟结果报告
```

### 3. LangGraph 实现示例

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated

class SentimentState(TypedDict):
    sentiment_input: str           # 舆情输入
    analysis_result: dict          # 分析结果
    predictions: list              # 预测场景
    decisions: list                # 决策方案
    simulation_results: dict       # 模拟结果

# 创建状态图
graph = StateGraph(SentimentState)

# 添加节点
graph.add_node("analyze", analyze_sentiment)      # 舆情分析
graph.add_node("predict", predict_trends)         # 趋势预测
graph.add_node("decide", generate_decisions)      # 决策生成
graph.add_node("simulate", run_simulation)        # 决策模拟

# 定义边
graph.set_entry_point("analyze")
graph.add_edge("analyze", "predict")
graph.add_edge("predict", "decide")
graph.add_edge("decide", "simulate")
graph.add_edge("simulate", END)

app = graph.compile()
```

---

## 城市模型矩阵技术栈 (新增)

根据 AICityMind.md 中"微调小模型专注细节和细分领域(多城市/多省份 组成模型矩阵)"的需求：

### 1. 架构设计

```
                    ┌─────────────────────────────────┐
                    │   讯飞星火 4.0 Ultra (基座模型)   │
                    │   通用舆情理解与推理能力          │
                    └───────────────┬─────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│ LoRA-河南     │         │ LoRA-广东     │         │ LoRA-四川     │
│ 省级适配器    │         │ 省级适配器    │         │ 省级适配器    │
└───────┬───────┘         └───────────────┘         └───────────────┘
        │
        ├─────────────────┬─────────────────┐
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ LoRA-信阳     │ │ LoRA-郑州     │ │ LoRA-洛阳     │
│ 市级适配器    │ │ 市级适配器    │ │ 市级适配器    │
└───────────────┘ └───────────────┘ └───────────────┘
```

### 2. 技术选型

| 技术组件 | 选型 | 说明 |
| -------- | ---- | ---- |
| **微调框架** | PEFT + LoRA | HuggingFace官方，兼容性好 |
| **加速训练** | Unsloth | 2x训练速度，50%显存优化 |
| **量化方案** | QLoRA (4-bit) | 进一步降低资源需求 |
| **模型管理** | HuggingFace Hub | 版本控制、模型分发 |

### 3. 实现方案

```python
from peft import LoraConfig, get_peft_model, PeftModel
from transformers import AutoModelForCausalLM

# 1. 加载基座模型 (讯飞星火或开源替代)
base_model = AutoModelForCausalLM.from_pretrained("base_model_path")

# 2. 定义LoRA配置
lora_config = LoraConfig(
    r=16,                    # LoRA秩
    lora_alpha=32,           # 缩放因子
    target_modules=["q_proj", "v_proj"],  # 目标层
    lora_dropout=0.05,
    task_type="CAUSAL_LM"
)

# 3. 训练城市适配器 (以信阳为例)
xinyang_model = get_peft_model(base_model, lora_config)
# ... 使用信阳本地舆情数据训练 ...
xinyang_model.save_pretrained("adapters/xinyang")

# 4. 动态加载适配器
def load_city_adapter(city_name: str):
    """根据城市名加载对应LoRA适配器"""
    adapter_path = f"adapters/{city_name}"
    model = PeftModel.from_pretrained(base_model, adapter_path)
    return model

# 5. 运行时切换
current_model = load_city_adapter("xinyang")  # 用户查看信阳时
current_model = load_city_adapter("zhengzhou") # 切换到郑州时
```

### 4. 训练数据来源

| 城市级别 | 数据来源 | 数据类型 |
| -------- | -------- | -------- |
| **省级** | 省级媒体、本地论坛、方言语料 | 地域文化、方言表达、本地热点 |
| **市级** | 本地新闻、政务公开、社区讨论 | 区县特征、民生话题、本地事件 |

### 5. 资源估算

| 项目 | 配置 | 说明 |
| ---- | ---- | ---- |
| **训练硬件** | RTX 3090 24GB / A10 | 单卡即可训练 |
| **训练时长** | 2-4小时/城市 | 1000-5000条数据 |
| **适配器大小** | ~10-50MB/城市 | 远小于基座模型 |
| **推理切换** | <1秒 | 热加载适配器 |

---

## 推荐开发顺序

```
Phase 1 (2周) - 基础框架
├── 前端框架搭建 (Vue3 + Vite + Element Plus)
├── 后端API框架 (FastAPI)
├── 高德地图3D集成 (JS API 2.0)
└── 基础数据库 (PostgreSQL)

Phase 2 (2周) - 数据与AI
├── 数据采集模块 (Scrapy + 新闻API)
├── 讯飞星火API接入
├── 基础情感分析
└── 讯飞TTS/ASR集成

Phase 3 (2周) - 3D与可视化
├── 3D地图可视化 (高德 + ECharts)
├── AI 3D生成集成 (Tripo API)
├── 实时推送 (WebSocket)
└── 舆情预警功能

Phase 4 (2周) - 决策模拟
├── LangGraph Agent框架
├── 趋势预测模块
├── 决策模拟模块
└── 语音交互完善

Phase 5 (1周) - 优化部署
├── 系统优化
├── 跨平台适配
└── 部署上线
```

---

## 高德地图 3D 技术栈 (新增)

根据 main.md 中“地图可视化展示(高德 JSapi、高亮舆情区域/建筑)”的需求：

### 1. 高德 JS API 2.0 核心功能

| 功能模块        | API/类              | 说明                       |
| --------------- | ------------------- | -------------------------- |
| **3D 地图视图** | viewMode: '3D'      | WebGL 渲染，支持旋转/倾斜  |
| **3D 建筑层**   | AMap.Buildings      | 建筑高亮、主题色           |
| **3D 地形图**   | terrain: true       | v2.1Beta，地球地形特征     |
| **海量点渲染**  | AMap.MassMarks      | 百万级数据点动态加载       |
| **热力图**      | AMap.HeatMap        | 舆情热度分布               |
| **区域高亮**    | AMap.DistrictSearch | 全国->省份->地级->县级边界 |
| **路径规划**    | AMap.Driving        | 政府/企业决策路径规划      |

### 2. MCP 协议支持 (2025 年新特性)

高德地图已全面接入 MCP 协议，支持 AI 智能体调用：

```javascript
// AI Agent通过MCP协议调用高德API
// 语音指令 -> 地图操作
// 例: "展示信阳市舆情热点" -> 自动定位+热力图渲染
```

### 3. 区域层级可视化实现

```javascript
// 全国->省份->地级->县级 舆情层级展示
const district = new AMap.DistrictSearch({
  level: "province", // country/province/city/district
  extensions: "all",
  subdistrict: 1,
});

// 舆情区域高亮
district.search("河南省", (status, result) => {
  const bounds = result.districtList[0].boundaries;
  const polygon = new AMap.Polygon({
    path: bounds,
    fillColor: getSentimentColor(sentimentScore),
    fillOpacity: 0.6,
    strokeWeight: 2,
  });
  map.add(polygon);
});
```

### 4. 3D 建筑高亮

```javascript
// 舆情点周边建筑高亮
const buildings = new AMap.Buildings({
  zooms: [16, 20],
  zIndex: 10,
  heightFactor: 1,
});

// 设置建筑主题
buildings.setStyle({
  hideWithoutStyle: true,
  areas: [
    {
      visible: true,
      rejectTexture: true,
      color1: "#ff6b6b", // 负面舆情区域
      color2: "#ee5253",
      path: sentimentAreaPolygon,
    },
  ],
});
map.add(buildings);
```

### 5. 3D 模型导入方案 (新增)

推荐使用 **GLCustomLayer + Three.js** 方案，适合 AI 生成模型动态加载、决策模拟动画等复杂场景。

| 方案                               | 说明               | 适用场景       |
| ---------------------------------- | ------------------ | -------------- |
| AMap.GltfLoader (1.4)              | 官方原生，简单     | 简单模型展示   |
| **GLCustomLayer + Three.js (2.0)** | 灵活强大，支持动画 | **本项目推荐** |

**核心依赖**:

```bash
npm install @amap/amap-jsapi-loader three@0.142 @tweenjs/tween.js
```

**Vue3 集成示例**:

```vue
<template>
  <div id="map-container" style="width: 100%; height: 100vh;"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let map, camera, renderer, scene, customCoords, gllayer;

onMounted(async () => {
  window._AMapSecurityConfig = { securityJsCode: "你的安全密钥" };

  const AMap = await AMapLoader.load({
    key: "你的Key",
    version: "2.0",
  });

  // 创建3D地图
  map = new AMap.Map("map-container", {
    center: [114.06, 32.13], // 信阳市中心
    zoom: 16,
    viewMode: "3D",
    pitch: 50,
  });

  customCoords = map.customCoords;

  // 创建GL自定义图层
  gllayer = new AMap.GLCustomLayer({
    zIndex: 10,
    init: initThree,
    render: renderThree,
  });

  map.add(gllayer);
});

// 初始化Three.js
function initThree(gl) {
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    100,
    1 << 30
  );

  renderer = new THREE.WebGLRenderer({ context: gl });
  renderer.autoClear = false; // 必须设为false

  scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 3));

  const dLight = new THREE.DirectionalLight(0xffffff, 10);
  dLight.position.set(1000, -100, 900);
  scene.add(dLight);

  // 加载AI生成的舆情场景3D模型
  loadSentimentModel("/models/scene.glb", [114.06, 32.13]);
}

// 加载3D模型 (支持Tripo AI生成的GLB)
async function loadSentimentModel(modelUrl, lngLat) {
  const loader = new GLTFLoader();

  loader.load(modelUrl, (gltf) => {
    const model = gltf.scene;
    const coords = customCoords.lngLatsToCoords([lngLat]);

    model.scale.set(100, 100, 100);
    model.rotation.x = Math.PI / 2;
    model.position.set(coords[0][0], coords[0][1], 0);

    scene.add(model);
  });
}

// 渲染函数
function renderThree() {
  renderer.resetState();

  customCoords.setCenter([114.06, 32.13]);
  const { near, far, fov, up, lookAt, position } =
    customCoords.getCameraParams();

  camera.near = near;
  camera.far = far;
  camera.fov = fov;
  camera.position.set(...position);
  camera.up.set(...up);
  camera.lookAt(...lookAt);
  camera.updateProjectionMatrix();

  renderer.render(scene, camera);
  renderer.resetState();
}

onUnmounted(() => {
  map?.destroy();
});
</script>
```

**与 Tripo AI 对接流程**:

```
舆情文字/图片 -> Tripo AI API -> GLB模型 -> loadSentimentModel() -> 地图展示
```

---

## 资源预算估算 (更新)

| 资源               | 规格                 | 月成本              |
| ------------------ | -------------------- | ------------------- |
| 云服务器           | 2 核 4G (GPU 可选)   | 约 50-200 元        |
| 讯飞星火 API       | Lite 免费 / Pro 按量 | 0-50 元             |
| 讯飞 TTS/ASR       | 免费额度             | 0 元                |
| 高德地图 API       | 个人开发者免费       | 0 元                |
| Tripo AI (3D 生成) | 免费额度             | 0-30 元             |
| 域名               | .cn                  | 约 30 元/年         |
| **总计**           | -                    | **约 80-300 元/月** |

---

## 快速启动模板

建议基于以下开源项目快速搭建：

- **前端**：vue-pure-admin / vue-vben-admin
- **后端**：FastAPI-template
- **3D 地图**：@amap/amap-jsapi-loader (Vue3 集成)
- **Agent**：LangGraph 官方模板
- **3D 生成**：Tripo AI SDK / TripoSR (PyTorch)

---

#### 推荐方案：高德地图 3D 建筑

```javascript
// 通过高德 API 获取建筑数据
// 需申请开发者 Key: lbs.amap.com

// 方式1: 高德矢量底图 (含建筑)
AMap.plugin(["AMap.Buildings"], function () {
  var buildings = new AMap.Buildings({
    zooms: [16, 20],
    zIndex: 10,
    heightFactor: 1,
  });
  map.add(buildings);
});

// 方式2: 规划云工具直接下载
// http://guihuayun.com/maps/
// 支持导出 GeoJSON/SHP 格式
```

### 9. 本项目推荐方案 (更新)

针对大学生团队和信阳等小城市场景，结合 main.md 中的最新需求：

```
方案A: 高德地图3D + 讯飞星火 (强烈推荐)
├── 高德JS API 2.0 3D地图
├── 讯飞星火4.0舆情分析
├── LangGraph多Agent决策模拟
├── Tripo AI文字/图片转3D
├── 讯飞TTS/ASR语音交互
└── 中国数据全覆盖，成本最低

```

---

## 技术栈总结

| 层次     | 核心技术                                  | 状态   | 对应 main.md 需求                 |
| -------- | ----------------------------------------- | ------ | --------------------------------- |
| 前端展示 | Vue3 + Vite + 高德地图 3D  + ECharts      | 已采用 | 地图可视化展示、区域高亮          |
| UI 框架  | Element Plus + TailwindCSS + Pinia        | 已采用 | 企业级组件、响应式布局            |
| 3D 渲染  | Three.js + 3D-Tiles-Renderer + MapV-Three | 已采用 | 3D 场景渲染、地图可视化           |
| 实时通信 | Socket.io-client                          | 已采用 | 舆情实时推送                      |
| 后端服务 | FastAPI + WebSocket + Celery              | 待集成 | 实时监测、异步处理                |
| AI 分析  | 讯飞星火 4.0 + BERT-wwm-Chinese           | 待集成 | 舆情分析、情感识别                |
| 3D 生成  | Tripo AI + TripoSR + 3DGS                 | 待集成 | AI 根据文字/照片/视频生成 3D 模型 |
| 语音交互 | 讯飞 TTS + 讯飞 ASR                       | 待集成 | 语音合成播报预警+语音交互         |
| 决策模拟 | LangGraph + CrewAI                        | 待集成 | 走向预测+决策建议+决策模拟        |
| 模型微调 | LoRA + PEFT + Unsloth                     | 待集成 | 城市模型矩阵，多城市/省份专属适配器 |
| 数据存储 | PostgreSQL + Elasticsearch + Chroma       | 待集成 | 舆情数据存储、全文检索、向量检索  |

---

## 当前进度概览

```
前端展示层 ████████████████████ 100% 已采用
后端服务层 ░░░░░░░░░░░░░░░░░░░░   0% 待集成
AI分析层   ░░░░░░░░░░░░░░░░░░░░   0% 待集成
3D生成层   ░░░░░░░░░░░░░░░░░░░░   0% 待集成
语音交互层 ░░░░░░░░░░░░░░░░░░░░   0% 待集成
数据采集层 ░░░░░░░░░░░░░░░░░░░░   0% 待集成
数据存储层 ░░░░░░░░░░░░░░░░░░░░   0% 待集成
```

如需我生成具体的项目初始化代码或某个模块的实现方案，请告知。
