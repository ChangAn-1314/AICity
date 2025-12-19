# -*- coding: utf-8 -*-
"""
批量采集脚本 - 根据配置文件自动采集所有关键词

Usage:
    python batch_collect.py              # 采集所有任务
    python batch_collect.py --task 民生类  # 采集指定任务
    python batch_collect.py --priority high  # 采集高优先级任务
    python batch_collect.py --dry-run    # 预览模式，不实际采集
"""

import sys
import asyncio
import argparse
from pathlib import Path
from datetime import datetime

# 添加项目根目录到路径
sys.path.insert(0, str(Path(__file__).parent))

from core.config import Config
from core.logger import get_logger, setup_logger
from core.task_queue import TaskQueue
from collectors import AsyncWeiboCollector
from storage import FileStorage


logger = get_logger('BatchCollect')


async def batch_collect(args):
    """批量采集数据"""
    config = Config()
    storage = FileStorage(config)
    task_queue = TaskQueue()
    
    # 获取批量任务配置
    batch_config = config.get('batch_collect', default={})
    if not batch_config.get('enabled', False):
        logger.warning("批量采集未启用，请在配置文件中设置 batch_collect.enabled: true")
        return
    
    tasks = batch_config.get('tasks', [])
    if not tasks:
        logger.warning("未配置采集任务")
        return
    
    # 过滤任务
    if args.task:
        tasks = [t for t in tasks if t['name'] == args.task]
        if not tasks:
            logger.error(f"未找到任务: {args.task}")
            return
    
    if args.priority:
        tasks = [t for t in tasks if t.get('priority', 'medium') == args.priority]
        if not tasks:
            logger.error(f"未找到优先级为 {args.priority} 的任务")
            return
    
    # 统计
    total_keywords = sum(len(t.get('keywords', [])) for t in tasks)
    print("\n" + "=" * 60)
    print("AICity 批量数据采集")
    print("=" * 60)
    print(f"  任务数: {len(tasks)}")
    print(f"  关键词总数: {total_keywords}")
    print(f"  采集源: weibo")
    print("=" * 60)
    
    # 预览模式
    if args.dry_run:
        print("\n[预览模式] 将要采集的关键词:")
        for task in tasks:
            print(f"\n  [{task['name']}] (优先级: {task.get('priority', 'medium')}, 页数: {task.get('max_pages', 10)})")
            for kw in task.get('keywords', []):
                print(f"    - {kw}")
        print("\n使用 --no-dry-run 开始实际采集")
        return
    
    # 开始采集
    all_data = []
    start_time = datetime.now()
    
    for task in tasks:
        task_name = task['name']
        keywords = task.get('keywords', [])
        max_pages = task.get('max_pages', 10)
        
        logger.info(f"开始采集任务: {task_name} ({len(keywords)} 个关键词)")
        
        # 添加到任务队列
        await task_queue.add_batch(keywords, 'weibo', max_pages)
        
        # 执行采集
        async with AsyncWeiboCollector(config) as collector:
            for keyword in keywords:
                logger.info(f"采集关键词: {keyword}")
                try:
                    data = []
                    async for item in collector.collect([keyword], max_pages=max_pages):
                        data.append(item)
                    all_data.extend(data)
                    logger.info(f"  获取 {len(data)} 条数据")
                except Exception as e:
                    logger.error(f"采集失败 [{keyword}]: {e}")
                
                # 任务间延迟（增加到5秒避免触发反爬虫）
                await asyncio.sleep(5)
        
        logger.info(f"任务 [{task_name}] 完成")
    
    # 保存数据
    if all_data:
        output_file = storage.save(all_data, data_type='raw')
        logger.info(f"保存到: {output_file}")
    
    # 统计
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    
    print("\n" + "=" * 60)
    print("采集完成")
    print("=" * 60)
    print(f"  总数据量: {len(all_data)} 条")
    print(f"  耗时: {duration:.1f} 秒")
    print(f"  平均: {len(all_data) / max(duration, 1):.1f} 条/秒")
    print("=" * 60)


def list_tasks():
    """列出所有采集任务"""
    config = Config()
    batch_config = config.get('batch_collect', default={})
    tasks = batch_config.get('tasks', [])
    
    print("\n可用的采集任务:")
    print("-" * 50)
    for task in tasks:
        keywords = task.get('keywords', [])
        print(f"  [{task['name']}]")
        print(f"    优先级: {task.get('priority', 'medium')}")
        print(f"    页数: {task.get('max_pages', 10)}")
        print(f"    关键词: {len(keywords)} 个")
        print(f"      {', '.join(keywords[:3])}{'...' if len(keywords) > 3 else ''}")
        print()


def main():
    parser = argparse.ArgumentParser(
        description='AICity 批量数据采集工具',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument('--task', '-t', help='指定采集任务名称')
    parser.add_argument('--priority', '-p', choices=['high', 'medium', 'low'], help='按优先级筛选')
    parser.add_argument('--dry-run', '-d', action='store_true', help='预览模式，不实际采集')
    parser.add_argument('--list', '-l', action='store_true', help='列出所有任务')
    parser.add_argument('--concurrent', '-c', type=int, default=3, help='并发数')
    
    args = parser.parse_args()
    
    setup_logger()
    
    if args.list:
        list_tasks()
        return
    
    asyncio.run(batch_collect(args))


if __name__ == '__main__':
    main()
