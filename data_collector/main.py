# -*- coding: utf-8 -*-
"""
AICity 异步数据采集工具 - 高性能版本

Usage:
    python main.py collect --source weibo --keywords "信阳,供暖"
    python main.py collect --source weibo --keywords "信阳" --concurrent 10
    python main.py process --input ./output/raw_xxx.jsonl
    python main.py stats
    python main.py resume  # 断点续传
    python main.py proxy --check  # 检测代理
"""

import asyncio
import argparse
import sys
from pathlib import Path
from datetime import datetime

# 添加项目根目录到 Python 路径
sys.path.insert(0, str(Path(__file__).parent))

from core.config import Config
from core.logger import get_logger, setup_logger
from core.task_queue import TaskQueue, TaskStatus
from core.proxy_pool import ProxyPool
from core.models import RawData
from collectors import AsyncWeiboCollector
from processors import DataCleaner, SentimentAnalyzer
from storage import FileStorage


logger = get_logger('AsyncMain')


async def async_collect(args):
    """异步采集数据"""
    config = Config()
    storage = FileStorage(config)
    task_queue = TaskQueue()
    proxy_pool = ProxyPool()
    
    # 加载代理
    if args.use_proxy:
        await proxy_pool.load_free_proxies()
        await proxy_pool.check_all(concurrency=20)
        logger.info(f"代理池状态: {proxy_pool.get_statistics()}")
    
    # 解析关键词
    keywords = args.keywords.split(',') if args.keywords else ['信阳']
    
    # 创建任务
    tasks = await task_queue.add_batch(keywords, args.source, args.max_pages)
    logger.info(f"创建 {len(tasks)} 个采集任务")
    
    all_data = []
    
    # 选择采集器
    if args.source == 'weibo':
        async with AsyncWeiboCollector(config) as collector:
            # 设置并发数
            collector.max_concurrent = args.concurrent
            
            # 如果有代理池，注入
            if proxy_pool.proxies:
                collector.proxy_pool = list(proxy_pool.proxies.keys())
            
            for task in tasks:
                try:
                    await task_queue.mark_running(task.id)
                    logger.info(f"执行任务: {task.keyword}")
                    
                    data = await collector.run([task.keyword], max_pages=task.max_pages)
                    all_data.extend(data)
                    
                    await task_queue.mark_completed(task.id, len(data))
                    logger.info(f"任务完成: {task.keyword}, 采集 {len(data)} 条")
                    
                except KeyboardInterrupt:
                    # 断点保存
                    await task_queue.mark_paused(task.id, collector.request_count, len(all_data))
                    logger.warning("用户中断，已保存断点")
                    break
                    
                except Exception as e:
                    await task_queue.mark_failed(task.id, str(e))
                    logger.error(f"任务失败: {task.keyword} - {e}")
            
            # 输出统计
            stats = collector.get_stats()
            logger.info(f"采集统计: {stats}")
    
    # 保存数据
    if all_data:
        filepath = storage.save(all_data, data_type='raw')
        logger.info(f"保存 {len(all_data)} 条数据到: {filepath}")
    
    # 显示任务统计
    queue_stats = task_queue.get_statistics()
    logger.info(f"任务统计: {queue_stats}")
    
    return all_data


async def resume_tasks(args):
    """断点续传 - 恢复未完成任务"""
    config = Config()
    storage = FileStorage(config)
    task_queue = TaskQueue()
    
    # 获取待处理任务
    pending_tasks = await task_queue.get_pending_tasks()
    
    if not pending_tasks:
        logger.info("没有待处理的任务")
        return
    
    logger.info(f"发现 {len(pending_tasks)} 个待处理任务")
    
    all_data = []
    
    async with AsyncWeiboCollector(config) as collector:
        for task in pending_tasks:
            try:
                # 从断点页开始
                start_page = task.page
                logger.info(f"恢复任务: {task.keyword}, 从第 {start_page} 页开始")
                
                await task_queue.mark_running(task.id, start_page)
                
                data = await collector.run(
                    [task.keyword], 
                    max_pages=task.max_pages,
                    start_page=start_page
                )
                all_data.extend(data)
                
                await task_queue.mark_completed(task.id, task.collected_count + len(data))
                
            except Exception as e:
                await task_queue.mark_failed(task.id, str(e))
                logger.error(f"恢复任务失败: {task.keyword} - {e}")
    
    if all_data:
        storage.save(all_data, data_type='raw_resumed')
    
    logger.info(f"断点续传完成，共采集 {len(all_data)} 条新数据")


