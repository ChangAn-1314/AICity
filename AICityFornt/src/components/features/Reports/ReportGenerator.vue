<script setup>
import { ref, reactive } from 'vue';
import { reportApi } from '@/api/report';
import { Document, Download, Loading } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import NeonButton from '@/components/ui/NeonButton.vue';

const generating = ref(false);
const progress = ref(0);
const generatedReport = ref(null);

const form = reactive({
  template: 'daily',
  dateRange: [],
  format: 'pdf',
  includeCharts: true,
  includeDetails: false
});

const templates = [
  { label: '每日舆情简报', value: 'daily' },
  { label: '周度分析报告', value: 'weekly' },
  { label: '月度综合汇编', value: 'monthly' },
  { label: '突发事件专报', value: 'special' }
];

const handleGenerate = async () => {
  if (form.dateRange.length === 0 && form.template !== 'daily') { // daily defaults to today
    // return ElMessage.warning('请选择日期范围');
  }
  
  generating.value = true;
  progress.value = 0;
  generatedReport.value = null;

  // Simulate progress
  const interval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.floor(Math.random() * 10) + 5;
    }
  }, 200);

  try {
    const res = await reportApi.generateReport(form);
    progress.value = 100;
    clearInterval(interval);
    setTimeout(() => {
      generatedReport.value = res.data.preview;
      generating.value = false;
      ElMessage.success('报告生成完成');
    }, 500);
  } catch (error) {
    clearInterval(interval);
    generating.value = false;
    ElMessage.error('生成失败');
  }
};

const handleDownload = () => {
  ElMessage.success(`正在下载报告: report.${form.format}`);
};
</script>

<template>
  <div class="h-full flex flex-col md:flex-row gap-6 animate-fade-in">
    <!-- Configuration Panel -->
    <div class="w-full md:w-1/3 flex flex-col gap-6">
      <div class="bg-slate-800/40 p-6 rounded-xl border border-white/5">
        <h2 class="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
          <el-icon><Document /></el-icon> 报告配置
        </h2>
        
        <el-form :model="form" label-position="top" class="space-y-4">
          <el-form-item label="报告模板">
            <el-select v-model="form.template" class="w-full cyber-select">
              <el-option v-for="t in templates" :key="t.value" :label="t.label" :value="t.value" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="form.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="w-full cyber-date-picker"
            />
          </el-form-item>
          
          <el-form-item label="导出格式">
            <el-radio-group v-model="form.format" class="cyber-radio">
              <el-radio-button label="pdf">PDF 文档</el-radio-button>
              <el-radio-button label="excel">Excel 表格</el-radio-button>
              <el-radio-button label="html">HTML 网页</el-radio-button>
            </el-radio-group>
          </el-form-item>
          
          <div class="bg-slate-900/30 p-4 rounded-lg border border-white/5 space-y-2">
            <el-checkbox v-model="form.includeCharts" class="text-slate-300">包含统计图表</el-checkbox>
            <br>
            <el-checkbox v-model="form.includeDetails" class="text-slate-300">附带详细数据表</el-checkbox>
          </div>
          
          <div class="pt-4">
            <NeonButton variant="primary" class="w-full" @click="handleGenerate" :loading="generating">
              {{ generating ? '正在生成...' : '生成报告' }}
            </NeonButton>
          </div>
        </el-form>
      </div>
      
      <!-- History/Tips could go here -->
      <div class="bg-slate-800/40 p-6 rounded-xl border border-white/5 flex-1">
        <h3 class="text-sm font-medium text-slate-400 mb-2">生成记录</h3>
        <div class="text-xs text-slate-500 italic">暂无历史记录</div>
      </div>
    </div>

    <!-- Preview Panel -->
    <div class="flex-1 bg-slate-800/40 rounded-xl border border-white/5 flex flex-col overflow-hidden relative">
      <div class="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900/20">
        <span class="font-medium text-slate-300">报告预览</span>
        <el-button 
          v-if="generatedReport" 
          type="success" 
          size="small" 
          @click="handleDownload"
        >
          <el-icon class="mr-1"><Download /></el-icon> 下载文件
        </el-button>
      </div>
      
      <div class="flex-1 p-8 overflow-y-auto relative custom-scrollbar">
        <!-- Loading State -->
        <div v-if="generating" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-10 backdrop-blur-sm">
          <div class="w-64">
            <div class="flex justify-between text-xs text-cyan-400 mb-2">
              <span>生成中...</span>
              <span>{{ progress }}%</span>
            </div>
            <el-progress :percentage="progress" :show-text="false" stroke-width="4" color="#06b6d4" />
          </div>
          <div class="mt-4 text-slate-400 text-sm">正在汇总数据与渲染图表...</div>
        </div>

        <!-- Report Content -->
        <div v-if="generatedReport" class="bg-white text-slate-900 p-8 rounded shadow-lg min-h-[600px] max-w-[800px] mx-auto animate-slide-up">
          <div class="text-center border-b-2 border-slate-200 pb-4 mb-6">
            <h1 class="text-2xl font-bold mb-2">{{ generatedReport.title }}</h1>
            <div class="text-slate-500 text-sm">生成日期: {{ generatedReport.date }}</div>
          </div>
          
          <div class="prose prose-slate max-w-none">
            <h3>一、综述</h3>
            <p>{{ generatedReport.summary }}</p>
            
            <h3>二、统计概览</h3>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="h-32 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">
                [趋势图表占位符]
              </div>
              <div class="h-32 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">
                [分布图表占位符]
              </div>
            </div>
            
            <h3>三、详细分析</h3>
            <p>报告内容展示区域。根据所选模板不同，此处将展示详细的舆情分析数据、热点事件追踪及处置建议。</p>
            <ul>
              <li>重点关注区域：浉河区</li>
              <li>高频关键词：交通、施工</li>
            </ul>
          </div>
          
          <div class="mt-12 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
            Generated by ZhiYu Intelligence System
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="!generating" class="h-full flex flex-col items-center justify-center text-slate-600">
          <el-icon size="64" class="mb-4 opacity-20"><Document /></el-icon>
          <div class="text-lg">请配置并生成报告</div>
          <div class="text-sm opacity-50">预览内容将显示在此处</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

:deep(.cyber-select .el-input__wrapper),
:deep(.cyber-date-picker .el-input__wrapper) {
  background-color: rgba(15, 23, 42, 0.6);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}

:deep(.cyber-radio .el-radio-button__inner) {
  background-color: rgba(15, 23, 42, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  box-shadow: none;
}
:deep(.cyber-radio .el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: rgba(6, 182, 212, 0.2);
  border-color: #06b6d4;
  color: #22d3ee;
  box-shadow: none;
}

:deep(.el-form-item__label) {
  color: #cbd5e1;
}
:deep(.el-checkbox__label) {
  color: #94a3b8;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.1);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
}
</style>
