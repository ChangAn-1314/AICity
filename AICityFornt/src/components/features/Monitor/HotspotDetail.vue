<script setup>
import { computed, ref, watch } from 'vue'
import { useSentimentStore } from '@/stores/sentiment'
import { useMapStore } from '@/stores/map'
import { formatDate, formatLevel } from '@/utils/format'
import { Close, VideoPlay, Picture } from '@element-plus/icons-vue'
import GlassPanel from '@/components/ui/GlassPanel.vue'

const props = defineProps({
  hotspot: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])
const sentimentStore = useSentimentStore()
const mapStore = useMapStore()

// Use prop or store selected hotspot
const detail = computed(() => props.hotspot || sentimentStore.selectedHotspot)

// Screen position for popup
const popupStyle = computed(() => {
  if (!mapStore.hotspotScreenPosition) return {}
  
  const h = detail.value?.level === 'high' || detail.value?.level === 'critical' ? 200 : 
           detail.value?.level === 'medium' ? 150 : 100
  
  // Current zoom scale
  const zoom = mapStore.cameraState.zoom || 17
  const scale = Math.max(0.2, Math.pow(1.3, zoom - 17))
  
  // Adjust head height by scale
  const scaledH = h * scale
  
  // Balloon head center Y
  const headY = mapStore.hotspotScreenPosition.y - scaledH - (35 * scale)
  
  return {
    left: `${mapStore.hotspotScreenPosition.x}px`, // Center on X
    top: `${headY}px`,
    transform: `translate(0, -50%) scale(${scale})` // Center vertically and Zoom Scale
  }
})

const levelColor = {
  high: 'text-pink-400',
  medium: 'text-purple-400', 
  low: 'text-cyan-400',
  critical: 'text-red-500',
  normal: 'text-blue-400'
}

const levelBg = {
  high: 'bg-pink-500/20 text-pink-300',
  medium: 'bg-purple-500/20 text-purple-300',
  low: 'bg-cyan-500/20 text-cyan-300',
  critical: 'bg-red-500/20 text-red-300',
  normal: 'bg-blue-500/20 text-blue-300'
}

// Mock content generation if missing
const displayContent = computed(() => {
  if (!detail.value) return ''
  return detail.value.content || 
    `据监测，${detail.value.title}引发了广泛关注。当前讨论热度为${detail.value.count}，趋势显示为${detail.value.trend === 'up' ? '上升' : '平稳'}。主要涉及${detail.value.category}领域，建议相关部门持续关注。`
})

// Mock media items
const mediaItems = computed(() => {
  if (!detail.value) return []
  // If real media exists, use it
  if (detail.value.media && detail.value.media.length) return detail.value.media
  
  // Otherwise return placeholders based on category
  return [
    { type: 'image', url: 'https://placehold.co/600x400/1e293b/cbd5e1?text=Hotspot+Image', caption: '现场图片' },
    { type: 'video', url: '', caption: '相关视频' } // No URL for video placeholder
  ]
})

const close = () => {
  emit('close')
  sentimentStore.selectHotspot(null)
}
</script>

