"""
重新计算场景时长，让"智舆系统"在 16 秒（480帧）出现

目标：
- 16.000s (帧480): "智舆系统"标题出现
- 16.779s (帧503): 最强峰值，标题完全展示
- 17.760s (帧532): 主界面截图出现

当前结构分析：
1. 开场 Logo: 0.053s - 5.227s (155帧)
2. 问题场景: 5.227s - 12.693s (223帧)
3. 产品介绍: 12.693s - 23.733s (331帧) <- 这个场景包含"智舆系统"

累计到产品介绍开始：155 + 15(转场) + 223 + 20(转场) = 413帧 = 13.77秒

问题：产品介绍从 13.77秒 开始，但我们需要它从 16秒 开始

解决方案：
需要在前面增加 480 - 413 = 67帧 = 2.23秒

方案1：延长开场 Logo
方案2：延长问题场景
方案3：增加一个新的过渡场景
方案4：调整多个场景的时长

推荐方案：调整前两个场景的时长
- 开场 Logo: 155帧 → 190帧 (+35帧, +1.17秒)
- 问题场景: 223帧 → 255帧 (+32帧, +1.07秒)

新的时间轴：
"""

FPS = 30

# 新的场景时长设计
scenes_adjusted = [
    {
        "name": "开场 Logo",
        "frames": 190,
        "duration": 190 / FPS,
        "start_frame": 0,
        "end_frame": 190,
        "start_time": 0.0,
        "end_time": 190 / FPS,
        "transition_frames": 15,
    },
    {
        "name": "问题场景",
        "frames": 255,
        "duration": 255 / FPS,
        "start_frame": 190 + 15,
        "end_frame": 190 + 15 + 255,
        "start_time": (190 + 15) / FPS,
        "end_time": (190 + 15 + 255) / FPS,
        "transition_frames": 20,
    },
    {
        "name": "产品介绍 - 智舆系统",
        "frames": 331,
        "duration": 331 / FPS,
        "start_frame": 190 + 15 + 255 + 20,
        "end_frame": 190 + 15 + 255 + 20 + 331,
        "start_time": (190 + 15 + 255 + 20) / FPS,
        "end_time": (190 + 15 + 255 + 20 + 331) / FPS,
        "transition_frames": 12,
        "note": "⭐ 这个场景从 16.00s 开始！",
    },
    {
        "name": "AI场景还原",
        "frames": 222,
        "duration": 222 / FPS,
        "start_frame": 190 + 15 + 255 + 20 + 331 + 12,
        "end_frame": 190 + 15 + 255 + 20 + 331 + 12 + 222,
        "start_time": (190 + 15 + 255 + 20 + 331 + 12) / FPS,
        "end_time": (190 + 15 + 255 + 20 + 331 + 12 + 222) / FPS,
        "transition_frames": 18,
    },
    {
        "name": "地图钻取",
        "frames": 240,
        "duration": 240 / FPS,
        "start_frame": 190 + 15 + 255 + 20 + 331 + 12 + 222 + 18,
        "end_frame": 190 + 15 + 255 + 20 + 331 + 12 + 222 + 18 + 240,
        "start_time": (190 + 15 + 255 + 20 + 331 + 12 + 222 + 18) / FPS,
        "end_time": (190 + 15 + 255 + 20 + 331 + 12 + 222 + 18 + 240) / FPS,
        "transition_frames": 15,
    },
    {
        "name": "智能决策",
        "frames": 240,
        "duration": 240 / FPS,
        "start_frame": 190 + 15 + 255 + 20 + 331 + 12 + 222 + 18 + 240 + 15,
        "end_frame": 190 + 15 + 255 + 20 + 331 + 12 + 222 + 18 + 240 + 15 + 240,
        "start_time": (190 + 15 + 255 + 20 + 331 + 12 + 222 + 18 + 240 + 15) / FPS,
        "end_time": (190 + 15 + 255 + 20 + 331 + 12 + 222 + 18 + 240 + 15 + 240) / FPS,
        "transition_frames": 18,
    },
    {
        "name": "数据可视化",
        "frames": 240,
        "duration": 240 / FPS,
        "start_frame": 190 + 15 + 255 + 20 + 331 + 12 + 222 + 18 + 240 + 15 + 240 + 18,
        "end_frame": 190
        + 15
        + 255
        + 20
        + 331
        + 12
        + 222
        + 18
        + 240
        + 15
        + 240
        + 18
        + 240,
        "start_time": (190 + 15 + 255 + 20 + 331 + 12 + 222 + 18 + 240 + 15 + 240 + 18)
        / FPS,
        "end_time": (
            190 + 15 + 255 + 20 + 331 + 12 + 222 + 18 + 240 + 15 + 240 + 18 + 240
        )
        / FPS,
        "transition_frames": 20,
    },
    {
        "name": "结尾 Slogan",
        "frames": 150,
        "duration": 150 / FPS,
        "start_frame": 190
        + 15
        + 255
        + 20
        + 331
        + 12
        + 222
        + 18
        + 240
        + 15
        + 240
        + 18
        + 240
        + 20,
        "end_frame": 190
        + 15
        + 255
        + 20
        + 331
        + 12
        + 222
        + 18
        + 240
        + 15
        + 240
        + 18
        + 240
        + 20
        + 150,
        "start_time": (
            190 + 15 + 255 + 20 + 331 + 12 + 222 + 18 + 240 + 15 + 240 + 18 + 240 + 20
        )
        / FPS,
        "end_time": (
            190
            + 15
            + 255
            + 20
            + 331
            + 12
            + 222
            + 18
            + 240
            + 15
            + 240
            + 18
            + 240
            + 20
            + 150
        )
        / FPS,
        "transition_frames": 25,
    },
    {
        "name": "尾声 Logo",
        "frames": 150,
        "duration": 150 / FPS,
        "start_frame": 190
        + 15
        + 255
        + 20
        + 331
        + 12
        + 222
        + 18
        + 240
        + 15
        + 240
        + 18
        + 240
        + 20
        + 150
        + 25,
        "end_frame": 190
        + 15
        + 255
        + 20
        + 331
        + 12
        + 222
        + 18
        + 240
        + 15
        + 240
        + 18
        + 240
        + 20
        + 150
        + 25
        + 150,
        "start_time": (
            190
            + 15
            + 255
            + 20
            + 331
            + 12
            + 222
            + 18
            + 240
            + 15
            + 240
            + 18
            + 240
            + 20
            + 150
            + 25
        )
        / FPS,
        "end_time": (
            190
            + 15
            + 255
            + 20
            + 331
            + 12
            + 222
            + 18
            + 240
            + 15
            + 240
            + 18
            + 240
            + 20
            + 150
            + 25
            + 150
        )
        / FPS,
        "transition_frames": 0,
    },
]

