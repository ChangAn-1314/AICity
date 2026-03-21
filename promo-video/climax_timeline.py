"""
重新设计的视频卡点方案
核心理念：在 16 秒高潮处展示"智舆系统用 AI 的眼睛看见舆情"

关键发现：
- 15.851s: 能量 0.4213 (超高峰值开始)
- 16.331s: 能量 0.4323
- 16.821s: 能量 0.4441 (最强峰值！)
- 17.312s: 能量 0.4177
- 17.813s: 能量 0.4093

节拍对应：
- 节拍 32: 15.371s
- 节拍 33: 15.797s
- 节拍 34: 16.288s (接近 16.331s 峰值)
- 节拍 35: 16.779s (接近 16.821s 最强峰值)
- 节拍 36: 17.269s
- 节拍 37: 17.760s
- 节拍 38: 18.251s
"""

FPS = 30

# 新的视频结构设计
scenes_redesign = [
    {
        "name": "开场 - 黑屏到 Logo",
        "start_beat": 1,
        "end_beat": 8,
        "start_time": 0.053,
        "end_time": 3.755,
        "duration": 3.702,
        "frames": int(3.702 * FPS),
        "content": "Logo 淡入，简洁开场",
        "energy": "medium",
    },
    {
        "name": "问题引入 - 城市舆情挑战",
        "start_beat": 8,
        "end_beat": 20,
        "start_time": 3.755,
        "end_time": 9.653,
        "duration": 5.898,
        "frames": int(5.898 * FPS),
        "content": "展示城市舆情的复杂性和挑战",
        "energy": "medium",
    },
    {
        "name": "过渡 - 需要新的解决方案",
        "start_beat": 20,
        "end_beat": 32,
        "start_time": 9.653,
        "end_time": 15.371,
        "duration": 5.718,
        "frames": int(5.718 * FPS),
        "content": "传统方法的局限，引出 AI 解决方案",
        "energy": "building",
    },
    {
        "name": "【核心高潮】智舆 - AI 的眼睛",
        "start_beat": 32,
        "end_beat": 40,
        "start_time": 15.371,
        "end_time": 19.232,
        "duration": 3.861,
        "frames": int(3.861 * FPS),
        "content": """
        ⭐ 15.371s (节拍32): Logo "智舆" 出现
        ⭐ 15.797s (节拍33): "AI 的眼睛" 文字浮现
        ⭐ 16.288s (节拍34): 眼睛图标/视觉效果出现
        ⭐ 16.779s (节拍35): 【最强峰值】眼睛扫描效果，数据流涌现
        ⭐ 17.269s (节拍36): "看见舆情" 文字
        ⭐ 17.760s (节拍37): 3D 地图展开
        ⭐ 18.251s (节拍38): 舆情热点标注出现
        """,
        "energy": "CLIMAX",
        "visual_effects": [
            "15.371s: Logo 震撼出现",
            "15.797s: AI 眼睛图标淡入",
            "16.288s: 眼睛睁开动画",
            "16.779s: 【最强】扫描光波扩散，粒子爆发",
            "17.269s: 数据流汇聚成地图",
            "17.760s: 3D 地图旋转展开",
            "18.251s: 热点标记逐个弹出",
        ],
    },
    {
        "name": "功能展示1 - AI 场景还原",
        "start_beat": 40,
        "end_beat": 52,
        "start_time": 19.232,
        "end_time": 25.131,
        "duration": 5.899,
        "frames": int(5.899 * FPS),
        "content": "展示 AI 如何还原舆情场景",
        "energy": "high",
    },
    {
        "name": "功能展示2 - 地图钻取",
        "start_beat": 52,
        "end_beat": 68,
        "start_time": 25.131,
        "end_time": 33.003,
        "duration": 7.872,
        "frames": int(7.872 * FPS),
        "content": "国家→省→市三级钻取",
        "energy": "medium-high",
    },
    {
        "name": "功能展示3 - 智能决策",
        "start_beat": 68,
        "end_beat": 84,
        "start_time": 33.003,
        "end_time": 40.875,
        "duration": 7.872,
        "frames": int(7.872 * FPS),
        "content": "Multi-Agent 决策推演",
        "energy": "medium",
    },
    {
        "name": "功能展示4 - 数据可视化",
        "start_beat": 84,
        "end_beat": 100,
        "start_time": 40.875,
        "end_time": 48.683,
        "duration": 7.808,
        "frames": int(7.808 * FPS),
        "content": "词云、趋势图等可视化",
        "energy": "medium",
    },
    {
        "name": "价值主张 - Slogan",
        "start_beat": 100,
        "end_beat": 112,
        "start_time": 48.683,
        "end_time": 54.443,
        "duration": 5.760,
        "frames": int(5.760 * FPS),
        "content": '"智见未来，舆领先机"',
        "energy": "low",
    },
    {
        "name": "结尾 - Logo 回归",
        "start_beat": 112,
        "end_beat": 122,
        "start_time": 54.443,
        "end_time": 59.339,
        "duration": 4.896,
        "frames": int(4.896 * FPS),
        "content": "Logo + 联系方式，淡出",
        "energy": "low",
    },
]

