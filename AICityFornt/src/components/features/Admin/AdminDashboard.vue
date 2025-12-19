<script setup>
import { 
  MapLocation, 
  WarnTriangleFilled, 
  User, 
  Monitor 
} from '@element-plus/icons-vue';

const stats = [
  { label: 'Active Hotspots', value: '24', trend: 12, icon: MapLocation },
  { label: 'System Alerts', value: '5', trend: -5, icon: WarnTriangleFilled },
  { label: 'Online Users', value: '1,203', trend: 8, icon: User },
  { label: 'Avg. Response', value: '2.4s', trend: 15, icon: Monitor },
];
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(stat, index) in stats" :key="index" class="h-32 bg-slate-800/40 rounded-xl border border-white/5 p-4 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300 hover:bg-slate-800/60">
        <div class="text-slate-400 text-sm mb-2 flex items-center gap-2">
          <el-icon><component :is="stat.icon" /></el-icon>
          {{ stat.label }}
        </div>
        <div class="text-3xl font-bold text-white tracking-tight">{{ stat.value }}</div>
        <div class="text-xs mt-2" :class="stat.trend > 0 ? 'text-emerald-400' : 'text-red-400'">
          {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}% vs last week
        </div>
        <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-slate-800/40 rounded-xl border border-white/5 p-6 hover:border-cyan-500/30 transition-colors cursor-pointer group">
             <h3 class="text-lg font-medium text-slate-200 mb-2 group-hover:text-cyan-400 transition-colors">System Diagnostics</h3>
             <p class="text-sm text-slate-400">Run full system scan and generate health report.</p>
        </div>
        <div class="bg-slate-800/40 rounded-xl border border-white/5 p-6 hover:border-cyan-500/30 transition-colors cursor-pointer group">
             <h3 class="text-lg font-medium text-slate-200 mb-2 group-hover:text-cyan-400 transition-colors">User Management</h3>
             <p class="text-sm text-slate-400">Review pending access requests and role assignments.</p>
        </div>
        <div class="bg-slate-800/40 rounded-xl border border-white/5 p-6 hover:border-cyan-500/30 transition-colors cursor-pointer group">
             <h3 class="text-lg font-medium text-slate-200 mb-2 group-hover:text-cyan-400 transition-colors">Data Backup</h3>
             <p class="text-sm text-slate-400">Initiate manual backup of core databases.</p>
        </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-slate-800/40 rounded-xl border border-white/5 p-6">
      <h3 class="text-lg font-medium text-slate-200 mb-4">Recent Activity</h3>
      <div class="space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center justify-between p-3 rounded bg-slate-900/50 hover:bg-slate-800/50 transition-colors border-l-2 border-transparent hover:border-cyan-500">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 text-xs">LOG</div>
            <div>
              <div class="text-sm text-slate-300">System update detected</div>
              <div class="text-xs text-slate-500">Module: Core / Version: 2.1.{{i}}</div>
            </div>
          </div>
          <div class="text-xs text-slate-500 font-mono">10:{{ 20 + i }}:00</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
