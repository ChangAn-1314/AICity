# -*- coding: utf-8 -*-
"""
数据采集器模块
"""

from .weibo import WeiboCollector
from .news import NewsCollector
from .gov import GovCollector
from .async_weibo import AsyncWeiboCollector

__all__ = [
    'WeiboCollector',
    'NewsCollector', 
    'GovCollector',
    'AsyncWeiboCollector'
]
