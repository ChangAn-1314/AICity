# -*- coding: utf-8 -*-
"""
配置管理模块
"""

import os
import yaml
from pathlib import Path
from typing import Any, Dict, Optional
from pydantic import BaseModel


class Config:
    """配置管理器"""
    
    _instance = None
    _config: Dict[str, Any] = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not self._config:
            self.load()
    
    def load(self, config_path: Optional[str] = None):
        """加载配置文件"""
        if config_path is None:
            # 默认配置路径
            base_dir = Path(__file__).parent.parent
            config_path = base_dir / "config" / "settings.yaml"
        
        config_path = Path(config_path)
        
        if config_path.exists():
            with open(config_path, 'r', encoding='utf-8') as f:
                self._config = yaml.safe_load(f)
        else:
            raise FileNotFoundError(f"配置文件不存在: {config_path}")
        
        # 加载环境变量覆盖
        self._load_env_overrides()
    
    def _load_env_overrides(self):
        """从环境变量加载敏感配置"""
        env_mappings = {
            'WEIBO_COOKIE': ('weibo', 'cookie'),
            'MONGODB_HOST': ('storage', 'mongodb', 'host'),
            'MONGODB_PORT': ('storage', 'mongodb', 'port'),
            'MYSQL_PASSWORD': ('storage', 'mysql', 'password'),
            'PROXY_URL': ('proxy', 'url'),
        }
        
        for env_key, config_path in env_mappings.items():
            env_value = os.getenv(env_key)
            if env_value:
                self._set_nested(config_path, env_value)
    
    def _set_nested(self, keys: tuple, value: Any):
        """设置嵌套配置值"""
        d = self._config
        for key in keys[:-1]:
            d = d.setdefault(key, {})
        d[keys[-1]] = value
    
    def get(self, *keys, default=None) -> Any:
        """获取配置值，支持多级键"""
        d = self._config
        for key in keys:
            if isinstance(d, dict):
                d = d.get(key)
            else:
                return default
            if d is None:
                return default
        return d
    
    @property
    def weibo(self) -> Dict:
        return self._config.get('weibo', {})
    
    @property
    def news(self) -> Dict:
        return self._config.get('news', {})
    
    @property
    def storage(self) -> Dict:
        return self._config.get('storage', {})
    
    @property
    def target(self) -> Dict:
        return self._config.get('target', {})
    
    @property
    def keywords(self) -> Dict:
        return self._config.get('sentiment_keywords', {})
    
    @property
    def request_config(self) -> Dict:
        return self._config.get('request', {})


# 全局配置实例
config = Config()
