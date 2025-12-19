# -*- coding: utf-8 -*-
"""
异步微博采集器 - 高性能并发版本
"""

import re
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional, AsyncGenerator
from urllib.parse import quote

from bs4 import BeautifulSoup

from core.async_base import AsyncBaseCollector
from core.models import RawData, SourceType, Author, Engagement, Location


class AsyncWeiboCollector(AsyncBaseCollector):
    """异步微博采集器"""
    
    source_type = SourceType.WEIBO
    
    SEARCH_URL = "https://m.weibo.cn/api/container/getIndex"
    
    def __init__(self, config=None):
        super().__init__(config)
        self.cookie = self.config.weibo.get('cookie', '')
        self.max_concurrent = 3  # 微博限制并发数，降低以避免被封
        
        # 微博专用请求头
        self.weibo_headers = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Referer': 'https://m.weibo.cn/search',
            'X-Requested-With': 'XMLHttpRequest',
            'MWeibo-Pwa': '1',
        }
    
    async def _init_session(self):
        """初始化会话，添加Cookie"""
        await super()._init_session()
        
        # 将Cookie直接添加到请求头中
        if self.cookie:
            self.weibo_headers['Cookie'] = self.cookie
            self.logger.info(f"已设置Cookie到请求头 (长度: {len(self.cookie)})")
    
    async def collect(self, keywords: List[str], **kwargs) -> AsyncGenerator[RawData, None]:
        """异步采集微博数据"""
        max_pages = kwargs.get('max_pages', self.config.weibo.get('max_pages', 10))
        search_types = kwargs.get('search_types', self.config.weibo.get('search_types', ['realtime']))
        
        seen_ids = set()
        
        for keyword in keywords:
            self.logger.info(f"搜索关键词: {keyword}")
            
            for search_type in search_types:
                containerid = self._get_containerid(keyword, search_type)
                
                # 串行获取，避免触发反爬虫
                for page in range(1, max_pages + 1):
                    page_items = await self._fetch_page(containerid, page)
                    
                    if not page_items:
                        # 空页面，可能已到末尾或被限制
                        if page > 1:
                            break
                        continue
                    
                    for item in page_items:
                        data = await self.parse_item(item, keyword)
                        if data and data.id not in seen_ids:
                            seen_ids.add(data.id)
                            yield data
                    
                    # 页间延迟，避免请求过快
                    await asyncio.sleep(0.5)
    
    def _get_containerid(self, keyword: str, search_type: str = 'realtime') -> str:
        """获取搜索容器ID"""
        encoded_keyword = quote(keyword)
        type_map = {'realtime': '61', 'hot': '60', 'user': '62'}
        type_code = type_map.get(search_type, '61')
        return f"100103type={type_code}&q={encoded_keyword}"
    
    async def _fetch_page(self, containerid: str, page: int) -> List[Dict]:
        """异步获取一页数据"""
        url = f"{self.SEARCH_URL}?containerid={containerid}&page_type=searchall&page={page}"
        
        # 使用微博专用请求头
        headers = self.weibo_headers.copy()
        headers['User-Agent'] = self.ua.random
        
        data = None
        try:
            async with self.semaphore:
                async with self.session.get(url, headers=headers) as response:
                    self.request_count += 1
                    if response.status == 200:
                        content_type = response.headers.get('Content-Type', '')
                        if 'json' in content_type:
                            data = await response.json(content_type=None)
                        else:
                            text = await response.text()
                            if 'passport' in text or 'login' in text.lower():
                                self.logger.warning(f"需要更新Cookie，当前Cookie已失效")
                            else:
                                self.logger.debug(f"非JSON响应: {text[:200]}")
                            self.error_count += 1
                            return []
                    elif response.status == 418:
                        # 反爬虫限制，需要退避
                        self.logger.warning(f"HTTP 418 反爬虫限制，等待退避...")
                        self.error_count += 1
                        await asyncio.sleep(3)  # 退避3秒
                        return []
                    else:
                        self.logger.warning(f"HTTP {response.status}")
                        self.error_count += 1
                        return []
        except Exception as e:
            self.error_count += 1
            self.logger.error(f"请求失败: {e}")
            return []
        
        if not data:
            return []
        
        if data.get('ok') != 1:
            msg = data.get('msg', '')
            self.logger.warning(f"API返回: ok={data.get('ok')}, msg={msg}")
            return []
        
        cards = data.get('data', {}).get('cards', [])
        if page == 1:
            self.logger.info(f"API返回: ok=1, cards={len(cards)}, keys={list(data.get('data', {}).keys())}")
        items = []
        
        for card in cards:
            if card.get('card_type') == 9:
                mblog = card.get('mblog')
                if mblog:
                    items.append(mblog)
            elif card.get('card_type') == 11:
                for sub_card in card.get('card_group', []):
                    if sub_card.get('card_type') == 9:
                        mblog = sub_card.get('mblog')
                        if mblog:
                            items.append(mblog)
        
        return items
    
    async def parse_item(self, item: Dict[str, Any], keyword: str = None) -> Optional[RawData]:
        """解析微博数据"""
        try:
            weibo_id = item.get('id') or item.get('mid')
            if not weibo_id:
                return None
            
            # 内容
            text = item.get('text', '')
            text_clean = BeautifulSoup(text, 'lxml').get_text()
            text_clean = re.sub(r'\s+', ' ', text_clean).strip()
            
            if not text_clean:
                return None
            
            # 时间
            created_at = item.get('created_at', '')
            publish_time = self._parse_weibo_time(created_at)
            
            # 作者
            user = item.get('user', {})
            followers_raw = user.get('followers_count', 0)
            followers = self._parse_count(followers_raw)
            
            author = Author(
                id=str(user.get('id', '')),
                name=user.get('screen_name', ''),
                avatar=user.get('profile_image_url', ''),
                followers=followers,
                verified=user.get('verified', False)
            )
            
            # 互动
            engagement = Engagement(
                likes=item.get('attitudes_count', 0),
                comments=item.get('comments_count', 0),
                shares=item.get('reposts_count', 0)
            )
            
            # 图片
            pics = item.get('pics', [])
            images = [pic.get('large', {}).get('url', pic.get('url', '')) for pic in pics]
            
            return RawData(
                id=self._generate_id('weibo', weibo_id),
                source=SourceType.WEIBO,
                source_id=str(weibo_id),
                url=f"https://m.weibo.cn/detail/{weibo_id}",
                content=text_clean,
                images=images,
                publish_time=publish_time,
                author=author,
                engagement=engagement,
                keywords=[keyword] if keyword else [],
                raw_json=item
            )
            
        except Exception as e:
            self.logger.error(f"解析微博数据出错: {e}")
            return None
    
    def _parse_count(self, value) -> int:
        """解析数量（处理 '1.5万'、'27.4万' 等格式）"""
        if isinstance(value, int):
            return value
        if not value:
            return 0
        
        value_str = str(value).strip()
        
        try:
            # 尝试直接转换
            return int(value_str)
        except ValueError:
            pass
        
        # 处理中文数字单位
        multipliers = {'万': 10000, '亿': 100000000}
        
        for unit, mult in multipliers.items():
            if unit in value_str:
                num_str = value_str.replace(unit, '').strip()
                try:
                    return int(float(num_str) * mult)
                except ValueError:
                    pass
        
        return 0
    
    def _parse_weibo_time(self, time_str: str) -> datetime:
        """解析微博时间"""
        if not time_str:
            return datetime.now()
        
        try:
            return datetime.strptime(time_str, '%a %b %d %H:%M:%S %z %Y').replace(tzinfo=None)
        except ValueError:
            pass
        
        return self._parse_time(time_str)
