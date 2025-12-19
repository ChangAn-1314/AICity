import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const token = ref(null);
  const permissions = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value);

  const hasPermission = (permission) => {
    return permissions.value.includes(permission);
  };

  // Actions
  const login = async (credentials) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await authApi.login(credentials);
      const { token: newToken, user: newUser, permissions: newPermissions } = response.data;
      
      token.value = newToken;
      user.value = newUser;
      permissions.value = newPermissions;
      
      return true;
    } catch (err) {
      error.value = err.message || '登录失败';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear state
      token.value = null;
      user.value = null;
      permissions.value = [];
      loading.value = false;
    }
  };

  const checkAuth = async () => {
    if (!token.value) return false;
    
    try {
      // Verify token by fetching user info
      const response = await authApi.getUserInfo();
      // Optional: update user info if needed
      // user.value = response.data.user;
      return true; 
    } catch (err) {
      // Token invalid
      await logout();
      return false;
    }
  };

  return {
    user,
    token,
    permissions,
    loading,
    error,
    isAuthenticated,
    hasPermission,
    login,
    logout,
    checkAuth
  };
}, {
  persist: {
    paths: ['token', 'user', 'permissions'],
    storage: localStorage,
  }
});