<template>
  <Transition name="popup-scale">
    <div 
      v-if="detail && mapStore.hotspotScreenPosition" 
      class="absolute z-50 pointer-events-none origin-center"
      :style="popupStyle"
    >
      <div class="panel-wrapper relative flex flex-col items-start">
        <!-- Connecting Line (horizontal to left) -->
        <div class="absolute top-1/2 -left-8 w-8 h-0.5 bg-cyan-500/50 -translate-y-1/2 pointer-events-none">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
        </div>

        <GlassPanel class="w-80 h-auto max-h-[500px] flex flex-col overflow-hidden border border-cyan-500/30 pointer-events-auto shadow-2xl shadow-black/80 bg-slate-900/90 backdrop-blur-xl">
          <!-- Header -->
          <div class="flex justify-between items-start mb-3 pb-3 border-b border-white/10 shrink-0">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border border-white/5" :class="levelBg[detail.level]">
                  {{ formatLevel(detail.level) }}
                </span>
                <span class="text-slate-400 text-xs font-mono uppercase">{{ detail.category }}</span>
              </div>
              <h2 class="text-base font-bold text-white leading-tight">{{ detail.title }}</h2>
            </div>
            <button @click="close" class="text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors p-1 -mr-1">
              <el-icon size="18"><Close /></el-icon>
            </button>
          </div>

          <!-- Content Scroll Area -->
          <div class="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1">
            <!-- Info Grid -->
            <div class="grid grid-cols-2 gap-2 mb-4">
              <div class="bg-slate-800/40 rounded p-2 border border-white/5">
                <div class="text-slate-500 text-[10px] mb-0.5">发布时间</div>
                <div class="text-slate-200 text-xs font-mono">
                  {{ typeof detail.time === 'number' ? formatDate(detail.time, 'MM-DD HH:mm') : detail.time }}
                </div>
              </div>
              <div class="bg-slate-800/40 rounded p-2 border border-white/5">
                <div class="text-slate-500 text-[10px] mb-0.5">信息来源</div>
                <div class="text-slate-200 text-xs truncate" :title="detail.source">{{ detail.source || '社交媒体' }}</div>
              </div>
              <div class="bg-slate-800/40 rounded p-2 border border-white/5">
                <div class="text-slate-500 text-[10px] mb-0.5">讨论热度</div>
                <div class="text-xs font-mono font-bold" :class="levelColor[detail.level]">
                  {{ detail.count?.toLocaleString() }}
                </div>
              </div>
              <div class="bg-slate-800/40 rounded p-2 border border-white/5">
                <div class="text-slate-500 text-[10px] mb-0.5">情感倾向</div>
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div class="h-full bg-red-500 w-[40%]"></div>
                  </div>
                  <span class="text-[10px] text-red-400">负面</span>
                </div>
              </div>
            </div>

            <!-- Text Content -->
            <div class="mb-4">
              <h3 class="text-cyan-400 text-xs font-bold mb-1.5 flex items-center gap-1.5">
                <div class="w-0.5 h-3 bg-cyan-500 rounded-full"></div>
                事件详情
              </h3>
              <p class="text-slate-300 text-xs leading-relaxed bg-slate-800/30 p-2 rounded border border-white/5">
                {{ displayContent }}
              </p>
            </div>

            <!-- Media Preview -->
            <div v-if="mediaItems.length" class="mb-2">
              <h3 class="text-purple-400 text-xs font-bold mb-1.5 flex items-center gap-1.5">
                <div class="w-0.5 h-3 bg-purple-500 rounded-full"></div>
                媒体资料
              </h3>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="(media, index) in mediaItems" :key="index" class="relative group rounded overflow-hidden border border-white/10 bg-black/40 aspect-video">
                  <!-- Image -->
                  <img 
                    v-if="media.type === 'image'" 
                    :src="media.url" 
                    class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    alt="preview"
                  />
                  
                  <!-- Video Placeholder -->
                  <div v-else-if="media.type === 'video'" class="w-full h-full flex items-center justify-center bg-slate-900">
                    <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-cyan-500/80 transition-colors cursor-pointer backdrop-blur">
                      <el-icon size="16" class="text-white ml-0.5"><VideoPlay /></el-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-auto pt-3 border-t border-white/10 flex gap-2 shrink-0">
            <button class="flex-1 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded border border-cyan-500/20 transition-colors">
              生成报告
            </button>
            <button class="flex-1 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-medium rounded border border-purple-500/20 transition-colors">
              加入研判
            </button>
          </div>
        </GlassPanel>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.panel-wrapper {
  transform: translateX(40px);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}

.popup-scale-enter-active .panel-wrapper,
.popup-scale-leave-active .panel-wrapper {
  /* Transition is handled by class definition above */
  will-change: transform, opacity;
}

.popup-scale-enter-from .panel-wrapper,
.popup-scale-leave-to .panel-wrapper {
  transform: translateX(0) scale(0);
  opacity: 0;
}

/* Connecting line animation */
.popup-scale-enter-active .w-8,
.popup-scale-leave-active .w-8 {
  transition: width 0.3s ease 0.1s;
}

.popup-scale-enter-from .w-8,
.popup-scale-leave-to .w-8 {
  width: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>
