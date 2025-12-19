# -*- coding: utf-8 -*-
"""
文件存储模块
"""

import json
import csv
from pathlib import Path
from datetime import datetime
from typing import List, Union

from core.models import RawData, CleanedData
from core.config import Config
from core.logger import get_logger


class FileStorage:
    """文件存储器"""
    
    def __init__(self, config: Config = None):
        self.config = config or Config()
        self.logger = get_logger('FileStorage')
        
        # 输出目录
        self.output_dir = Path(self.config.get('storage', 'file', 'output_dir', default='./output'))
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # 输出格式
        self.format = self.config.get('storage', 'file', 'format', default='jsonl')
    
    def save(self, data: Union[List[RawData], List[CleanedData]], 
             filename: str = None, data_type: str = 'raw') -> str:
        """
        保存数据到文件
        
        Args:
            data: 数据列表
            filename: 文件名（不含扩展名）
            data_type: 数据类型 raw/cleaned/annotated
            
        Returns:
            保存的文件路径
        """
        if not data:
            self.logger.warning("没有数据需要保存")
            return ""
        
        # 生成文件名
        if filename is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"{data_type}_{timestamp}"
        
        # 根据格式保存
        if self.format == 'jsonl':
            filepath = self._save_jsonl(data, filename)
        elif self.format == 'json':
            filepath = self._save_json(data, filename)
        elif self.format == 'csv':
            filepath = self._save_csv(data, filename)
        else:
            raise ValueError(f"不支持的格式: {self.format}")
        
        self.logger.info(f"保存 {len(data)} 条数据到: {filepath}")
        return str(filepath)
    
    def _save_jsonl(self, data: List, filename: str) -> Path:
        """保存为JSONL格式"""
        filepath = self.output_dir / f"{filename}.jsonl"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            for item in data:
                json_str = item.model_dump_json(exclude_none=True)
                f.write(json_str + '\n')
        
        return filepath
    
    def _save_json(self, data: List, filename: str) -> Path:
        """保存为JSON格式"""
        filepath = self.output_dir / f"{filename}.json"
        
        json_data = [item.model_dump(exclude_none=True) for item in data]
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2, default=str)
        
        return filepath
    
    def _save_csv(self, data: List, filename: str) -> Path:
        """保存为CSV格式"""
        filepath = self.output_dir / f"{filename}.csv"
        
        if not data:
            return filepath
        
        # 获取所有字段
        first_item = data[0].model_dump(exclude_none=True)
        fieldnames = list(first_item.keys())
        
        with open(filepath, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            
            for item in data:
                row = item.model_dump(exclude_none=True)
                # 处理嵌套对象
                for k, v in row.items():
                    if isinstance(v, (dict, list)):
                        row[k] = json.dumps(v, ensure_ascii=False)
                writer.writerow(row)
        
        return filepath
    
    def load(self, filepath: str) -> List[dict]:
        """
        从文件加载数据
        
        Args:
            filepath: 文件路径
            
        Returns:
            数据列表
        """
        filepath = Path(filepath)
        
        if not filepath.exists():
            raise FileNotFoundError(f"文件不存在: {filepath}")
        
        suffix = filepath.suffix.lower()
        
        if suffix == '.jsonl':
            return self._load_jsonl(filepath)
        elif suffix == '.json':
            return self._load_json(filepath)
        elif suffix == '.csv':
            return self._load_csv(filepath)
        else:
            raise ValueError(f"不支持的文件格式: {suffix}")
    
    def _load_jsonl(self, filepath: Path) -> List[dict]:
        """加载JSONL文件"""
        data = []
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    data.append(json.loads(line))
        return data
    
    def _load_json(self, filepath: Path) -> List[dict]:
        """加载JSON文件"""
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def _load_csv(self, filepath: Path) -> List[dict]:
        """加载CSV文件"""
        data = []
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                data.append(row)
        return data
    
    def export_for_training(self, data: List[CleanedData], output_name: str = 'training') -> str:
        """
        导出为训练格式
        
        Args:
            data: 清洗并标注后的数据
            output_name: 输出文件名前缀
            
        Returns:
            输出文件路径
        """
        training_data = []
        
        for item in data:
            if not item.is_valid or not item.annotation:
                continue
            
            # 构建SFT格式
            instruction = "分析以下舆情内容，给出事件分类、情感倾向、紧急程度和处置建议。"
            
            response_parts = [
                f"## 舆情分析",
                f"",
                f"**事件分类**: {item.annotation.category} - {item.annotation.subcategory}",
                f"**情感倾向**: {item.annotation.sentiment.value} ({item.annotation.sentiment_score:.2f})",
                f"**紧急程度**: {item.annotation.urgency.value}",
                f"**关键词**: {', '.join(item.annotation.keywords)}",
                f"**建议部门**: {item.annotation.suggested_department}"
            ]
            
            training_item = {
                "instruction": instruction,
                "input": item.content_cleaned,
                "output": '\n'.join(response_parts)
            }
            
            training_data.append(training_item)
        
        # 保存
        filepath = self.output_dir / f"{output_name}.jsonl"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            for item in training_data:
                f.write(json.dumps(item, ensure_ascii=False) + '\n')
        
        self.logger.info(f"导出 {len(training_data)} 条训练数据到: {filepath}")
        return str(filepath)
