# paper3 Image Rollout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 `docs/paper3` 建立完整的插图施工清单，批量落位高优先级图片，并在缺图处插入统一占位图，使商业计划书从“可编译”升级为“图文结构更完整、评审更直观”。

**Architecture:** 先输出统一的筛图清单，再按 `P1` 优先级把现成 PNG 和 UI 素材复制到 `paper3/picture`，随后修改对应章节插图代码并统一命名。对没有现成好图的章节，先插入占位图；对适合矢量图的市场、财务和风险图表，后续按 `docs/paper/background_report.tex` 的 `tikz/pgfplots` 逻辑重绘替换。

**Tech Stack:** LaTeX (`xelatex`/`latexmk`)、`graphicx`、`eso-pic`、`tcolorbox`、现有 PNG/JPG 素材、`tikz`/`pgfplots`（后续重绘用）

---

### Task 1: 生成完整筛图清单

**Files:**
- Create: `docs/plans/2026-03-08-paper3-image-manifest.md`
- Reference: `docs/source/`
- Reference: `docs/picture/`
- Reference: `docs/paper/background_report.tex`
- Reference: `docs/paper3/chapters/chapter1_background.tex`
- Reference: `docs/paper3/chapters/chapter2_product.tex`
- Reference: `docs/paper3/chapters/chapter3_technology.tex`
- Reference: `docs/paper3/chapters/chapter4_market.tex`
- Reference: `docs/paper3/chapters/chapter5_business.tex`
- Reference: `docs/paper3/chapters/chapter6_execution.tex`
- Reference: `docs/paper3/chapters/chapter7_finance.tex`
- Reference: `docs/paper3/chapters/chapter8_team.tex`
- Reference: `docs/paper3/chapters/chapter9_social_value.tex`
- Reference: `docs/paper3/chapters/chapter10_risk.tex`
- Reference: `docs/paper3/chapters/appendix.tex`

**Step 1: 写清单文档骨架**

```markdown
# paper3 插图施工清单

| 所属章节 | 建议编号 | 图名/用途 | 推荐优先级 | 当前状态 | 来源路径 | 使用方式 | 建议文件名 | 建议插入位置 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
```

**Step 2: 按章节填入 P1 项**

至少先填入以下候选图：

```text
背景章节 | F1-01 | 政策支持体系图 | P1 | 已有成品 | docs/picture/fig01_policy_system.png | 直接可用 | chapter1-policy-system.png | 政策环境与时代窗口后 | 已在 paper3 落位
背景章节 | F1-02 | 市场增长趋势图 | P1 | 已有成品 | docs/picture/fig02_market_trend.png | 直接可用 | chapter1-market-growth.png | 传统舆情治理痛点后 | 已在 paper3 落位
产品章节 | F2-01 | 主界面总览图 | P1 | 可复制整理 | docs/source/UI/ui_main_interface.png | 复制后改名可用 | chapter2-main-interface.png | 产品定位后 | 产品主视觉
技术章节 | F3-01 | 系统总体架构图 | P1 | 已有成品 | docs/picture/fig04_architecture.png | 直接可用 | chapter3-system-architecture.png | 总体架构后 | 关键主图
市场章节 | F4-01 | 竞品功能雷达图 | P1 | 已有成品 | docs/picture/fig03_radar_compare.png | 直接可用 | chapter4-competition-radar.png | 竞品格局与差异化判断后 | 已在 paper3 落位
```

**Step 3: 填入 P2/P3 与占位图项**

```text
市场章节 | F4-02 | TAM/SAM/SOM 结构图 | P1 | 先占位 | 暂无现成成品 | 先插入占位图 | chapter4-tam-sam-som-placeholder.png | 市场空间判断后 | 后续可重绘
执行章节 | F6-01 | 试点实施流程图 | P1 | 先占位 | 暂无现成成品 | 先插入占位图 | chapter6-pilot-flow-placeholder.png | 实施路径与里程碑后 | 后续转正式流程图
财务章节 | F7-01 | 三年财务趋势图 | P1 | 可按 tex 复刻 | docs/paper/background_report.tex | 按 background_report.tex 重绘 | chapter7-finance-trend.png | 成本结构与利润测算后 | 优先重绘
风险章节 | F10-02 | 风险热力图 | P2 | 先占位 | 暂无现成成品 | 先插入占位图 | chapter10-risk-heatmap-placeholder.png | 风险矩阵后 | 后续重绘
```

