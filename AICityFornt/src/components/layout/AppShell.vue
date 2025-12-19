<script setup>
import { ref, onMounted, onUnmounted, computed, watch, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import AMapLoader from '@amap/amap-jsapi-loader';
import { useAuthStore } from "@/stores/auth";
import { Fold, Expand, Monitor, DataAnalysis, Close } from "@element-plus/icons-vue";
// 使用高德地图 3D 版本 (需要申请 Key)
import CityMap3D from "@/components/features/Map/CityMap3D-AMap.vue";
import MapControlIsland from "@/components/features/Map/MapControlIsland.vue";
// 备选: Cesium 版本
// import CityMap3D from "@/components/features/Map/CityMap3D.vue";
import NewsTicker from "@/components/features/Monitor/NewsTicker.vue";
import FilterPanel from "@/components/features/Monitor/FilterPanel.vue";
// HotspotDetail 已集成到水滴标记中，不再单独使用
// import HotspotDetail from "@/components/features/Monitor/HotspotDetail.vue";
import InsightCard from "@/components/features/Analysis/InsightCard.vue";
import KeywordCloud from "@/components/features/Analysis/KeywordCloud.vue";
import TrendChart from "@/components/features/Analysis/TrendChart.vue";
import DecisionPanel from "@/components/features/Simulation/DecisionPanel.vue";
import GlassPanel from "@/components/ui/GlassPanel.vue";
import DataFlowLine from "@/components/ui/DataFlowLine.vue";
import DynamicIsland from "./DynamicIsland.vue";
import AdminLayout from "./AdminLayout.vue"; // Admin Overlay
// Admin Features
import AdminDashboard from "@/components/features/Admin/AdminDashboard.vue";
import HotspotManager from "@/components/features/Admin/HotspotManager.vue";
import EventManager from "@/components/features/Admin/EventManager.vue";
import UserManager from "@/components/features/Admin/UserManager.vue";
import AuditLogs from "@/components/features/Admin/AuditLogs.vue";
import SystemSettings from "@/components/features/Admin/SystemSettings.vue";
// Report Features
import DataQuery from "@/components/features/Reports/DataQuery.vue";
import StatisticsReport from "@/components/features/Reports/StatisticsReport.vue";
import ReportGenerator from "@/components/features/Reports/ReportGenerator.vue";

import VoiceButton from "@/components/features/Voice/VoiceButton.vue"; // Import VoiceButton
import { useFocusMode } from "@/composables/useFocusMode";
import { useStaggeredEntrance } from "@/composables/useStaggeredEntrance";
import { useMapStore } from "@/stores/map";

const { isFocusMode } = useFocusMode();
const { isReady, getStaggerStyle } = useStaggeredEntrance({
  baseDelay: 200,
  stepDelay: 100,
});

const mapStore = useMapStore();

// --- City Selector Logic ---
const selectedRegion = ref([])
const AMAP_KEY = '2f5760aea1bba05bbe5fbd4d8fbd02ce'

const cascaderProps = {
  lazy: true,
  lazyLoad(node, resolve) {
    const { level } = node
    
    // Ensure AMap is loaded
    AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.DistrictSearch']
    }).then((AMap) => {
      const districtSearch = new AMap.DistrictSearch({
        subdistrict: 1,
        extensions: 'base',
        level: level === 0 ? 'country' : 'province'
      })
      
      const keyword = level === 0 ? '中国' : node.label
      
      districtSearch.search(keyword, (status, result) => {
        if (status === 'complete' && result.districtList?.length) {
          const list = result.districtList[0].districtList
          if (!list) {
             resolve([])
             return
          }
          const nodes = list.map(item => ({
            value: item.name,
            label: item.name,
            leaf: level >= 1 // Level 0: Province, Level 1: City (Leaf)
          }))
          resolve(nodes)
        } else {
          resolve([])
        }
      })
    }).catch(e => {
       console.error("AMap Loader Error:", e)
       resolve([])
    })
  }
}

const handleCityChange = (val) => {
  if (val && val.length > 0) {
    const cityName = val[val.length - 1]
    mapStore.setCity(cityName)
  }
}