async def manage_proxy(args):
    """代理池管理"""
    proxy_pool = ProxyPool()
    
    if args.load:
        await proxy_pool.load_free_proxies()
        logger.info(f"加载完成: {proxy_pool.get_statistics()}")
    
    if args.check:
        if not proxy_pool.proxies:
            await proxy_pool.load_free_proxies()
        
        await proxy_pool.check_all(concurrency=args.concurrent)
        
        stats = proxy_pool.get_statistics()
        print(f"\n代理池统计:")
        print(f"  总数: {stats['total']}")
        print(f"  可用: {stats['valid']}")
        print(f"  无效: {stats['invalid']}")
        print(f"  平均评分: {stats['avg_score']}")
    
    if args.cleanup:
        await proxy_pool.cleanup_invalid()
        logger.info("清理完成")


async def show_status(args):
    """显示状态"""
    task_queue = TaskQueue()
    
    stats = task_queue.get_statistics()
    
    print("\n" + "=" * 50)
    print("AICity 异步采集器状态")
    print("=" * 50)
    
    print(f"\n任务队列:")
    print(f"  总任务: {stats['total']}")
    print(f"  待处理: {stats['pending']}")
    print(f"  运行中: {stats['running']}")
    print(f"  已完成: {stats['completed']}")
    print(f"  失败: {stats['failed']}")
    print(f"  暂停: {stats['paused']}")
    
    # 显示待处理任务
    pending = await task_queue.get_pending_tasks()
    if pending:
        print(f"\n待处理任务 ({len(pending)}):")
        for task in pending[:5]:
            print(f"  - {task.keyword} ({task.source}) [页{task.page}/{task.max_pages}]")
        if len(pending) > 5:
            print(f"  ... 还有 {len(pending) - 5} 个任务")
    
    print("\n" + "=" * 50)


def process_data(args):
    """处理采集的数据"""
    config = Config()
    storage = FileStorage(config)
    cleaner = DataCleaner()
    analyzer = SentimentAnalyzer()
    
    # 加载原始数据
    input_path = args.input
    if not Path(input_path).exists():
        logger.error(f"输入文件不存在: {input_path}")
        sys.exit(1)
    
    logger.info(f"加载数据: {input_path}")
    raw_data = storage.load(input_path)
    logger.info(f"加载 {len(raw_data)} 条数据")
    
    # 转换为RawData对象
    data_objects = []
    for item in raw_data:
        try:
            data_objects.append(RawData(**item))
        except Exception as e:
            logger.debug(f"转换数据失败: {e}")
    
    # 清洗
    logger.info("开始数据清洗...")
    cleaned_data = cleaner.clean_batch(data_objects)
    
    # 去重
    cleaned_data = cleaner.deduplicate(cleaned_data)
    logger.info(f"清洗后 {len(cleaned_data)} 条数据")
    
    # 情感分析
    logger.info("开始情感分析...")
    analyzed_data = analyzer.analyze_batch(cleaned_data)
    
    # 保存清洗后的数据
    output_file = storage.save(analyzed_data, data_type='cleaned')
    logger.info(f"保存到: {output_file}")
    
    # 导出训练数据
    if args.export_training:
        training_file = storage.export_for_training(analyzed_data)
        logger.info(f"训练数据: {training_file}")
    
    # 统计信息
    valid_count = sum(1 for d in analyzed_data if d.is_valid)
    negative_count = sum(1 for d in analyzed_data if d.annotation and d.annotation.sentiment.value == 'negative')
    
    print("\n" + "=" * 50)
    print("数据处理完成")
    print("=" * 50)
    print(f"  原始数据: {len(raw_data)} 条")
    print(f"  有效数据: {valid_count} 条")
    print(f"  负面舆情: {negative_count} 条")
    print("=" * 50)


