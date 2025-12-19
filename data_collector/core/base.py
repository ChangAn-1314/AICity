# -*- coding: utf-8 -*-
"""
采集器基类
"""

import time
import random
import hashlib
from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Dict, Any, Optional, Generator
from tenacity import retry, stop_after_attempt, wait_exponential

import httpx
from fake_useragent import UserAgent

from .config import Config
from .logger import get_logger
from .models import RawData, SourceType


class BaseCollector(ABC):
    """采集器基类"""
    
    source_type: SourceType = None
    
    def __init__(self, config: Config = None):
        self.config = config or Config()
        self.logger = get_logger(self.__class__.__name__)
        self.ua = UserAgent()
        self.session = None
        self._init_session()
    
    def _init_session(self):
        """初始化HTTP会话"""
        request_config = self.config.request_config
        
        self.session = httpx.Client(
            timeout=request_config.get('timeout', 30),
            follow_redirects=True,
            headers=self._get_headers()
        )
        
        # 配置代理
        if self.config.get('proxy', 'enabled'):
            proxy_url = self.config.get('proxy', 'url')
            if proxy_url:
                self.session = httpx.Client(
                    timeout=request_config.get('timeout', 30),
                    follow_redirects=True,
                    headers=self._get_headers(),
                    proxy=proxy_url
                )
    
    def _get_headers(self) -> Dict[str, str]:
        """获取请求头"""
        headers = self.config.request_config.get('headers', {}).copy()
        headers['User-Agent'] = self.ua.random
        return headers
    
    def _generate_id(self, *args) -> str:
        """生成唯一ID"""
        content = '_'.join(str(a) for a in args)
        return hashlib.md5(content.encode()).hexdigest()[:16]
    
    def _delay(self, delay_range: List[int] = None):
        """随机延迟，避免被封"""
        if delay_range is None:
            delay_range = [1, 3]
        delay = random.uniform(delay_range[0], delay_range[1])
        time.sleep(delay)
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    def _request(self, url: str, method: str = 'GET', **kwargs) -> httpx.Response:
        """发送HTTP请求，带重试机制"""
        self.logger.debug(f"请求: {method} {url}")
        
        # 更新User-Agent
        if 'headers' not in kwargs:
            kwargs['headers'] = {}
        kwargs['headers']['User-Agent'] = self.ua.random
        
        response = self.session.request(method, url, **kwargs)
        response.raise_for_status()
        
        return response
    
    def _parse_time(self, time_str: str) -> datetime:
        """解析时间字符串"""
        # 常见时间格式
        formats = [
            '%Y-%m-%d %H:%M:%S',
            '%Y-%m-%d %H:%M',
            '%Y/%m/%d %H:%M:%S',
            '%Y年%m月%d日 %H:%M',
            '%m月%d日 %H:%M',
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(time_str, fmt)
            except ValueError:
                continue
        
        # 处理相对时间
        now = datetime.now()
        if '刚刚' in time_str or '秒前' in time_str:
            return now
        elif '分钟前' in time_str:
            minutes = int(''.join(filter(str.isdigit, time_str)) or 1)
            return now.replace(minute=max(0, now.minute - minutes))
        elif '小时前' in time_str:
            hours = int(''.join(filter(str.isdigit, time_str)) or 1)
            return now.replace(hour=max(0, now.hour - hours))
        elif '昨天' in time_str:
            return now.replace(day=now.day - 1)
        elif '今天' in time_str:
            return now
        
        self.logger.warning(f"无法解析时间: {time_str}")
        return now
    
    @abstractmethod
    def collect(self, keywords: List[str], **kwargs) -> Generator[RawData, None, None]:
        """
        执行采集
        
        Args:
            keywords: 搜索关键词列表
            **kwargs: 其他参数
            
        Yields:
            RawData: 采集到的原始数据
        """
        pass
    
    @abstractmethod
    def parse_item(self, item: Dict[str, Any]) -> Optional[RawData]:
        """
        解析单条数据
        
        Args:
            item: 原始数据字典
            
        Returns:
            RawData: 解析后的数据对象，解析失败返回None
        """
        pass
    
    def run(self, keywords: List[str] = None, **kwargs) -> List[RawData]:
        """
        运行采集任务
        
        Args:
            keywords: 搜索关键词，默认使用配置中的关键词
            **kwargs: 其他参数
            
        Returns:
            List[RawData]: 采集结果列表
        """
        if keywords is None:
            # 从配置获取关键词
            keywords = []
            for category, kws in self.config.keywords.items():
                keywords.extend(kws)
        
        results = []
        self.logger.info(f"开始采集，关键词: {keywords}")
        
        try:
            for data in self.collect(keywords, **kwargs):
                results.append(data)
                self.logger.debug(f"采集到: {data.id} - {data.content[:50]}...")
        except Exception as e:
            self.logger.error(f"采集出错: {e}")
            raise
        
        self.logger.info(f"采集完成，共 {len(results)} 条数据")
        return results
    
    def close(self):
        """关闭会话"""
        if self.session:
            self.session.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
