# 策划书更新日志

## 2025-12-10

### 文档结构优化
- 将全文无序列表改为段落描述
- 为算法模型添加数学公式（LoRA、情感分析、市场规模计算）
- 添加具体技术实施路径说明

#### 各章节段落化改动详情

**chapter1.tex**
- 行业痛点：将5个痛点的列表改为连贯段落，用"一是...二是...三是..."串联
- 信阳市场景：将城市特点列表改为段落描述
- 团队能力：将专业构成、技术储备、本地资源改为段落

**chapter2.tex**
- 主界面布局：将五区域设计的列表改为段落，详述各区域功能
- AI场景还原技术路径：将文字/图片/视频舆情处理流程改为段落
- 3D地图多级视图：将四级视图(全国/省/市/县)的列表改为段落

**chapter3.tex**
- 大语言模型技术：将讯飞星火能力列表改为技术描述段落
- 3D技术说明：将技术组件列表改为段落
- 商业模式：将营收模式列表改为段落

**chapter4.tex**
- PEST分析：将政治/经济/社会/技术四要素改为段落
- 竞争态势：将机会窗口列表改为段落
- 增长驱动因素：将四大因素改为段落

**chapter5.tex**
- 营销目标：将短期/中期/长期目标改为段落
- 获客渠道：将线上线下渠道列表改为段落
- 推广策略：将线上/线下/口碑传播改为段落

> 总体影响：文档风格从"要点罗列"变为"正式论述"，更符合策划书的学术/商业文体要求，核心内容未变。

### 公式添加
- **LoRA公式**：`W = W0 + BA`（chapter2.tex第194行）
- **情感分析公式**：`P(y|X) = Softmax(Wc * H[CLS] + bc)`（chapter3.tex第14行）
- **市场规模计算**：地级市/县域市场规模约6.3亿元（chapter4.tex第40行）

### 封面更新
- 添加项目Logo到封面顶部
- 填写团队名称：X.X小队
- 填写团队成员：安思言 李智康 叶照扬 王佳蕾 李欣然 程文飞

### 页眉优化
- 在页眉左侧添加项目Logo
- 调整页眉高度为28pt以适配Logo

### 图片添加
- 添加智能舆情分析模块界面截图（ui_ai_analysis.png, ui_wordcloud.png）
- 添加走向预测与决策模拟模块界面截图（ui_trend_analysis.png, ui_decision_sim.png）
- 图片位置：chapter2.tex 功能模块介绍部分

### LaTeX配置
- 添加amssymb宏包以支持mathbb数学符号
- 添加AutoFakeBold=2选项启用伪粗体
- 配置VS Code LaTeX Workshop使用xelatex编译
- 关闭保存自动编译（autoBuild.run: never）

### 文件结构
```
docs/paper/
├── main.tex              # 主文件
├── picture/              # 图片目录（新建）
│   ├── logo.png          # 项目Logo
│   ├── ui_ai_analysis.png
│   ├── ui_wordcloud.png
│   ├── ui_trend_analysis.png
│   └── ui_decision_sim.png
├── chapters/
│   ├── cover.tex         # 封面（已更新）
│   ├── chapter1.tex      # 第一章（已优化）
│   ├── chapter2.tex      # 第二章（已优化+添加图片）
│   ├── chapter3.tex      # 第三章（已优化+添加公式）
│   ├── chapter4.tex      # 第四章（已优化+添加公式）
│   ├── chapter5.tex      # 第五章（已优化）
│   └── appendix.tex      # 附录
└── .vscode/
    └── settings.json     # VS Code配置
```

### 编译信息
- 编译引擎：XeLaTeX
- 页数：37页
- PDF大小：约55MB
