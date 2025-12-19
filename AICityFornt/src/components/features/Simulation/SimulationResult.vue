<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  result: {
    type: Object,
    required: true
  }
});

const chartRef = ref(null);
let chartInstance = null;

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

  // Mock scenarios if not provided
  const scenarios = props.result.scenarios || {
    optimistic: { risk: -25, sentiment: +15 },
    neutral: { risk: -15, sentiment: +8 },
    pessimistic: { risk: -5, sentiment: +2 }
  };

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      textStyle: { color: '#94a3b8', fontSize: 10 },
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10
    },
    grid: {
      top: '10%',
      left: '3%',
      right: '4%',
      bottom: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['乐观', '中性', '悲观'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { color: 'rgba(255,255,255,0.05)', type: 'dashed' }
      },
      axisLabel: { color: '#94a3b8' }
    },
    series: [
      {
        name: '风险降低(%)',
        type: 'bar',
        data: [
          Math.abs(scenarios.optimistic.risk), 
          Math.abs(scenarios.neutral.risk), 
          Math.abs(scenarios.pessimistic.risk)
        ],
        itemStyle: { color: '#10b981' }, // emerald-500
        barWidth: '30%'
      },
      {
        name: '情感提升(%)',
        type: 'bar',
        data: [
          scenarios.optimistic.sentiment, 
          scenarios.neutral.sentiment, 
          scenarios.pessimistic.sentiment
        ],
        itemStyle: { color: '#f472b6' }, // pink-400
        barWidth: '30%'
      }
    ]
  };

  chartInstance.setOption(option);
};

watch(() => props.result, () => {
  updateChart();
}, { deep: true });

onMounted(() => {
  // Short delay to ensure container is ready
  setTimeout(initChart, 100);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart);
  chartInstance?.dispose();
});
</script>

<template>
  <div class="h-full flex flex-col">
    <h4 class="text-xs text-cyan-400 font-mono mb-2 flex items-center gap-2">
      <div class="w-1 h-3 bg-cyan-400 rounded-full"></div>
      多场景模拟对比
    </h4>
    
    <div class="flex-1 relative min-h-[120px]">
      <div ref="chartRef" class="w-full h-full absolute inset-0"></div>
    </div>
    
    <div class="mt-2 bg-slate-800/50 rounded p-2 border border-white/5">
      <div class="text-xs text-slate-400 mb-1">AI 推荐建议</div>
      <p class="text-xs text-slate-200 leading-relaxed">
        综合评估，<span class="text-emerald-400">中性策略</span>性价比较高。虽然乐观策略收益最大，但执行成本较高且存在不确定性。建议优先考虑当前方案。
      </p>
    </div>
  </div>
</template>