**Step 4: 自检清单完整性**

Run: `rg "^\|" "docs/plans/2026-03-08-paper3-image-manifest.md"`

Expected: 能看到所有章节对应条目，且字段完整。

**Step 5: Commit**

```bash
git add docs/plans/2026-03-08-paper3-image-manifest.md
git commit -m "docs: add paper3 image rollout manifest"
```

### Task 2: 复制并统一命名 P1 图片素材

**Files:**
- Modify: `docs/paper3/picture/`
- Reference: `docs/source/UI/`
- Reference: `docs/picture/`

**Step 1: 建立目标命名集合**

```text
chapter2-main-interface.png
chapter2-modules.png
chapter2-ai-analysis.png
chapter2-wordcloud.png
chapter2-trend-analysis.png
chapter2-decision-sim.png
chapter2-3d-restoration.png
chapter2-drill-national.png
chapter2-drill-province.png
chapter2-drill-city.png
chapter2-drill-district.png
chapter3-system-architecture.png
chapter3-ai-3d-workflow.png
chapter3-multi-agent.png
chapter3-gantt.png
chapter4-pest.png
chapter4-market-forecast.png
chapter5-marketing-matrix.png
```

**Step 2: 复制最关键的现成图**

Run:

```bash
copy "docs\picture\fig04_architecture.png" "docs\paper3\picture\chapter3-system-architecture.png"
copy "docs\picture\fig05_modules.png" "docs\paper3\picture\chapter2-modules.png"
copy "docs\picture\fig07_interaction_flow.png" "docs\paper3\picture\chapter2-interaction-flow.png"
copy "docs\picture\fig08_ai_3d_workflow.png" "docs\paper3\picture\chapter3-ai-3d-workflow.png"
copy "docs\picture\fig09_multi_agent.png" "docs\paper3\picture\chapter3-multi-agent.png"
copy "docs\picture\fig12_gantt.png" "docs\paper3\picture\chapter3-gantt.png"
copy "docs\picture\fig14_PEST.png" "docs\paper3\picture\chapter4-pest.png"
copy "docs\picture\fig15_market_forecast.png" "docs\paper3\picture\chapter4-market-forecast.png"
copy "docs\picture\fig17.png" "docs\paper3\picture\chapter5-marketing-matrix.png"
```

Expected: `docs/paper3/picture/` 中出现统一命名的图。

**Step 3: 复制关键 UI 截图**

Run:

```bash
copy "docs\source\UI\ui_main_interface.png" "docs\paper3\picture\chapter2-main-interface.png"
copy "docs\source\UI\ui_ai_analysis.png" "docs\paper3\picture\chapter2-ai-analysis.png"
copy "docs\source\UI\ui_wordcloud.png" "docs\paper3\picture\chapter2-wordcloud.png"
copy "docs\source\UI\ui_trend_analysis.png" "docs\paper3\picture\chapter2-trend-analysis.png"
copy "docs\source\UI\ui_decision_sim.png" "docs\paper3\picture\chapter2-decision-sim.png"
copy "docs\source\UI\3D建筑+场景还原.png" "docs\paper3\picture\chapter2-3d-restoration.png"
copy "docs\source\UI\ui_drill_1_national.png" "docs\paper3\picture\chapter2-drill-national.png"
copy "docs\source\UI\ui_drill_2_province.png" "docs\paper3\picture\chapter2-drill-province.png"
copy "docs\source\UI\ui_drill_3_city.png" "docs\paper3\picture\chapter2-drill-city.png"
copy "docs\source\UI\ui_drill_4_district.png" "docs\paper3\picture\chapter2-drill-district.png"
```

**Step 4: 核对目标目录**

Run: `dir "docs\paper3\picture"`

Expected: 刚复制的统一命名文件均存在。

**Step 5: Commit**

```bash
git add docs/paper3/picture
git commit -m "docs: stage paper3 image assets"
```

### Task 3: 改造产品章插图

**Files:**
- Modify: `docs/paper3/chapters/chapter2_product.tex`
- Reference: `docs/paper/chapters/chapter2.tex`
- Reference: `docs/paper3/picture/`