print("=" * 80)
print("重新设计的视频卡点方案")
print("核心：16 秒高潮处展示'智舆 - AI 的眼睛看见舆情'")
print("=" * 80)
print()

total_frames = 0
for i, scene in enumerate(scenes_redesign, 1):
    print(f"{i}. {scene['name']}")
    print(f"   节拍: {scene['start_beat']}-{scene['end_beat']}")
    print(f"   时间: {scene['start_time']:.3f}s - {scene['end_time']:.3f}s")
    print(f"   时长: {scene['duration']:.3f}s ({scene['frames']} 帧)")
    print(f"   能量: {scene['energy']}")
    print(f"   内容: {scene['content']}")
    if "visual_effects" in scene:
        print(f"   视觉效果:")
        for effect in scene["visual_effects"]:
            print(f"      {effect}")
    print()
    total_frames += scene["frames"]

print(f"总时长: {total_frames / FPS:.2f}秒 ({total_frames} 帧)")
print()

# 核心高潮段的精确卡点
print("=" * 80)
print("核心高潮段 (15.371s - 19.232s) 的精确卡点")
print("=" * 80)
print()

climax_beats = [
    {
        "time": 15.371,
        "beat": 32,
        "frame": int(15.371 * FPS),
        "action": 'Logo "智舆" 震撼出现',
        "energy": 0.4213,
    },
    {
        "time": 15.797,
        "beat": 33,
        "frame": int(15.797 * FPS),
        "action": '"AI 的眼睛" 文字浮现',
        "energy": 0.4213,
    },
    {
        "time": 16.288,
        "beat": 34,
        "frame": int(16.288 * FPS),
        "action": "眼睛图标出现，开始睁开",
        "energy": 0.4323,
    },
    {
        "time": 16.779,
        "beat": 35,
        "frame": int(16.779 * FPS),
        "action": "【最强峰值】眼睛完全睁开，扫描光波爆发",
        "energy": 0.4441,
    },
    {
        "time": 17.269,
        "beat": 36,
        "frame": int(17.269 * FPS),
        "action": '数据流汇聚，"看见舆情" 文字出现',
        "energy": 0.4177,
    },
    {
        "time": 17.760,
        "beat": 37,
        "frame": int(17.760 * FPS),
        "action": "3D 地图从数据流中展开",
        "energy": 0.4093,
    },
    {
        "time": 18.251,
        "beat": 38,
        "frame": int(18.251 * FPS),
        "action": "舆情热点标记逐个弹出",
        "energy": 0.4397,
    },
    {
        "time": 18.741,
        "beat": 39,
        "frame": int(18.741 * FPS),
        "action": "地图旋转，展示全局视角",
        "energy": 0.4219,
    },
]

for beat in climax_beats:
    print(
        f"{beat['time']:7.3f}s (节拍 {beat['beat']:2d}, 帧 {beat['frame']:4d}) - 能量 {beat['energy']:.4f}"
    )
    print(f"   动作: {beat['action']}")
    print()

print("=" * 80)
print("关键转场点")
print("=" * 80)
print()

transitions = [
    {"time": 3.755, "from": "开场", "to": "问题", "effect": "fade"},
    {"time": 9.653, "from": "问题", "to": "过渡", "effect": "slide from-right"},
    {"time": 15.371, "from": "过渡", "to": "【核心高潮】", "effect": "flash + scale"},
    {"time": 19.232, "from": "【核心高潮】", "to": "功能1", "effect": "fade"},
    {"time": 25.131, "from": "功能1", "to": "功能2", "effect": "slide from-left"},
    {"time": 33.003, "from": "功能2", "to": "功能3", "effect": "fade"},
    {"time": 40.875, "from": "功能3", "to": "功能4", "effect": "slide from-bottom"},
    {"time": 48.683, "from": "功能4", "to": "Slogan", "effect": "fade"},
    {"time": 54.443, "from": "Slogan", "to": "结尾", "effect": "fade"},
]

for trans in transitions:
    frame = int(trans["time"] * FPS)
    print(
        f"{trans['time']:7.3f}s (帧 {frame:4d}) - {trans['from']:15s} → {trans['to']:15s} [{trans['effect']}]"
    )

print()
print("=" * 80)
