<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useSentimentStore } from '@/stores/sentiment';
import * as echarts from 'echarts';

const sentimentStore = useSentimentStore();
const chartRef = ref(null);
let chartInstance = null;

const trends = computed(() => {
  return sentimentStore.analysisResult?.trends || { dates: [], historical: [], prediction: [] };
});

let resizeObserver = null;

const initChart = () => {
  if (!chartRef.value) return;
  
  chartInstance = echarts.init(chartRef.value);
  updateChart();
  
  resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize();
  });
  resizeObserver.observe(chartRef.value);
};

const updateChart = () => {
  if (!chartInstance || trends.value.dates.length === 0) return;

  const option = {
    grid: {
      top: '15%',
      left: '10%',
      right: '5%',
      bottom: '10%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#64748b'
        }
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trends.value.dates,
      axisLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.1)'
        }
      },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.05)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 10
      }
    },
    series: [
      {
        name: '历史趋势',
        type: 'line',
        data: trends.value.historical,
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: '#06b6d4' // cyan-500
        },
        lineStyle: {
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(6,182,212,0.3)' },
            { offset: 1, color: 'rgba(6,182,212,0)' }
          ])
        }
      },
      {
        name: 'AI预测',
        type: 'line',
        data: trends.value.prediction,
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: '#ec4899' // pink-500
        },
        lineStyle: {
          width: 3,
          type: 'dashed'
        }
      }
    ]
  };

  chartInstance.setOption(option);
};

watch(trends, (newVal) => {
  if (newVal.dates.length > 0) {
    if (!chartInstance) {
      initChart();
    } else {
      updateChart();
    }
  }
}, { deep: true });

onMounted(() => {
  if (sentimentStore.hotspots.length === 0) {
    sentimentStore.fetchHotspots();
  }
  // Delay init to ensure DOM is ready
  setTimeout(() => {
    if (trends.value.dates.length > 0) {
      initChart();
    }
  }, 100);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  chartInstance?.dispose();
});
</script>

<template>
  <div class="h-full flex flex-col">
    <h3 class="text-sm font-mono text-cyan-400 mb-2 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <span class="text-lg">~</span> 舆情趋势预测
      </div>
      <span class="text-xs bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded animate-pulse">+12%</span>
    </h3>
    
    <div class="flex-1 bg-slate-900/40 rounded-lg border border-cyan-500/20 relative overflow-hidden min-h-[180px]">
      <!-- 始终渲染图表容器，确保 ref 可用 -->
      <div ref="chartRef" class="w-full h-full absolute inset-0"></div>
      
      <!-- Empty State -->
      <div v-if="trends.dates.length === 0" class="absolute inset-0 flex items-center justify-center text-slate-500 text-xs z-10">
        暂无趋势数据
      </div>
    </div>
  </div>
</template>
