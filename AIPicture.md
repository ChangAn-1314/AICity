# 智舆系统策划书 - AI生图提示词

> 排除需要截图的图片：图6(系统主界面设计稿)、图10(四级区域穿透示意图)、图11(已实现功能截图集)

## 已完成图片状态

| 图片 | 状态 | 文件名 |
|------|------|--------|
| 图1 国家-省-市三级政策支持体系图 | 已完成 | `fig01_policy_system.png` |
| 图2 中国舆情监测市场规模增长趋势图 | 已完成 | `fig02_market_trend.png` |
| ~~图3 智舆系统vs主流产品功能雷达对比图~~ | 已删除(合并至图16) | - |
| 图4 系统整体架构图 | 已完成 | `fig04_architecture.png` |
| 图5 六大功能模块关系图 | 已完成 | `fig05_modules.png` |
| 图6 系统主界面设计稿 | 已完成(截图) | `ui_main_interface.png` |
| 图7 界面交互流程图 | 已完成 | `fig07_interaction_flow.png` |
| 图8 AI 3D场景还原技术流程图 | 已完成 | `fig08_ai_3d_workflow.png` |
| 图9 多Agent决策模拟架构图 | 已完成 | `fig09_multi_agent.png` |
| 图10 四级区域穿透示意图 | 已完成(截图) | `ui_drill_[1-4]_*.png` |
| 图11 已实现功能截图集 | 已完成(截图) | `ui_*.png` |
| 图12 技术路线甘特图 | 已完成 | `fig12_gantt.png` |
| 图13 成本收益分析图 | 已完成 | `fig13_cost_benefit.png` |
| 图14 PEST分析四象限图 | 已完成 | `fig14_PEST.png` |
| 图15 舆情监测市场规模增长预测图 | 已完成 | `fig15_market_forecast.png` |
| 图16 竞品功能对比雷达图 | 已完成 | `fig16.png` |
| 图17 营销渠道矩阵图 | 已完成 | `fig17.png` |

---

## 图1：国家-省-市三级政策支持体系图

**用途**: 展示国家、河南省、信阳市三级政策文件名称及核心要点的层级结构图

**真实数据**:
- 国家层面：《深化智慧城市发展推进全域数字化转型行动计划》(2025年10月) - 2027年底建成50个以上全域数字化转型城市
- 河南省层面：《河南省支持人工智能产业生态发展若干政策措施》- 100万元备案奖励、30亿元产业基金
- 信阳市层面：《信阳市数字政府建设实施方案(2023-2025年)》- 12345热线升级

**AI生图提示词**:
```
Create a professional hierarchical pyramid infographic showing China's smart city policy system with 3 tiers:

Top tier (National/国家): "Digital China Transformation Action Plan 2025" - target: 50+ smart cities by 2027

Middle tier (Henan Province/河南省): "AI Industry Support Policy" - 1M yuan model registration bonus, 3B yuan industry fund

Bottom tier (Xinyang City/信阳市): "Digital Government Implementation Plan 2023-2025" - 12345 hotline upgrade

Style: Modern corporate infographic, blue gradient background (#00529B to #06B6D4), white text, clean geometric shapes, policy document icons at each level. Include connecting arrows showing top-down policy flow. Bilingual labels (Chinese primary, English secondary). Resolution: 1920x1080, landscape orientation.
```

---

## 图2：中国舆情监测市场规模增长趋势图(2020-2030)

**用途**: 柱状图+折线图展示市场规模及增速

**真实数据**:
- 2020年: 44.15亿元
- 2023年: 4.2亿美元(约30亿RMB)
- 2024年: 110亿元, 增速18%
- 2025年(预测): 72.4亿元, 增速26.4%
- 2030年(预测): 7.55亿美元(约54亿RMB)
- 全球2024年: 23.15亿美元, 预计2031年40.50亿美元, CAGR 8.1%

