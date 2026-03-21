"""
基于 BGM 节拍分析的视频时间轴设计

BGM 信息：
- 时长: 100.32秒
- BPM: 122.3
- 每拍间隔: 0.491秒
- FPS: 30

关键节拍时间戳（秒）和对应帧数：
"""

FPS = 30

# 关键节拍点（从 beat_analysis.txt 提取）
key_beats = [
    0.053,  # 节拍 1
    0.619,  # 节拍 2
    1.173,  # 节拍 3
    1.781,  # 节拍 4
    2.272,  # 节拍 5
    2.773,  # 节拍 6
    3.264,  # 节拍 7
    3.755,  # 节拍 8
    4.245,  # 节拍 9
    4.736,  # 节拍 10
    5.227,  # 节拍 11
    5.739,  # 节拍 12
    6.229,  # 节拍 13
    6.720,  # 节拍 14
    7.211,  # 节拍 15
    7.733,  # 节拍 16
    8.224,  # 节拍 17
    8.715,  # 节拍 18
    9.205,  # 节拍 19
    9.696,  # 节拍 20
    10.187,  # 节拍 21
    10.699,  # 节拍 22
    11.189,  # 节拍 23
    11.680,  # 节拍 24
    12.171,  # 节拍 25
    12.693,  # 节拍 26
    13.184,  # 节拍 27
    13.675,  # 节拍 28
    14.165,  # 节拍 29
    14.656,  # 节拍 30
    15.147,  # 节拍 31
    15.851,  # 节拍 32 - 超高能量峰值开始
    16.331,  # 节拍 33
    16.821,  # 节拍 34 - 最强峰值
    17.312,  # 节拍 35
    17.813,  # 节拍 36
    18.304,  # 节拍 37
    18.795,  # 节拍 38
    19.285,  # 节拍 39
    19.787,  # 节拍 40
    20.277,  # 节拍 41
    20.757,  # 节拍 42
    21.269,  # 节拍 43
    21.760,  # 节拍 44
    22.251,  # 节拍 45
    22.752,  # 节拍 46
    23.243,  # 节拍 47
    23.733,  # 节拍 48
    24.224,  # 节拍 49
    24.715,  # 节拍 50
    25.227,  # 节拍 51
    25.717,  # 节拍 52
    26.208,  # 节拍 53
    26.699,  # 节拍 54
    27.189,  # 节拍 55
    27.680,  # 节拍 56
    28.171,  # 节拍 57
    28.693,  # 节拍 58
    29.184,  # 节拍 59
    29.675,  # 节拍 60
]

# 能量峰值点（用于重要转场）
energy_peaks = [
    0.171,
    0.523,
    0.875,
    1.280,
    1.824,
    2.475,
    2.880,
    3.776,
    4.811,
    5.739,
    6.827,
    8.757,
    10.763,
    11.125,
    12.747,
    14.240,
    15.851,  # 超高能量
    16.331,  # 超高能量
    16.821,  # 最强峰值
    17.312,  # 超高能量
    18.304,  # 超高能量
    19.787,
    20.757,
    21.760,
    22.752,
]

