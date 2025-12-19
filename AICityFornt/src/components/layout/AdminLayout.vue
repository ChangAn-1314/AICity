<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 md:p-8 animate-fade-in"
  >
    <!-- Main Container -->
    <GlassPanel
      className="w-full h-full max-w-7xl flex overflow-hidden relative shadow-2xl shadow-cyan-500/10"
    >
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 z-50 p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-full hover:bg-slate-700/50 transition-colors"
      >
        <el-icon><Close /></el-icon>
      </button>

      <!-- Sidebar -->
      <div
        class="w-64 flex-shrink-0 bg-slate-900/50 border-r border-white/5 flex flex-col transition-all duration-300"
        :class="{ 'w-20': collapsed }"
      >
        <!-- Logo/Header -->
        <div
          class="h-16 flex items-center justify-center border-b border-white/5"
        >
          <span
            v-if="!collapsed"
            class="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
            >智舆 Admin</span
          >
          <span v-else class="text-xl font-bold text-cyan-400">A</span>
        </div>

        <!-- Menu Items -->
        <div
          class="flex-1 overflow-y-auto py-4 space-y-2 px-2 custom-scrollbar"
        >
          <div
            v-for="item in menuItems"
            :key="item.id"
            class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group relative overflow-hidden"
            :class="
              activeItem === item.id
                ? 'bg-cyan-500/10 text-cyan-300'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            "
            @click="activeItem = item.id"
          >
            <!-- Hover Glow -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
            ></div>

            <el-icon :size="20"><component :is="item.icon" /></el-icon>
            <span
              v-if="!collapsed"
              class="text-sm font-medium whitespace-nowrap"
              >{{ item.label }}</span
            >

            <!-- Active Indicator -->
            <div
              v-if="activeItem === item.id"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            ></div>
          </div>
        </div>

        <!-- Footer / User -->
        <div
          class="p-4 border-t border-white/5 flex items-center justify-between"
        >
          <div
            class="flex items-center gap-3 justify-center md:justify-start overflow-hidden"
          >
            <div
              class="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-purple-500/30"
            >
              AD
            </div>
            <div v-if="!collapsed" class="flex flex-col overflow-hidden">
              <span class="text-xs font-bold text-slate-200 truncate"
                >Admin User</span
              >
              <span class="text-[10px] text-slate-500 truncate"
                >System Administrator</span
              >
            </div>
          </div>

          <el-tooltip v-if="!collapsed" content="退出登录" placement="top">
            <button
              @click="handleLogout"
              class="text-slate-500 hover:text-red-400 transition-colors"
            >
              <el-icon :size="18"><SwitchButton /></el-icon>
            </button>
          </el-tooltip>
        </div>
      </div>

      <!-- Main Content -->
      <div
        class="flex-1 flex flex-col bg-slate-900/30 relative overflow-hidden"
      >
        <!-- Top Bar -->
        <div
          class="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-900/20"
        >
          <button
            @click="collapsed = !collapsed"
            class="text-slate-400 hover:text-white transition-colors"
          >
            <el-icon :size="20"
              ><component :is="collapsed ? 'Expand' : 'Fold'"
            /></el-icon>
          </button>

          <div class="flex items-center gap-4">
            <span class="text-xs text-slate-500 font-mono">{{
              currentTime
            }}</span>
            <el-tag
              size="small"
              type="success"
              effect="dark"
              class="!bg-emerald-500/20 !border-emerald-500/30 !text-emerald-300"
              >SYSTEM ONLINE</el-tag
            >
          </div>
        </div>

        <!-- Content Slot -->
        <div class="flex-1 overflow-auto p-6 relative custom-scrollbar">
          <!-- Background Grid -->
          <div
            class="absolute inset-0 pointer-events-none opacity-[0.05]"
            style="
              background-image: linear-gradient(#ffffff 1px, transparent 1px),
                linear-gradient(90deg, #ffffff 1px, transparent 1px);
              background-size: 20px 20px;
            "
          ></div>

          <!-- Dashboard Content -->
          <AdminDashboard v-if="activeItem === 'dashboard'" />
          <HotspotManager v-else-if="activeItem === 'hotspots'" />
          <EventManager v-else-if="activeItem === 'alerts'" />
          <UserManager v-else-if="activeItem === 'users'" />
          <AuditLogs v-else-if="activeItem === 'logs'" />
          <DataQuery v-else-if="activeItem === 'query'" />
          <StatisticsReport v-else-if="activeItem === 'stats'" />
          <ReportGenerator v-else-if="activeItem === 'gen-report'" />
          <SystemSettings v-else-if="activeItem === 'settings'" />

          <div
            v-else
            class="flex flex-col items-center justify-center h-full text-slate-500"
          >
            <el-icon :size="48" class="mb-4 opacity-20"><Setting /></el-icon>
            <div class="text-lg">Module: {{ activeItem }}</div>
            <div class="text-sm opacity-50">Content under construction</div>
          </div>
        </div>
      </div>
    </GlassPanel>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import GlassPanel from "@/components/ui/GlassPanel.vue";
import AdminDashboard from "@/components/features/Admin/AdminDashboard.vue";
import HotspotManager from "@/components/features/Admin/HotspotManager.vue";
import EventManager from "@/components/features/Admin/EventManager.vue";
import UserManager from "@/components/features/Admin/UserManager.vue";
import SystemSettings from "@/components/features/Admin/SystemSettings.vue";
import AuditLogs from "@/components/features/Admin/AuditLogs.vue";
import DataQuery from "@/components/features/Reports/DataQuery.vue";
import StatisticsReport from "@/components/features/Reports/StatisticsReport.vue";
import ReportGenerator from "@/components/features/Reports/ReportGenerator.vue";
import {
  DataBoard,
  MapLocation,
  WarnTriangleFilled,
  User,
  Setting,
  Fold,
  Expand,
  Close,
  SwitchButton,
  Document,
  Search,
  TrendCharts,
  Files,
} from "@element-plus/icons-vue";

defineEmits(["close"]);

const props = defineProps({
  defaultTab: {
    type: String,
    default: "dashboard",
  },
});

const router = useRouter();
const authStore = useAuthStore();
const collapsed = ref(false);
const activeItem = ref(props.defaultTab);
const currentTime = ref("");

// Watch for prop changes to switch tabs if already open
import { watch } from "vue";
watch(
  () => props.defaultTab,
  (newTab) => {
    if (newTab) {
      activeItem.value = newTab;
    }
  }
);

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: DataBoard },
  { id: "hotspots", label: "Hotspot Mgmt", icon: MapLocation },
  { id: "alerts", label: "Alert Center", icon: WarnTriangleFilled },
  { id: "users", label: "User Access", icon: User },
  { id: "logs", label: "Audit Logs", icon: Document },
  { id: "query", label: "Data Query", icon: Search },
  { id: "stats", label: "Statistics", icon: TrendCharts },
  { id: "gen-report", label: "Generate Report", icon: Files },
  { id: "settings", label: "System Settings", icon: Setting },
];

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};

let timer;
onMounted(() => {
  const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString("en-US", { hour12: false });
  };
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.5);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.8);
}

.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
