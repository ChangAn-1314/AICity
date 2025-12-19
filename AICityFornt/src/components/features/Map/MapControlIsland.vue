<script setup>
import { useMapStore } from '@/stores/map'
import { Grid, Aim, Location, OfficeBuilding, Connection } from '@element-plus/icons-vue'

const mapStore = useMapStore()
</script>

<template>
  <div class="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full py-4 px-2 flex flex-col items-center gap-4 shadow-2xl pointer-events-auto">
    <!-- 切换热力图 -->
    <el-tooltip content="切换热力图" placement="left">
      <button
        @click="mapStore.toggleLayer('heatmap')"
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
        :class="mapStore.layers.heatmap ? 'bg-red-500/20 text-red-400 shadow-[0_0_10px_rgba(248,113,113,0.3)]' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/10'"
      >
        <el-icon :size="20"><Grid /></el-icon>
      </button>
    </el-tooltip>

    <!-- 切换行政边界 -->
    <el-tooltip content="切换行政边界" placement="left">
      <button
        @click="mapStore.toggleLayer('boundary')"
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
        :class="mapStore.layers.boundary ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/10'"
      >
        <el-icon :size="20"><Aim /></el-icon>
      </button>
    </el-tooltip>

    <!-- 切换悬浮标志 -->
    <el-tooltip content="切换悬浮标志" placement="left">
      <button
        @click="mapStore.toggleLayer('markers')"
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
        :class="mapStore.layers.markers ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/10'"
      >
        <el-icon :size="20"><Location /></el-icon>
      </button>
    </el-tooltip>

    <!-- 切换3D建模 -->
    <el-tooltip content="切换3D建模" placement="left">
      <button
        @click="mapStore.toggleLayer('models')"
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
        :class="mapStore.layers.models ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/10'"
      >
        <el-icon :size="20"><OfficeBuilding /></el-icon>
      </button>
    </el-tooltip>

    <!-- 切换关联线 -->
    <el-tooltip content="切换关联线" placement="left">
      <button
        @click="mapStore.toggleLayer('lines')"
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
        :class="mapStore.layers.lines ? 'bg-yellow-500/20 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/10'"
      >
        <el-icon :size="20"><Connection /></el-icon>
      </button>
    </el-tooltip>
  </div>
</template>
