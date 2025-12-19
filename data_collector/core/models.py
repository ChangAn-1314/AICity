# -*- coding: utf-8 -*-
"""
数据模型定义
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum


class SourceType(str, Enum):
    """数据来源类型"""
    WEIBO = "weibo"
    DOUYIN = "douyin"
    XIAOHONGSHU = "xiaohongshu"
    NEWS = "news"
    GOV = "gov"
    FORUM = "forum"
    COMPLAINT = "complaint"


class SentimentType(str, Enum):
    """情感类型"""
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"


class UrgencyLevel(str, Enum):
    """紧急程度"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class Location(BaseModel):
    """位置信息"""
    province: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    address: Optional[str] = None
    coordinates: Optional[List[float]] = None  # [lng, lat]


class Author(BaseModel):
    """作者信息"""
    id: Optional[str] = None
    name: Optional[str] = None
    avatar: Optional[str] = None
    followers: Optional[int] = None
    verified: bool = False
    verified_type: Optional[str] = None


class Engagement(BaseModel):
    """互动数据"""
    likes: int = 0
    comments: int = 0
    shares: int = 0
    views: int = 0


class RawData(BaseModel):
    """原始采集数据模型"""
    
    # 基础标识
    id: str = Field(..., description="唯一标识")
    source: SourceType = Field(..., description="数据来源")
    source_id: Optional[str] = Field(None, description="原平台ID")
    url: Optional[str] = Field(None, description="原始链接")
    
    # 内容
    title: Optional[str] = Field(None, description="标题")
    content: str = Field(..., description="正文内容")
    images: List[str] = Field(default_factory=list, description="图片链接")
    videos: List[str] = Field(default_factory=list, description="视频链接")
    
    # 时间
    publish_time: datetime = Field(..., description="发布时间")
    collect_time: datetime = Field(default_factory=datetime.now, description="采集时间")
    
    # 作者
    author: Optional[Author] = None
    
    # 互动
    engagement: Engagement = Field(default_factory=Engagement)
    
    # 位置
    location: Optional[Location] = None
    
    # 元数据
    keywords: List[str] = Field(default_factory=list, description="命中关键词")
    raw_json: Optional[Dict[str, Any]] = Field(None, description="原始JSON数据")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class Annotation(BaseModel):
    """标注信息"""
    category: Optional[str] = None
    subcategory: Optional[str] = None
    sentiment: Optional[SentimentType] = None
    sentiment_score: Optional[float] = None
    urgency: Optional[UrgencyLevel] = None
    keywords: List[str] = Field(default_factory=list)
    entities: List[Dict[str, str]] = Field(default_factory=list)
    summary: Optional[str] = None
    suggested_department: Optional[str] = None
    annotator: Optional[str] = None
    annotate_time: Optional[datetime] = None


class CleanedData(BaseModel):
    """清洗后的数据模型"""
    
    # 继承原始数据字段
    id: str
    source: SourceType
    content: str
    content_cleaned: str = Field(..., description="清洗后的内容")
    publish_time: datetime
    collect_time: datetime
    
    # 位置（标准化后）
    location: Optional[Location] = None
    
    # 统计
    char_count: int = 0
    word_count: int = 0
    
    # 标注
    annotation: Optional[Annotation] = None
    
    # 处理状态
    is_valid: bool = True
    invalid_reason: Optional[str] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class CollectTask(BaseModel):
    """采集任务"""
    id: str
    name: str
    source: SourceType
    keywords: List[str]
    status: str = "pending"  # pending / running / completed / failed
    created_at: datetime = Field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    total_count: int = 0
    success_count: int = 0
    error_count: int = 0
    error_message: Optional[str] = None
