<script setup>
defineProps({
  variant: {
    type: String,
    default: "primary", // primary, alert, success
  },
});
</script>

<template>
  <button
    class="px-4 py-2 rounded-lg font-mono uppercase tracking-wider text-sm transition-all duration-300 border outline-none"
    :class="{
      'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]':
        variant === 'primary',
      'bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]':
        variant === 'alert',
      'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]':
        variant === 'success',
    }"
  >
    <slot />
  </button>
</template>
