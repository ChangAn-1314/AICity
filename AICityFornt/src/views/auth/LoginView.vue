<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { User, Lock } from '@element-plus/icons-vue';
import GlassPanel from '@/components/ui/GlassPanel.vue';
import NeonButton from '@/components/ui/NeonButton.vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const pageLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    pageLoading.value = false;
  }, 1500);
});

const formRef = ref(null);
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
};

const handleLogin = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const success = await authStore.login(loginForm);
      if (success) {
        ElMessage.success('登录成功');
        const redirect = route.query.redirect || '/';
        router.push(redirect);
      } else {
        ElMessage.error(authStore.error || '登录失败，请检查用户名或密码');
      }
    }
  });
};
</script>

<template>
  <div class="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute inset-0 bg-slate-950">
      <!-- Grid Pattern -->
      <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px); background-size: 40px 40px;"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/80 to-slate-900 pointer-events-none"></div>
    </div>
    
    <!-- Animated Orbs -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse pointer-events-none mix-blend-screen"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-700 pointer-events-none mix-blend-screen"></div>

    <!-- Loading Splash Screen -->
    <Transition name="fade">
      <div v-if="pageLoading" class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-3xl">
        <div class="relative w-48 h-48 mb-12">
          <div class="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute inset-0 border border-cyan-500/30 rounded-full animate-spin-slow dashed-circle"></div>
          <img src="/images/logo.png" class="w-full h-full object-contain relative z-10 animate-float" />
        </div>
        
        <div class="w-64 h-1 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur">
          <div class="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-loading-bar"></div>
        </div>
        
        <div class="mt-6 flex flex-col items-center gap-2">
          <div class="text-cyan-400 font-mono text-lg tracking-[0.5em] animate-pulse font-bold">ZHIYU</div>
          <div class="text-slate-500 text-xs tracking-[0.2em] uppercase">Intelligent Perception System</div>
        </div>
      </div>
    </Transition>

    <!-- Intro Animation Wrapper -->
    <GlassPanel v-if="!pageLoading" className="w-full max-w-md relative z-10 shadow-2xl !bg-slate-900/60 backdrop-blur-xl border-white/10 animate-slide-up">
      <div class="text-center mb-8">
        <!-- Logo -->
        <div class="relative w-24 h-24 mx-auto mb-4 group perspective-1000">
          <div class="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl group-hover:bg-cyan-500/40 transition-all duration-500 animate-pulse-slow"></div>
          <img 
            src="/images/logo.png" 
            alt="AI City Logo" 
            class="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] transform transition-transform duration-500 hover:scale-110 hover:rotate-3"
          />
        </div>

        <h1 class="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 tracking-tight">
          智舆 城市大脑
        </h1>
        <p class="text-slate-400 text-xs tracking-[0.2em] uppercase font-light">
          Intelligent Perception System
        </p>
      </div>

      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            :prefix-icon="User"
            class="cyber-input"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
            class="cyber-input"
          />
        </el-form-item>

        <div class="flex items-center justify-between mb-6">
          <el-checkbox 
            v-model="loginForm.remember" 
            class="cyber-checkbox"
          >
            <span class="text-slate-400">记住我</span>
          </el-checkbox>
          <a href="#" class="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            忘记密码?
          </a>
        </div>

        <NeonButton 
          class="w-full flex justify-center items-center h-10"
          @click.prevent="handleLogin"
          :disabled="authStore.loading"
        >
          <span v-if="authStore.loading" class="animate-pulse">登录中...</span>
          <span v-else>登 录</span>
        </NeonButton>
      </el-form>

      <!-- Footer -->
      <div class="mt-6 text-center text-xs text-slate-500">
        <p>测试账号: admin / admin 或 user / user</p>
      </div>
    </GlassPanel>
  </div>
</template>

<style scoped>
.cyber-input :deep(.el-input__wrapper) {
  background-color: rgba(15, 23, 42, 0.6);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.cyber-input :deep(.el-input__wrapper:hover),
.cyber-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.5);
  background-color: rgba(15, 23, 42, 0.8);
}

.cyber-input :deep(.el-input__inner) {
  color: #f8fafc;
  height: 44px;
}

.cyber-checkbox :deep(.el-checkbox__inner) {
  background-color: rgba(15, 23, 42, 0.6);
  border-color: rgba(255, 255, 255, 0.2);
}

.cyber-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #06b6d4;
  border-color: #06b6d4;
}

.cyber-checkbox :deep(.el-checkbox__label) {
  padding-left: 8px;
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-slide-up {
  animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite ease-in-out;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 10s linear infinite;
}

.dashed-circle {
  border-style: dashed;
  border-width: 1px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes loading-bar {
  0% { width: 0%; transform: translateX(-100%); }
  50% { width: 70%; transform: translateX(0); }
  100% { width: 100%; transform: translateX(100%); }
}

.animate-loading-bar {
  animation: loading-bar 1.5s ease-in-out infinite;
  width: 100%;
}

/* Vue Transition: fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
