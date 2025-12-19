# -*- coding: utf-8 -*-
"""
新闻数据采集器
"""

import re
from datetime import datetime
from typing import List, Dict, Any, Optional, Generator
from urllib.parse import quote, urljoin

from bs4 import BeautifulSoup

from core.base import BaseCollector
from core.models import RawData, SourceType, Engagement


class NewsCollector(BaseCollector):
    """新闻数据采集器"""
    
    source_type = SourceType.NEWS
    
    # 新闻源配置
    NEWS_SOURCES = {
        'baidu': {
            'name': '百度新闻',
            'search_url': 'https://www.baidu.com/s',
            'params': lambda q: {'wd': q, 'tn': 'news', 'rtt': '1', 'bsst': '1'}
        },
        'sogou': {
            'name': '搜狗新闻',
            'search_url': 'https://news.sogou.com/news',
            'params': lambda q: {'query': q, 'sort': '1'}
        },
        'toutiao': {
            'name': '今日头条',
            'search_url': 'https://so.toutiao.com/search',
            'params': lambda q: {'keyword': q, 'pd': 'information'}
        }
    }
    
    def __init__(self, config=None):
        super().__init__(config)
        self.sources = self.config.news.get('sources', [])
    
    def collect(self, keywords: List[str], **kwargs) -> Generator[RawData, None, None]:
        """采集新闻数据"""
        max_articles = kwargs.get('max_articles', self.config.news.get('max_articles', 100))
        delay_range = self.config.news.get('delay_range', [1, 3])
        sources = kwargs.get('sources', ['baidu'])
        
        seen_urls = set()
        count = 0
        
        for keyword in keywords:
            if count >= max_articles:
                break
                
            self.logger.info(f"搜索新闻关键词: {keyword}")
            
            for source_name in sources:
                if count >= max_articles:
                    break
                    
                source = self.NEWS_SOURCES.get(source_name)
                if not source:
                    continue
                
                try:
                    items = self._search_news(source, keyword)
                    
                    for item in items:
                        if count >= max_articles:
                            break
                            
                        if item.get('url') in seen_urls:
                            continue
                        
                        data = self.parse_item(item, keyword)
                        if data:
                            seen_urls.add(item.get('url'))
                            count += 1
                            yield data
                    
                    self._delay(delay_range)
                    
                except Exception as e:
                    self.logger.error(f"采集 {source['name']} 出错: {e}")
                    continue
    
    def _search_news(self, source: Dict, keyword: str) -> List[Dict]:
        """搜索新闻"""
        url = source['search_url']
        params = source['params'](keyword)
        
        response = self._request(url, params=params)
        html = response.text
        
        # 根据来源解析
        if 'baidu' in url:
            return self._parse_baidu_results(html)
        elif 'sogou' in url:
            return self._parse_sogou_results(html)
        else:
            return self._parse_generic_results(html)
    
    def _parse_baidu_results(self, html: str) -> List[Dict]:
        """解析百度新闻结果"""
        soup = BeautifulSoup(html, 'lxml')
        results = []
        
        # 新闻结果容器
        items = soup.select('.result-op, .result')
        
        for item in items:
            try:
                title_elem = item.select_one('h3 a, .c-title a')
                if not title_elem:
                    continue
                
                title = title_elem.get_text(strip=True)
                url = title_elem.get('href', '')
                
                # 摘要
                abstract_elem = item.select_one('.c-abstract, .c-span-last')
                abstract = abstract_elem.get_text(strip=True) if abstract_elem else ''
                
                # 来源和时间
                source_elem = item.select_one('.c-color-gray, .news-source')
                source_info = source_elem.get_text(strip=True) if source_elem else ''
                
                # 解析来源和时间
                news_source = ''
                time_str = ''
                if source_info:
                    parts = source_info.split()
                    if len(parts) >= 2:
                        news_source = parts[0]
                        time_str = ' '.join(parts[1:])
                
                results.append({
                    'title': title,
                    'url': url,
                    'abstract': abstract,
                    'source': news_source,
                    'time': time_str
                })
                
            except Exception as e:
                self.logger.debug(f"解析百度结果项出错: {e}")
                continue
        
        return results
    
    def _parse_sogou_results(self, html: str) -> List[Dict]:
        """解析搜狗新闻结果"""
        soup = BeautifulSoup(html, 'lxml')
        results = []
        
        items = soup.select('.news-list li, .vrwrap')
        
        for item in items:
            try:
                title_elem = item.select_one('h3 a, .vr-title a')
                if not title_elem:
                    continue
                
                title = title_elem.get_text(strip=True)
                url = title_elem.get('href', '')
                
                abstract_elem = item.select_one('.news-txt, .str_info')
                abstract = abstract_elem.get_text(strip=True) if abstract_elem else ''
                
                source_elem = item.select_one('.news-from, .news-detail')
                source_info = source_elem.get_text(strip=True) if source_elem else ''
                
                results.append({
                    'title': title,
                    'url': url,
                    'abstract': abstract,
                    'source': source_info,
                    'time': ''
                })
                
            except Exception as e:
                self.logger.debug(f"解析搜狗结果项出错: {e}")
                continue
        
        return results
    
    def _parse_generic_results(self, html: str) -> List[Dict]:
        """通用新闻解析"""
        soup = BeautifulSoup(html, 'lxml')
        results = []
        
        # 尝试查找常见新闻列表结构
        items = soup.select('article, .news-item, .list-item, .item')
        
        for item in items:
            try:
                title_elem = item.select_one('h2 a, h3 a, .title a, a.title')
                if not title_elem:
                    continue
                
                title = title_elem.get_text(strip=True)
                url = title_elem.get('href', '')
                
                abstract_elem = item.select_one('p, .abstract, .desc, .summary')
                abstract = abstract_elem.get_text(strip=True) if abstract_elem else ''
                
                results.append({
                    'title': title,
                    'url': url,
                    'abstract': abstract,
                    'source': '',
                    'time': ''
                })
                
            except Exception:
                continue
        
        return results
    
    def parse_item(self, item: Dict[str, Any], keyword: str = None) -> Optional[RawData]:
        """解析新闻数据"""
        try:
            title = item.get('title', '')
            url = item.get('url', '')
            abstract = item.get('abstract', '')
            
            if not title or not url:
                return None
            
            # 组合内容
            content = f"{title}\n{abstract}" if abstract else title
            
            # 时间解析
            time_str = item.get('time', '')
            publish_time = self._parse_time(time_str) if time_str else datetime.now()
            
            # 构建数据对象
            data = RawData(
                id=self._generate_id('news', url),
                source=SourceType.NEWS,
                source_id=url,
                url=url,
                title=title,
                content=content,
                publish_time=publish_time,
                keywords=[keyword] if keyword else [],
                raw_json=item
            )
            
            return data
            
        except Exception as e:
            self.logger.error(f"解析新闻数据出错: {e}")
            return None
    
    def fetch_full_content(self, url: str) -> Optional[str]:
        """获取新闻全文（需要时调用）"""
        try:
            response = self._request(url)
            soup = BeautifulSoup(response.text, 'lxml')
            
            # 移除脚本和样式
            for tag in soup(['script', 'style', 'nav', 'header', 'footer', 'aside']):
                tag.decompose()
            
            # 尝试找到正文
            content_selectors = [
                'article',
                '.article-content',
                '.news-content',
                '.content',
                '#content',
                '.post-content',
                'main'
            ]
            
            for selector in content_selectors:
                content_elem = soup.select_one(selector)
                if content_elem:
                    text = content_elem.get_text(separator='\n', strip=True)
                    if len(text) > 100:
                        return text
            
            # 回退：获取body文本
            body = soup.find('body')
            if body:
                return body.get_text(separator='\n', strip=True)[:5000]
            
            return None
            
        except Exception as e:
            self.logger.error(f"获取新闻全文出错: {e}")
            return None
