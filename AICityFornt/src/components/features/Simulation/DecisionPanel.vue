<script setup>
import NeonButton from "@/components/ui/NeonButton.vue";
import SimulationResult from "./SimulationResult.vue";
import CustomDecision from "./CustomDecision.vue";
import { ref } from "vue";

const emit = defineEmits(['decision-select', 'simulate']);

const simulationStatus = ref("idle"); // idle, calculating, done
const selectedStrategy = ref("A");
const simulationData = ref(null);
const activeTab = ref('preset'); // preset, custom

const strategies = [
  { id: 'A', name: '官方声明回应', risk: 'low', desc: '发布权威信息，澄清事实' },
  { id: 'B', name: '社区互动沟通', risk: 'medium', desc: '组织线下座谈，直接对话' },
  { id: 'C', name: '静默监控跟踪', risk: 'high', desc: '暂不干预，持续监测态势' }
];

const simulate = () => {
  simulationStatus.value = "calculating";
  emit('decision-select', selectedStrategy.value);
  
  setTimeout(() => {
    simulationStatus.value = "done";
    simulationData.value = {
      strategyId: selectedStrategy.value,
      result: { impact: -15, sentiment: +8 }
    };
    emit('simulate', simulationData.value);
  }, 2000);
};

const handleCustomSimulate = (result) => {
  simulationStatus.value = "done";
  simulationData.value = result;
  emit('simulate', result);
};

const reset = () => {
  simulationStatus.value = "idle";
  simulationData.value = null;
};
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-mono text-slate-400 flex items-center gap-2">
        <span class="text-lg text-emerald-400">⚡</span> 决策模拟器
      </h3>
      <div class="flex bg-slate-800/50 rounded p-0.5 border border-white/5">
        <button 
          @click="activeTab = 'preset'"
          class="px-2 py-0.5 text-[10px] rounded transition-colors"
          :class="activeTab === 'preset' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'"
        >
          预设
        </button>
        <button 
          @click="activeTab = 'custom'"
          class="px-2 py-0.5 text-[10px] rounded transition-colors"
          :class="activeTab === 'custom' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'"
        >
          自定义
        </button>
      </div>
    </div>

    <div class="flex-1 relative overflow-hidden">
      <!-- Results View -->
      <Transition name="fade">
        <div v-if="simulationStatus === 'done'" class="absolute inset-0 z-10 bg-slate-900 flex flex-col">
          <SimulationResult :result="simulationData" class="flex-1" />
          <div class="mt-2 flex justify-end">
            <NeonButton variant="alert" class="!py-1 !px-3 text-xs" @click="reset">
              重新模拟
            </NeonButton>
          </div>
        </div>
      </Transition>

      <!-- Input View -->
      <div class="h-full flex flex-col justify-between gap-2 overflow-hidden" :class="{'opacity-0 pointer-events-none': simulationStatus === 'done'}">
        
        <Transition name="fade" mode="out-in">
          <!-- Preset Tab -->
          <div v-if="activeTab === 'preset'" class="flex-1 flex flex-col h-full">
            <!-- Options List -->
            <div class="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
              <div 
                v-for="strategy in strategies" 
                :key="strategy.id"
                @click="selectedStrategy = strategy.id"
                class="relative p-2 rounded border transition-all cursor-pointer group"
                :class="selectedStrategy === strategy.id 
                  ? 'bg-slate-800/80 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                  : 'bg-slate-800/30 border-white/5 hover:bg-slate-800/50 hover:border-white/10'"
              >
                <div class="flex justify-between items-start mb-1">
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 rounded-full border flex items-center justify-center"
                      :class="selectedStrategy === strategy.id ? 'border-emerald-500' : 'border-slate-600'"
                    >
                      <div v-if="selectedStrategy === strategy.id" class="w-2 h-2 rounded-full bg-emerald-500"></div>
                    </div>
                    <span class="text-sm font-medium" :class="selectedStrategy === strategy.id ? 'text-white' : 'text-slate-300'">
                      {{ strategy.name }}
                    </span>
                  </div>
                  <span class="text-[10px] px-1.5 rounded border"
                    :class="{
                      'border-emerald-500/30 text-emerald-400': strategy.risk === 'low',
                      'border-yellow-500/30 text-yellow-400': strategy.risk === 'medium',
                      'border-red-500/30 text-red-400': strategy.risk === 'high'
                    }"
                  >
                    {{ strategy.risk === 'low' ? '低风险' : strategy.risk === 'medium' ? '中风险' : '高风险' }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 ml-6 group-hover:text-slate-400 transition-colors">
                  {{ strategy.desc }}
                </p>
              </div>
            </div>

            <!-- Status Area -->
            <div class="min-h-[30px] flex items-center justify-center shrink-0">
              <div
                v-if="simulationStatus === 'calculating'"
                class="flex items-center gap-2 text-cyan-400 text-xs font-mono"
              >
                <div class="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                正在计算预测结果...
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 mt-1 shrink-0">
              <NeonButton 
                variant="primary" 
                class="flex-1 !py-1.5" 
                @click="simulate"
                :disabled="simulationStatus === 'calculating'"
                :class="{'opacity-50 cursor-not-allowed': simulationStatus === 'calculating'}"
              >
                开始模拟
              </NeonButton>
              <NeonButton 
                variant="alert" 
                class="!py-1.5 !px-3" 
                @click="reset"
              >
                重置
              </NeonButton>
            </div>
          </div>

          <!-- Custom Tab -->
          <div v-else class="flex-1 flex flex-col h-full">
            <div class="flex-1 bg-slate-800/30 rounded border border-white/5 p-2 mb-2">
              <p class="text-xs text-slate-400 mb-2 leading-relaxed">
                请输入特定的决策方案描述，AI 将基于当前舆情态势预测该方案可能产生的效果和潜在风险。
              </p>
              <CustomDecision @simulate="handleCustomSimulate" />
            </div>
          </div>
        </Transition>
        
      </div>
    </div>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
