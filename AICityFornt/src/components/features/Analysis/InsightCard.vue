<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useSentimentStore } from "@/stores/sentiment";
import * as echarts from 'echarts';

const sentimentStore = useSentimentStore();
const chartRef = ref(null);
let chartInstance = null;

// Computed stats from store
const stats = computed(() => {
  const hotspots = sentimentStore.hotspots;
  const total = hotspots.length;
  
  if (total === 0) return { total: 0, highCount: 0, negativeRatio: 0, positiveRatio: 0, neutralRatio: 0 };

  // Mock sentiment distribution based on levels if analysisResult is missing
  // In a real app, this would come from AI analysis
  const highCount = hotspots.filter(h => h.level === 'high').length;
  const mediumCount = hotspots.filter(h => h.level === 'medium').length;
  const lowCount = hotspots.filter(h => h.level === 'low').length;
  
  // Calculate ratios (Mock logic: High level -> Negative, Low -> Positive/Neutral)
  const negative = Math.round((highCount / total) * 100) || 0;
  const neutral = Math.round((mediumCount / total) * 100) || 0;
  const positive = 100 - negative - neutral;

  return {
    total,
    highCount,
    negativeRatio: negative,
    neutralRatio: neutral,
    positiveRatio: positive
  };
});

// Find top event for summary
const topEvent = computed(() => {
  const hotspots = sentimentStore.hotspots;
  if (hotspots.length === 0) return null;
  return hotspots.find(h => h.level === 'high') || hotspots[0];
});

const initChart = () => {
  if (!chartRef.value) return;
  
  chartInstance = echarts.init(chartRef.value);
  updateChart();
  
  window.addEventListener('resize', resizeChart);
};

const resizeChart = () => {
  chartInstance?.resize();
};

const updateChart = () => {
  if (!chartInstance) return;

  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 5,
        radius: '100%',
        center: ['50%', '75%'],
        itemStyle: {
          color: '#f472b6', // pink-400
          shadowColor: 'rgba(244, 114, 182, 0.45)',
          shadowBlur: 10,
          shadowOffsetX: 2,
          shadowOffsetY: 2
        },
        progress: {
          show: true,
          roundCap: true,
          width: 8
        },
        pointer: {
          show: false
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 8,
            color: [[1, 'rgba(255,255,255,0.1)']]
          }
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        title: {
          show: true,
          fontSize: 12,
          color: '#94a3b8', // slate-400
          offsetCenter: [0, '20%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, '-20%'],
          fontSize: 24,
          fontWeight: 'bold',
          formatter: '{value}%',
          color: '#fff'
        },
        data: [
          {
            value: stats.value.negativeRatio,
            name: '负面指数'
          }
        ]
      }
    ]
  };

  chartInstance.setOption(option);
};

watch(stats, () => {
  updateChart();
});

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart);
  chartInstance?.dispose();
});
</script>

<template>
  <div class="h-full flex flex-col">
    <h3 class="text-sm font-mono text-purple-400 mb-2 flex items-center gap-2 shrink-0">
      <span class="text-lg">*</span> AI 智能分析
    </h3>
    
    <div v-if="topEvent" class="flex-1 bg-purple-900/10 rounded-lg p-3 border border-purple-500/20 flex flex-col relative overflow-hidden">
      <!-- Background decorative elements -->
      <div class="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <!-- Text Summary -->
      <div class="text-xs text-purple-200/70 uppercase font-bold tracking-wider mb-2">
        事件摘要
      </div>
      <p class="text-sm text-slate-300 leading-snug mb-3">
        检测到 <strong class="text-pink-400">{{ topEvent.title }}</strong> 异常。
        与<strong class="text-cyan-400">{{ topEvent.category }}</strong>关联度
        <strong class="text-purple-400">87%</strong>。
      </p>
      
      <!-- Chart Area -->
      <div class="flex-1 flex items-center justify-center relative min-h-[100px]">
        <!-- Gauge Chart -->
        <div ref="chartRef" class="w-full h-full absolute inset-0"></div>
        
        <!-- Legend/Stats -->
        <div class="absolute bottom-0 w-full flex justify-between text-xs px-2">
          <div class="flex flex-col items-center">
            <span class="text-cyan-400 font-bold">{{ stats.positiveRatio }}%</span>
            <span class="text-slate-500 scale-75">正面</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-slate-300 font-bold">{{ stats.neutralRatio }}%</span>
            <span class="text-slate-500 scale-75">中立</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-pink-400 font-bold">{{ stats.negativeRatio }}%</span>
            <span class="text-slate-500 scale-75">负面</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="flex-1 bg-purple-900/10 rounded-lg p-3 border border-purple-500/20 flex items-center justify-center text-slate-500 text-xs">
      暂无分析数据
    </div>
  </div>
</template>