**AI生图提示词**:
```
Create a professional dual-axis chart showing China's public opinion monitoring market growth 2020-2030:

Bar chart (left Y-axis, billion RMB): 
- 2020: 44.15B
- 2022: 65B
- 2024: 110B
- 2025: 139B (projected)
- 2028: 200B (projected)
- 2030: 280B (projected)

Line chart (right Y-axis, growth rate %):
- 2020-2024: 18% CAGR
- 2025: 26.4% peak
- 2026-2030: 15% sustained

Style: Modern business chart, gradient blue bars (#00529B), cyan growth line (#06B6D4) with data point markers. Dark background (#0a0a1a) with glowing effects. Include annotation bubble highlighting "2025: 72.4B RMB, 26.4% Growth". Chinese title "中国舆情监测市场规模(2020-2030)". Resolution: 1600x900.
```

---

## ~~图3：智舆系统vs主流产品功能雷达对比图~~ (已删除，合并至图16)

> 此图与图16内容重复，已合并。chapter1使用表格描述差异化优势。

---

## 图4：系统整体架构图

**用途**: 彩色分层架构图，展示各层技术组件及数据流向

**真实技术栈**:
- 前端展示层: Vue3 + Vite + 高德地图3D + Three.js + ECharts (已实现)
- 后端服务层: FastAPI + Celery + Redis + WebSocket (开发中)
- AI分析层: 讯飞星火4.0 + LangGraph + LoRA微调 + RAG (开发中)
- 3D生成层: Tripo AI + 3D Gaussian Splatting (规划中)
- 语音交互层: 讯飞TTS + 讯飞ASR (规划中)
- 数据采集层: MediaCrawler + Scrapy + API接口 (规划中)
- 数据存储层: PostgreSQL + Elasticsearch + Chroma (规划中)

**AI生图提示词**:
```
Create a professional 7-layer system architecture diagram for AI City Opinion Monitoring System:

Layer 1 (Top, Cyan #06B6D4): "前端展示层" - Vue3, Vite, AMap 3D, Three.js, ECharts [Status: Completed]

Layer 2 (Blue #3B82F6): "后端服务层" - FastAPI, Celery, Redis, WebSocket [Status: In Progress]

Layer 3 (Purple #8B5CF6): "AI分析层" - iFlytek Spark 4.0, LangGraph, LoRA, RAG [Status: In Progress]

Layer 4 (Pink #EC4899): "3D生成层" - Tripo AI, 3D Gaussian Splatting, TripoSR [Status: Planned]

Layer 5 (Orange #F97316): "语音交互层" - iFlytek TTS, iFlytek ASR [Status: Planned]

Layer 6 (Green #22C55E): "数据采集层" - MediaCrawler, Scrapy, Platform APIs [Status: Planned]

Layer 7 (Bottom, Gray #6B7280): "数据存储层" - PostgreSQL, Elasticsearch, Chroma Vector DB [Status: Planned]

Style: Horizontal stacked layers with gradient colors, bidirectional arrows between layers showing data flow (HTTP/WebSocket/SQL/gRPC). Dark background (#0f172a), glowing layer edges, tech stack icons. Include status badges. Resolution: 1920x1080.
```

---

## 图5：六大功能模块关系图

**用途**: 六边形蜂窝图展示模块间关联关系

**六大模块**:
1. 实时舆情监测 - 多源采集、多模态解析、实时预警
2. 智能舆情分析 - 情感分析(>90%)、主题聚类、传播追踪
3. 3D地图可视化 - 四级穿透、建筑高亮、热力图
4. AI场景还原 - 文字/图片/视频转3D
5. 走向预测与决策模拟 - 趋势预测、多场景推演
6. 语音交互与播报 - 语音预警、语音指令

