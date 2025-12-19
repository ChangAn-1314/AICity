import { useAuthStore } from '@/stores/auth';

export function setupGuards(router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Set document title
    document.title = `${to.meta.title ? to.meta.title + ' | ' : ''}智舆 城市大脑`;

    // Check if route requires auth
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !authStore.isAuthenticated) {
      // If there is a token but user is not authenticated (e.g. page refresh), try to validate
      if (authStore.token) {
        try {
          const success = await authStore.checkAuth();
          if (success) {
            return next();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      
      // Not authenticated, redirect to login
      return next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }

    // If authenticated and trying to access login, redirect to home
    if (to.path === '/login' && authStore.isAuthenticated) {
      return next({ path: '/' });
    }

    next();
  });
}
