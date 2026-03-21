// URL Hash 控制脚本 - 用于演示视频
// 在 AppShell.vue 的 onMounted 中调用

export function setupDemoMode() {
  // 监听 URL hash 变化
  const handleHashChange = () => {
    const hash = window.location.hash.replace('#', '');
    
    // 根据 hash 切换到对应的视图
    switch (hash) {
      case 'monitor':
        // 切换到监测视图
        if (window.__appShellInstance) {
          window.__appShellInstance.activeMenu = 'monitor';
        }
        break;
      case 'map':
        // 切换到地图视图
        if (window.__appShellInstance) {
          window.__appShellInstance.activeMenu = 'map';
        }
        break;
      case 'analysis':
        // 切换到分析视图
        if (window.__appShellInstance) {
          window.__appShellInstance.activeMenu = 'analysis';
        }
        break;
      case 'decision':
        // 打开决策工具
        if (window.__appShellInstance) {
          window.__appShellInstance.activeTool = 'decision';
        }
        break;
    }
  };

  // 初始化时执行一次
  handleHashChange();

  // 监听 hash 变化
  window.addEventListener('hashchange', handleHashChange);

  // 返回清理函数
  return () => {
    window.removeEventListener('hashchange', handleHashChange);
  };
}