**AI生图提示词**:
```
Create a hexagonal honeycomb diagram showing 6 interconnected functional modules:

Center hexagon (largest, Cyan #06B6D4): "智舆系统" (ZhiYu System)

Surrounding 6 hexagons (equal size, connected to center):
1. Top: "实时舆情监测" - Icon: radar/eye, Keywords: 多源采集, 实时预警
2. Top-right: "智能舆情分析" - Icon: brain/AI, Keywords: 情感分析90%+, 主题聚类
3. Bottom-right: "3D地图可视化" - Icon: 3D map, Keywords: 四级穿透, 热力图
4. Bottom: "AI场景还原" - Icon: 3D model, Keywords: 文字/图片转3D
5. Bottom-left: "走向预测与决策" - Icon: chart/forecast, Keywords: 趋势预测, 场景推演
6. Top-left: "语音交互播报" - Icon: microphone, Keywords: TTS预警, ASR指令

Style: Cyberpunk glassmorphism, dark background (#0a0a1a), neon cyan edges with glow effect, gradient fill (dark to light), connecting lines between adjacent hexagons showing data flow. Resolution: 1400x1200.
```

---

## 图7：界面交互流程图

**用途**: 用户操作流程图，展示主要交互路径

**主要流程**:
1. 登录系统 -> 选择城市/区域
2. 查看地图视图 -> 四级穿透(全国->省->市->县)
3. 查看舆情列表 -> 点击详情 -> AI分析结果
4. 触发预警 -> 语音播报/通知推送
5. 走向预测 -> 决策模拟 -> 效果评估
6. 语音指令 -> 系统响应

**AI生图提示词**:
```
Create a user interaction flowchart for ZhiYu Opinion Monitoring System:

Start node: "用户登录"

Main branches:
Branch 1 (Map View): 登录 -> 选择区域 -> 地图视图 -> 四级穿透(全国/省/市/县) -> 舆情热力图

Branch 2 (Analysis): 舆情列表 -> 选择事件 -> AI智能分析 -> 情感/传播/趋势报告

Branch 3 (Alert): 系统监测 -> 触发预警 -> [分支: 语音播报 / 短信通知 / 企微推送]

Branch 4 (Decision): 走向预测 -> 选择场景(乐观/中性/悲观) -> 决策模拟 -> 效果评估报告

Branch 5 (Voice): 语音指令输入 -> ASR识别 -> 意图理解 -> 执行操作 -> TTS语音反馈

Style: Modern UX flowchart, rounded rectangles for actions, diamonds for decisions, arrows with labels. Color scheme: Cyan (#06B6D4) for primary path, gray for secondary. Dark background, clean minimalist design. Resolution: 1800x1000, landscape.
```

---

## 图8：AI 3D场景还原技术流程图

**用途**: 展示从输入到输出的完整技术路径

**技术流程**:
- 输入: 文字舆情 / 图片舆情 / 视频舆情
- 处理: 讯飞星火提取场景描述 -> Tripo AI / TripoSR生成3D模型
- 输出: GLB/GLTF模型 -> Three.js渲染 -> 高德地图叠加

**AI生图提示词**:
```
Create a technical pipeline flowchart for AI 3D Scene Reconstruction:

INPUT SECTION (Left, 3 parallel inputs):
1. "文字舆情" (Text) -> iFlytek Spark 4.0 -> Scene Description Extraction
2. "图片舆情" (Image) -> TripoSR / Tripo AI -> Direct 3D Reconstruction  
3. "视频舆情" (Video) -> Keyframe Extraction + ASR -> Multi-modal Processing

PROCESSING SECTION (Center):
- All paths merge -> "Tripo AI API" -> "3D Model Generation (~10s)"
- Output format: GLB/GLTF

OUTPUT SECTION (Right):
- 3D Model -> "Three.js GLCustomLayer" -> "高德地图3D叠加" -> Final Display

Technical annotations:
- Tripo AI: Text/Image to 3D, 10s generation
- TripoSR: Single image 3D reconstruction, open source
- 3DGS: Real-time scene reconstruction

Style: Technical blueprint style, dark blue background (#0f172a), cyan flow lines (#06B6D4), white text, process boxes with rounded corners, technology logos/icons. Resolution: 1920x800, wide format.
```

---

## 图9：多Agent决策模拟架构图

**用途**: 四Agent协作流程图，展示数据流转关系

**Agent架构**:
1. 分析Agent: 输入原始舆情 -> 输出情感/主题/影响力分析
2. 预测Agent: 输入分析结果+历史数据 -> 输出乐观/中性/悲观场景
3. 决策Agent: 输入预测结果 -> 输出多套决策建议
4. 模拟Agent: 输入用户选择的决策 -> 输出效果评估报告