print("=" * 80)
print("调整后的场景时间轴 - 让'智舆系统'在 16 秒出现")
print("=" * 80)
print()

for i, scene in enumerate(scenes_adjusted, 1):
    print(f"{i}. {scene['name']}")
    print(f"   帧数: {scene['frames']} 帧 ({scene['duration']:.2f}秒)")
    print(f"   开始: 帧 {scene['start_frame']:4d} ({scene['start_time']:6.2f}秒)")
    print(f"   结束: 帧 {scene['end_frame']:4d} ({scene['end_time']:6.2f}秒)")
    if "note" in scene:
        print(f"   {scene['note']}")
    if scene["transition_frames"] > 0:
        print(f"   转场: {scene['transition_frames']} 帧")
    print()

total_frames = scenes_adjusted[-1]["end_frame"]
print(f"总时长: {total_frames / FPS:.2f}秒 ({total_frames} 帧)")
print()

# 验证关键时刻
product_start = scenes_adjusted[2]["start_frame"]
print("=" * 80)
print("关键时刻验证")
print("=" * 80)
print(f"产品介绍场景开始: 帧 {product_start} = {product_start / FPS:.3f}秒")
print(f"目标时间: 16.000秒 = 480帧")
print(f"差异: {product_start - 480} 帧 = {(product_start - 480) / FPS:.3f}秒")
print()

if abs(product_start - 480) <= 5:
    print("✓ 完美！'智舆系统'将在 16 秒左右出现")
else:
    print(f"✗ 需要调整，差异 {abs(product_start - 480)} 帧")

print()
print("=" * 80)
print("ProductWithScreenshots 场景内的关键帧")
print("=" * 80)
print(f"场景开始 (帧0):   {product_start / FPS:.3f}秒 - 开始淡入")
print(f"标题出现 (帧20):  {(product_start + 20) / FPS:.3f}秒 - '智舆系统'完全显示")
print(f"副标题 (帧50):    {(product_start + 50) / FPS:.3f}秒 - '用AI的眼睛看城市'")
print(f"截图出现 (帧90):  {(product_start + 90) / FPS:.3f}秒 - 主界面截图")
print()
print(f"16.779秒峰值对应场景内帧: {int((16.779 - product_start / FPS) * FPS)}")
print("=" * 80)