# 视频场景时间轴设计（基于节拍）
scenes = [
    {
        "name": "开场 Logo",
        "start_beat": 1,
        "end_beat": 11,
        "start_time": 0.053,
        "end_time": 5.227,
        "duration": 5.174,
        "frames": int(5.174 * FPS),
        "energy": "medium",
        "description": "从第1拍到第11拍，Logo 淡入+呼吸动画",
    },
    {
        "name": "问题场景",
        "start_beat": 11,
        "end_beat": 26,
        "start_time": 5.227,
        "end_time": 12.693,
        "duration": 7.466,
        "frames": int(7.466 * FPS),
        "energy": "medium",
        "description": "展示城市舆情问题，文字逐个出现配合节拍",
    },
    {
        "name": "产品介绍 - 主界面",
        "start_beat": 26,
        "end_beat": 48,
        "start_time": 12.693,
        "end_time": 23.733,
        "duration": 11.040,
        "frames": int(11.040 * FPS),
        "energy": "high",
        "description": "高能量段！15.8-23.7秒有超强峰值，主界面展示+功能亮点",
    },
    {
        "name": "核心功能1 - AI场景还原",
        "start_beat": 48,
        "end_beat": 64,
        "start_time": 23.733,
        "end_time": 31.147,
        "duration": 7.414,
        "frames": int(7.414 * FPS),
        "energy": "medium-high",
        "description": "3D场景展示，配合节拍做镜头推进",
    },
    {
        "name": "核心功能2 - 地图钻取",
        "start_beat": 64,
        "end_beat": 80,
        "start_time": 31.147,
        "end_time": 39.147,
        "duration": 8.000,
        "frames": int(8.000 * FPS),
        "energy": "medium-high",
        "description": "国家→省→市三级钻取，每级配合节拍",
    },
    {
        "name": "核心功能3 - 智能决策",
        "start_beat": 80,
        "end_beat": 96,
        "start_time": 39.147,
        "end_time": 47.147,
        "duration": 8.000,
        "frames": int(8.000 * FPS),
        "energy": "medium",
        "description": "AI分析界面，数据流动效果",
    },
    {
        "name": "核心功能4 - 数据可视化",
        "start_beat": 96,
        "end_beat": 112,
        "start_time": 47.147,
        "end_time": 55.147,
        "duration": 8.000,
        "frames": int(8.000 * FPS),
        "energy": "low",
        "description": "词云+趋势图，能量开始下降",
    },
    {
        "name": "结尾 Slogan",
        "start_beat": 112,
        "end_beat": 122,
        "start_time": 55.147,
        "end_time": 60.147,
        "duration": 5.000,
        "frames": int(5.000 * FPS),
        "energy": "low",
        "description": "平静段，Slogan 展示",
    },
    {
        "name": "尾声 Logo",
        "start_beat": 122,
        "end_beat": 132,
        "start_time": 60.147,
        "end_time": 65.147,
        "duration": 5.000,
        "frames": int(5.000 * FPS),
        "energy": "low",
        "description": "Logo 回归，淡出",
    },
]

print("=" * 80)
print("视频场景时间轴（基于节拍同步）")
print("=" * 80)
print()

total_frames = 0
for i, scene in enumerate(scenes, 1):
    print(f"{i}. {scene['name']}")
    print(f"   节拍: {scene['start_beat']}-{scene['end_beat']}")
    print(f"   时间: {scene['start_time']:.3f}s - {scene['end_time']:.3f}s")
    print(f"   时长: {scene['duration']:.3f}s ({scene['frames']} 帧)")
    print(f"   能量: {scene['energy']}")
    print(f"   说明: {scene['description']}")
    print()
    total_frames += scene["frames"]

print(f"总时长: {total_frames / FPS:.2f}秒 ({total_frames} 帧)")
print()

# 转场时间点（在能量峰值处）
print("=" * 80)
print("建议的转场时间点（能量峰值）")
print("=" * 80)
print()

transitions = [
    (5.227, "开场 → 问题", "fade"),
    (12.693, "问题 → 产品", "slide from-right"),
    (15.851, "产品内部重点强调", "scale pulse"),
    (23.733, "产品 → 功能1", "fade"),
    (31.147, "功能1 → 功能2", "slide from-left"),
    (39.147, "功能2 → 功能3", "fade"),
    (47.147, "功能3 → 功能4", "slide from-bottom"),
    (55.147, "功能4 → 结尾", "fade"),
    (60.147, "结尾 → 尾声", "fade"),
]

for time, desc, effect in transitions:
    frame = int(time * FPS)
    print(f"{time:7.3f}s (帧 {frame:4d}) - {desc:30s} [{effect}]")

print()
print("=" * 80)
