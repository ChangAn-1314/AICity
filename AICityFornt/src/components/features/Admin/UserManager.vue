<script setup>
import { ref, reactive, onMounted } from 'vue';
import { authApi } from '@/api/auth';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Edit, Delete, Refresh, Key } from '@element-plus/icons-vue';
import NeonButton from '@/components/ui/NeonButton.vue';

const loading = ref(false);
const users = ref([]);
const dialogVisible = ref(false);
const dialogType = ref('create');
const formRef = ref(null);

const formData = reactive({
  id: '',
  username: '',
  name: '',
  email: '',
  role: 'user',
  status: 'active'
});

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await authApi.getUsers();
    users.value = res.data.list;
  } catch (error) {
    ElMessage.error('获取用户列表失败');
  } finally {
    loading.value = false;
  }
};

const openDialog = (type, row = null) => {
  dialogType.value = type;
  if (type === 'edit' && row) {
    Object.assign(formData, row);
  } else {
    Object.assign(formData, {
      id: '',
      username: '',
      name: '',
      email: '',
      role: 'user',
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
          await authApi.createUser(formData);
          ElMessage.success('创建成功');
        } else {
          await authApi.updateUser(formData.id, formData);
          ElMessage.success('更新成功');
        }
        dialogVisible.value = false;
        fetchUsers();
      } catch (error) {
        ElMessage.error('操作失败');
      }
    }
  });
};

const handleDelete = async (row) => {
  if (row.username === 'admin') {
    return ElMessage.warning('无法删除超级管理员');
  }
  try {
    await authApi.deleteUser(row.id);
    ElMessage.success('删除成功');
    fetchUsers();
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

const handleResetPassword = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要重置用户 ${row.username} 的密码吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await authApi.resetPassword(row.id);
    ElMessage.success('密码已重置为默认密码');
  } catch (error) {
    // Cancelled
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="space-y-4 animate-fade-in">
    <!-- Toolbar -->
    <div class="flex justify-between bg-slate-800/40 p-4 rounded-xl border border-white/5">
      <h2 class="text-xl font-bold text-slate-200">用户管理</h2>
      <NeonButton variant="primary" @click="openDialog('create')">
        <el-icon class="mr-1"><Plus /></el-icon> 新增用户
      </NeonButton>
    </div>

    <!-- Table -->
    <div class="bg-slate-800/40 rounded-xl border border-white/5 overflow-hidden">
      <el-table 
        :data="users" 
        style="width: 100%" 
        v-loading="loading"
        :header-cell-style="{ background: 'rgba(15, 23, 42, 0.8)', color: '#94a3b8', borderColor: 'rgba(255,255,255,0.05)' }"
        :cell-style="{ background: 'transparent', borderColor: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }"
        :row-class-name="'hover:bg-white/5'"
      >
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'info'" effect="dark">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" effect="plain" size="small">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="openDialog('edit', row)">编辑</el-button>
            <el-button type="warning" link :icon="Key" @click="handleResetPassword(row)">重置密码</el-button>
            <el-popconfirm 
              title="确定要删除此用户吗?" 
              @confirm="handleDelete(row)"
              v-if="row.username !== 'admin'"
            >
              <template #reference>
                <el-button type="danger" link :icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新增用户' : '编辑用户'"
      width="500px"
      class="cyber-dialog"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" class="w-full">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            active-value="active"
            inactive-value="disabled"
            active-text="启用"
            inactive-text="禁用"
          />
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
:deep(.cyber-dialog) {
  background-color: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
:deep(.el-dialog__title) { color: #f8fafc; }
:deep(.el-dialog__body) { color: #cbd5e1; }

:deep(.el-table) {
  --el-table-border-color: rgba(255, 255, 255, 0.05);
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: rgba(15, 23, 42, 0.8);
  --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.05);
  --el-table-text-color: #cbd5e1;
  --el-table-header-text-color: #94a3b8;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
