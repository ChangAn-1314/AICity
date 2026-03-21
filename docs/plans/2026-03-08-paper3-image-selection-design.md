# paper3 插图筛选与落位设计

日期：2026-03-08

## 1. 目标

为 `docs/paper3` 建立一套可执行的插图筛选、落位与占位策略，优先服务商业计划书正文补图，而不是做纯素材归档。核心目标如下：

- 优先复用现有高质量图源，快速提升 `paper3` 的可读性、真实性和答辩展示感
- 统一处理三类来源：`docs/picture`、`docs/source`、`docs/paper/background_report.tex`
- 对缺失图片采用统一占位策略，避免章节逻辑断裂
- 为后续批量复制、重命名、插入正文和重绘图表提供施工清单

## 2. 来源分层策略

### 2.1 `docs/picture`

定位为成品图库，优先级最高。适合直接进入正文，常见类型包括政策图、市场图、架构图、流程图、雷达图和技术路线图。

### 2.2 `docs/source`

定位为原始素材库与界面截图仓库。适合补充产品章、技术章和执行章中的 UI 界面、功能分屏和演示截图，但通常需要先复制到 `paper3/picture` 后统一命名。

### 2.3 `docs/paper/background_report.tex`

定位为图表代码来源。该文件中的 `tikz` 和 `pgfplots` 图表按“可直接复刻”处理，用于后续统一重绘市场图、技术成熟度图、财务趋势图和风险类图表。

## 3. 判定规则

所有候选图片统一按以下状态判定：

- `直接可用`：已是适合正文的成品图，可直接复制到 `paper3/picture`
- `复制后改名可用`：内容可用，但命名、尺寸或裁切需整理
- `按 background_report.tex 重绘`：现成 PNG 不优，建议按 `tex` 图表逻辑重绘
- `仅参考`：信息有用，但不适合直接进入计划书正文
- `先插入占位图`：章节逻辑上必须有图，但当前没有足够合适的现成图

优先级分为：

- `P1`：当前轮次应优先补入正文
- `P2`：第二优先级，待主图补齐后处理
- `P3`：增强项，可选

## 4. 章节落位策略

### 4.1 背景章

优先使用 `docs/picture/fig01_policy_system.png` 和 `docs/picture/fig02_market_trend.png`。其中政策支持体系图用于强化“国家-省-市”政策承接关系，市场增长图用于强化赛道增长逻辑。信阳试点场景分布图暂采用统一占位图，后续等试点对象或场景拼图素材到位后替换。

### 4.2 产品章

优先使用 `docs/source/UI/ui_main_interface.png`、`docs/source/UI/ui_ai_analysis.png`、`docs/source/UI/ui_wordcloud.png`、`docs/source/UI/ui_trend_analysis.png`、`docs/source/UI/ui_decision_sim.png`、`docs/source/UI/3D建筑+场景还原.png`、`docs/source/UI/ui_drill_1_national.png` 至 `ui_drill_4_district.png`。同时复用 `docs/picture/fig05_modules.png` 和 `docs/picture/fig07_interaction_flow.png`。该章目标是让评委感知“项目不是概念，而是有界面、有模块、有用户路径”。

### 4.3 技术章

优先使用 `docs/picture/fig04_architecture.png`、`docs/picture/fig08_ai_3d_workflow.png`、`docs/picture/fig09_multi_agent.png`、`docs/picture/fig12_gantt.png`。其中总体架构图、多 Agent 图和 AI 3D 流程图属于 P1；技术甘特图属于 P2。若需要更统一的技术能力图，后续可按 `background_report.tex` 的技术成熟度图表逻辑重绘。

### 4.4 市场章

优先使用 `docs/picture/fig03_radar_compare.png`、`docs/picture/fig14_PEST.png`、`docs/picture/fig15_market_forecast.png`。竞品能力雷达图、PEST 图和市场预测图属于 P1。`TAM/SAM/SOM` 图和一手调研统计图当前没有足够好的现成图，先统一占位，待后续基于真实调研结果或统一视觉规范重绘。

### 4.5 商业章

优先使用 `docs/picture/fig17.png` 作为营销渠道矩阵图。其余如三年推广路线、获客漏斗和版本分层，目前以表格表达为主，后续若需要更强答辩感，可单独重绘时间轴和漏斗图。

### 4.6 执行章

当前最适合补“试点实施流程图”“现有成果证据拼图”“试点对象分布图”。由于这类图强调真实性，优先使用 `docs/source/UI` 截图、编译结果截图、仓库目录截图和未来形成的试点材料。现阶段无统一成品图时，采用占位图策略，不强行拼接低质量图片。

### 4.7 财务章

财务章目前表格完整，但趋势图偏弱。建议后续重点补“三年收入/成本/净利润趋势图”，并优先按 `background_report.tex` 的 `pgfplots` 风格重绘，而不是继续寻找不统一的 PNG。`docs/picture/fig13_cost_benefit.png` 可作为补充图使用。

### 4.8 团队章

团队章以表格为主，不强行插入人物照片。后续如需补图，优先做“团队协同三角图”或“组织协同图”，用于表达“技术实现 + 场景理解 + 方案表达”的三位一体结构。

### 4.9 社会价值章

该章更适合“治理价值闭环图”“利益相关方影响图”“短中长期社会价值路径图”等概念框架图。当前无优质现成图时先占位，后续按统一风格重绘。

### 4.10 风险章

该章最适合补“风险热力图”和“四道可信防线示意图”。当前表格已够支撑阅读，但从答辩角度仍建议补图。优先级为 P2，建议后续按矩阵图和框架图形式统一重绘。

### 4.11 附录章

附录以证据索引和模板为主，不追求复杂视觉。后续建议补“证据包结构示意图”和“样例证据缩略拼图”，用于提升真实性引导效率。

## 5. 最终施工清单格式

后续正式筛图时，统一按以下字段输出：

- 所属章节
- 建议编号
- 图名/用途
- 推荐优先级
- 当前状态
- 来源路径
- 使用方式
- 建议文件名
- 建议插入位置
- 备注

示例：

```text
背景章节 | F1-01 | 国家-省-市政策支持体系图 | P1 | 已有成品 | docs/picture/fig01_policy_system.png | 直接可用 | chapter1-policy-system.png | 政策环境与时代窗口后 | 已适合正文
市场章节 | F4-02 | TAM/SAM/SOM 结构图 | P1 | 先占位 | 暂无现成成品 | 先插入占位图 | chapter4-tam-sam-som-placeholder.png | 市场空间判断后 | 后续可重绘
技术章节 | F3-03 | 核心技术成熟度评估图 | P2 | 可按 tex 复刻 | docs/paper/background_report.tex | 按 background_report.tex 重绘 | chapter3-tech-maturity.png | 技术壁垒段后 | 建议统一风格
```

## 6. 推荐执行顺序

1. 先输出完整筛图清单
2. 按 `P1` 批量复制、重命名并归入 `paper3/picture`
3. 在 `paper3` 对应章节插入现成图
4. 对缺图章节插入统一占位图
5. 最后处理 `background_report.tex` 可复刻图表并替换占位图或低质量 PNG

## 7. 本次设计结论

本设计的核心不是“把所有图都搬过来”，而是建立一套稳定的图源优先级、章节落位规则和缺图兜底机制。这样既能尽快提升 `paper3` 的图文完成度，又能避免后续因图源混乱、风格不统一和真实性不足而重复返工。
