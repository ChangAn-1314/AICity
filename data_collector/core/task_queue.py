# -*- coding: utf-8 -*-
"""
任务队列 - 支持断点续传
"""

import json
import asyncio
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum

from .logger import get_logger


class TaskStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    PAUSED = "paused"


@dataclass
class Task:
    """采集任务"""
    id: str
    keyword: str
    source: str
    status: TaskStatus = TaskStatus.PENDING
    page: int = 1
    max_pages: int = 10
    collected_count: int = 0
    error_count: int = 0
    created_at: str = ""
    updated_at: str = ""
    error_message: str = ""
    
    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now().isoformat()
        self.updated_at = datetime.now().isoformat()
    
    def to_dict(self) -> Dict:
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Task':
        data['status'] = TaskStatus(data.get('status', 'pending'))
        return cls(**data)


class TaskQueue:
    """持久化任务队列 - 支持断点续传"""
    
    def __init__(self, queue_file: str = "./output/.task_queue.json"):
        self.logger = get_logger('TaskQueue')
        self.queue_file = Path(queue_file)
        self.queue_file.parent.mkdir(parents=True, exist_ok=True)
        
        self.tasks: Dict[str, Task] = {}
        self._lock = asyncio.Lock()
        
        # 加载已有任务
        self._load()
    
    def _load(self):
        """从文件加载任务"""
        if self.queue_file.exists():
            try:
                with open(self.queue_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    for task_id, task_data in data.items():
                        self.tasks[task_id] = Task.from_dict(task_data)
                self.logger.info(f"加载 {len(self.tasks)} 个任务")
            except Exception as e:
                self.logger.error(f"加载任务失败: {e}")
    
    def _save(self):
        """保存任务到文件"""
        try:
            data = {tid: task.to_dict() for tid, task in self.tasks.items()}
            with open(self.queue_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            self.logger.error(f"保存任务失败: {e}")
    
    async def add_task(self, keyword: str, source: str, max_pages: int = 10) -> Task:
        """添加任务"""
        async with self._lock:
            task_id = f"{source}_{keyword}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
            
            task = Task(
                id=task_id,
                keyword=keyword,
                source=source,
                max_pages=max_pages
            )
            
            self.tasks[task_id] = task
            self._save()
            
            self.logger.info(f"添加任务: {task_id}")
            return task
    
    async def add_batch(self, keywords: List[str], source: str, max_pages: int = 10) -> List[Task]:
        """批量添加任务"""
        tasks = []
        for keyword in keywords:
            task = await self.add_task(keyword, source, max_pages)
            tasks.append(task)
        return tasks
    
    async def get_pending_tasks(self) -> List[Task]:
        """获取待处理任务"""
        return [t for t in self.tasks.values() if t.status in (TaskStatus.PENDING, TaskStatus.PAUSED)]
    
    async def get_task(self, task_id: str) -> Optional[Task]:
        """获取任务"""
        return self.tasks.get(task_id)
    
    async def update_task(self, task_id: str, **kwargs):
        """更新任务状态"""
        async with self._lock:
            if task_id in self.tasks:
                task = self.tasks[task_id]
                for key, value in kwargs.items():
                    if hasattr(task, key):
                        setattr(task, key, value)
                task.updated_at = datetime.now().isoformat()
                self._save()
    
    async def mark_running(self, task_id: str, page: int = None):
        """标记任务运行中"""
        kwargs = {'status': TaskStatus.RUNNING}
        if page is not None:
            kwargs['page'] = page
        await self.update_task(task_id, **kwargs)
    
    async def mark_completed(self, task_id: str, collected_count: int = 0):
        """标记任务完成"""
        await self.update_task(
            task_id,
            status=TaskStatus.COMPLETED,
            collected_count=collected_count
        )
    
    async def mark_failed(self, task_id: str, error_message: str = ""):
        """标记任务失败"""
        await self.update_task(
            task_id,
            status=TaskStatus.FAILED,
            error_message=error_message
        )
    
    async def mark_paused(self, task_id: str, page: int, collected_count: int):
        """标记任务暂停（用于断点续传）"""
        await self.update_task(
            task_id,
            status=TaskStatus.PAUSED,
            page=page,
            collected_count=collected_count
        )
    
    async def resume_task(self, task_id: str) -> Optional[Task]:
        """恢复暂停的任务"""
        task = await self.get_task(task_id)
        if task and task.status == TaskStatus.PAUSED:
            await self.update_task(task_id, status=TaskStatus.PENDING)
            return task
        return None
    
    async def clear_completed(self):
        """清除已完成任务"""
        async with self._lock:
            completed = [tid for tid, t in self.tasks.items() if t.status == TaskStatus.COMPLETED]
            for tid in completed:
                del self.tasks[tid]
            self._save()
            self.logger.info(f"清除 {len(completed)} 个已完成任务")
    
    def get_statistics(self) -> Dict[str, int]:
        """获取任务统计"""
        stats = {
            'total': len(self.tasks),
            'pending': 0,
            'running': 0,
            'completed': 0,
            'failed': 0,
            'paused': 0
        }
        
        for task in self.tasks.values():
            stats[task.status.value] = stats.get(task.status.value, 0) + 1
        
        return stats