**AI生图提示词**:
```
Create a multi-agent collaboration architecture diagram based on LangGraph:

4 AGENTS in sequential flow:

Agent 1 "分析Agent" (Blue #3B82F6):
- Input: Raw Opinion Data (原始舆情数据)
- Process: Deep sentiment analysis, topic extraction
- Output: Analysis Report (情感/主题/影响力)

Agent 2 "预测Agent" (Purple #8B5CF6):
- Input: Analysis Result + Historical Data
- Process: Trend forecasting, scenario modeling
- Output: 3 Scenarios (乐观/中性/悲观)

Agent 3 "决策Agent" (Cyan #06B6D4):
- Input: Prediction Results
- Process: Strategy generation, risk assessment
- Output: Multiple Decision Plans (多套决策方案)

Agent 4 "模拟Agent" (Green #22C55E):
- Input: User-selected Decision
- Process: Execution simulation, outcome modeling
- Output: Effect Evaluation Report (效果评估报告)

Core Engine (Center): "讯飞星火4.0 Ultra + LangGraph StateGraph"

Style: Circular/orbital layout with 4 agents around central engine, directed arrows showing data flow, each agent in a hexagonal container with icon. Dark background with neon glow effects. Include LangGraph logo. Resolution: 1400x1000.
```

---

## 图12：技术路线甘特图

**用途**: 项目开发甘特图，展示各阶段时间节点和里程碑

**开发阶段**:
- Phase 1 (第1-2周): 前端原型 - Vue3框架、高德地图、UI设计 [已完成]
- Phase 2 (第3-4周): 后端服务 - FastAPI、讯飞API接入 [进行中]
- Phase 3 (第5-6周): AI增强 - LangGraph、走向预测、决策模拟
- Phase 4 (第7周): 3D生成 - Tripo AI集成、场景生成
- Phase 5 (第8周): 数据采集 - MediaCrawler、多平台接入
- Phase 6 (第9周): 优化上线 - 性能优化、文档编写

**AI生图提示词**:
```
Create a Gantt chart showing project development timeline (9 weeks):

PHASES (Y-axis):
1. Phase 1 "前端原型" (Week 1-2): Vue3, AMap 3D, Cyberpunk UI 
2. Phase 2 "后端服务" (Week 3-4): FastAPI, iFlytek API, WebSocket 
3. Phase 3 "AI增强" (Week 5-6): LangGraph Multi-Agent, Prediction, Simulation 
4. Phase 4 "3D生成" (Week 7): Tripo AI Integration, Scene Generation 
5. Phase 5 "数据采集" (Week 8): MediaCrawler, Multi-platform APIs 
6. Phase 6 "优化上线" (Week 9): Performance Optimization, Documentation

TIMELINE (X-axis): Week 1-9

Milestones (Diamond markers):
- Week 2: "前端Demo完成"
- Week 4: "后端API上线"
- Week 6: "AI功能集成"
- Week 9: "产品发布"

Style: Modern Gantt chart, horizontal bars with gradient fill, dark background (#0f172a), cyan accent (#06B6D4). Progress indicator on in-progress tasks. Chinese labels. Resolution: 1600x800.
```

---

## 图13：成本收益分析图

**用途**: 柱状图对比投入与预期收益

**真实数据**:
- 开发成本: 0元 (学习型投入)
- 月运营成本: 80-300元 (云服务器50-200 + API费用0-50 + 域名2.5)
- 首年投入: 约3000元
- 首年收入预期: 1-7万元
- 投入产出比: 3-23倍
- 盈亏平衡点: 4个付费客户

