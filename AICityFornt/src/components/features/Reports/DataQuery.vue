<script setup>
import { ref, reactive, onMounted } from 'vue';
import { reportApi } from '@/api/report';
import { Search, Download } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import NeonButton from '@/components/ui/NeonButton.vue';

const loading = ref(false);
const results = ref([]);
const total = ref(0);

const query = reactive({
  dateRange: [],
  keywords: '',
  region: '',
  category: ''
});

const pagination = reactive({
  page: 1,
  pageSize: 20
});

const regions = ['浉河区', '平桥区', '罗山县', '光山县', '新县', '商城县', '固始县', '潢川县', '淮滨县', '息县'];
const categories = ['交通', '民生', '环保', '医疗', '教育', '安全'];

const handleQuery = async () => {
  loading.value = true;
  try {
    const res = await reportApi.queryData({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...query
    });
    results.value = res.list;
    total.value = res.total;
  } catch (error) {
    ElMessage.error('查询失败');
  } finally {
    loading.value = false;
  }
};

const handleExport = () => {
  if (results.value.length === 0) return ElMessage.warning('无数据可导出');
  
  const header = 'ID,Date,Region,Category,Title,Value\n';
  const rows = results.value.map(row => 
    `${row.id},${row.date},${row.region},${row.category},${row.title},${row.value}`
  ).join('\n');
  
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `data-export-${Date.now()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
  ElMessage.success('导出成功');
};

const resetQuery = () => {
  query.dateRange = [];
  query.keywords = '';
  query.region = '';
  query.category = '';
  handleQuery();
};

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="space-y-4 animate-fade-in h-full flex flex-col">
    <!-- Filter Panel -->
    <div class="bg-slate-800/40 p-6 rounded-xl border border-white/5">
      <h2 class="text-xl font-bold text-slate-200 mb-4">历史数据查询</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <el-date-picker
          v-model="query.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="w-full cyber-date-picker"
        />
        
        <el-select v-model="query.region" placeholder="选择区域" clearable class="w-full cyber-select">
          <el-option v-for="r in regions" :key="r" :label="r" :value="r" />
        </el-select>
        
        <el-select v-model="query.category" placeholder="选择分类" clearable class="w-full cyber-select">
          <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
        </el-select>
        
        <el-input v-model="query.keywords" placeholder="关键词搜索..." :prefix-icon="Search" class="w-full cyber-input" />
      </div>
      
      <div class="flex justify-end gap-4 mt-4">
        <el-button @click="resetQuery">重置</el-button>
        <NeonButton variant="primary" @click="handleQuery" :loading="loading">
          <el-icon class="mr-1"><Search /></el-icon> 查询
        </NeonButton>
      </div>
    </div>

    <!-- Results Table -->
    <div class="bg-slate-800/40 rounded-xl border border-white/5 overflow-hidden flex-1 flex flex-col">
      <div class="p-4 border-b border-white/5 flex justify-between items-center">
        <span class="text-slate-400">共找到 {{ total }} 条结果</span>
        <el-button type="success" plain size="small" @click="handleExport">
          <el-icon class="mr-1"><Download /></el-icon> 导出数据
        </el-button>
      </div>
      
      <el-table 
        :data="results" 
        style="width: 100%; height: 100%;" 
        v-loading="loading"
        :header-cell-style="{ background: 'rgba(15, 23, 42, 0.8)', color: '#94a3b8', borderColor: 'rgba(255,255,255,0.05)' }"
        :cell-style="{ background: 'transparent', borderColor: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }"
        :row-class-name="'hover:bg-white/5'"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="region" label="区域" width="100" />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }">
            <el-tag size="small" effect="dark">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="value" label="数值" width="100" />
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

/* Cyber Styles */
:deep(.cyber-input .el-input__wrapper),
:deep(.cyber-select .el-input__wrapper),
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
