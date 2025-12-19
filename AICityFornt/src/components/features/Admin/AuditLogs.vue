<script setup>
import { ref, reactive, onMounted } from 'vue';
import { authApi } from '@/api/auth';
import { Search, Download, Refresh } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import NeonButton from '@/components/ui/NeonButton.vue';

const loading = ref(false);
const logs = ref([]);
const total = ref(0);

const filters = reactive({
  dateRange: [],
  action: '',
  user: ''
});

const pagination = reactive({
  page: 1,
  pageSize: 20
});

const fetchLogs = async () => {
  loading.value = true;
  try {
    const res = await authApi.getAuditLogs({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters
    });
    logs.value = res.data.list;
    total.value = res.data.total;
  } catch (error) {
    ElMessage.error('获取日志失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  pagination.page = 1;
  fetchLogs();
};

const handleExport = () => {
  // Mock CSV export
  const header = 'ID,Timestamp,User,Action,Target,IP,Details\n';
  const rows = logs.value.map(log => 
    `${log.id},${new Date(log.timestamp).toISOString()},${log.user},${log.action},${log.target},${log.ip},${log.details}`
  ).join('\n');
  
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `audit-logs-${Date.now()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
  ElMessage.success('导出成功');
};

const getActionType = (action) => {
  const map = {
    create: 'success',
    update: 'warning',
    delete: 'danger',
    login: 'info',
    logout: 'info'
  };
  return map[action] || 'info';
};

onMounted(() => {
  fetchLogs();
});
</script>

<template>
  <div class="space-y-4 animate-fade-in h-full flex flex-col">
    <!-- Toolbar -->
    <div class="flex flex-col md:flex-row justify-between gap-4 bg-slate-800/40 p-4 rounded-xl border border-white/5">
      <div class="flex items-center gap-4 flex-1 flex-wrap">
        <el-date-picker
          v-model="filters.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="cyber-date-picker"
          style="width: 300px"
          @change="handleSearch"
        />
        <el-select v-model="filters.action" placeholder="操作类型" clearable class="w-32 cyber-select" @change="handleSearch">
          <el-option label="创建" value="create" />
          <el-option label="更新" value="update" />
          <el-option label="删除" value="delete" />
          <el-option label="登录" value="login" />
          <el-option label="登出" value="logout" />
        </el-select>
        <el-input
          v-model="filters.user"
          placeholder="搜索用户..."
          :prefix-icon="Search"
          class="w-48 cyber-input"
          @change="handleSearch"
        />
      </div>
      
      <NeonButton @click="handleExport">
        <el-icon class="mr-1"><Download /></el-icon> 导出 CSV
      </NeonButton>
    </div>

    <!-- Table -->
    <div class="bg-slate-800/40 rounded-xl border border-white/5 overflow-hidden flex-1 flex flex-col">
      <el-table 
        :data="logs" 
        style="width: 100%; height: 100%;" 
        v-loading="loading"
        :header-cell-style="{ background: 'rgba(15, 23, 42, 0.8)', color: '#94a3b8', borderColor: 'rgba(255,255,255,0.05)' }"
        :cell-style="{ background: 'transparent', borderColor: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }"
        :row-class-name="'hover:bg-white/5'"
      >
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="p-4 bg-slate-900/50 text-slate-400 text-sm">
              <p><span class="text-slate-300">IP 地址:</span> {{ row.ip }}</p>
              <p><span class="text-slate-300">详细信息:</span> {{ row.details }}</p>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="时间" width="180">
          <template #default="{ row }">
            <span class="text-xs font-mono">{{ new Date(row.timestamp).toLocaleString() }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="user" label="用户" width="120" />
        
        <el-table-column prop="action" label="操作" width="100">
          <template #default="{ row }">
            <el-tag :type="getActionType(row.action)" effect="dark" size="small" class="capitalize">
              {{ row.action }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="target" label="对象" width="100">
          <template #default="{ row }">
            <el-tag type="info" effect="plain" size="small" class="capitalize">
              {{ row.target }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="details" label="详情摘要" min-width="200" show-overflow-tooltip />
      </el-table>
      
      <!-- Pagination -->
      <div class="p-4 flex justify-end border-t border-white/5 bg-slate-800/20">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="total"
          :page-sizes="[20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          background
        />
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

/* Custom Element Plus Styles */
:deep(.cyber-input .el-input__wrapper) {
  background-color: rgba(15, 23, 42, 0.6);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}

:deep(.cyber-select .el-input__wrapper) {
  background-color: rgba(15, 23, 42, 0.6);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}

:deep(.cyber-date-picker .el-input__wrapper) {
  background-color: rgba(15, 23, 42, 0.6);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}

:deep(.el-table) {
  --el-table-border-color: rgba(255, 255, 255, 0.05);
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: rgba(15, 23, 42, 0.8);
  --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.05);
  --el-table-text-color: #cbd5e1;
  --el-table-header-text-color: #94a3b8;
  --el-table-expanded-cell-bg-color: transparent;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #06b6d4;
}

:deep(.el-pagination.is-background .el-pager li) {
  background-color: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
}

:deep(.el-pagination.is-background .btn-prev),
:deep(.el-pagination.is-background .btn-next) {
  background-color: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
}
</style>