**AI生图提示词**:
```
Create a cost-benefit analysis chart with two sections:

SECTION 1 - Monthly Cost Breakdown (Stacked Bar):
- Cloud Server (云服务器): 50-200 RMB (Blue)
- iFlytek API (讯飞星火API): 0-50 RMB (Purple)
- iFlytek TTS/ASR: 0 RMB (Free quota)
- AMap API (高德地图): 0 RMB (Free for developers)
- Tripo AI: 0-30 RMB (Cyan)
- Domain (域名): 2.5 RMB/month (Gray)
Total: 80-300 RMB/month

SECTION 2 - ROI Analysis (Bar comparison):
- First Year Investment (首年投入): 3,000 RMB (Red bar)
- First Year Revenue Projection (首年收入预期): 10,000-70,000 RMB (Green gradient bar)
- ROI Ratio: 3-23x
- Break-even Point: 4 paying customers

Annotation box: "低成本运营模式 - 大学生团队可承受"

Style: Clean business chart, dark background, gradient bars, clear data labels in Chinese. Include currency symbols (¥). Resolution: 1400x900.
```

---

## 图14：PEST分析四象限图

**用途**: 四象限图展示政治、经济、社会、技术四个维度的关键因素

**真实数据**:
- Political: 《深化智慧城市发展行动计划》、河南30亿AI产业基金、舆情管理纳入城市治理
- Economic: 2025年市场72.4亿元(+26.4%)、地级市空白市场、云服务降低成本
- Social: 社媒用户增长、短视频成主渠道、公众透明度要求提高
- Technological: 大模型准确率>90%、多模态分析成熟、AI 3D生成10秒

**AI生图提示词**:
```
Create a PEST analysis quadrant diagram for AI Opinion Monitoring market:

QUADRANT 1 - Political (Top-Left, Blue #3B82F6):
- "智慧城市发展行动计划" - 2027年50+数字化城市
- "河南省AI产业基金" - 30亿元支持
- "网络舆情管理法规" - 合规要求明确
- 舆情管理纳入城市治理体系

QUADRANT 2 - Economic (Top-Right, Green #22C55E):
- "2025年市场规模72.4亿元" (+26.4%增速)
- "地级市/县域空白市场" - 6.3亿元潜力
- "云服务普及" - 降低部署成本
- AI技术降低分析门槛

QUADRANT 3 - Social (Bottom-Left, Orange #F97316):
- "社交媒体用户持续增长"
- "短视频成舆情主渠道"
- "公众对政府透明度要求提高"
- "企业品牌声誉意识增强"

QUADRANT 4 - Technological (Bottom-Right, Purple #8B5CF6):
- "大模型情感分析准确率 >90%"
- "多模态分析能力成熟"
- "AI 3D生成技术 ~10秒"
- "WebGL/Three.js技术普及"

Center: "智舆系统 PEST分析"

Style: 2x2 grid layout, each quadrant with distinct color, key points as bullet list, dark background (#0f172a), clean modern design. Resolution: 1400x1400.
```

---

## 图15：舆情监测市场规模增长预测图(2024-2031)

**用途**: 全球与中国市场对比的增长曲线图

**真实数据**:
- 全球市场: 2024年23.15亿美元 -> 2031年40.50亿美元, CAGR 8.1%
- 中国市场: 2024年110亿RMB -> 2030年~280亿RMB, CAGR 15-26%
- 中国占全球比例: 2023年19.59% -> 2030年20.45%

**AI生图提示词**:
```
Create a dual-line growth projection chart comparing Global vs China market (2024-2031):

LINE 1 - Global Market (USD Billion, Gray/White):
- 2024: $2.315B
- 2025: $2.50B
- 2027: $2.94B
- 2029: $3.46B
- 2031: $4.05B
- CAGR: 8.1%

LINE 2 - China Market (RMB Billion, Cyan #06B6D4):
- 2024: ¥110B
- 2025: ¥139B
- 2027: ¥180B
- 2029: ¥230B
- 2031: ¥300B
- CAGR: 15-26%

Area fill under China line to emphasize growth. Annotation: "中国增速领跑全球 - CAGR 15-26%"

Secondary Y-axis: China's global market share (%)
- 2024: 19.6%
- 2031: 20.5%

Style: Professional financial chart, dark background, glowing cyan line for China, dashed white line for Global. Data point markers with values. Chinese title "舆情监测市场规模预测(2024-2031)". Resolution: 1600x900.
```

---

## 图16：竞品功能对比雷达图