// Reset selector when map updates externally (e.g. auto-detection)
watch(() => mapStore.currentCity, () => {
   selectedRegion.value = []
})
// ---------------------------

const activeMenu = ref("map");
const analysisView = ref("keywords"); // keywords, trends
const sidebarCollapsed = ref(false);
const rightPanelCollapsed = ref(false);
const showAdmin = ref(false); // Admin Overlay State
const adminTab = ref("dashboard");
const activeTool = ref(null); // 'hotspots', 'query', etc.

watch(activeMenu, (newVal) => {
  if (newVal === 'monitor') {
    sidebarCollapsed.value = false;
    if (isMobile.value) rightPanelCollapsed.value = true;
  } else if (newVal === 'analysis') {
    rightPanelCollapsed.value = false;
    if (isMobile.value) sidebarCollapsed.value = true;
  } else if (newVal === 'map') {
    sidebarCollapsed.value = true;
    rightPanelCollapsed.value = true;
  } else if (newVal === 'alerts') {
    // Open the Alert Manager Tool
    activeTool.value = 'alerts';
  }
});

const toolTitle = computed(() => {
  const titles = {
    dashboard: '后台概览',
    hotspots: '舆情管理',
    alerts: '预警管理',
    users: '用户管理',
    logs: '审计日志',
    query: '数据查询',
    stats: '统计分析',
    genreport: '报告生成',
    settings: '系统设置'
  };
  return titles[activeTool.value] || '';
});

const toggleTool = (tool) => {
  if (activeTool.value === tool) {
    activeTool.value = null;
  } else {
    activeTool.value = tool;
  }
};
provide('toggleTool', toggleTool);

// Mobile Detection
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    // On mobile, collapse both panels by default
    sidebarCollapsed.value = true;
    rightPanelCollapsed.value = true;
  } else {
    // On desktop, open both by default
    sidebarCollapsed.value = false;
    rightPanelCollapsed.value = false;
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", () => {
    const wasMobile = isMobile.value;
    isMobile.value = window.innerWidth < 768;
    // Only reset panels if crossing breakpoint
    if (wasMobile !== isMobile.value) {
      if (isMobile.value) {
        sidebarCollapsed.value = true;
        rightPanelCollapsed.value = true;
      } else {
        sidebarCollapsed.value = false;
        rightPanelCollapsed.value = false;
      }
    }
  });
});

// Provide control to DynamicIsland
const toggleAdmin = (tab) => {
  if (typeof tab === "string") {
    adminTab.value = tab;
    showAdmin.value = true;
  } else {
    // Toggle behavior for click events
    if (showAdmin.value) {
      showAdmin.value = false;
    } else {
      adminTab.value = "dashboard";
      showAdmin.value = true;
    }
  }
};
provide("toggleAdmin", toggleAdmin);
provide("activeMenu", activeMenu);

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  // On mobile, force close right panel if opening sidebar
  if (isMobile.value && !sidebarCollapsed.value) {
    rightPanelCollapsed.value = true;
  }
};

const toggleRightPanel = () => {
  rightPanelCollapsed.value = !rightPanelCollapsed.value;
  // On mobile, force close sidebar if opening right panel
  if (isMobile.value && !rightPanelCollapsed.value) {
    sidebarCollapsed.value = true;
  }
};
</script>

