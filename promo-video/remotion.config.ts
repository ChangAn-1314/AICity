import { Config } from '@remotion/cli/config';

// 使用 JPEG 格式以提升渲染速度
Config.setVideoImageFormat('jpeg');

// 覆盖已存在的输出文件
Config.setOverwriteOutput(true);

// 设置并发数以优化性能
Config.setConcurrency(6);

// 设置 JPEG 质量 (1-100, 默认80)
Config.setJpegQuality(85);
