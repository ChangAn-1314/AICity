# -*- coding: utf-8 -*-
"""
异步采集器基类 - 高性能并发采集
"""

import asyncio
import random
import hashlib
from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Dict, Any, Optional, AsyncGenerator
from tenacity import retry, stop_after_attempt, wait_exponential

import aiohttp
from fake_useragent import UserAgent

from .config import Config
from .logger import get_logger
from .models import RawData, SourceType


class AsyncBaseCollector(ABC):
    """异步采集器基类"""
    
    source_type: SourceType = None
    
    def __init__(self, config: Config = None):
        self.config = config or Config()
        self.logger = get_logger(self.__class__.__name__)
        self.ua = UserAgent()
        self.session: Optional[aiohttp.ClientSession] = None
        
        # 并发控制
        self.semaphore: Optional[asyncio.Semaphore] = None
        self.max_concurrent = 10  # 最大并发数
        
        # 智能限速
        self.request_count = 0
        self.error_count = 0
        self.last_request_time = 0
        self.adaptive_delay = 1.0  # 自适应延迟(秒)
        
        # 代理池
        self.proxy_pool: List[str] = []
        self.proxy_index = 0
    
    async def __aenter__(self):
        await self._init_session()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()
    
    async def _init_session(self):
        """初始化异步会话"""
        timeout = aiohttp.ClientTimeout(total=self.config.request_config.get('timeout', 30))
        
        connector = aiohttp.TCPConnector(
            limit=self.max_concurrent,
            limit_per_host=5,
            enable_cleanup_closed=True
        )
        
        self.session = aiohttp.ClientSession(
            timeout=timeout,
            connector=connector,
            headers=self._get_headers()
        )
        
        self.semaphore = asyncio.Semaphore(self.max_concurrent)
        
        # 加载代理池
        await self._load_proxy_pool()
    
    async def _load_proxy_pool(self):
        """加载代理池"""
        if self.config.get('proxy', 'enabled'):
            pool_api = self.config.get('proxy', 'pool_api')
            if pool_api:
                try:
                    async with self.session.get(pool_api) as resp:
                        data = await resp.json()
                        self.proxy_pool = data.get('proxies', [])
                        self.logger.info(f"加载 {len(self.proxy_pool)} 个代理")
                except Exception as e:
                    self.logger.warning(f"加载代理池失败: {e}")
            
            # 单个代理
            single_proxy = self.config.get('proxy', 'url')
            if single_proxy and single_proxy not in self.proxy_pool:
                self.proxy_pool.append(single_proxy)
    
    def _get_proxy(self) -> Optional[str]:
        """获取代理（轮换）"""
        if not self.proxy_pool:
            return None
        
        proxy = self.proxy_pool[self.proxy_index % len(self.proxy_pool)]
        self.proxy_index += 1
        return proxy
    
    def _get_headers(self) -> Dict[str, str]:
        """获取请求头"""
        headers = self.config.request_config.get('headers', {}).copy()
        headers['User-Agent'] = self.ua.random
        return headers
    
    def _generate_id(self, *args) -> str:
        """生成唯一ID"""
        content = '_'.join(str(a) for a in args)
        return hashlib.md5(content.encode()).hexdigest()[:16]
    
    async def _adaptive_delay(self):
        """自适应延迟 - 根据错误率动态调整"""
        # 计算错误率
        if self.request_count > 10:
            error_rate = self.error_count / self.request_count
            
            if error_rate > 0.3:
                # 错误率高，增加延迟
                self.adaptive_delay = min(self.adaptive_delay * 1.5, 10.0)
                self.logger.warning(f"错误率高({error_rate:.1%})，延迟增加到 {self.adaptive_delay:.1f}s")
            elif error_rate < 0.05 and self.adaptive_delay > 0.5:
                # 错误率低，减少延迟
                self.adaptive_delay = max(self.adaptive_delay * 0.8, 0.5)
        
        # 添加随机抖动
        delay = self.adaptive_delay * (0.8 + random.random() * 0.4)
        await asyncio.sleep(delay)
    
    async def _request(self, url: str, method: str = 'GET', 
                       retry_count: int = 3, **kwargs) -> Optional[aiohttp.ClientResponse]:
        """发送异步HTTP请求，带重试和限流"""
        async with self.semaphore:
            for attempt in range(retry_count):
                try:
                    # 更新请求头
                    headers = kwargs.pop('headers', {})
                    headers['User-Agent'] = self.ua.random
                    
                    # 获取代理
                    proxy = self._get_proxy()
                    
                    self.logger.debug(f"请求: {method} {url} (尝试 {attempt + 1})")
                    
                    async with self.session.request(
                        method, url, 
                        headers=headers,
                        proxy=proxy,
                        **kwargs
                    ) as response:
                        self.request_count += 1
                        
                        if response.status == 200:
                            return response
                        elif response.status == 429:
                            # 被限速，增加延迟
                            self.error_count += 1
                            self.adaptive_delay = min(self.adaptive_delay * 2, 30.0)
                            self.logger.warning(f"被限速(429)，延迟增加到 {self.adaptive_delay:.1f}s")
                            await asyncio.sleep(self.adaptive_delay)
                        elif response.status >= 400:
                            self.error_count += 1
                            self.logger.warning(f"请求失败: {response.status}")
                        
                        response.raise_for_status()
                        return response
                        
                except aiohttp.ClientError as e:
                    self.error_count += 1
                    self.logger.warning(f"请求异常 (尝试 {attempt + 1}): {e}")
                    
                    if attempt < retry_count - 1:
                        await asyncio.sleep(2 ** attempt)  # 指数退避
                    
                except Exception as e:
                    self.error_count += 1
                    self.logger.error(f"未知错误: {e}")
                    break
            
            return None
    
    async def _request_json(self, url: str, **kwargs) -> Optional[Dict]:
        """请求并返回JSON"""
        try:
            headers = kwargs.pop('headers', {})
            headers['User-Agent'] = self.ua.random
            proxy = self._get_proxy()
            
            async with self.semaphore:
                async with self.session.get(url, headers=headers, proxy=proxy, **kwargs) as response:
                    self.request_count += 1
                    if response.status == 200:
                        return await response.json()
                    else:
                        self.error_count += 1
                        return None
        except Exception as e:
            self.error_count += 1
            self.logger.error(f"请求JSON失败: {e}")
            return None
    
    async def _request_text(self, url: str, **kwargs) -> Optional[str]:
        """请求并返回文本"""
        try:
            headers = kwargs.pop('headers', {})
            headers['User-Agent'] = self.ua.random
            proxy = self._get_proxy()
            
            async with self.semaphore:
                async with self.session.get(url, headers=headers, proxy=proxy, **kwargs) as response:
                    self.request_count += 1
                    if response.status == 200:
                        return await response.text()
                    else:
                        self.error_count += 1
                        return None
        except Exception as e:
            self.error_count += 1
            self.logger.error(f"请求文本失败: {e}")
            return None
    
    def _parse_time(self, time_str: str) -> datetime:
        """解析时间字符串"""
        if not time_str:
            return datetime.now()
            
        formats = [
            '%Y-%m-%d %H:%M:%S',
            '%Y-%m-%d %H:%M',
            '%Y/%m/%d %H:%M:%S',
            '%Y年%m月%d日 %H:%M',
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(time_str, fmt)
            except ValueError:
                continue
        
        # 相对时间处理
        now = datetime.now()
        if '刚刚' in time_str or '秒前' in time_str:
            return now
        elif '分钟前' in time_str:
            minutes = int(''.join(filter(str.isdigit, time_str)) or 1)
            return now.replace(minute=max(0, now.minute - minutes))
        elif '小时前' in time_str:
            hours = int(''.join(filter(str.isdigit, time_str)) or 1)
            return now.replace(hour=max(0, now.hour - hours))
        
        return now
    
    @abstractmethod
    async def collect(self, keywords: List[str], **kwargs) -> AsyncGenerator[RawData, None]:
        """执行异步采集"""
        pass
    
    @abstractmethod
    async def parse_item(self, item: Dict[str, Any]) -> Optional[RawData]:
        """解析单条数据"""
        pass
    
    async def run(self, keywords: List[str] = None, **kwargs) -> List[RawData]:
        """运行异步采集任务"""
        if keywords is None:
            keywords = []
            for category, kws in self.config.keywords.items():
                keywords.extend(kws)
        
        results = []
        self.logger.info(f"开始异步采集，关键词: {keywords}")
        
        try:
            async for data in self.collect(keywords, **kwargs):
                results.append(data)
                
                # 自适应延迟
                await self._adaptive_delay()
                
        except Exception as e:
            self.logger.error(f"采集出错: {e}")
            raise
        
        self.logger.info(f"采集完成: {len(results)} 条, 请求: {self.request_count}, 错误: {self.error_count}")
        return results
    
    async def run_batch(self, keywords: List[str], batch_size: int = 5) -> List[RawData]:
        """批量并发采集多个关键词"""
        all_results = []
        
        # 分批处理关键词
        for i in range(0, len(keywords), batch_size):
            batch = keywords[i:i + batch_size]
            
            # 并发采集
            tasks = [self._collect_keyword(kw) for kw in batch]
            batch_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for result in batch_results:
                if isinstance(result, list):
                    all_results.extend(result)
                elif isinstance(result, Exception):
                    self.logger.error(f"批量采集异常: {result}")
        
        return all_results
    
    async def _collect_keyword(self, keyword: str) -> List[RawData]:
        """采集单个关键词"""
        results = []
        async for data in self.collect([keyword]):
            results.append(data)
        return results
    
    async def close(self):
        """关闭会话"""
        if self.session:
            await self.session.close()
            self.logger.info(f"会话已关闭 (请求: {self.request_count}, 错误: {self.error_count})")
    
    def get_stats(self) -> Dict[str, Any]:
        """获取采集统计"""
        error_rate = self.error_count / max(self.request_count, 1)
        return {
            'request_count': self.request_count,
            'error_count': self.error_count,
            'error_rate': f"{error_rate:.1%}",
            'adaptive_delay': f"{self.adaptive_delay:.2f}s",
            'proxy_count': len(self.proxy_pool)
        }
