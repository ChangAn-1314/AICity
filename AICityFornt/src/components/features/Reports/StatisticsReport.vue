<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import { reportApi } from '@/api/report';
import { Refresh } from '@element-plus/icons-vue';

const granularity = ref('day');
const loading = ref(false);
const chartRefs = {
  trend: ref(null),
  pie: ref(null),
  bar: ref(null)
};
const charts = {};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await reportApi.getStatistics({ granularity: granularity.value });
    updateCharts(res.data);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const initCharts = () => {
  if (chartRefs.trend.value) charts.trend = echarts.init(chartRefs.trend.value);
  if (chartRefs.pie.value) charts.pie = echarts.init(chartRefs.pie.value);
  if (chartRefs.bar.value) charts.bar = echarts.init(chartRefs.bar.value);
};

const updateCharts = (data) => {
  if (!data) return;

  // Trend Chart
  if (charts.trend) {
    charts.trend.setOption({
      tooltip: { trigger: 'axis' },
      legend: { textStyle: { color: '#94a3b8' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { 
        type: 'category', 
        boundaryGap: false, 
        data: data.trend.xAxis,
        axisLabel: { color: '#94a3b8' }
      },
      yAxis: { 
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#94a3b8' }
      },
      series: data.trend.series.map(s => ({
        ...s,
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.1 }
      }))
    });
  }

  // Pie Chart
  if (charts.pie) {
    charts.pie.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: '0%', left: 'center', textStyle: { color: '#94a3b8' } },
      series: [
        {
          name: '分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          itemStyle: {
            borderRadius: 5,
            borderColor: '#0f172a',
            borderWidth: 2
          },
          label: { show: false },
          data: data.distribution
        }
      ]
    });
  }

  // Bar Chart
  if (charts.bar) {
    charts.bar.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { textStyle: { color: '#94a3b8' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { 
        type: 'category', 
        data: data.comparison.categories,
        axisLabel: { color: '#94a3b8' }
      },
      yAxis: { 
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#94a3b8' }
      },
      series: data.comparison.series.map(s => ({
        ...s,
        type: 'bar',
        itemStyle: { borderRadius: [4, 4, 0, 0] }
      }))
    });
  }
};

const handleResize = () => {
  Object.values(charts).forEach(chart => chart?.resize());
};

watch(granularity, () => {
  fetchData();
});

onMounted(async () => {
  await nextTick();
  initCharts();
  fetchData();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  Object.values(charts).forEach(chart => chart?.dispose());
});
</script>

<template>
  <div class="space-y-4 h-full flex flex-col animate-fade-in">
    <!-- Toolbar -->
    <div class="flex justify-between items-center bg-slate-800/40 p-4 rounded-xl border border-white/5">
      <h2 class="text-xl font-bold text-slate-200">统计报表</h2>
      <div class="flex items-center gap-4">
        <el-radio-group v-model="granularity" size="small" class="cyber-radio">
          <el-radio-button label="day">本日</el-radio-button>
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
        </el-radio-group>
        <el-button :icon="Refresh" circle size="small" @click="fetchData" class="bg-slate-800 border-white/10" />
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="flex-1 grid grid-rows-[1.5fr_1fr] gap-4 min-h-0">
      <!-- Trend -->
      <div class="bg-slate-800/40 rounded-xl border border-white/5 p-4 flex flex-col">
        <h3 class="text-sm font-medium text-slate-400 mb-4">事件趋势分析</h3>
        <div ref="chartRefs.trend" class="flex-1 w-full min-h-0"></div>
      </div>

      <!-- Bottom Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        <!-- Distribution -->
        <div class="bg-slate-800/40 rounded-xl border border-white/5 p-4 flex flex-col">
          <h3 class="text-sm font-medium text-slate-400 mb-4">事件类型分布</h3>
          <div ref="chartRefs.pie" class="flex-1 w-full min-h-0"></div>
        </div>
        
        <!-- Comparison -->
        <div class="bg-slate-800/40 rounded-xl border border-white/5 p-4 flex flex-col">
          <h3 class="text-sm font-medium text-slate-400 mb-4">区域对比分析</h3>
          <div ref="chartRefs.bar" class="flex-1 w-full min-h-0"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

:deep(.cyber-radio .el-radio-button__inner) {
  background-color: rgba(15, 23, 42, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  box-shadow: none;
}
:deep(.cyber-radio .el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: rgba(6, 182, 212, 0.2);
  border-color: #06b6d4;
  color: #22d3ee;
  box-shadow: none;
}
</style>