**Step 1: 在产品定位后插入主界面总览图**

```latex
\begin{figure}[H]
\centering
\includegraphics[width=0.95\textwidth]{chapter2-main-interface.png}
\caption{智舆系统主界面示意}
\end{figure}
```

**Step 2: 在核心功能模块表后插入模块关系图**

```latex
\begin{figure}[H]
\centering
\includegraphics[width=0.82\textwidth]{chapter2-modules.png}
\caption{智舆核心功能模块关系图}
\end{figure}
```

**Step 3: 在典型应用场景之间插入 UI 分屏图**

```latex
\begin{figure}[H]
\centering
\begin{minipage}[b]{0.48\textwidth}
\centering
\includegraphics[width=\textwidth]{chapter2-ai-analysis.png}
\caption{AI 分析面板}
\end{minipage}
\hfill
\begin{minipage}[b]{0.48\textwidth}
\centering
\includegraphics[width=\textwidth]{chapter2-wordcloud.png}
\caption{关键词与主题表达}
\end{minipage}
\end{figure}
```

**Step 4: 插入 3D 场景图、四级穿透图和交互流程图**

将以下图依次落位：

```text
chapter2-3d-restoration.png
chapter2-drill-national.png / province / city / district
chapter2-interaction-flow.png
```

**Step 5: 编译验证产品章未破版**

Run: `latexmk -xelatex -interaction=nonstopmode main.tex`

Expected: 编译成功，产品章图片正常显示。

**Step 6: Commit**

```bash
git add docs/paper3/chapters/chapter2_product.tex docs/paper3/picture
git commit -m "docs: add paper3 product visuals"
```

### Task 4: 改造技术章与市场章插图

**Files:**
- Modify: `docs/paper3/chapters/chapter3_technology.tex`
- Modify: `docs/paper3/chapters/chapter4_market.tex`
- Reference: `docs/paper/chapters/chapter3.tex`
- Reference: `docs/paper/chapters/chapter4.tex`

**Step 1: 在技术章插入三张主图**

依次落位：

```text
chapter3-system-architecture.png
chapter3-ai-3d-workflow.png
chapter3-multi-agent.png
```

每张图后补 1-2 句解释，说明它支撑的是“总体架构”“AI 3D 链路”“多 Agent 协作价值”。

**Step 2: 视版面决定是否插入技术甘特图**

```latex
\begin{figure}[H]
\centering
\includegraphics[width=0.88\textwidth]{chapter3-gantt.png}
\caption{技术研发与迭代推进示意}
\end{figure}
```

**Step 3: 在市场章补 PEST 图与市场预测图**

```latex
\begin{figure}[H]
\centering
\includegraphics[width=0.85\textwidth]{chapter4-pest.png}
\caption{智舆所处市场的 PEST 分析图}
\end{figure}
```

```latex
\begin{figure}[H]
\centering
\includegraphics[width=0.88\textwidth]{chapter4-market-forecast.png}
\caption{舆情监测市场规模增长预测图}
\end{figure}
```

**Step 4: 保留并统一处理占位图**

确认以下占位继续保留：

```text
目标市场分层图
TAM/SAM/SOM 结构示意图
一手调研样本统计图
```

**Step 5: 编译验证技术章和市场章**

Run: `latexmk -xelatex -interaction=nonstopmode main.tex`

Expected: 编译通过，技术章与市场章图表正常显示，占位图样式统一。

**Step 6: Commit**

```bash
git add docs/paper3/chapters/chapter3_technology.tex docs/paper3/chapters/chapter4_market.tex docs/paper3/picture
git commit -m "docs: add paper3 technology and market visuals"
```

### Task 5: 改造商业章并补后半部占位图

**Files:**
- Modify: `docs/paper3/chapters/chapter5_business.tex`
- Modify: `docs/paper3/chapters/chapter6_execution.tex`
- Modify: `docs/paper3/chapters/chapter7_finance.tex`
- Modify: `docs/paper3/chapters/chapter8_team.tex`
- Modify: `docs/paper3/chapters/chapter9_social_value.tex`
- Modify: `docs/paper3/chapters/chapter10_risk.tex`

**Step 1: 在商业章插入营销渠道矩阵图**