<template>
  <div
    class="relative w-full h-screen bg-slate-900 text-slate-50 overflow-hidden font-sans select-none"
  >
    <!-- Admin Overlay -->
    <Transition name="fade">
      <AdminLayout
        v-if="showAdmin"
        :defaultTab="adminTab"
        @close="showAdmin = false"
      />
    </Transition>

    <!-- Tool Overlay (Standalone) -->
    <Transition name="fade">
      <div v-if="activeTool" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 md:p-8 pointer-events-auto">
        <GlassPanel className="w-full max-w-5xl h-[80vh] flex flex-col relative shadow-2xl shadow-cyan-500/10 bg-slate-900/80 overflow-hidden">
           <!-- Header -->
           <div class="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/40 shrink-0">
              <h3 class="text-lg font-bold text-cyan-400 flex items-center gap-2">
                 <span class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                 {{ toolTitle }}
              </h3>
              <button @click="activeTool = null" class="p-1 hover:text-white text-slate-400 transition-colors bg-slate-800/50 rounded-full">
                 <el-icon :size="20"><Close /></el-icon>
              </button>
           </div>
           <!-- Content -->
           <div class="flex-1 overflow-auto p-6 relative">
              <AdminDashboard v-if="activeTool === 'dashboard'" />
              <HotspotManager v-if="activeTool === 'hotspots'" />
              <EventManager v-if="activeTool === 'alerts'" />
              <UserManager v-if="activeTool === 'users'" />
              <AuditLogs v-if="activeTool === 'logs'" />
              <DataQuery v-if="activeTool === 'query'" />
              <StatisticsReport v-if="activeTool === 'stats'" />
              <ReportGenerator v-if="activeTool === 'genreport'" />
              <SystemSettings v-if="activeTool === 'settings'" />
           </div>
        </GlassPanel>
      </div>
    </Transition>

    <!-- Layer 0: Full Screen Map -->
    <div
      class="absolute inset-0 z-0 transition-all duration-500"
      :class="{ 'scale-105': isFocusMode }"
    >
      <CityMap3D />
      <!-- Background Overlay for better text contrast -->
      <div class="absolute inset-0 bg-slate-900/20 pointer-events-none"></div>
    </div>

    <!-- Focus Mode Overlay (Removed to allow map internal highlighting) -->
    <!-- <div 
      class="absolute inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 pointer-events-none"
      :class="isFocusMode ? 'opacity-100' : 'opacity-0'"
    ></div> -->

    <!-- Layer 1: Header / Top Navigation Bar -->
    <div
      class="absolute top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center justify-center pointer-events-none"
    >
      <div
        class="pointer-events-auto stagger-item"
        :class="[
          { 'opacity-30 grayscale': isFocusMode },
          { 'is-ready': isReady },
        ]"
        :style="getStaggerStyle(0)"
      >
        <DynamicIsland />
      </div>
    </div>

    <!-- Layer 2: Global Status Indicator -->
    <div
      class="absolute top-24 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none md:top-28"
    >
      <div
        class="bg-black/60 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2 border border-white/10 shadow-[0_0_15px_rgba(6,182,212,0.3)] pointer-events-auto transition-all hover:bg-black/80 hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
      >
        <span
          class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"
        ></span>
        <!-- Cascader for City Selection -->
        <el-cascader
            v-model="selectedRegion"
            :props="cascaderProps"
            :placeholder="`实时监控: ${mapStore.currentCity}`"
            :show-all-levels="false"
            @change="handleCityChange"
            class="region-cascader"
            popper-class="cyber-cascader-popper"
        >
           <template #default="{ node, data }">
              <div class="flex items-center justify-between min-w-[100px]">
                 <span>{{ data.label }}</span>
                 <span v-if="!node.isLeaf" class="text-xs text-slate-600 font-mono">></span>
              </div>
           </template>
        </el-cascader>
      </div>
    </div>

    <!-- Layer 3: Left Floating Zone (Responsive) -->
    <div
      class="absolute top-4 md:top-24 bottom-24 md:bottom-8 z-40 flex gap-4 pointer-events-none transition-transform duration-500 ease-in-out left-0"
      :class="[
        sidebarCollapsed ? '-translate-x-[calc(100%-1rem)] md:-translate-x-80' : 'translate-x-2 md:translate-x-4',
        { 'opacity-30 blur-[1px] pointer-events-none': isFocusMode },
      ]"
    >
      <!-- Monitor Panel (Floating) -->
      <div
        class="w-[90vw] max-w-[340px] md:w-80 h-full flex flex-col pointer-events-none gap-4 relative"
      >
        <div
          class="h-full w-full stagger-item"
          :class="{ 'is-ready': isReady }"
          :style="getStaggerStyle(2)"
        >
          <GlassPanel
            className="flex-1 flex flex-col h-full pointer-events-auto shadow-2xl shadow-black/50 bg-slate-900/80 md:bg-slate-900/60 overflow-hidden backdrop-blur-xl"
          >
            <h3
              class="text-lg font-mono text-cyan-400 mb-4 flex items-center gap-2 border-b border-white/10 pb-2 shrink-0"
            >
              <span
                class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
              ></span>
              实时舆情监控
            </h3>
            <div class="mb-3 shrink-0">
              <FilterPanel />
            </div>
            <NewsTicker />
          </GlassPanel>
        </div>
      </div>
      
      <!-- Toggle Button (Desktop Only) - Attached to right side -->
      <button
        @click="toggleSidebar"
        class="absolute top-10 -right-8 z-50 w-8 h-12 bg-slate-900/80 backdrop-blur border border-white/10 hidden md:flex items-center justify-center text-slate-400 hover:text-cyan-300 pointer-events-auto rounded-r-lg border-l-0"
      >
        <el-icon><component :is="sidebarCollapsed ? Expand : Fold" /></el-icon>
      </button>
    </div>

    <!-- Layer 3.5: Map Control Island (Vertical) -->
    <div
      class="absolute bottom-32 z-40 transition-all duration-500 ease-in-out flex flex-col items-center"
      :class="[
        rightPanelCollapsed ? 'right-6' : 'right-[360px]',
        { 'opacity-30 blur-[1px] pointer-events-none': isFocusMode }
      ]"
    >
      <MapControlIsland />
    </div>

    <!-- Layer 4: Right Floating Zone (Responsive) -->
    <div
      class="absolute top-4 md:top-24 bottom-24 md:bottom-8 z-40 flex gap-4 pointer-events-none transition-transform duration-500 ease-in-out right-0"
      :class="[
        rightPanelCollapsed ? 'translate-x-[calc(100%-1rem)] md:translate-x-80' : '-translate-x-2 md:-translate-x-4',
        { 'opacity-30 blur-[1px] pointer-events-none': isFocusMode },
      ]"
    >
      <!-- Toggle Button (Desktop Only) - Attached to left side -->
      <button
        @click="toggleRightPanel"
        class="absolute top-10 -left-8 z-50 w-8 h-12 bg-slate-900/80 backdrop-blur border border-white/10 hidden md:flex items-center justify-center text-slate-400 hover:text-cyan-300 pointer-events-auto rounded-l-lg border-r-0"
      >
        <el-icon><component :is="rightPanelCollapsed ? Fold : Expand" /></el-icon>
      </button>

      <!-- Panels -->
      <div
        class="w-[90vw] max-w-[340px] md:w-80 h-full flex flex-col gap-4 pointer-events-none relative"
      >
        <div
          class="flex-1 flex flex-col gap-0 overflow-y-auto custom-scrollbar pr-1 pb-1"
        >
        <!-- Top: Insight -->
        <div
          class="shrink-0 stagger-item"
          :class="{ 'is-ready': isReady }"
          :style="getStaggerStyle(3)"
        >
          <GlassPanel
            className="h-auto min-h-[200px] pointer-events-auto transition-transform hover:scale-[1.02] duration-300 shadow-2xl shadow-black/50 bg-slate-900/80 md:bg-slate-900/60 backdrop-blur-xl"
          >
            <InsightCard />
          </GlassPanel>
        </div>

        <!-- Connection -->
        <div class="relative h-6 w-full shrink-0 my-1">
          <DataFlowLine
            direction="vertical"
            class="left-1/2 -translate-x-1/2"
          />
        </div>

        <!-- Middle: Keywords/Trends -->
        <div
          class="shrink-0 stagger-item"
          :class="{ 'is-ready': isReady }"
          :style="getStaggerStyle(4)"
        >
          <GlassPanel
            className="flex-1 min-h-[250px] pointer-events-auto transition-transform hover:scale-[1.02] duration-300 shadow-2xl shadow-black/50 bg-slate-900/80 md:bg-slate-900/60 flex flex-col overflow-hidden relative group backdrop-blur-xl"
          >
            <!-- View Toggle -->
            <div
              class="absolute top-2 right-2 z-10 flex bg-slate-800/80 rounded p-0.5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                @click="analysisView = 'keywords'"
                class="px-2 py-0.5 text-[10px] rounded transition-colors"
                :class="
                  analysisView === 'keywords'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                "
              >
                云图
              </button>
              <button
                @click="analysisView = 'trends'"
                class="px-2 py-0.5 text-[10px] rounded transition-colors"
                :class="
                  analysisView === 'trends'
                    ? 'bg-pink-500/20 text-pink-300'
                    : 'text-slate-400 hover:text-slate-200'
                "
              >
                趋势
              </button>
            </div>

            <Transition name="fade" mode="out-in">
              <KeywordCloud v-if="analysisView === 'keywords'" />
              <TrendChart v-else />
            </Transition>
          </GlassPanel>
        </div>

        <!-- Connection -->
        <div class="relative h-6 w-full shrink-0 my-1">
          <DataFlowLine
            direction="vertical"
            class="left-1/2 -translate-x-1/2"
          />
        </div>

        <!-- Bottom: Simulation -->
        <div
          class="shrink-0 stagger-item"
          :class="{ 'is-ready': isReady }"
          :style="getStaggerStyle(5)"
        >
          <GlassPanel
            className="h-auto min-h-[280px] pointer-events-auto transition-transform hover:scale-[1.02] duration-300 shadow-2xl shadow-black/50 bg-slate-900/60"
          >
            <DecisionPanel />
          </GlassPanel>
        </div>
      </div>
    </div>
    </div>

    <!-- Layer 5: Mobile Bottom Navigation -->
    <div
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex md:hidden justify-center pointer-events-none"
    >
      <div
        class="flex items-center gap-8 px-8 py-3 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl pointer-events-auto stagger-item"
        :class="[
          { 'opacity-30 blur-[1px] pointer-events-none': isFocusMode },
          { 'is-ready': isReady },
        ]"
        :style="getStaggerStyle(6)"
      >
        <!-- Monitor Toggle -->
        <button
          @click="toggleSidebar"
          class="p-2 rounded-full transition-all active:scale-95"
          :class="
            !sidebarCollapsed
              ? 'text-cyan-400 bg-cyan-500/20'
              : 'text-slate-400 hover:text-cyan-300'
          "
        >
          <el-icon size="24"><Monitor /></el-icon>
        </button>

        <!-- Voice (Center) -->
        <div class="scale-110">
          <VoiceButton />
        </div>

        <!-- Analysis Toggle -->
        <button
          @click="toggleRightPanel"
          class="p-2 rounded-full transition-all active:scale-95"
          :class="
            !rightPanelCollapsed
              ? 'text-cyan-400 bg-cyan-500/20'
              : 'text-slate-400 hover:text-cyan-300'
          "
        >
          <el-icon size="24"><DataAnalysis /></el-icon>
        </button>
      </div>
    </div>

    <!-- Layer 6: Detail Panel Overlay (已集成到水滴标记中) -->
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Staggered Entrance Animation */
.stagger-item {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out,
    transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: var(--stagger-delay, 0ms);
}

