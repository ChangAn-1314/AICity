<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useSentimentStore } from '@/stores/sentiment';
import * as echarts from 'echarts';
import 'echarts-wordcloud';

const sentimentStore = useSentimentStore();
const chartRef = ref(null);
let chartInstance = null;
let resizeObserver = null;

// Mock keywords if store is empty, though store should have them now
const keywords = computed(() => {
  return sentimentStore.analysisResult?.keywords || [];
});

const initChart = () => {
  if (!chartRef.value) return;
  
  chartInstance = echarts.init(chartRef.value);
  updateChart();
  
  // Use ResizeObserver for robust resizing
  resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize();
  });
  resizeObserver.observe(chartRef.value);
};

const updateChart = () => {
  if (!chartInstance || keywords.value.length === 0) return;

  const option = {
    tooltip: {
      show: true
    },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '100%',
      height: '100%',
      right: null,
      bottom: null,
      sizeRange: [12, 40], // 字号范围
      rotationRange: [-45, 45], // 旋转角度范围
      rotationStep: 15,
      gridSize: 8,
      drawOutOfBound: false,
      layoutAnimation: true,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: function () {
          // Cyberpunk colors
          const colors = [
            '#06b6d4', // cyan-500
            '#22d3ee', // cyan-400
            '#a855f7', // purple-500
            '#c084fc', // purple-400
            '#ec4899', // pink-500
            '#f472b6', // pink-400
            '#facc15', // yellow-400
            '#94a3b8'  // slate-400 (for smaller words)
          ];
          return colors[Math.floor(Math.random() * colors.length)];
        }
      },
      emphasis: {
        focus: 'self',
        textStyle: {
          textShadowBlur: 10,
          textShadowColor: '#333'
        }
      },
      data: keywords.value
    }]
  };

  chartInstance.setOption(option);
};

watch(keywords, (newVal) => {
  if (newVal.length > 0) {
    if (!chartInstance) {
      initChart();
    } else {
      updateChart();
    }
  }
}, { deep: true });

onMounted(() => {
  // Ensure data is fetched
  if (sentimentStore.hotspots.length === 0) {
    sentimentStore.fetchHotspots();
  }
  // Delay init to ensure DOM is ready
  setTimeout(() => {
    if (keywords.value.length > 0) {
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
    <h3 class="text-sm font-mono text-cyan-400 mb-2 flex items-center gap-2 shrink-0">
      <span class="text-lg">#</span> 舆情关键词云
    </h3>
    
    <div class="flex-1 bg-slate-900/40 rounded-lg border border-cyan-500/20 relative overflow-hidden min-h-[180px]">
      <!-- 始终渲染图表容器，确保 ref 可用 -->
      <div ref="chartRef" class="w-full h-full absolute inset-0"></div>
      
      <!-- Empty State -->
      <div v-if="keywords.length === 0" class="absolute inset-0 flex items-center justify-center text-slate-500 text-xs z-10">
        暂无关键词数据
      </div>
    </div>
  </div>
</template>
