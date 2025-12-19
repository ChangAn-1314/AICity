# -*- coding: utf-8 -*-
"""
数据存储模块
"""

from .file_storage import FileStorage
from .mongo_storage import MongoStorage

__all__ = ['FileStorage', 'MongoStorage']
