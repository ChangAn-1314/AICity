<script setup>
defineProps({
  className: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div
    class="cyber-card rounded-2xl p-4"
    :class="className"
  >
    <!-- Scanline Overlay -->
    <div class="scanlines rounded-2xl"></div>
    
    <slot />
  </div>
</template>

<style>
@import '@/styles/cyberpunk.css';
</style>
