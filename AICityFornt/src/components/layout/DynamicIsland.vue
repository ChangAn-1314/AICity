<script setup>
import { ref, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { useMapStore } from "@/stores/map";
import { useAuthStore } from "@/stores/auth";
import {
  Switch,
  Aim,
  Monitor,
  MapLocation,
  DataAnalysis,
  Warning,
  Setting,
  List,
  Search,
  DataBoard,
  WarnTriangleFilled,
  User,
  Document,
  TrendCharts,
  Files,
  SwitchButton
} from "@element-plus/icons-vue";
import VoiceButton from "@/components/features/Voice/VoiceButton.vue";

const router = useRouter();
const mapStore = useMapStore();
const authStore = useAuthStore();
const time = ref("");
const activeMenu = inject("activeMenu", ref("map"));
const toggleAdmin = inject("toggleAdmin", (tab) =>
  console.warn("toggleAdmin not provided", tab)
);
const toggleTool = inject("toggleTool", (tool) =>
  console.warn("toggleTool not provided", tool)
);

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};

onMounted(() => {
  setInterval(() => {
    const now = new Date();
    time.value = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  }, 1000);
});

const toggleLayer = (layer) => {
  mapStore.toggleLayer(layer);
};
</script>

<template>
  <div
    class="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl transition-all hover:bg-black/70 duration-300 cursor-default pointer-events-auto"
  >
    <!-- Time -->
    <div class="font-mono font-bold text-slate-200 text-lg w-16 text-center">
      {{ time }}
    </div>

    <!-- Admin Tools -->
    <div class="w-px h-4 bg-white/10 mx-1"></div>

    <div class="flex items-center gap-6">
      <el-tooltip content="后台概览" placement="bottom">
        <el-icon :size="20" class="cursor-pointer hover:text-purple-400 transition-all hover:scale-110 outline-none" @click="toggleTool('dashboard')"><DataBoard /></el-icon>
      </el-tooltip>
      <el-tooltip content="舆情管理" placement="bottom">
        <el-icon :size="20" class="cursor-pointer hover:text-purple-400 transition-all hover:scale-110 outline-none" @click="toggleTool('hotspots')"><List /></el-icon>
      </el-tooltip>
      <el-tooltip content="预警管理" placement="bottom">
        <el-icon :size="20" class="cursor-pointer hover:text-purple-400 transition-all hover:scale-110 outline-none" @click="toggleTool('alerts')"><WarnTriangleFilled /></el-icon>
      </el-tooltip>
      <el-tooltip content="统计分析" placement="bottom">
        <el-icon :size="20" class="cursor-pointer hover:text-purple-400 transition-all hover:scale-110 outline-none" @click="toggleTool('stats')"><TrendCharts /></el-icon>
      </el-tooltip>
      <el-tooltip content="报告生成" placement="bottom">
        <el-icon :size="20" class="cursor-pointer hover:text-purple-400 transition-all hover:scale-110 outline-none" @click="toggleTool('genreport')"><Files /></el-icon>
      </el-tooltip>
      <el-tooltip content="数据查询" placement="bottom">
        <el-icon :size="20" class="cursor-pointer hover:text-purple-400 transition-all hover:scale-110 outline-none" @click="toggleTool('query')"><Search /></el-icon>
      </el-tooltip>
      <el-tooltip content="审计日志" placement="bottom">
        <el-icon :size="20" class="cursor-pointer hover:text-purple-400 transition-all hover:scale-110 outline-none" @click="toggleTool('logs')"><Document /></el-icon>
      </el-tooltip>
      <el-tooltip content="用户管理" placement="bottom">
        <el-icon :size="20" class="cursor-pointer hover:text-purple-400 transition-all hover:scale-110 outline-none" @click="toggleTool('users')"><User /></el-icon>
      </el-tooltip>
      <el-tooltip content="系统设置" placement="bottom">
        <el-icon :size="20" class="cursor-pointer hover:text-purple-400 transition-all hover:scale-110 outline-none" @click="toggleTool('settings')"><Setting /></el-icon>
      </el-tooltip>
    </div>

    <div class="w-px h-4 bg-white/20"></div>

    <!-- Map Controls (Moved to Map Component) -->
    <!--
    <div class="flex items-center gap-3">
      <el-tooltip content="切换热力图" placement="bottom">
        <button
          @click="toggleLayer('heatmap')"
          class="flex items-center justify-center w-8 h-8 rounded-full transition-all"
          :class="
            mapStore.layers.heatmap
              ? 'bg-red-500/20 text-red-400 shadow-[0_0_10px_rgba(248,113,113,0.3)]'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2.26C4.19 13.47 3 11.38 3 9a7 7 0 0 1 7-7z"
            ></path>
            <line x1="8" y1="22" x2="16" y2="22"></line>
          </svg>
        </button>
      </el-tooltip>

      <el-tooltip content="切换行政边界" placement="bottom">
        <button
          @click="toggleLayer('boundary')"
          class="flex items-center justify-center w-8 h-8 rounded-full transition-all"
          :class="
            mapStore.layers.boundary
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          "
        >
          <el-icon size="14"><Aim /></el-icon>
        </button>
      </el-tooltip>
    </div>
    -->

    <div class="w-px h-4 bg-white/20"></div>

    <!-- Voice Interaction -->
    <VoiceButton />

    <div class="w-px h-4 bg-white/20"></div>

    <div class="text-xs text-slate-400 tracking-widest">智舆</div>

    <div class="w-px h-4 bg-white/20"></div>

    <!-- 退出登录 -->
    <el-tooltip content="退出登录" placement="bottom">
      <el-icon 
        :size="20" 
        class="cursor-pointer text-slate-400 hover:text-red-400 transition-all hover:scale-110 outline-none" 
        @click="handleLogout"
      >
        <SwitchButton />
      </el-icon>
    </el-tooltip>
  </div>
</template>