.stagger-item.is-ready {
  opacity: 1;
  transform: translateY(0);
}

/* Hidden Cascader Input Styling */
:deep(.region-cascader .el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
}
:deep(.region-cascader .el-input__inner) {
  color: #a5f3fc !important; /* Cyan-200 */
  font-family: monospace;
  cursor: pointer;
  text-align: center;
  width: auto;
  min-width: 120px;
}
:deep(.region-cascader .el-input__inner::placeholder) {
  color: #a5f3fc !important;
}
:deep(.region-cascader .el-input__suffix) {
  display: none;
}
</style>

<style>
/* Global Popper Styling */
.cyber-cascader-popper.el-popper {
  background: rgba(15, 23, 42, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
}
.cyber-cascader-popper .el-cascader-menu {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
}
.cyber-cascader-popper .el-cascader-node {
  color: #94a3b8; 
}
.cyber-cascader-popper .el-cascader-node:hover,
.cyber-cascader-popper .el-cascader-node.in-active-path,
.cyber-cascader-popper .el-cascader-node.is-active {
  background: rgba(6, 182, 212, 0.1) !important;
  color: #22d3ee !important;
  font-weight: bold;
}
.cyber-cascader-popper .el-scrollbar__wrap {
    background: transparent !important;
}
</style>
