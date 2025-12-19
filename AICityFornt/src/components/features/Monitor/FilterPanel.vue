<script setup>
import { ref, watch, onMounted } from 'vue'
import { useSentimentStore } from '@/stores/sentiment'
import { Filter, ArrowDown } from '@element-plus/icons-vue'
import { debounce } from 'lodash'

const sentimentStore = useSentimentStore()

const isExpanded = ref(false)

const filters = ref({
  level: 'all',
  category: 'all',
  timeRange: '24h'
})

// Initialize from store
onMounted(() => {
  if (sentimentStore.filters) {
    filters.value = { ...sentimentStore.filters }
  }
})

// Update store with debounce
const updateStore = debounce((newFilters) => {
  sentimentStore.updateFilters(newFilters)
}, 300)

watch(filters, (newVal) => {
  updateStore(newVal)
}, { deep: true })

const categories = [
  { label: '全部类别', value: 'all' },
  { label: '交通出行', value: 'traffic' },
  { label: '民生服务', value: 'livelihood' },
  { label: '医疗卫生', value: 'medical' },
  { label: '教育资源', value: 'education' },
  { label: '环境保护', value: 'environment' },
  { label: '公共安全', value: 'security' },
  { label: '消费维权', value: 'consumption' }
]

const levels = [
  { label: '全部等级', value: 'all', color: '' },
  { label: '高风险', value: 'high', color: 'bg-pink-500' },
  { label: '中风险', value: 'medium', color: 'bg-purple-500' },
  { label: '低风险', value: 'low', color: 'bg-cyan-500' }
]

const timeRanges = [
  { label: '24小时内', value: '24h' },
  { label: '近3天', value: '3d' },
  { label: '近7天', value: '7d' },
  { label: '近30天', value: '30d' }
]

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden transition-all duration-300" :class="isExpanded ? 'h-auto' : 'h-10'">
    <!-- Header / Collapsed View -->
    <div 
      class="flex items-center justify-between px-3 h-10 cursor-pointer hover:bg-white/5 transition-colors"
      @click="toggleExpand"
    >
      <div class="flex items-center gap-2 text-sm text-cyan-300">
        <el-icon><Filter /></el-icon>
        <span class="font-medium">筛选过滤</span>
        <div v-if="!isExpanded" class="flex gap-2 ml-4 text-xs text-slate-400">
          <span v-if="filters.level !== 'all'" class="bg-slate-800 px-1.5 rounded border border-white/10">
            {{ levels.find(l => l.value === filters.level)?.label }}
          </span>
          <span v-if="filters.category !== 'all'" class="bg-slate-800 px-1.5 rounded border border-white/10">
            {{ categories.find(c => c.value === filters.category)?.label }}
          </span>
        </div>
      </div>
      <el-icon 
        class="text-slate-400 transition-transform duration-300"
        :class="isExpanded ? 'rotate-180' : ''"
      >
        <ArrowDown />
      </el-icon>
    </div>

    <!-- Expanded Content -->
    <div class="p-3 border-t border-white/5 space-y-4">
      <!-- Risk Level -->
      <div class="space-y-2">
        <div class="text-xs text-slate-500 font-medium">风险等级</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="level in levels"
            :key="level.value"
            class="px-3 py-1 text-xs rounded-full border transition-all"
            :class="filters.level === level.value 
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/20' 
              : 'bg-slate-800/50 border-transparent text-slate-400 hover:border-slate-600'"
            @click="filters.level = level.value"
          >
            <div class="flex items-center gap-1.5">
              <span v-if="level.color" class="w-1.5 h-1.5 rounded-full" :class="level.color"></span>
              {{ level.label }}
            </div>
          </button>
        </div>
      </div>

      <!-- Category -->
      <div class="space-y-2">
        <div class="text-xs text-slate-500 font-medium">事件类别</div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="px-2 py-1.5 text-xs rounded border transition-all truncate"
            :class="filters.category === cat.value 
              ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-sm shadow-purple-500/20' 
              : 'bg-slate-800/50 border-transparent text-slate-400 hover:border-slate-600'"
            @click="filters.category = cat.value"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Time Range -->
      <div class="space-y-2">
        <div class="text-xs text-slate-500 font-medium">时间范围</div>
        <div class="flex bg-slate-800/80 rounded p-0.5 border border-white/5">
          <button
            v-for="range in timeRanges"
            :key="range.value"
            class="flex-1 py-1 text-xs rounded transition-all"
            :class="filters.timeRange === range.value 
              ? 'bg-slate-600 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'"
            @click="filters.timeRange = range.value"
          >
            {{ range.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
