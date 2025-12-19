<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { Search, Plus, Edit, Delete, Refresh } from '@element-plus/icons-vue';
import { sentimentApi } from '@/api/sentiment';
import { ElMessage } from 'element-plus';
import NeonButton from '@/components/ui/NeonButton.vue';

// State
const loading = ref(false);
const hotspots = ref([]);
const total = ref(0);
const searchQuery = ref('');
const filters = reactive({
  level: '',
  category: ''
});
const pagination = reactive({
  page: 1,
  pageSize: 10
});

// Dialog
const dialogVisible = ref(false);
const dialogType = ref('create'); // 'create' or 'edit'
const formRef = ref(null);
const formData = reactive({
  id: null,
  title: '',
  level: 'low',
  category: 'traffic',
  lat: '',
  lng: '',
  summary: '',
  status: 'active'
});

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  level: [{ required: true, message: '请选择等级', trigger: 'change' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }]
};

// Methods
const fetchData = async () => {
  loading.value = true;
  try {
    // Mock API support for params
    const res = await sentimentApi.getHotspots({
      page: pagination.page,
      pageSize: pagination.pageSize,
      search: searchQuery.value,
      ...filters
    });
    
    // Since mock API returns array, we simulate filtering/pagination here for demo
    let data = res;
    if (searchQuery.value) {
      data = data.filter(item => item.title.includes(searchQuery.value));
    }
    if (filters.level) {
      data = data.filter(item => item.level === filters.level);
    }
    
    hotspots.value = data;
    total.value = data.length; // Mock total
  } catch (error) {
    ElMessage.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  pagination.page = 1;
  fetchData();
};

const openDialog = (type, row = null) => {
  dialogType.value = type;
  if (type === 'edit' && row) {
    Object.assign(formData, { ...row });
  } else {
    // Reset form
    Object.assign(formData, {
      id: null,
      title: '',
      level: 'low',
      category: 'traffic',
      lat: '',
      lng: '',
      summary: '',
      status: 'active'
    });
  }
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'create') {
          await sentimentApi.createHotspot(formData);
          ElMessage.success('创建成功');
        } else {
          await sentimentApi.updateHotspot(formData.id, formData);
          ElMessage.success('更新成功');
        }
        dialogVisible.value = false;
        fetchData();
      } catch (error) {
        ElMessage.error('操作失败');
      }
    }
  });
};

const handleDelete = async (row) => {
  try {
    await sentimentApi.deleteHotspot(row.id);
    ElMessage.success('删除成功');
    fetchData();
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="space-y-4 animate-fade-in">
    <!-- Toolbar -->
    <div class="flex flex-col md:flex-row justify-between gap-4 bg-slate-800/40 p-4 rounded-xl border border-white/5">
      <div class="flex items-center gap-4 flex-1">
        <el-input
          v-model="searchQuery"
          placeholder="搜索热点标题..."
          :prefix-icon="Search"
          class="w-full md:w-64 cyber-input"
          @input="handleSearch"
        />
        <el-select v-model="filters.level" placeholder="全部等级" class="w-32 cyber-select" clearable @change="handleSearch">
          <el-option label="高风险" value="high" />
          <el-option label="中风险" value="medium" />
          <el-option label="低风险" value="low" />
        </el-select>
      </div>
      
      <NeonButton variant="primary" @click="openDialog('create')">
        <el-icon class="mr-1"><Plus /></el-icon> 新增热点
      </NeonButton>
    </div>

    <!-- Table -->
    <div class="bg-slate-800/40 rounded-xl border border-white/5 overflow-hidden">
      <el-table 
        :data="hotspots" 
        style="width: 100%" 
        v-loading="loading"
        :header-cell-style="{ background: 'rgba(15, 23, 42, 0.8)', color: '#94a3b8', borderColor: 'rgba(255,255,255,0.05)' }"
        :cell-style="{ background: 'transparent', borderColor: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }"
        :row-class-name="'hover:bg-white/5'"
      >
        <el-table-column prop="title" label="标题" min-width="180" />
        
        <el-table-column prop="level" label="等级" width="100">
          <template #default="{ row }">
            <el-tag :type="row.level === 'high' ? 'danger' : row.level === 'medium' ? 'warning' : 'success'" effect="dark">
              {{ row.level === 'high' ? '高风险' : row.level === 'medium' ? '中风险' : '低风险' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }">
            <span class="capitalize">{{ row.category }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="位置" width="180">
          <template #default="{ row }">
            <span class="text-xs font-mono text-slate-400">{{ row.lat?.toFixed(4) }}, {{ row.lng?.toFixed(4) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="时间" width="180">
          <template #default="{ row }">
            <span class="text-xs">{{ new Date(row.time).toLocaleString() }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="openDialog('edit', row)">编辑</el-button>
            <el-popconfirm title="确定要删除吗?" @confirm="handleDelete(row)">
              <template #reference>
                <el-button type="danger" link :icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- Pagination -->
      <div class="p-4 flex justify-end border-t border-white/5">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="total"
          layout="prev, pager, next, total"
          background
        />
      </div>
    </div>

    <!-- Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新增热点' : '编辑热点'"
      width="500px"
      class="cyber-dialog"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入热点标题" />
        </el-form-item>
        
        <el-form-item label="等级" prop="level">
          <el-select v-model="formData.level" class="w-full">
            <el-option label="高风险" value="high" />
            <el-option label="中风险" value="medium" />
            <el-option label="低风险" value="low" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="分类" prop="category">
          <el-select v-model="formData.category" class="w-full">
            <el-option label="交通出行" value="traffic" />
            <el-option label="民生服务" value="livelihood" />
            <el-option label="医疗卫生" value="health" />
            <el-option label="公共安全" value="security" />
          </el-select>
        </el-form-item>
        
        <div class="flex gap-4">
          <el-form-item label="经度" prop="lng" class="flex-1">
            <el-input v-model="formData.lng" placeholder="121.xxxx" />
          </el-form-item>
          <el-form-item label="纬度" prop="lat" class="flex-1">
            <el-input v-model="formData.lat" placeholder="31.xxxx" />
          </el-form-item>
        </div>
        
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="formData.summary" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* Custom Styles for Element Plus components to match Cyberpunk theme */
:deep(.cyber-input .el-input__wrapper) {
  background-color: rgba(15, 23, 42, 0.6);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}

:deep(.cyber-select .el-input__wrapper) {
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

/* Dialog Dark Mode */
:deep(.el-dialog) {
  background-color: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-dialog__title) {
  color: #f8fafc;
}

:deep(.el-dialog__body) {
  color: #cbd5e1;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
