# -*- coding: utf-8 -*-
"""
政务数据采集器 - 12345热线、政务公开等
"""

import re
from datetime import datetime
from typing import List, Dict, Any, Optional, Generator
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from core.base import BaseCollector
from core.models import RawData, SourceType, Location


class GovCollector(BaseCollector):
    """政务数据采集器"""
    
    source_type = SourceType.GOV
    
    # 政务数据源
    GOV_SOURCES = {
        'xinyang': {
            'name': '信阳市政府',
            'base_url': 'http://www.xinyang.gov.cn',
            'news_url': '/zwgk/zfxxgkml/',
            'complaint_url': '/hdjl/ywzs/'
        },
        'henan': {
            'name': '河南省政府',
            'base_url': 'https://www.henan.gov.cn',
            'news_url': '/zwgk/',
        }
    }
    
    def __init__(self, config=None):
        super().__init__(config)
    
    def collect(self, keywords: List[str], **kwargs) -> Generator[RawData, None, None]:
        """采集政务数据"""
        sources = kwargs.get('sources', ['xinyang'])
        max_items = kwargs.get('max_items', 100)
        delay_range = kwargs.get('delay_range', [1, 3])
        
        count = 0
        
        for source_name in sources:
            if count >= max_items:
                break
                
            source = self.GOV_SOURCES.get(source_name)
            if not source:
                continue
            
            self.logger.info(f"采集政务数据: {source['name']}")
            
            try:
                # 采集政务公开
                if 'news_url' in source:
                    for item in self._collect_gov_news(source, keywords):
                        if count >= max_items:
                            break
                        count += 1
                        yield item
                        self._delay(delay_range)
                
                # 采集投诉建议
                if 'complaint_url' in source:
                    for item in self._collect_complaints(source, keywords):
                        if count >= max_items:
                            break
                        count += 1
                        yield item
                        self._delay(delay_range)
                        
            except Exception as e:
                self.logger.error(f"采集 {source['name']} 出错: {e}")
                continue
    
    def _collect_gov_news(self, source: Dict, keywords: List[str]) -> Generator[RawData, None, None]:
        """采集政务公开信息"""
        base_url = source['base_url']
        news_url = urljoin(base_url, source['news_url'])
        
        try:
            response = self._request(news_url)
            soup = BeautifulSoup(response.text, 'lxml')
            
            # 查找新闻列表
            items = soup.select('.news-list li, .list-item, .zwgk-list li, ul.list li')
            
            for item in items:
                try:
                    link = item.select_one('a')
                    if not link:
                        continue
                    
                    title = link.get_text(strip=True)
                    url = urljoin(base_url, link.get('href', ''))
                    
                    # 检查关键词匹配
                    if not self._match_keywords(title, keywords):
                        continue
                    
                    # 日期
                    date_elem = item.select_one('.date, .time, span')
                    date_str = date_elem.get_text(strip=True) if date_elem else ''
                    
                    data = self.parse_item({
                        'title': title,
                        'url': url,
                        'date': date_str,
                        'source_name': source['name'],
                        'type': 'gov_news'
                    })
                    
                    if data:
                        yield data
                        
                except Exception as e:
                    self.logger.debug(f"解析政务新闻项出错: {e}")
                    continue
                    
        except Exception as e:
            self.logger.error(f"采集政务新闻出错: {e}")
    
    def _collect_complaints(self, source: Dict, keywords: List[str]) -> Generator[RawData, None, None]:
        """采集投诉建议数据"""
        base_url = source['base_url']
        complaint_url = urljoin(base_url, source.get('complaint_url', ''))
        
        if not complaint_url:
            return
        
        try:
            response = self._request(complaint_url)
            soup = BeautifulSoup(response.text, 'lxml')
            
            # 查找投诉列表
            items = soup.select('.complaint-list li, .ywzs-list li, table tr')
            
            for item in items:
                try:
                    # 标题/内容
                    title_elem = item.select_one('a, .title, td:first-child')
                    if not title_elem:
                        continue
                    
                    title = title_elem.get_text(strip=True)
                    url = ''
                    if title_elem.name == 'a':
                        url = urljoin(base_url, title_elem.get('href', ''))
                    
                    # 检查关键词
                    if not self._match_keywords(title, keywords):
                        continue
                    
                    # 状态
                    status_elem = item.select_one('.status, .state, td:last-child')
                    status = status_elem.get_text(strip=True) if status_elem else ''
                    
                    # 日期
                    date_elem = item.select_one('.date, .time')
                    date_str = date_elem.get_text(strip=True) if date_elem else ''
                    
                    data = self.parse_item({
                        'title': title,
                        'url': url,
                        'date': date_str,
                        'status': status,
                        'source_name': source['name'],
                        'type': 'complaint'
                    })
                    
                    if data:
                        yield data
                        
                except Exception as e:
                    self.logger.debug(f"解析投诉项出错: {e}")
                    continue
                    
        except Exception as e:
            self.logger.error(f"采集投诉数据出错: {e}")
    
    def _match_keywords(self, text: str, keywords: List[str]) -> bool:
        """检查文本是否匹配关键词"""
        if not keywords:
            return True
        text_lower = text.lower()
        return any(kw.lower() in text_lower for kw in keywords)
    
    def parse_item(self, item: Dict[str, Any], keyword: str = None) -> Optional[RawData]:
        """解析政务数据"""
        try:
            title = item.get('title', '')
            url = item.get('url', '')
            
            if not title:
                return None
            
            # 时间解析
            date_str = item.get('date', '')
            publish_time = self._parse_time(date_str) if date_str else datetime.now()
            
            # 位置信息
            location = Location(
                province=self.config.target.get('province', '河南省'),
                city=self.config.target.get('city', '信阳市')
            )
            
            # 内容
            content = title
            if item.get('status'):
                content += f"\n状态: {item['status']}"
            
            data = RawData(
                id=self._generate_id('gov', url or title),
                source=SourceType.GOV,
                source_id=url,
                url=url,
                title=title,
                content=content,
                publish_time=publish_time,
                location=location,
                keywords=[keyword] if keyword else [],
                raw_json=item
            )
            
            return data
            
        except Exception as e:
            self.logger.error(f"解析政务数据出错: {e}")
            return None