def show_stats(args):
    """显示统计信息"""
    config = Config()
    file_storage = FileStorage(config)
    
    output_dir = Path(config.get('storage', 'file', 'output_dir', default='./output'))
    
    print("\n" + "=" * 50)
    print("AICity 数据采集统计")
    print("=" * 50)
    
    # 统计文件
    raw_files = list(output_dir.glob('raw_*.jsonl'))
    cleaned_files = list(output_dir.glob('cleaned_*.jsonl'))
    training_files = list(output_dir.glob('training*.jsonl'))
    
    print(f"\n文件统计:")
    print(f"  原始数据文件: {len(raw_files)}")
    print(f"  清洗数据文件: {len(cleaned_files)}")
    print(f"  训练数据文件: {len(training_files)}")
    
    # 统计数据量
    total_raw = 0
    total_cleaned = 0
    
    for f in raw_files:
        data = file_storage.load(str(f))
        total_raw += len(data)
    
    for f in cleaned_files:
        data = file_storage.load(str(f))
        total_cleaned += len(data)
    
    print(f"\n数据量统计:")
    print(f"  原始数据: {total_raw} 条")
    print(f"  清洗数据: {total_cleaned} 条")
    
    # 最近文件
    all_files = list(output_dir.glob('*.jsonl'))
    if all_files:
        all_files.sort(key=lambda x: x.stat().st_mtime, reverse=True)
        print(f"\n最近文件:")
        for f in all_files[:5]:
            mtime = datetime.fromtimestamp(f.stat().st_mtime)
            size = f.stat().st_size / 1024
            print(f"  {f.name} ({size:.1f}KB) - {mtime.strftime('%Y-%m-%d %H:%M')}")
    
    print("\n" + "=" * 50)


def main():
    """主函数"""
    parser = argparse.ArgumentParser(
        description='AICity 异步数据采集工具 (高性能版)',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    subparsers = parser.add_subparsers(dest='command', help='子命令')
    
    # collect 命令
    collect_parser = subparsers.add_parser('collect', help='异步采集数据')
    collect_parser.add_argument('--source', '-s', default='weibo', help='数据源')
    collect_parser.add_argument('--keywords', '-k', type=str, help='关键词(逗号分隔)')
    collect_parser.add_argument('--max-pages', '-p', type=int, default=10, help='最大页数')
    collect_parser.add_argument('--concurrent', '-c', type=int, default=5, help='并发数')
    collect_parser.add_argument('--use-proxy', action='store_true', help='使用代理池')
    
    # resume 命令
    resume_parser = subparsers.add_parser('resume', help='断点续传')
    
    # proxy 命令
    proxy_parser = subparsers.add_parser('proxy', help='代理池管理')
    proxy_parser.add_argument('--load', action='store_true', help='加载免费代理')
    proxy_parser.add_argument('--check', action='store_true', help='检测代理')
    proxy_parser.add_argument('--cleanup', action='store_true', help='清理无效代理')
    proxy_parser.add_argument('--concurrent', type=int, default=20, help='检测并发数')
    
    # status 命令
    status_parser = subparsers.add_parser('status', help='显示任务状态')
    
    # process 命令
    process_parser = subparsers.add_parser('process', help='处理采集数据')
    process_parser.add_argument('--input', '-i', required=True, help='输入文件路径')
    process_parser.add_argument('--export-training', '-e', action='store_true', help='导出训练数据')
    
    # stats 命令
    stats_parser = subparsers.add_parser('stats', help='显示统计信息')
    
    args = parser.parse_args()
    
    if args.command is None:
        parser.print_help()
        sys.exit(0)
    
    setup_logger()
    
    # 运行命令
    if args.command == 'collect':
        asyncio.run(async_collect(args))
    elif args.command == 'resume':
        asyncio.run(resume_tasks(args))
    elif args.command == 'proxy':
        asyncio.run(manage_proxy(args))
    elif args.command == 'status':
        asyncio.run(show_status(args))
    elif args.command == 'process':
        process_data(args)
    elif args.command == 'stats':
        show_stats(args)


if __name__ == '__main__':
    main()
