# -*- coding: utf-8 -*-
"""
数据清洗模块
"""

import re
import hashlib
from typing import List, Optional, Set
from datetime import datetime

import jieba
import jieba.analyse

from core.models import RawData, CleanedData, Annotation, Location
from core.logger import get_logger


class DataCleaner:
    """数据清洗器"""
    
    def __init__(self):
        self.logger = get_logger('DataCleaner')
        
        # 停用词
        self.stopwords: Set[str] = self._load_stopwords()
        
        # 无效内容模式
        self.invalid_patterns = [
            r'^转发微博$',
            r'^分享图片$',
            r'^\[.+\]$',  # 纯表情
            r'^#.+#$',    # 纯话题
            r'抽奖|转发抽|福利|红包|优惠券',
            r'关注.*私信',
            r'广告|推广|代购',
        ]
        
        # 需要移除的内容
        self.remove_patterns = [
            r'@[\w\u4e00-\u9fff]+',  # @用户
            r'#[\w\u4e00-\u9fff]+#',  # 话题标签
            r'https?://\S+',          # 链接
            r'\[[\w\u4e00-\u9fff]+\]', # 表情
            r'展开全文',
            r'收起全文',
            r'网页链接',
            r'O网页链接',
        ]
    
    def _load_stopwords(self) -> Set[str]:
        """加载停用词表"""
        # 基础停用词
        stopwords = {
            '的', '了', '是', '在', '我', '有', '和', '就',
            '不', '人', '都', '一', '一个', '上', '也', '很',
            '到', '说', '要', '去', '你', '会', '着', '没有',
            '看', '好', '自己', '这', '那', '什么', '这个',
        }
        return stopwords
    
    def clean(self, data: RawData) -> Optional[CleanedData]:
        """
        清洗单条数据
        
        Args:
            data: 原始数据
            
        Returns:
            清洗后的数据，无效数据返回None
        """
        try:
            content = data.content
            
            # 1. 检查是否有效
            if not self._is_valid(content):
                return CleanedData(
                    id=data.id,
                    source=data.source,
                    content=content,
                    content_cleaned='',
                    publish_time=data.publish_time,
                    collect_time=data.collect_time,
                    is_valid=False,
                    invalid_reason='内容无效或为广告'
                )
            
            # 2. 清洗内容
            cleaned = self._clean_text(content)
            
            # 3. 检查清洗后长度
            if len(cleaned) < 10:
                return CleanedData(
                    id=data.id,
                    source=data.source,
                    content=content,
                    content_cleaned=cleaned,
                    publish_time=data.publish_time,
                    collect_time=data.collect_time,
                    is_valid=False,
                    invalid_reason='清洗后内容过短'
                )
            
            # 4. 分词统计
            words = list(jieba.cut(cleaned))
            word_count = len([w for w in words if w.strip() and w not in self.stopwords])
            
            # 5. 标准化位置
            location = self._normalize_location(data.location, cleaned)
            
            # 6. 构建清洗后数据
            cleaned_data = CleanedData(
                id=data.id,
                source=data.source,
                content=content,
                content_cleaned=cleaned,
                publish_time=data.publish_time,
                collect_time=data.collect_time,
                location=location,
                char_count=len(cleaned),
                word_count=word_count,
                is_valid=True
            )
            
            return cleaned_data
            
        except Exception as e:
            self.logger.error(f"清洗数据出错: {e}")
            return None
    
    def clean_batch(self, data_list: List[RawData]) -> List[CleanedData]:
        """批量清洗数据"""
        results = []
        
        for data in data_list:
            cleaned = self.clean(data)
            if cleaned:
                results.append(cleaned)
        
        self.logger.info(f"清洗完成: {len(results)}/{len(data_list)} 条有效")
        return results
    
    def _is_valid(self, text: str) -> bool:
        """检查内容是否有效"""
        if not text or len(text.strip()) < 5:
            return False
        
        for pattern in self.invalid_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return False
        
        return True
    
    def _clean_text(self, text: str) -> str:
        """清洗文本内容"""
        cleaned = text
        
        # 移除特定模式
        for pattern in self.remove_patterns:
            cleaned = re.sub(pattern, '', cleaned)
        
        # 移除多余空白
        cleaned = re.sub(r'\s+', ' ', cleaned)
        
        # 移除首尾空白
        cleaned = cleaned.strip()
        
        return cleaned
    
    def _normalize_location(self, location: Optional[Location], text: str) -> Optional[Location]:
        """标准化位置信息"""
        if location and location.city:
            return location
        
        # 尝试从文本提取位置
        # 省份
        provinces = ['河南', '湖北', '安徽', '江苏', '山东', '陕西']
        # 城市
        cities = ['信阳', '郑州', '武汉', '合肥', '南京', '济南', '西安']
        # 区县
        districts = ['浉河区', '平桥区', '羊山新区', '南湾湖']
        
        detected_province = None
        detected_city = None
        detected_district = None
        
        for p in provinces:
            if p in text:
                detected_province = p + '省'
                break
        
        for c in cities:
            if c in text:
                detected_city = c + '市'
                break
        
        for d in districts:
            if d in text:
                detected_district = d
                break
        
        if detected_province or detected_city or detected_district:
            return Location(
                province=detected_province,
                city=detected_city,
                district=detected_district
            )
        
        return location
    
    def extract_keywords(self, text: str, topK: int = 10) -> List[str]:
        """提取关键词"""
        keywords = jieba.analyse.extract_tags(text, topK=topK)
        return list(keywords)
    
    def deduplicate(self, data_list: List[CleanedData], threshold: float = 0.8) -> List[CleanedData]:
        """去重（基于内容相似度）"""
        if not data_list:
            return []
        
        unique = []
        seen_hashes = set()
        
        for data in data_list:
            # 简单哈希去重
            content_hash = hashlib.md5(data.content_cleaned.encode()).hexdigest()
            
            if content_hash not in seen_hashes:
                seen_hashes.add(content_hash)
                unique.append(data)
        
        self.logger.info(f"去重: {len(data_list)} -> {len(unique)} 条")
        return unique
