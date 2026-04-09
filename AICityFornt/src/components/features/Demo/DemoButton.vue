<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed top-4 right-4 z-[9999] flex flex-col gap-2"
    >
      <button
        @click="$emit('play')"
        :disabled="isPlaying"
        class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg v-if="!isPlaying" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
        </svg>
        <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ isPlaying ? '演示中...' : '播放演示' }}</span>
      </button>

      <div
        v-if="isPlaying"
        class="bg-slate-900/90 backdrop-blur-md rounded-lg p-3 border border-cyan-500/30"
      >
        <div class="text-xs text-cyan-400 mb-2">演示进度</div>
        <div class="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        <div class="text-xs text-slate-400 mt-1 text-right">{{ progress }}%</div>
      </div>

      <button
        v-if="isPlaying"
        @click="$emit('stop')"
        class="px-4 py-2 bg-red-500/80 text-white rounded-lg shadow-lg hover:bg-red-500 transition-all flex items-center gap-2 justify-center"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd"/>
        </svg>
        <span>停止</span>
      </button>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  isPlaying: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    default: 0,
  },
})

defineEmits(['play', 'stop'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
