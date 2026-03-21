"""
重新计算：让"智舆系统"在 15秒22帧（15.733秒，帧472）突然出现

当前情况：
- 产品介绍场景从 16.00秒（帧480）开始
- 需要在 15.733秒（帧472）显示"智舆系统"
- 差异：-0.267秒（-8帧）

解决方案：
需要让产品介绍场景提前开始，至少在 15.733秒之前

新的时间轴设计：
- 产品介绍场景从 15.00秒（帧450）开始
- 场景内第 22帧（15.733秒）时，"智舆系统"突然出现

调整方案：
- 开场 Logo：190帧 → 180帧 (-10帧)
- 问题场景：255帧 → 235帧 (-20帧)
- 转场保持不变
"""

FPS = 30

# 目标：15秒22帧 = 15.733秒 = 472帧
target_frame = 15 * FPS + 22  # 472帧
target_time = target_frame / FPS  # 15.733秒

print(f"目标时间: {target_time:.3f}秒 (帧 {target_frame})")
print()

# 新的场景设计
scenes_new = [
    {
        "name": "开场 Logo",
        "frames": 180,
        "transition": 15,
    },
    {
        "name": "问题场景",
        "frames": 235,
        "transition": 20,
    },
    {
        "name": "产品介绍 - 智舆系统",
        "frames": 331,
        "transition": 12,
    },
]

# 计算累计帧数
cumulative = 0
for i, scene in enumerate(scenes_new):
    scene["start_frame"] = cumulative
    scene["start_time"] = cumulative / FPS
    cumulative += scene["frames"]
    scene["end_frame"] = cumulative
    scene["end_time"] = cumulative / FPS
    cumulative += scene["transition"]

print("新的场景时间轴:")
print("=" * 80)
for i, scene in enumerate(scenes_new, 1):
    print(f"{i}. {scene['name']}")
    print(f"   开始: 帧 {scene['start_frame']:4d} ({scene['start_time']:6.2f}秒)")
    print(f"   结束: 帧 {scene['end_frame']:4d} ({scene['end_time']:6.2f}秒)")
    print(f"   时长: {scene['frames']} 帧 ({scene['frames'] / FPS:.2f}秒)")
    print(f"   转场: {scene['transition']} 帧")
    print()

# 验证产品介绍场景
product_start = scenes_new[2]["start_frame"]
product_start_time = product_start / FPS

print("=" * 80)
print("验证:")
print(f"产品介绍场景开始: 帧 {product_start} ({product_start_time:.3f}秒)")
print(f"目标时间: 帧 {target_frame} ({target_time:.3f}秒)")
print(f"场景内相对帧数: {target_frame - product_start}")
print()

if target_frame >= product_start:
    relative_frame = target_frame - product_start
    print(f"✓ 可行！在场景内第 {relative_frame} 帧显示'智舆系统'")
else:
    print(f"✗ 不可行！需要场景更早开始 {product_start - target_frame} 帧")

print()
print("=" * 80)
print("ProductWithScreenshots 场景内的动画时机:")
print("=" * 80)
print(f"场景开始 (帧0):        {product_start_time:.3f}秒")
print(f"'智舆系统'出现 (帧{target_frame - product_start}): {target_time:.3f}秒 ⭐")
print(f"副标题出现 (帧50):     {(product_start + 50) / FPS:.3f}秒")
print(f"截图出现 (帧90):       {(product_start + 90) / FPS:.3f}秒")
print("=" * 80)
