<script setup>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import NeonButton from '@/components/ui/NeonButton.vue';
import { Setting, Bell, Key, Connection } from '@element-plus/icons-vue';

const activeTab = ref('general');
const loading = ref(false);

const settings = reactive({
  general: {
    systemName: '智舆 城市大脑',
    refreshRate: 30,
    autoBackup: true
  },
  alerts: {
    highThreshold: 80,
    mediumThreshold: 50,
    emailNotifications: true,
    smsNotifications: false,
    alertContact: 'admin@example.com'
  },
  apiKeys: {
    amapKey: '****************',
    voiceApiKey: '****************'
  },
  dataSources: {
    useMockData: true,
    weatherApiUrl: 'https://api.weather.com/v1',
    trafficApiUrl: 'https://api.traffic.com/v1'
  }
});

const originalSettings = JSON.parse(JSON.stringify(settings));

const handleSave = async () => {
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    ElMessage.success('系统设置已保存');
    // Update original settings to new values
    Object.assign(originalSettings, JSON.parse(JSON.stringify(settings)));
  } catch (error) {
    ElMessage.error('保存失败');
  } finally {
    loading.value = false;
  }
};

const handleReset = () => {
  ElMessageBox.confirm('确定要还原当前页面的设置吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // Reset only current tab or all? Usually all or specific. Let's do all for simplicity or just reload.
    // Here I will reset all for simplicity.
    Object.assign(settings, JSON.parse(JSON.stringify(originalSettings)));
    ElMessage.info('设置已还原');
  }).catch(() => {});
};
</script>

<template>
  <div class="space-y-6 animate-fade-in h-full flex flex-col">
    <div class="flex justify-between items-center bg-slate-800/40 p-4 rounded-xl border border-white/5">
      <h2 class="text-xl font-bold text-slate-200">系统设置</h2>
      <div class="flex gap-3">
        <el-button @click="handleReset">重置</el-button>
        <NeonButton variant="primary" @click="handleSave" :loading="loading">
          保存更改
        </NeonButton>
      </div>
    </div>

    <div class="flex-1 bg-slate-800/40 rounded-xl border border-white/5 overflow-hidden flex flex-col">
      <el-tabs v-model="activeTab" class="cyber-tabs h-full" tab-position="left">
        <el-tab-pane name="general" label="基础设置">
          <template #label>
            <span class="flex items-center gap-2"><el-icon><Setting /></el-icon> 基础设置</span>
          </template>
          <div class="p-6 max-w-2xl">
            <el-form :model="settings.general" label-width="120px" label-position="top">
              <el-form-item label="系统名称">
                <el-input v-model="settings.general.systemName" />
              </el-form-item>
              <el-form-item label="数据刷新间隔 (秒)">
                <el-slider v-model="settings.general.refreshRate" :min="5" :max="300" show-input />
              </el-form-item>
              <el-form-item label="自动备份">
                <el-switch v-model="settings.general.autoBackup" active-text="开启" inactive-text="关闭" />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane name="alerts" label="告警配置">
           <template #label>
            <span class="flex items-center gap-2"><el-icon><Bell /></el-icon> 告警配置</span>
          </template>
          <div class="p-6 max-w-2xl">
            <el-form :model="settings.alerts" label-width="120px" label-position="top">
              <div class="grid grid-cols-2 gap-6">
                <el-form-item label="高风险阈值">
                  <el-input-number v-model="settings.alerts.highThreshold" :min="0" :max="100" />
                </el-form-item>
                <el-form-item label="中风险阈值">
                  <el-input-number v-model="settings.alerts.mediumThreshold" :min="0" :max="100" />
                </el-form-item>
              </div>
              
              <el-divider content-position="left">通知方式</el-divider>
              
              <el-form-item label="邮件通知">
                <el-switch v-model="settings.alerts.emailNotifications" />
              </el-form-item>
              <el-form-item label="接收邮箱" v-if="settings.alerts.emailNotifications">
                <el-input v-model="settings.alerts.alertContact" />
              </el-form-item>
              <el-form-item label="短信通知">
                <el-switch v-model="settings.alerts.smsNotifications" />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane name="api" label="API 密钥">
           <template #label>
            <span class="flex items-center gap-2"><el-icon><Key /></el-icon> API 密钥</span>
          </template>
          <div class="p-6 max-w-2xl">
            <el-alert title="密钥直接关系到服务可用性，请谨慎修改" type="warning" show-icon class="mb-6" :closable="false" />
            <el-form :model="settings.apiKeys" label-width="120px" label-position="top">
              <el-form-item label="高德地图 Key">
                <el-input v-model="settings.apiKeys.amapKey" type="password" show-password />
              </el-form-item>
              <el-form-item label="语音交互 API Key">
                <el-input v-model="settings.apiKeys.voiceApiKey" type="password" show-password />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane name="data" label="数据源">
           <template #label>
            <span class="flex items-center gap-2"><el-icon><Connection /></el-icon> 数据源</span>
          </template>
          <div class="p-6 max-w-2xl">
            <el-form :model="settings.dataSources" label-width="120px" label-position="top">
              <el-form-item label="使用模拟数据">
                <el-switch v-model="settings.dataSources.useMockData" active-text="开启" inactive-text="关闭" />
              </el-form-item>
              <el-form-item label="气象数据接口">
                <el-input v-model="settings.dataSources.weatherApiUrl" :disabled="settings.dataSources.useMockData">
                  <template #prepend>GET</template>
                </el-input>
              </el-form-item>
              <el-form-item label="交通流接口">
                <el-input v-model="settings.dataSources.trafficApiUrl" :disabled="settings.dataSources.useMockData">
                  <template #prepend>WS</template>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.cyber-tabs {
  display: flex;
  height: 100%;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

:deep(.cyber-tabs .el-tabs__header) {
  background-color: rgba(15, 23, 42, 0.3);
  margin-right: 0 !important;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  height: 100%;
}

:deep(.cyber-tabs .el-tabs__item) {
  color: #94a3b8;
  padding: 0 24px;
  height: 50px;
  line-height: 50px;
  text-align: left;
  justify-content: flex-start;
}

:deep(.cyber-tabs .el-tabs__item.is-active) {
  color: #22d3ee;
  background-color: rgba(34, 211, 238, 0.05);
  border-right: 2px solid #22d3ee;
}

:deep(.cyber-tabs .el-tabs__content) {
  height: 100%;
  overflow-y: auto;
  flex: 1;
}

:deep(.cyber-tabs .el-tabs__nav-wrap) {
  height: 100%;
}

:deep(.el-form-item__label) {
  color: #cbd5e1;
}

:deep(.el-input__wrapper), :deep(.el-textarea__inner) {
  background-color: rgba(15, 23, 42, 0.6);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}
</style>