**用途**: 多产品功能维度对比雷达图

**真实数据** (来自背景报告):
| 产品 | 综合评分 | 数据覆盖 | AI能力 | 预警速度 | 报告生成 | 价格 |
|------|---------|---------|--------|---------|---------|------|
| 新浪舆情通 | 96.8 | 95 | 98.3% | 1-5分钟 | 5分钟 | 3-25万 |
| 人民网舆情 | 92.3 | 85 | 90% | 专项 | 权威 | 5-50万 |
| 鹰眼速读网 | 89.7 | 80 | 88% | 24h | 一键 | 3-30万 |
| 清博舆情 | 87.5 | 75 | 85% | 实时 | 学术 | 2-20万 |

**AI生图提示词**:
```
Create a multi-product radar chart comparing 5 opinion monitoring products:

Products (5 lines):
1. 新浪舆情通 (Sina) - Score 96.8 - Red #EF4444
2. 人民网舆情 (People) - Score 92.3 - Orange #F97316
3. 鹰眼速读网 (Yingyan) - Score 89.7 - Yellow #EAB308
4. 清博舆情 (Qingbo) - Score 87.5 - Green #22C55E
5. 智舆系统 (ZhiYu) - Highlighted - Cyan #06B6D4

6 Dimensions (0-100):
- 数据覆盖 (Data Coverage): 95/85/80/75/70
- AI分析能力 (AI Analysis): 98/90/88/85/88
- 预警响应 (Alert Speed): 95/70/85/80/90
- 报告生成 (Report Gen): 90/95/75/85/85
- 可视化 (Visualization): 70/60/65/65/95
- 性价比 (Cost-effective): 40/30/35/50/90

Style: Overlapping radar polygons with transparency, ZhiYu line thicker with glow effect. Dark background, legend showing product names and scores. Title: "主流舆情监测产品功能对比". Resolution: 1300x1200.
```

---

## 图17：营销渠道矩阵图

**用途**: 线上+线下营销渠道的矩阵展示图

**渠道规划**:
- 线上: 官网、技术博客(CSDN/掘金)、社交媒体(微信公众号/抖音)、SEO
- 线下: 创新创业大赛、行业会议、客户拜访、合作伙伴
- 获客: 政府对接、企业走访、免费试用
- 口碑: 客户案例、老带新激励、行业评测

**AI生图提示词**:
```
Create a 2x2 marketing channel matrix diagram:

X-AXIS: Cost (低成本 -> 高成本)
Y-AXIS: Reach (小范围 -> 大范围)

QUADRANT 1 - High Reach, Low Cost (Top-Left, Green):
"线上推广"
- 官方网站 (Official Website)
- 技术博客 (CSDN/掘金)
- SEO优化
- 社交媒体 (微信公众号/抖音)

QUADRANT 2 - High Reach, High Cost (Top-Right, Blue):
"品牌建设"
- 创新创业大赛 (Competition Awards)
- 行业会议 (Industry Conferences)
- 媒体报道

QUADRANT 3 - Low Reach, Low Cost (Bottom-Left, Cyan):
"口碑传播"
- 客户案例分享
- 老带新激励
- 社群运营

QUADRANT 4 - Low Reach, High Cost (Bottom-Right, Orange):
"直接销售"
- 政府部门对接
- 企业客户拜访
- 定制化服务

Center annotation: "大学生团队优先: Q1 + Q3"

Style: Clean matrix layout, colored quadrants with icons, channel items as bullet points. Dark background, professional business style. Arrow indicators on axes. Resolution: 1400x1000.
```

---

## 使用说明

1. **生成工具推荐**: Midjourney v6, DALL-E 3, Stable Diffusion XL, 或国产工具如文心一格
2. **风格一致性**: 所有图片采用深色背景 + 霓虹青色(#06B6D4)主色调, 符合智舆系统赛博朋克风格
3. **格式要求**: PNG格式, 分辨率按提示词指定, 建议300dpi用于打印
4. **数据准确性**: 所有数据来源于背景调查报告, 可在图片中适当简化数字

---

*最后更新: 2025年12月*
