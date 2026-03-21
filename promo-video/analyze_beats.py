import librosa
import numpy as np
import os


def analyze_beats_and_energy(filepath, output_file="beat_analysis.txt"):
    """
    分析音频的节拍、能量变化和频率特征
    生成详细的文字化时间轴，用于视频卡点
    """

    print(f"正在加载音频文件: {filepath}")
    y, sr = librosa.load(filepath, sr=None)
    duration = len(y) / sr

    print(f"采样率: {sr} Hz")
    print(f"音频时长: {duration:.2f} 秒\n")

    # 1. 节拍检测
    print("检测节拍...")
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
    tempo_val = tempo[0] if isinstance(tempo, np.ndarray) else tempo
    beat_times = librosa.frames_to_time(beats, sr=sr)

    # 2. 能量分析 (RMS)
    print("分析能量...")
    rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=512)[0]
    rms_times = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=512)

    # 3. 频谱分析
    print("分析频谱...")
    D = librosa.stft(y)
    magnitude = np.abs(D)
    freqs = librosa.fft_frequencies(sr=sr)

    # 定义频段
    low_freq_mask = (freqs >= 20) & (freqs < 250)
    mid_freq_mask = (freqs >= 250) & (freqs < 4000)
    high_freq_mask = (freqs >= 4000) & (freqs < 20000)

    # 计算每个频段的能量
    low_energy = np.mean(magnitude[low_freq_mask, :], axis=0)
    mid_energy = np.mean(magnitude[mid_freq_mask, :], axis=0)
    high_energy = np.mean(magnitude[high_freq_mask, :], axis=0)

    spec_times = librosa.frames_to_time(np.arange(len(low_energy)), sr=sr)

    # 4. 检测能量峰值（用于卡点）
    print("检测能量峰值...")
    from scipy.signal import find_peaks

    # 找出 RMS 能量峰值
    rms_peaks, _ = find_peaks(
        rms, distance=int(sr / 512 * 0.3), prominence=np.std(rms) * 0.5
    )
    peak_times = rms_times[rms_peaks]

    # 5. 检测频率变化点
    print("检测频率变化...")

    # 计算频率能量比例的变化
    total_energy = low_energy + mid_energy + high_energy + 1e-10
    low_ratio = low_energy / total_energy
    mid_ratio = mid_energy / total_energy
    high_ratio = high_energy / total_energy

    # 检测低频突变点
    low_diff = np.abs(np.diff(low_ratio))
    low_changes, _ = find_peaks(
        low_diff, distance=int(sr / 2048 * 1.0), prominence=np.std(low_diff) * 1.5
    )

    # 检测高频突变点
    high_diff = np.abs(np.diff(high_ratio))
    high_changes, _ = find_peaks(
        high_diff, distance=int(sr / 2048 * 1.0), prominence=np.std(high_diff) * 1.5
    )

    # 6. 生成文字化报告
    print(f"\n生成分析报告到: {output_file}")

    with open(output_file, "w", encoding="utf-8") as f:
        f.write("=" * 80 + "\n")
        f.write("BGM 时间轴能量与频率分析 - 用于视频卡点\n")
        f.write("=" * 80 + "\n\n")

        f.write(f"音频文件: {filepath}\n")
        f.write(f"时长: {duration:.2f} 秒\n")
        f.write(f"BPM: {tempo_val:.1f}\n")
        f.write(f"检测到的节拍数: {len(beat_times)}\n")
        f.write(f"检测到的能量峰值: {len(peak_times)}\n\n")

        # 整体频率分布
        f.write("-" * 80 + "\n")
        f.write("整体频率能量分布\n")
        f.write("-" * 80 + "\n")
        total_low = np.sum(low_energy)
        total_mid = np.sum(mid_energy)
        total_high = np.sum(high_energy)
        total_all = total_low + total_mid + total_high

        f.write(f"低频 (20-250 Hz):     {total_low / total_all * 100:.1f}%\n")
        f.write(f"中频 (250-4000 Hz):   {total_mid / total_all * 100:.1f}%\n")
        f.write(f"高频 (4000-20000 Hz): {total_high / total_all * 100:.1f}%\n\n")

        # 按时间段分析（每5秒）
        f.write("-" * 80 + "\n")
        f.write("时间段频率特征分析（每5秒）\n")
        f.write("-" * 80 + "\n\n")

        segment_duration = 5.0
        num_segments = int(np.ceil(duration / segment_duration))

        for i in range(num_segments):
            start_time = i * segment_duration
            end_time = min((i + 1) * segment_duration, duration)

            # 找到这个时间段的索引
            start_idx = int(start_time * sr / 2048)
            end_idx = int(end_time * sr / 2048)

            if end_idx > len(low_energy):
                end_idx = len(low_energy)

            # 计算这个时间段的平均能量
            seg_low = np.mean(low_energy[start_idx:end_idx])
            seg_mid = np.mean(mid_energy[start_idx:end_idx])
            seg_high = np.mean(high_energy[start_idx:end_idx])
            seg_total = seg_low + seg_mid + seg_high

            # 计算这个时间段的 RMS
            rms_start = int(start_time * sr / 512)
            rms_end = int(end_time * sr / 512)
            if rms_end > len(rms):
                rms_end = len(rms)
            seg_rms = np.mean(rms[rms_start:rms_end])

            f.write(f"[{start_time:6.2f}s - {end_time:6.2f}s]\n")
            f.write(f"  整体能量: {seg_rms:.4f}\n")
            f.write(f"  低频: {seg_low / seg_total * 100:5.1f}%  ")
            f.write(f"中频: {seg_mid / seg_total * 100:5.1f}%  ")
            f.write(f"高频: {seg_high / seg_total * 100:5.1f}%\n")

            # 特征描述
            if seg_low / seg_total > 0.45:
                f.write(f"  特征: 低频主导，适合展示稳重/大气的画面\n")
            elif seg_high / seg_total > 0.20:
                f.write(f"  特征: 高频明显，适合展示明亮/科技感画面\n")
            else:
                f.write(f"  特征: 中频为主，适合展示清晰/叙事性画面\n")

            # 找出这个时间段内的节拍
            beats_in_segment = beat_times[
                (beat_times >= start_time) & (beat_times < end_time)
            ]
            if len(beats_in_segment) > 0:
                f.write(f"  节拍点: {len(beats_in_segment)} 个\n")

            f.write("\n")

        # 关键卡点时间戳
        f.write("-" * 80 + "\n")
        f.write("关键卡点时间戳（能量峰值）\n")
        f.write("-" * 80 + "\n\n")

        f.write("这些时间点适合放置重要的视觉转场或关键信息：\n\n")

        for i, peak_time in enumerate(peak_times[:50]):  # 只输出前50个
            # 找到最接近的频谱索引
            spec_idx = int(peak_time * sr / 2048)
            if spec_idx >= len(low_energy):
                spec_idx = len(low_energy) - 1

            # 获取这个时刻的频率特征
            peak_low = low_energy[spec_idx]
            peak_mid = mid_energy[spec_idx]
            peak_high = high_energy[spec_idx]
            peak_total = peak_low + peak_mid + peak_high

            # 获取 RMS
            rms_idx = int(peak_time * sr / 512)
            if rms_idx >= len(rms):
                rms_idx = len(rms) - 1
            peak_rms = rms[rms_idx]

            f.write(f"{i + 1:3d}. {peak_time:7.3f}s  ")
            f.write(f"能量:{peak_rms:.4f}  ")
            f.write(f"低:{peak_low / peak_total * 100:4.1f}% ")
            f.write(f"中:{peak_mid / peak_total * 100:4.1f}% ")
            f.write(f"高:{peak_high / peak_total * 100:4.1f}%")

            # 推荐的视觉效果
            if peak_low / peak_total > 0.5:
                f.write("  [推荐: 重击/震撼效果]")
            elif peak_high / peak_total > 0.25:
                f.write("  [推荐: 闪光/科技效果]")
            else:
                f.write("  [推荐: 快速转场]")

            f.write("\n")

        # 节拍时间戳
        f.write("\n" + "-" * 80 + "\n")
        f.write("所有节拍时间戳（用于精确同步）\n")
        f.write("-" * 80 + "\n\n")

        f.write(f"BPM: {tempo_val:.1f}，平均每拍间隔: {60 / tempo_val:.3f}秒\n\n")

        for i in range(0, len(beat_times), 10):
            line_beats = beat_times[i : i + 10]
            f.write(f"节拍 {i + 1:3d}-{min(i + 10, len(beat_times)):3d}: ")
            f.write(", ".join([f"{t:6.3f}s" for t in line_beats]))
            f.write("\n")

        # 频率变化点
        f.write("\n" + "-" * 80 + "\n")
        f.write("频率特征变化点（适合场景切换）\n")
        f.write("-" * 80 + "\n\n")

        f.write("低频突变点（适合切换到重要场景）：\n")
        for i, idx in enumerate(low_changes[:20]):
            change_time = spec_times[idx]
            f.write(f"  {i + 1:2d}. {change_time:7.3f}s\n")

        f.write("\n高频突变点（适合切换到明亮/科技场景）：\n")
        for i, idx in enumerate(high_changes[:20]):
            change_time = spec_times[idx]
            f.write(f"  {i + 1:2d}. {change_time:7.3f}s\n")

        # Remotion 集成建议
        f.write("\n" + "=" * 80 + "\n")
        f.write("Remotion 视频卡点建议\n")
        f.write("=" * 80 + "\n\n")

        f.write("基于以上分析，建议的视频时间轴结构：\n\n")

        # 根据能量和频率特征推荐场景
        segments_info = []
        for i in range(num_segments):
            start_time = i * segment_duration
            end_time = min((i + 1) * segment_duration, duration)

            start_idx = int(start_time * sr / 2048)
            end_idx = int(end_time * sr / 2048)
            if end_idx > len(low_energy):
                end_idx = len(low_energy)

            seg_low = np.mean(low_energy[start_idx:end_idx])
            seg_mid = np.mean(mid_energy[start_idx:end_idx])
            seg_high = np.mean(high_energy[start_idx:end_idx])
            seg_total = seg_low + seg_mid + seg_high

            rms_start = int(start_time * sr / 512)
            rms_end = int(end_time * sr / 512)
            if rms_end > len(rms):
                rms_end = len(rms)
            seg_rms = np.mean(rms[rms_start:rms_end])

            segments_info.append(
                {
                    "start": start_time,
                    "end": end_time,
                    "rms": seg_rms,
                    "low_pct": seg_low / seg_total,
                    "mid_pct": seg_mid / seg_total,
                    "high_pct": seg_high / seg_total,
                }
            )

        # 找出高能量段（高潮）
        rms_values = [s["rms"] for s in segments_info]
        rms_mean = np.mean(rms_values)
        rms_std = np.std(rms_values)

        for i, seg in enumerate(segments_info):
            f.write(f"{i + 1:2d}. [{seg['start']:6.2f}s - {seg['end']:6.2f}s]  ")

            if seg["rms"] > rms_mean + rms_std:
                f.write("【高潮段】")
            elif seg["rms"] < rms_mean - rms_std:
                f.write("【平静段】")
            else:
                f.write("【过渡段】")

            f.write(f"  能量:{seg['rms']:.4f}  ")

            # 推荐场景类型
            if seg["low_pct"] > 0.45:
                f.write("推荐: Logo展示/产品特写/重要信息")
            elif seg["high_pct"] > 0.20:
                f.write("推荐: 科技界面/数据可视化/动态效果")
            else:
                f.write("推荐: 功能介绍/文字说明/流畅转场")

            f.write("\n")

        f.write("\n" + "=" * 80 + "\n")
        f.write("分析完成\n")
        f.write("=" * 80 + "\n")

    print(f"\n分析完成！报告已保存到: {output_file}")
    print(f"\n关键数据摘要:")
    print(f"  总时长: {duration:.2f}秒")
    print(f"  BPM: {tempo_val:.1f}")
    print(f"  节拍数: {len(beat_times)}")
    print(f"  能量峰值: {len(peak_times)}")
    print(f"  低频变化点: {len(low_changes)}")
    print(f"  高频变化点: {len(high_changes)}")

    return {
        "duration": duration,
        "tempo": tempo_val,
        "beat_times": beat_times,
        "peak_times": peak_times,
        "segments": segments_info,
    }


if __name__ == "__main__":
    filepath = "public/musc/Apple Horizon.mp3"

    if not os.path.exists(filepath):
        print(f"错误: 找不到文件 {filepath}")
    else:
        results = analyze_beats_and_energy(filepath)
