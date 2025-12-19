# -*- coding: utf-8 -*-
"""
情感分析模块
"""

from typing import Optional, Dict, List
from snownlp import SnowNLP

from core.models import CleanedData, Annotation, SentimentType, UrgencyLevel
from core.logger import get_logger


class SentimentAnalyzer:
    """情感分析器"""
    
    def __init__(self):
        self.logger = get_logger('SentimentAnalyzer')
        
        # 紧急程度关键词
        self.urgency_keywords = {
            'critical': ['死亡', '伤亡', '爆炸', '坍塌', '群体性', '暴力', '恐怖'],
            'high': ['受伤', '火灾', '事故', '堵塞', '停水', '停电', '讨薪', '维权'],
            'medium': ['投诉', '问题', '故障', '延误', '不满', '差评'],
            'low': ['建议', '咨询', '询问', '反馈']
        }
        
        # 分类关键词
        self.category_keywords = {
            '民生': {
                '供暖': ['暖气', '供暖', '取暖', '温度低', '不热'],
                '供水供电': ['停水', '停电', '水压', '电压', '跳闸'],
                '物业': ['物业', '小区', '电梯', '绿化', '保安'],
                '欠薪': ['欠薪', '讨薪', '工资', '拖欠', '农民工']
            },
            '交通': {
                '拥堵': ['拥堵', '堵车', '排队', '不通'],
                '事故': ['车祸', '追尾', '碰撞', '交通事故'],
                '公共交通': ['地铁', '公交', '延误', '晚点']
            },
            '安全': {
                '火灾': ['火灾', '起火', '着火', '消防'],
                '治安': ['偷盗', '抢劫', '打架', '斗殴'],
                '食品安全': ['食物中毒', '过期', '变质', '卫生']
            },
            '消费': {
                '维权': ['维权', '投诉', '退款', '赔偿'],
                '欺诈': ['欺诈', '骗', '假货', '虚假宣传']
            },
            '环境': {
                '污染': ['污染', '排放', '臭味', '废水'],
                '噪音': ['噪音', '扰民', '施工', '装修']
            }
        }
    
    def analyze(self, data: CleanedData) -> CleanedData:
        """
        分析单条数据
        
        Args:
            data: 清洗后的数据
            
        Returns:
            添加了标注的数据
        """
        if not data.is_valid:
            return data
        
        text = data.content_cleaned
        
        # 情感分析
        sentiment, score = self._analyze_sentiment(text)
        
        # 分类
        category, subcategory = self._classify(text)
        
        # 紧急程度
        urgency = self._assess_urgency(text, sentiment)
        
        # 关键词提取
        keywords = self._extract_keywords(text)
        
        # 建议部门
        department = self._suggest_department(category, subcategory)
        
        # 构建标注
        annotation = Annotation(
            category=category,
            subcategory=subcategory,
            sentiment=sentiment,
            sentiment_score=score,
            urgency=urgency,
            keywords=keywords,
            suggested_department=department
        )
        
        data.annotation = annotation
        return data
    
    def analyze_batch(self, data_list: List[CleanedData]) -> List[CleanedData]:
        """批量分析"""
        results = []
        for data in data_list:
            analyzed = self.analyze(data)
            results.append(analyzed)
        
        self.logger.info(f"分析完成: {len(results)} 条")
        return results
    
    def _analyze_sentiment(self, text: str) -> tuple[SentimentType, float]:
        """情感分析"""
        try:
            s = SnowNLP(text)
            score = s.sentiments  # 0-1, 越大越正面
            
            # 转换为 -1 到 1 的分数
            normalized_score = (score - 0.5) * 2
            
            if normalized_score > 0.3:
                return SentimentType.POSITIVE, normalized_score
            elif normalized_score < -0.3:
                return SentimentType.NEGATIVE, normalized_score
            else:
                return SentimentType.NEUTRAL, normalized_score
                
        except Exception as e:
            self.logger.debug(f"情感分析出错: {e}")
            return SentimentType.NEUTRAL, 0.0
    
    def _classify(self, text: str) -> tuple[Optional[str], Optional[str]]:
        """内容分类"""
        max_score = 0
        best_category = None
        best_subcategory = None
        
        for category, subcategories in self.category_keywords.items():
            for subcategory, keywords in subcategories.items():
                score = sum(1 for kw in keywords if kw in text)
                if score > max_score:
                    max_score = score
                    best_category = category
                    best_subcategory = subcategory
        
        return best_category, best_subcategory
    
    def _assess_urgency(self, text: str, sentiment: SentimentType) -> UrgencyLevel:
        """评估紧急程度"""
        for level, keywords in self.urgency_keywords.items():
            if any(kw in text for kw in keywords):
                return UrgencyLevel(level)
        
        # 根据情感判断
        if sentiment == SentimentType.NEGATIVE:
            return UrgencyLevel.MEDIUM
        
        return UrgencyLevel.LOW
    
    def _extract_keywords(self, text: str, topK: int = 5) -> List[str]:
        """提取关键词"""
        try:
            s = SnowNLP(text)
            return s.keywords(topK)
        except:
            return []
    
    def _suggest_department(self, category: str, subcategory: str) -> Optional[str]:
        """建议处理部门"""
        department_map = {
            ('民生', '供暖'): '住建局',
            ('民生', '供水供电'): '城管局/供电公司',
            ('民生', '物业'): '住建局/社区',
            ('民生', '欠薪'): '人社局',
            ('交通', '拥堵'): '交警支队',
            ('交通', '事故'): '交警支队',
            ('交通', '公共交通'): '交通运输局',
            ('安全', '火灾'): '消防救援',
            ('安全', '治安'): '公安局',
            ('安全', '食品安全'): '市场监管局',
            ('消费', '维权'): '市场监管局',
            ('消费', '欺诈'): '市场监管局/公安局',
            ('环境', '污染'): '生态环境局',
            ('环境', '噪音'): '城管局',
        }
        
        return department_map.get((category, subcategory), '12345热线')
