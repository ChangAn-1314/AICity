<script setup>
import NeonButton from "@/components/ui/NeonButton.vue";
import { ref } from "vue";
import { useDecisionApi } from '@/api/decision';

const emit = defineEmits(['simulate']);
const decisionApi = useDecisionApi();

const customDecision = ref("");
const loading = ref(false);
const error = ref(null);

const submitCustomDecision = async () => {
  if (!customDecision.value.trim()) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    // In a real app, we would call the API
    // const result = await decisionApi.customSimulate(customDecision.value);
    
    // Mock response for now
    await new Promise(resolve => setTimeout(resolve, 2000));
    const result = {
      strategyId: 'custom',
      result: { 
        impact: -Math.floor(Math.random() * 20 + 5), 
        sentiment: Math.floor(Math.random() * 15 + 5),
        scenarios: {
          optimistic: { risk: -25, sentiment: +15 },
          neutral: { risk: -15, sentiment: +8 },
          pessimistic: { risk: -5, sentiment: +2 }
        }
      }
    };
    
    emit('simulate', result);
    customDecision.value = ""; // Clear input on success
  } catch (e) {
    error.value = "模拟请求失败，请稍后重试";
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="relative">
      <textarea
        v-model="customDecision"
        class="w-full bg-slate-800/50 border border-white/10 rounded p-2 text-xs text-slate-300 placeholder-slate-500 focus:border-cyan-500/50 outline-none resize-none transition-colors custom-scrollbar"
        rows="3"
        placeholder="输入自定义决策方案描述..."
        :disabled="loading"
        maxlength="200"
      ></textarea>
      <div class="absolute bottom-1 right-2 text-[10px] text-slate-600">
        {{ customDecision.length }}/200
      </div>
    </div>
    
    <div v-if="error" class="text-red-400 text-[10px]">{{ error }}</div>
    
    <NeonButton 
      variant="primary" 
      class="w-full !py-1.5 flex items-center justify-center gap-2" 
      @click="submitCustomDecision"
      :disabled="loading || !customDecision.trim()"
      :class="{'opacity-50 cursor-not-allowed': loading || !customDecision.trim()}"
    >
      <span v-if="loading" class="w-3 h-3 border-2 border-white/20 border-t-cyan-300 rounded-full animate-spin"></span>
      <span v-else>智能模拟</span>
    </NeonButton>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}
</style>
