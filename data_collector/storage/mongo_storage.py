# -*- coding: utf-8 -*-
"""
MongoDB存储模块
"""

from typing import List, Dict, Optional, Any
from datetime import datetime

try:
    from pymongo import MongoClient
    from pymongo.collection import Collection
    MONGO_AVAILABLE = True
except ImportError:
    MONGO_AVAILABLE = False

from core.models import RawData, CleanedData
from core.config import Config
from core.logger import get_logger


class MongoStorage:
    """MongoDB存储器"""
    
    def __init__(self, config: Config = None):
        self.config = config or Config()
        self.logger = get_logger('MongoStorage')
        
        if not MONGO_AVAILABLE:
            self.logger.warning("pymongo未安装，MongoDB存储不可用")
            self.client = None
            self.db = None
            return
        
        # 连接配置
        mongo_config = self.config.storage.get('mongodb', {})
        host = mongo_config.get('host', 'localhost')
        port = mongo_config.get('port', 27017)
        database = mongo_config.get('database', 'aicity_data')
        
        try:
            self.client = MongoClient(host, port)
            self.db = self.client[database]
            self.logger.info(f"MongoDB连接成功: {host}:{port}/{database}")
        except Exception as e:
            self.logger.error(f"MongoDB连接失败: {e}")
            self.client = None
            self.db = None
    
    def _get_collection(self, name: str) -> Optional[Collection]:
        """获取集合"""
        if self.db is None:
            return None
        return self.db[name]
    
    def save_raw(self, data: List[RawData]) -> int:
        """保存原始数据"""
        collection = self._get_collection('raw_data')
        if collection is None:
            return 0
        
        documents = []
        for item in data:
            doc = item.model_dump(exclude_none=True)
            doc['_id'] = item.id  # 使用自定义ID
            documents.append(doc)
        
        try:
            # 使用upsert避免重复
            count = 0
            for doc in documents:
                result = collection.update_one(
                    {'_id': doc['_id']},
                    {'$set': doc},
                    upsert=True
                )
                if result.upserted_id or result.modified_count:
                    count += 1
            
            self.logger.info(f"保存 {count} 条原始数据到MongoDB")
            return count
            
        except Exception as e:
            self.logger.error(f"保存原始数据失败: {e}")
            return 0
    
    def save_cleaned(self, data: List[CleanedData]) -> int:
        """保存清洗后的数据"""
        collection = self._get_collection('cleaned_data')
        if collection is None:
            return 0
        
        documents = []
        for item in data:
            doc = item.model_dump(exclude_none=True)
            doc['_id'] = item.id
            documents.append(doc)
        
        try:
            count = 0
            for doc in documents:
                result = collection.update_one(
                    {'_id': doc['_id']},
                    {'$set': doc},
                    upsert=True
                )
                if result.upserted_id or result.modified_count:
                    count += 1
            
            self.logger.info(f"保存 {count} 条清洗数据到MongoDB")
            return count
            
        except Exception as e:
            self.logger.error(f"保存清洗数据失败: {e}")
            return 0
    
    def find(self, collection_name: str, query: Dict = None, 
             limit: int = 100, skip: int = 0) -> List[Dict]:
        """查询数据"""
        collection = self._get_collection(collection_name)
        if collection is None:
            return []
        
        query = query or {}
        
        try:
            cursor = collection.find(query).skip(skip).limit(limit)
            return list(cursor)
        except Exception as e:
            self.logger.error(f"查询失败: {e}")
            return []
    
    def count(self, collection_name: str, query: Dict = None) -> int:
        """统计数量"""
        collection = self._get_collection(collection_name)
        if collection is None:
            return 0
        
        query = query or {}
        
        try:
            return collection.count_documents(query)
        except Exception as e:
            self.logger.error(f"统计失败: {e}")
            return 0
    
    def aggregate(self, collection_name: str, pipeline: List[Dict]) -> List[Dict]:
        """聚合查询"""
        collection = self._get_collection(collection_name)
        if collection is None:
            return []
        
        try:
            return list(collection.aggregate(pipeline))
        except Exception as e:
            self.logger.error(f"聚合查询失败: {e}")
            return []
    
    def get_statistics(self) -> Dict[str, Any]:
        """获取统计信息"""
        stats = {
            'raw_data': {
                'total': self.count('raw_data'),
                'by_source': [],
                'by_date': []
            },
            'cleaned_data': {
                'total': self.count('cleaned_data'),
                'valid': self.count('cleaned_data', {'is_valid': True}),
                'by_category': [],
                'by_sentiment': []
            }
        }
        
        # 按来源统计
        pipeline = [
            {'$group': {'_id': '$source', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}}
        ]
        stats['raw_data']['by_source'] = self.aggregate('raw_data', pipeline)
        
        # 按分类统计
        pipeline = [
            {'$match': {'is_valid': True}},
            {'$group': {'_id': '$annotation.category', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}}
        ]
        stats['cleaned_data']['by_category'] = self.aggregate('cleaned_data', pipeline)
        
        # 按情感统计
        pipeline = [
            {'$match': {'is_valid': True}},
            {'$group': {'_id': '$annotation.sentiment', 'count': {'$sum': 1}}}
        ]
        stats['cleaned_data']['by_sentiment'] = self.aggregate('cleaned_data', pipeline)
        
        return stats
    
    def close(self):
        """关闭连接"""
        if self.client:
            self.client.close()
            self.logger.info("MongoDB连接已关闭")
