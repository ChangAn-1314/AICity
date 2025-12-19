# AICity 舆情数据采集工具

专业的城市舆情数据采集、清洗、分析工具，用于微调城市舆情分析模型。

## 功能特性

- **异步高并发**: 基于asyncio/aiohttp的高性能并发采集
- **多源采集**: 支持微博、新闻网站、政务公开等多种数据源
- **智能清洗**: 自动去除广告、无效内容，标准化处理
- **情感分析**: 内置情感分析和分类功能
- **断点续传**: 任务队列持久化，支持中断后继续
- **代理池**: 支持代理轮换和健康检测
- **自适应限速**: 根据错误率自动调整请求频率
- **灵活存储**: 支持文件(JSONL/JSON/CSV)和MongoDB存储
- **训练导出**: 一键导出SFT微调格式数据

## 目录结构

```
data_collector/
├── config/
│   └── settings.yaml      # 配置文件
├── core/
│   ├── base.py           # 同步采集器基类
│   ├── async_base.py     # 异步采集器基类
│   ├── config.py         # 配置管理
│   ├── logger.py         # 日志管理
│   ├── models.py         # 数据模型
│   ├── task_queue.py     # 任务队列(断点续传)
│   └── proxy_pool.py     # 代理池管理
├── collectors/
│   ├── weibo.py          # 同步微博采集器
│   ├── async_weibo.py    # 异步微博采集器
│   ├── news.py           # 新闻采集器
│   └── gov.py            # 政务数据采集器
├── processors/
│   ├── cleaner.py        # 数据清洗
│   └── analyzer.py       # 情感分析
├── storage/
│   ├── file_storage.py   # 文件存储
│   └── mongo_storage.py  # MongoDB存储
├── output/               # 输出目录
├── logs/                 # 日志目录
├── main.py              # 主入口(异步)
├── requirements.txt     # 依赖
└── README.md
```

## 安装

```bash
# 进入目录
cd data_collector

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt
```

## 配置

编辑 `config/settings.yaml`:

```yaml
# 目标城市
target:
  province: "河南省"
  city: "信阳市"

# 微博采集配置
weibo:
  enabled: true
  cookie: "你的微博Cookie"  # 登录后获取
  max_pages: 10

# 存储配置
storage:
  type: "file"
  file:
    output_dir: "./output"
    format: "jsonl"
```

### 获取微博Cookie

1. 登录 https://m.weibo.cn
2. 打开开发者工具 (F12)
3. 在 Network 标签页刷新页面
4. 找到任意请求，复制 Cookie 值

## 使用方法

### 1. 采集数据

```bash
# 异步高并发采集微博数据
python main.py collect --keywords "信阳,供暖,交通" --concurrent 5

# 指定数据源和页数
python main.py collect --source weibo --keywords "信阳" --max-pages 20 --concurrent 10

# 使用代理池采集
python main.py collect --keywords "信阳" --use-proxy
```

### 2. 处理数据

```bash
# 清洗和分析数据
python main.py process --input ./output/raw_20251215_120000.jsonl

# 同时导出训练数据
python main.py process --input ./output/raw_xxx.jsonl --export-training
```

### 3. 查看统计

```bash
# 显示数据统计
python main.py stats

# 显示任务状态
python main.py status
```

### 4. 断点续传

```bash
# 继续未完成的任务
python main.py resume
```

### 5. 代理管理

```bash
# 加载免费代理
python main.py proxy --load

# 检测代理可用性
python main.py proxy --check --concurrent 20

# 清理无效代理
python main.py proxy --cleanup
```

## 输出格式

### 原始数据 (raw_*.jsonl)

```json
{
  "id": "abc123",
  "source": "weibo",
  "content": "信阳今天供暖终于正常了...",
  "publish_time": "2025-12-15T10:30:00",
  "author": {"name": "用户A", "followers": 1000},
  "engagement": {"likes": 50, "comments": 10}
}
```

### 清洗数据 (cleaned_*.jsonl)

```json
{
  "id": "abc123",
  "source": "weibo",
  "content_cleaned": "信阳今天供暖终于正常了",
  "annotation": {
    "category": "民生",
    "subcategory": "供暖",
    "sentiment": "positive",
    "sentiment_score": 0.75,
    "urgency": "low",
    "suggested_department": "住建局"
  }
}
```

### 训练数据 (training.jsonl)

```json
{
  "instruction": "分析以下舆情内容...",
  "input": "信阳今天供暖终于正常了",
  "output": "## 舆情分析\n**事件分类**: 民生 - 供暖\n**情感倾向**: positive..."
}
```

## API调用

```python
from collectors import WeiboCollector
from processors import DataCleaner, SentimentAnalyzer
from storage import FileStorage

# 采集
with WeiboCollector() as collector:
    data = collector.run(keywords=['信阳', '供暖'])

# 清洗
cleaner = DataCleaner()
cleaned = cleaner.clean_batch(data)

# 分析
analyzer = SentimentAnalyzer()
analyzed = analyzer.analyze_batch(cleaned)

# 存储
storage = FileStorage()
storage.save(analyzed, data_type='cleaned')
```

## 注意事项

1. **遵守网站规则**: 请遵守各平台的robots.txt和使用条款
2. **控制采集频率**: 默认每次请求间隔2-5秒，避免被封
3. **数据脱敏**: 采集的数据请做好脱敏处理再使用
4. **Cookie安全**: 不要将Cookie提交到代码仓库

## 扩展开发

### 添加新的采集器

```python
from core.base import BaseCollector
from core.models import RawData, SourceType

class MyCollector(BaseCollector):
    source_type = SourceType.NEWS
    
    def collect(self, keywords, **kwargs):
        # 实现采集逻辑
        for item in self._fetch_data(keywords):
            yield self.parse_item(item)
    
    def parse_item(self, item):
        return RawData(
            id=self._generate_id('my', item['id']),
            source=self.source_type,
            content=item['content'],
            publish_time=self._parse_time(item['time'])
        )
```

## 许可证

MIT License
