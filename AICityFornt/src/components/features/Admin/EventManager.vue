<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { sentimentApi } from '@/api/sentiment';
import { ElMessage } from 'element-plus';
import { Clock, User, Timer, Refresh } from '@element-plus/icons-vue';

// State
const events = ref([]);
const loading = ref(false);
const draggingEvent = ref(null);

// Columns definition
const columns = [
  { id: 'pending', title: '待处理', color: 'bg-red-500/10 border-red-500/20 text-red-400' },
  { id: 'processing', title: '处理中', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' },
  { id: 'resolved', title: '已完成', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' }
];

// Group events by status
const groupedEvents = computed(() => {
  const groups = { pending: [], processing: [], resolved: [] };
  events.value.forEach(event => {
    if (groups[event.status]) {
      groups[event.status].push(event);
    }
  });
  return groups;
});

// Detail Drawer
const drawerVisible = ref(false);
const selectedEvent = ref(null);
const timeline = ref([]);

// Methods
const fetchEvents = async () => {
  loading.value = true;
  try {
    events.value = await sentimentApi.getEvents();
  } catch (error) {
    ElMessage.error('获取事件失败');
  } finally {
    loading.value = false;
  }
};

const handleDragStart = (event, item) => {
  draggingEvent.value = item;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.dropEffect = 'move';
};

const handleDrop = async (status) => {
  if (!draggingEvent.value || draggingEvent.value.status === status) return;
  
  const item = draggingEvent.value;
  const oldStatus = item.status;
  
  // Optimistic update
  item.status = status;
  
  try {
    await sentimentApi.updateEventStatus(item.id, status);
    ElMessage.success(`状态更新: ${status}`);
  } catch (error) {
    // Revert on failure
    item.status = oldStatus;
    ElMessage.error('状态更新失败');
  } finally {
    draggingEvent.value = null;
  }
};

const openDetail = async (item) => {
  selectedEvent.value = item;
  drawerVisible.value = true;
  try {
    timeline.value = await sentimentApi.getEventTimeline(item.id);
  } catch (error) {
    timeline.value = [];
  }
};

const getLevelType = (level) => {
  const map = { high: 'danger', medium: 'warning', low: 'info' };
  return map[level] || 'info';
};

onMounted(() => {
  fetchEvents();
});
</script>

<template>
  <div class="h-full flex flex-col animate-fade-in">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl font-bold text-slate-200">事件看板</h2>
      <el-button :icon="Refresh" circle @click="fetchEvents" class="bg-slate-800 border-white/10 text-slate-400" />
    </div>

    <!-- Kanban Board -->
    <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0 overflow-x-auto pb-4">
      <div 
        v-for="col in columns" 
        :key="col.id"
        class="flex flex-col bg-slate-800/30 rounded-xl border border-white/5 overflow-hidden"
        @dragover.prevent
        @drop="handleDrop(col.id)"
      >
        <!-- Column Header -->
        <div class="p-4 border-b border-white/5 flex items-center justify-between" :class="col.color">
          <span class="font-medium">{{ col.title }}</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-black/20">
            {{ groupedEvents[col.id].length }}
          </span>
        </div>

        <!-- Card List -->
        <div class="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
          <div
            v-for="item in groupedEvents[col.id]"
            :key="item.id"
            draggable="true"
            @dragstart="handleDragStart($event, item)"
            @click="openDetail(item)"
            class="bg-slate-800/60 p-4 rounded-lg border border-white/5 cursor-move hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all group relative shadow-lg shadow-black/20"
          >
             <div class="flex justify-between items-start mb-2">
               <span class="font-medium text-slate-200 line-clamp-1">{{ item.title }}</span>
               <el-tag size="small" :type="getLevelType(item.level)" effect="dark" class="scale-90 origin-right">
                 {{ item.level }}
               </el-tag>
             </div>
             <p class="text-xs text-slate-500 mb-3 line-clamp-2">{{ item.description }}</p>
             
             <div class="flex items-center justify-between text-xs text-slate-500">
               <div class="flex items-center gap-1">
                 <el-icon><User /></el-icon>
                 <span>{{ item.assignee }}</span>
               </div>
               <div class="flex items-center gap-1">
                 <el-icon><Clock /></el-icon>
                 <span>{{ new Date(item.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }}</span>
               </div>
             </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="groupedEvents[col.id].length === 0" class="text-center py-8 text-slate-600 text-sm border-2 border-dashed border-slate-800 rounded-lg">
            暂无事件
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Drawer -->
    <el-drawer
      v-model="drawerVisible"
      title="事件详情"
      direction="rtl"
      size="400px"
      class="cyber-drawer"
    >
      <div v-if="selectedEvent" class="space-y-6">
        <!-- Header Info -->
        <div class="bg-slate-800/50 p-4 rounded-lg border border-white/5">
          <h3 class="text-lg font-bold text-white mb-2">{{ selectedEvent.title }}</h3>
          <div class="flex gap-2 mb-4">
            <el-tag :type="getLevelType(selectedEvent.level)" effect="dark">{{ selectedEvent.level }}</el-tag>
            <el-tag type="info" effect="plain">{{ selectedEvent.category || 'General' }}</el-tag>
          </div>
          <p class="text-slate-400 text-sm leading-relaxed">{{ selectedEvent.description }}</p>
        </div>

        <!-- Timeline -->
        <div>
          <h4 class="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
            <el-icon><Timer /></el-icon> 处理记录
          </h4>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in timeline"
              :key="index"
              :type="activity.type"
              :timestamp="new Date(activity.time).toLocaleString()"
              placement="top"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </div>
        
        <!-- Actions -->
        <div class="pt-4 border-t border-white/10">
           <h4 class="text-sm font-medium text-slate-300 mb-4">快速操作</h4>
           <div class="flex gap-2">
             <el-button type="primary" plain size="small" @click="drawerVisible = false">分配人员</el-button>
             <el-button type="success" plain size="small" @click="drawerVisible = false">标记完成</el-button>
           </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

:deep(.cyber-drawer) {
  background-color: #0f172a !important;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}
:deep(.cyber-drawer .el-drawer__header) {
  color: #cbd5e1;
  margin-bottom: 0;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
:deep(.el-timeline-item__content) {
  color: #94a3b8;
}
:deep(.el-timeline-item__timestamp) {
  color: #64748b;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
