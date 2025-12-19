<template>
  <div 
    class="data-flow-line absolute overflow-hidden pointer-events-none"
    :class="[
      direction === 'horizontal' ? 'h-[2px] w-full' : 'w-[2px] h-full',
      active ? (direction === 'horizontal' ? 'animate-flow-x' : 'animate-flow-y') : 'bg-gray-700/30'
    ]"
    :style="customStyle"
  >
    <!-- Optional: Add particles or extra glow effects here if needed -->
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  direction: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  color: {
    type: String,
    default: 'rgba(34, 211, 238, 0.8)' // cyan-400
  },
  duration: {
    type: String,
    default: '2s'
  },
  active: {
    type: Boolean,
    default: true
  }
});

const customStyle = computed(() => ({
  '--flow-color': props.color,
  animationDuration: props.duration
}));
</script>

<style scoped>
@import '@/styles/animations.css';

.data-flow-line {
  transition: opacity 0.3s ease;
  z-index: 10;
}
</style>
