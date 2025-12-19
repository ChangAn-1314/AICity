<script setup>
import { computed } from 'vue';
import { useVoiceStore } from '@/stores/voice';
import { Microphone, Mute } from '@element-plus/icons-vue';

const voiceStore = useVoiceStore();

const isListening = computed(() => voiceStore.isListening);
const isSpeaking = computed(() => voiceStore.isSpeaking);

const toggleListening = () => {
  if (isListening.value) {
    voiceStore.stopListening();
  } else {
    voiceStore.startListening();
  }
};
</script>

<template>
  <div class="relative group">
    <!-- Pulse Animation Rings -->
    <div v-if="isListening" class="absolute inset-0 rounded-full animate-ping bg-cyan-500/30"></div>
    <div v-if="isListening" class="absolute inset-0 rounded-full animate-ping bg-cyan-500/20 delay-75"></div>
    
    <!-- Button -->
    <button
      @click="toggleListening"
      class="relative flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 shadow-lg overflow-hidden backdrop-blur-md"
      :class="[
        isListening 
          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
          : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-slate-800'
      ]"
    >
      <!-- Waveform Visualization (Simple CSS version when listening) -->
      <div v-if="isListening" class="absolute inset-0 flex items-center justify-center gap-[2px] opacity-50">
        <div class="w-[2px] bg-cyan-400 animate-wave" style="animation-delay: 0ms"></div>
        <div class="w-[2px] bg-cyan-400 animate-wave" style="animation-delay: 100ms"></div>
        <div class="w-[2px] bg-cyan-400 animate-wave" style="animation-delay: 200ms"></div>
        <div class="w-[2px] bg-cyan-400 animate-wave" style="animation-delay: 100ms"></div>
        <div class="w-[2px] bg-cyan-400 animate-wave" style="animation-delay: 0ms"></div>
      </div>

      <el-icon :size="20" class="relative z-10">
        <Microphone v-if="!isSpeaking" />
        <div v-else class="text-emerald-400 animate-pulse">●</div>
      </el-icon>
    </button>

    <!-- Status Tooltip -->
    <div 
      class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 backdrop-blur border border-white/10 rounded text-[10px] text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
    >
      {{ isListening ? '正在聆听...' : '语音助手' }}
    </div>
  </div>
</template>

<style scoped>
@keyframes wave {
  0%, 100% { height: 4px; }
  50% { height: 16px; }
}

.animate-wave {
  animation: wave 1s ease-in-out infinite;
}
</style>
