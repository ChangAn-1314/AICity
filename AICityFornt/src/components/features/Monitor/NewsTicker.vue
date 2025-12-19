<script setup>
import { ref, computed } from "vue";
import { useSentimentStore } from "@/stores/sentiment";
import { formatLevel, formatDate } from "@/utils/format";

const emit = defineEmits(['item-click']);
const sentimentStore = useSentimentStore();

// 转换为实时监控格式
const news = computed(() => {
  return sentimentStore.hotspots.map(item => ({
    id: item.id,
    time: typeof item.time === 'number' ? formatDate(item.time, 'HH:mm') : item.time,
    title: `${item.category}: ${item.title}`,
    level: item.level || 'medium',
    count: item.count || 0,
    category: item.category || '未分类',
    rawTime: item.time // 用于排序
  })).sort((a, b) => new Date(b.rawTime) - new Date(a.rawTime));
});

// 等级中文映射
const levelText = {
  high: '高热度',
  medium: '中热度', 
  low: '低热度',
  critical: '极高热度',
  normal: '正常'
}

const levelColor = {
  high: 'text-pink-400',
  medium: 'text-purple-400',
  low: 'text-cyan-400',
  critical: 'text-red-500',
  normal: 'text-blue-400'
}

// 点击跳转到地图热点
const navigateToHotspot = (id) => {
  const item = sentimentStore.hotspots.find(h => h.id === id);
  if (item) {
    sentimentStore.selectHotspot(item);
    emit('item-click', item);
    window.dispatchEvent(new CustomEvent('navigate-to-hotspot', {
      detail: { hotspotId: id }
    }));
  }
}
</script>

<template>
  <div class="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar relative">
    <TransitionGroup name="list">
      <div
        v-for="item in news"
        :key="item.id"
        @click="navigateToHotspot(item.id)"
        class="group p-3 rounded-lg bg-slate-800/50 border border-white/5 hover:bg-white/5 hover:border-cyan-500/30 transition-all cursor-pointer active:scale-[0.98]"
        :class="{
          'border-pink-500/30': item.level === 'high',
          'border-purple-500/20': item.level === 'medium',
        }"
      >
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs font-mono text-slate-400">{{ item.time }}</span>
          <div class="flex items-center gap-2">
            <span class="text-xs" :class="levelColor[item.level]">{{ levelText[item.level] || formatLevel(item.level) }}</span>
            <span
              class="w-2 h-2 rounded-full"
              :class="{
                'bg-cyan-500': item.level === 'low',
                'bg-purple-500': item.level === 'medium',
                'bg-pink-500 animate-pulse': item.level === 'high',
                'bg-red-600 animate-ping': item.level === 'critical',
                'bg-blue-500': item.level === 'normal'
              }"
            ></span>
          </div>
        </div>
        <p class="text-sm text-slate-200 leading-relaxed group-hover:text-cyan-100 transition-colors">
          {{ item.title }}
        </p>
        <div class="flex justify-between items-center mt-2 text-xs">
          <span class="text-slate-500">讨论量</span>
          <div class="flex items-center gap-2">
            <span class="font-mono" :class="levelColor[item.level]">{{ item.count.toLocaleString() }}</span>
            <span class="text-slate-600 group-hover:text-cyan-400 transition-colors">></span>
          </div>
        </div>
      </div>
    </TransitionGroup>
    
    <!-- Empty state -->
    <div v-if="news.length === 0" class="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
      暂无实时舆情
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
