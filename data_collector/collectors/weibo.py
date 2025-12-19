# -*- coding: utf-8 -*-
"""
微博数据采集器
"""

import re
import json
from datetime import datetime
from typing import List, Dict, Any, Optional, Generator
from urllib.parse import quote

from bs4 import BeautifulSoup

from core.base import BaseCollector
from core.models import RawData, SourceType, Author, Engagement, Location


class WeiboCollector(BaseCollector):
    """微博数据采集器"""
    
    source_type = SourceType.WEIBO
    
    # API端点
    SEARCH_URL = "https://m.weibo.cn/api/container/getIndex"
    DETAIL_URL = "https://m.weibo.cn/statuses/show"
    
    def __init__(self, config=None):
        super().__init__(config)
        self.cookie = self.config.weibo.get('cookie', '')
        if self.cookie:
            self.session.headers['Cookie'] = self.cookie
    
    def collect(self, keywords: List[str], **kwargs) -> Generator[RawData, None, None]:
        """
        采集微博数据
        
        Args:
            keywords: 搜索关键词
            max_pages: 最大页数，默认10
            search_type: 搜索类型 realtime/hot
        """
        max_pages = kwargs.get('max_pages', self.config.weibo.get('max_pages', 10))
        search_types = kwargs.get('search_types', self.config.weibo.get('search_types', ['realtime']))
        delay_range = self.config.weibo.get('delay_range', [2, 5])
        
        seen_ids = set()
        
        for keyword in keywords:
            self.logger.info(f"搜索关键词: {keyword}")
            
            for search_type in search_types:
                containerid = self._get_containerid(keyword, search_type)
                
                for page in range(1, max_pages + 1):
                    self.logger.debug(f"采集第 {page} 页")
                    
                    try:
                        items = self._fetch_page(containerid, page)
                        
                        if not items:
                            self.logger.info(f"关键词 '{keyword}' 第 {page} 页无数据，停止")
                            break
                        
                        for item in items:
                            data = self.parse_item(item, keyword)
                            if data and data.id not in seen_ids:
                                seen_ids.add(data.id)
                                yield data
                        
                        self._delay(delay_range)
                        
                    except Exception as e:
                        self.logger.error(f"采集第 {page} 页出错: {e}")
                        continue
    
    def _get_containerid(self, keyword: str, search_type: str = 'realtime') -> str:
        """获取搜索容器ID"""
        encoded_keyword = quote(keyword)
        
        type_map = {
            'realtime': '61',  # 实时
            'hot': '60',       # 热门
            'user': '62',      # 用户
        }
        
        type_code = type_map.get(search_type, '61')
        return f"100103type={type_code}&q={encoded_keyword}"
    
    def _fetch_page(self, containerid: str, page: int) -> List[Dict]:
        """获取一页数据"""
        params = {
            'containerid': containerid,
            'page_type': 'searchall',
            'page': page
        }
        
        response = self._request(self.SEARCH_URL, params=params)
        data = response.json()
        
        if data.get('ok') != 1:
            self.logger.warning(f"API返回错误: {data.get('msg', 'unknown')}")
            return []
        
        cards = data.get('data', {}).get('cards', [])
        items = []
        
        for card in cards:
            if card.get('card_type') == 9:  # 微博卡片
                mblog = card.get('mblog')
                if mblog:
                    items.append(mblog)
            elif card.get('card_type') == 11:  # 卡片组
                card_group = card.get('card_group', [])
                for sub_card in card_group:
                    if sub_card.get('card_type') == 9:
                        mblog = sub_card.get('mblog')
                        if mblog:
                            items.append(mblog)
        
        return items
    
    def parse_item(self, item: Dict[str, Any], keyword: str = None) -> Optional[RawData]:
        """解析微博数据"""
        try:
            # 基础信息
            weibo_id = item.get('id') or item.get('mid')
            if not weibo_id:
                return None
            
            # 内容处理
            text = item.get('text', '')
            # 清理HTML标签
            text_clean = BeautifulSoup(text, 'lxml').get_text()
            text_clean = re.sub(r'\s+', ' ', text_clean).strip()
            
            if not text_clean:
                return None
            
            # 时间解析
            created_at = item.get('created_at', '')
            publish_time = self._parse_weibo_time(created_at)
            
            # 作者信息
            user = item.get('user', {})
            author = Author(
                id=str(user.get('id', '')),
                name=user.get('screen_name', ''),
                avatar=user.get('profile_image_url', ''),
                followers=user.get('followers_count', 0),
                verified=user.get('verified', False),
                verified_type=user.get('verified_type_ext', '')
            )
            
            # 互动数据
            engagement = Engagement(
                likes=item.get('attitudes_count', 0),
                comments=item.get('comments_count', 0),
                shares=item.get('reposts_count', 0)
            )
            
            # 位置信息
            location = None
            if 'page_info' in item and item['page_info']:
                page_info = item['page_info']
                if page_info.get('type') == 'place':
                    location = Location(
                        address=page_info.get('page_title', '')
                    )
            
            # 图片
            pics = item.get('pics', [])
            images = [pic.get('large', {}).get('url', pic.get('url', '')) for pic in pics]
            
            # 视频
            videos = []
            if 'page_info' in item and item['page_info']:
                page_info = item['page_info']
                if page_info.get('type') == 'video':
                    video_url = page_info.get('urls', {}).get('mp4_720p_mp4', '')
                    if video_url:
                        videos.append(video_url)
            
            # 构建数据对象
            data = RawData(
                id=self._generate_id('weibo', weibo_id),
                source=SourceType.WEIBO,
                source_id=str(weibo_id),
                url=f"https://m.weibo.cn/detail/{weibo_id}",
                content=text_clean,
                images=images,
                videos=videos,
                publish_time=publish_time,
                author=author,
                engagement=engagement,
                location=location,
                keywords=[keyword] if keyword else [],
                raw_json=item
            )
            
            return data
            
        except Exception as e:
            self.logger.error(f"解析微博数据出错: {e}")
            return None
    
    def _parse_weibo_time(self, time_str: str) -> datetime:
        """解析微博时间格式"""
        if not time_str:
            return datetime.now()
        
        # 微博API时间格式: "Sat Dec 14 22:30:00 +0800 2024"
        try:
            return datetime.strptime(time_str, '%a %b %d %H:%M:%S %z %Y').replace(tzinfo=None)
        except ValueError:
            pass
        
        return self._parse_time(time_str)