```latex
\begin{figure}[H]
\centering
\includegraphics[width=0.84\textwidth]{chapter5-marketing-matrix.png}
\caption{智舆营销渠道矩阵图}
\end{figure}
```

**Step 2: 为执行章插入试点实施流程占位图**

```latex
\placeholderfigure{试点实施流程图待补}{建议后续补充“调研-接入-联调-培训-上线-评估”的正式流程图。}{智舆试点实施流程图（占位）}
```

**Step 3: 为财务章插入三年财务趋势图占位图**

```latex
\placeholderfigure{三年财务趋势图待补}{建议后续基于收入、成本、净利润和现金流四条曲线重绘正式趋势图。}{三年财务趋势图（占位）}
```

**Step 4: 为团队、社会价值和风险章插入框架图占位图**

分别插入：

```text
团队协同结构图（占位）
社会价值闭环图（占位）
风险热力图（占位）
四道可信防线图（占位，可选）
```

**Step 5: 编译验证后半部章节布局**

Run: `latexmk -xelatex -interaction=nonstopmode main.tex`

Expected: 页数增长，后半部可视化结构更完整，编译继续通过。

**Step 6: Commit**

```bash
git add docs/paper3/chapters/chapter5_business.tex docs/paper3/chapters/chapter6_execution.tex docs/paper3/chapters/chapter7_finance.tex docs/paper3/chapters/chapter8_team.tex docs/paper3/chapters/chapter9_social_value.tex docs/paper3/chapters/chapter10_risk.tex
git commit -m "docs: add paper3 execution and support visuals"
```

### Task 6: 重绘 `background_report.tex` 可复刻图表

**Files:**
- Modify: `docs/paper3/main.tex`
- Modify: `docs/paper3/chapters/chapter4_market.tex`
- Modify: `docs/paper3/chapters/chapter7_finance.tex`
- Modify: `docs/paper3/chapters/chapter10_risk.tex`
- Reference: `docs/paper/background_report.tex`

**Step 1: 为 `paper3` 引入重绘所需宏包（如尚未引入）**

```latex
\usepackage{tikz}
\usepackage{pgfplots}
\pgfplotsset{compat=1.18}
```

**Step 2: 重绘市场或技术类图表中的第一张目标图**

优先从下面三类里选 1 张：

```text
核心技术成熟度评估图
三年财务趋势图
风险热力图
```

**Step 3: 用正式图替换同章节占位图或低质量 PNG**

```latex
% 删除占位图
% 插入 tikz/pgfplots 正式图
```

**Step 4: 编译并检查版面统一性**

Run: `latexmk -xelatex -interaction=nonstopmode main.tex`

Expected: 编译通过，重绘图清晰、风格统一、字号与正文匹配。

**Step 5: Commit**

```bash
git add docs/paper3/main.tex docs/paper3/chapters/chapter4_market.tex docs/paper3/chapters/chapter7_finance.tex docs/paper3/chapters/chapter10_risk.tex
git commit -m "docs: redraw paper3 charts with tikz"
```

### Task 7: 最终核查与附录同步

**Files:**
- Modify: `docs/paper3/chapters/appendix.tex`
- Modify: `docs/plans/2026-03-08-paper3-image-manifest.md`
- Verify: `docs/paper3/main.pdf`

**Step 1: 更新附录中的图表总清单状态**

将已经补入正文的图从“待补强/待图形化”改为“已完成”或“已部分完成”。

**Step 2: 更新施工清单状态**

在 `docs/plans/2026-03-08-paper3-image-manifest.md` 中补充“已复制/已插入/已占位/待重绘”等状态。

**Step 3: 完整编译最终 PDF**

Run: `latexmk -xelatex -interaction=nonstopmode main.tex`

Expected: `main.pdf` 成功输出，页数和图表数量较当前版本进一步提升。

**Step 4: 人工核查四类重点页面**

重点检查：

```text
封面背景图
产品章界面图
技术章架构图
市场章竞品图和预测图
```

**Step 5: Commit**

```bash
git add docs/paper3/chapters/appendix.tex docs/plans/2026-03-08-paper3-image-manifest.md docs/paper3/main.pdf
git commit -m "docs: finalize paper3 visual rollout"
```
