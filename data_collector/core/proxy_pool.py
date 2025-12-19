# -*- coding: utf-8 -*-
"""
代理池管理
"""

import asyncio
import random
from typing import List, Optional, Dict
from dataclasses import dataclass, field
from datetime import datetime, timedelta

import aiohttp

from .logger import get_logger


@dataclass
class Proxy:
    """代理信息"""
    url: str
    protocol: str = "http"
    success_count: int = 0
    fail_count: int = 0
    last_used: datetime = field(default_factory=datetime.now)
    last_check: datetime = field(default_factory=datetime.now)
    response_time: float = 0.0
    is_valid: bool = True
    
    @property
    def score(self) -> float:
        """计算代理评分（越高越好）"""
        total = self.success_count + self.fail_count
        if total == 0:
            return 50.0
        
        success_rate = self.success_count / total
        # 综合成功率和响应时间
        time_score = max(0, 100 - self.response_time * 10)
        return success_rate * 70 + time_score * 0.3


class ProxyPool:
    """代理池管理器"""
    
    def __init__(self):
        self.logger = get_logger('ProxyPool')
        self.proxies: Dict[str, Proxy] = {}
        self._lock = asyncio.Lock()
        
        # 免费代理API（示例）
        self.free_proxy_apis = [
            "https://proxylist.geonode.com/api/proxy-list?limit=50&page=1&sort_by=lastChecked&sort_type=desc",
        ]
    
    async def add_proxy(self, url: str, protocol: str = "http"):
        """添加代理"""
        async with self._lock:
            if url not in self.proxies:
                self.proxies[url] = Proxy(url=url, protocol=protocol)
                self.logger.debug(f"添加代理: {url}")
    
    async def add_proxies(self, urls: List[str], protocol: str = "http"):
        """批量添加代理"""
        for url in urls:
            await self.add_proxy(url, protocol)
    
    async def get_proxy(self) -> Optional[str]:
        """获取一个可用代理（基于评分）"""
        async with self._lock:
            valid_proxies = [p for p in self.proxies.values() if p.is_valid]
            
            if not valid_proxies:
                return None
            
            # 按评分排序，取前30%中随机选择
            valid_proxies.sort(key=lambda p: p.score, reverse=True)
            top_count = max(1, len(valid_proxies) // 3)
            selected = random.choice(valid_proxies[:top_count])
            
            selected.last_used = datetime.now()
            return selected.url
    
    async def report_success(self, proxy_url: str, response_time: float = 0.0):
        """报告代理成功"""
        async with self._lock:
            if proxy_url in self.proxies:
                proxy = self.proxies[proxy_url]
                proxy.success_count += 1
                proxy.response_time = (proxy.response_time + response_time) / 2
                proxy.is_valid = True
    
    async def report_failure(self, proxy_url: str):
        """报告代理失败"""
        async with self._lock:
            if proxy_url in self.proxies:
                proxy = self.proxies[proxy_url]
                proxy.fail_count += 1
                
                # 失败率过高标记为无效
                total = proxy.success_count + proxy.fail_count
                if total >= 5 and proxy.fail_count / total > 0.5:
                    proxy.is_valid = False
                    self.logger.warning(f"代理标记为无效: {proxy_url}")
    
    async def check_proxy(self, proxy_url: str, timeout: int = 10) -> bool:
        """检测代理是否可用"""
        test_url = "http://httpbin.org/ip"
        
        try:
            start = datetime.now()
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    test_url, 
                    proxy=proxy_url, 
                    timeout=aiohttp.ClientTimeout(total=timeout)
                ) as response:
                    if response.status == 200:
                        elapsed = (datetime.now() - start).total_seconds()
                        await self.report_success(proxy_url, elapsed)
                        return True
        except Exception as e:
            self.logger.debug(f"代理检测失败 {proxy_url}: {e}")
        
        await self.report_failure(proxy_url)
        return False
    
    async def check_all(self, concurrency: int = 10):
        """并发检测所有代理"""
        self.logger.info(f"开始检测 {len(self.proxies)} 个代理...")
        
        semaphore = asyncio.Semaphore(concurrency)
        
        async def check_with_limit(proxy_url):
            async with semaphore:
                return await self.check_proxy(proxy_url)
        
        tasks = [check_with_limit(url) for url in self.proxies.keys()]
        results = await asyncio.gather(*tasks)
        
        valid_count = sum(1 for r in results if r)
        self.logger.info(f"代理检测完成: {valid_count}/{len(self.proxies)} 可用")
    
    async def load_free_proxies(self):
        """从免费API加载代理"""
        for api_url in self.free_proxy_apis:
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(api_url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                        if response.status == 200:
                            data = await response.json()
                            proxies = data.get('data', [])
                            
                            for p in proxies:
                                ip = p.get('ip')
                                port = p.get('port')
                                protocols = p.get('protocols', ['http'])
                                
                                if ip and port:
                                    protocol = protocols[0] if protocols else 'http'
                                    proxy_url = f"{protocol}://{ip}:{port}"
                                    await self.add_proxy(proxy_url, protocol)
                            
                            self.logger.info(f"从 {api_url} 加载 {len(proxies)} 个代理")
                            
            except Exception as e:
                self.logger.warning(f"加载免费代理失败: {e}")
    
    def get_statistics(self) -> Dict:
        """获取代理池统计"""
        valid = sum(1 for p in self.proxies.values() if p.is_valid)
        avg_score = sum(p.score for p in self.proxies.values()) / max(len(self.proxies), 1)
        
        return {
            'total': len(self.proxies),
            'valid': valid,
            'invalid': len(self.proxies) - valid,
            'avg_score': f"{avg_score:.1f}"
        }
    
    async def cleanup_invalid(self):
        """清理无效代理"""
        async with self._lock:
            invalid = [url for url, p in self.proxies.items() if not p.is_valid]
            for url in invalid:
                del self.proxies[url]
            
            if invalid:
                self.logger.info(f"清理 {len(invalid)} 个无效代理")
