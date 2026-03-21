import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
import os


def analyze_audio_spectrum(filepath, output_dir="audio_analysis"):
    """
    完整的音频频谱分析
    生成：
    1. 波形图
    2. 频谱图（Spectrogram）
    3. 梅尔频谱图（Mel Spectrogram）
    4. 色度图（Chromagram）
    5. 频率统计分析
    """

    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)

    print(f"正在加载音频文件: {filepath}")

    # 加载音频文件
    y, sr = librosa.load(filepath, sr=None)

    print(f"采样率: {sr} Hz")
    print(f"音频时长: {len(y) / sr:.2f} 秒")
    print(f"音频数据点数: {len(y)}")

    # 创建大图，包含多个子图
    fig = plt.figure(figsize=(16, 12))

    # 1. 波形图
    plt.subplot(3, 2, 1)
    librosa.display.waveshow(y, sr=sr, alpha=0.8)
    plt.title("波形图 (Waveform)", fontsize=14, fontproperties="SimHei")
    plt.xlabel("时间 (秒)", fontproperties="SimHei")
    plt.ylabel("振幅", fontproperties="SimHei")
    plt.grid(True, alpha=0.3)

    # 2. 短时傅里叶变换 (STFT) 频谱图
    plt.subplot(3, 2, 2)
    D = librosa.stft(y)
    S_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)
    img = librosa.display.specshow(
        S_db, sr=sr, x_axis="time", y_axis="hz", cmap="viridis"
    )
    plt.colorbar(img, format="%+2.0f dB")
    plt.title("频谱图 (Spectrogram)", fontsize=14, fontproperties="SimHei")
    plt.xlabel("时间 (秒)", fontproperties="SimHei")
    plt.ylabel("频率 (Hz)", fontproperties="SimHei")

    # 3. 梅尔频谱图
    plt.subplot(3, 2, 3)
    S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128)
    S_db_mel = librosa.power_to_db(S, ref=np.max)
    img = librosa.display.specshow(
        S_db_mel, sr=sr, x_axis="time", y_axis="mel", cmap="magma"
    )
    plt.colorbar(img, format="%+2.0f dB")
    plt.title("梅尔频谱图 (Mel Spectrogram)", fontsize=14, fontproperties="SimHei")
    plt.xlabel("时间 (秒)", fontproperties="SimHei")
    plt.ylabel("梅尔频率", fontproperties="SimHei")

    # 4. 色度图
    plt.subplot(3, 2, 4)
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    img = librosa.display.specshow(
        chroma, sr=sr, x_axis="time", y_axis="chroma", cmap="coolwarm"
    )
    plt.colorbar(img)
    plt.title("色度图 (Chromagram)", fontsize=14, fontproperties="SimHei")
    plt.xlabel("时间 (秒)", fontproperties="SimHei")
    plt.ylabel("音高类别", fontproperties="SimHei")

    # 5. 频率能量分布（低频、中频、高频）
    plt.subplot(3, 2, 5)

    # 计算不同频段的能量
    # 低频: 20-250 Hz
    # 中频: 250-4000 Hz
    # 高频: 4000-20000 Hz

    freqs = librosa.fft_frequencies(sr=sr)
    magnitude = np.abs(D)

    # 计算每个频段的平均能量随时间变化
    low_freq_mask = (freqs >= 20) & (freqs < 250)
    mid_freq_mask = (freqs >= 250) & (freqs < 4000)
    high_freq_mask = (freqs >= 4000) & (freqs < 20000)

    low_energy = np.mean(magnitude[low_freq_mask, :], axis=0)
    mid_energy = np.mean(magnitude[mid_freq_mask, :], axis=0)
    high_energy = np.mean(magnitude[high_freq_mask, :], axis=0)

    times = librosa.frames_to_time(np.arange(len(low_energy)), sr=sr)

    plt.plot(times, low_energy, label="低频 (20-250 Hz)", alpha=0.7, linewidth=2)
    plt.plot(times, mid_energy, label="中频 (250-4000 Hz)", alpha=0.7, linewidth=2)
    plt.plot(times, high_energy, label="高频 (4000-20000 Hz)", alpha=0.7, linewidth=2)
    plt.title("频段能量分布", fontsize=14, fontproperties="SimHei")
    plt.xlabel("时间 (秒)", fontproperties="SimHei")
    plt.ylabel("能量", fontproperties="SimHei")
    plt.legend(prop={"family": "SimHei"})
    plt.grid(True, alpha=0.3)

    # 6. 整体频率分布直方图
    plt.subplot(3, 2, 6)

    # 计算整首歌的平均频谱
    avg_spectrum = np.mean(magnitude, axis=1)

    plt.plot(freqs[: len(freqs) // 2], avg_spectrum[: len(freqs) // 2])
    plt.title("平均频率分布", fontsize=14, fontproperties="SimHei")
    plt.xlabel("频率 (Hz)", fontproperties="SimHei")
    plt.ylabel("平均幅度", fontproperties="SimHei")
    plt.xscale("log")
    plt.grid(True, alpha=0.3)

    plt.tight_layout()

    # 保存图像
    output_path = os.path.join(output_dir, "spectrum_analysis.png")
    plt.savefig(output_path, dpi=150, bbox_inches="tight")
    print(f"\n频谱分析图已保存到: {output_path}")

    # 打印统计信息
    print("\n=== 频率分析统计 ===")

    total_energy = np.sum(magnitude)
    low_total = np.sum(magnitude[low_freq_mask, :])
    mid_total = np.sum(magnitude[mid_freq_mask, :])
    high_total = np.sum(magnitude[high_freq_mask, :])

    print(f"\n能量分布:")
    print(f"  低频 (20-250 Hz):     {low_total / total_energy * 100:.1f}%")
    print(f"  中频 (250-4000 Hz):   {mid_total / total_energy * 100:.1f}%")
    print(f"  高频 (4000-20000 Hz): {high_total / total_energy * 100:.1f}%")

    # 找出能量最强的频率
    peak_freq_idx = np.argmax(avg_spectrum[: len(freqs) // 2])
    peak_freq = freqs[peak_freq_idx]
    print(f"\n主导频率: {peak_freq:.1f} Hz")

    # 计算动态范围
    rms = librosa.feature.rms(y=y)[0]
    dynamic_range = 20 * np.log10(np.max(rms) / (np.min(rms) + 1e-10))
    print(f"动态范围: {dynamic_range:.1f} dB")

    # 节奏分析
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
    tempo_val = tempo[0] if isinstance(tempo, np.ndarray) else tempo
    print(f"\n节奏信息:")
    print(f"  估算 BPM: {tempo_val:.1f}")
    print(f"  检测到的节拍数: {len(beats)}")

    # 音调分析
    print(f"\n音调特征:")
    chroma_mean = np.mean(chroma, axis=1)
    dominant_pitch = np.argmax(chroma_mean)
    pitch_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    print(f"  主导音高: {pitch_names[dominant_pitch]}")

    print("\n=== 音频质量评估 ===")
    print(f"采样率 {sr} Hz 理论支持的最高频率: {sr / 2} Hz")

    # 检查高频能量
    if high_total / total_energy < 0.1:
        print("[!] 高频能量较低，可能是低比特率压缩导致")
    else:
        print("[OK] 高频保留良好")

    if sr < 44100:
        print("[!] 采样率低于 CD 质量 (44.1 kHz)")
    else:
        print("[OK] 采样率符合标准")

    return {
        "sr": sr,
        "duration": len(y) / sr,
        "tempo": tempo_val,
        "low_freq_pct": low_total / total_energy * 100,
        "mid_freq_pct": mid_total / total_energy * 100,
        "high_freq_pct": high_total / total_energy * 100,
        "peak_freq": peak_freq,
        "dynamic_range": dynamic_range,
    }


if __name__ == "__main__":
    filepath = "public/musc/Apple Horizon.mp3"

    if not os.path.exists(filepath):
        print(f"错误: 找不到文件 {filepath}")
    else:
        results = analyze_audio_spectrum(filepath)

        print("\n" + "=" * 50)
        print("分析完成！")
        print("=" * 50)
