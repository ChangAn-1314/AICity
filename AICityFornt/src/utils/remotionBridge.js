// AICityFornt/src/utils/remotionBridge.js
// Remotion 视频录制桥接器 - 接收来自 iframe 父窗口的控制命令

export function initRemotionBridge(mapInstance, mapStore) {
  if (!window.parent || window.parent === window) {
    return;
  }

  window.addEventListener('message', (event) => {
    if (!event.data || !event.data.type) return;

    const {type, data} = event.data;

    switch (type) {
      case 'INIT_MAP':
        if (mapInstance && data) {
          mapInstance.setZoom(data.zoom || 4);
          mapInstance.setPitch(data.pitch || 0);
        }
        break;

      case 'SET_ZOOM':
        if (mapInstance && data && typeof data.zoom === 'number') {
          mapInstance.setZoom(data.zoom);
        }
        break;

      case 'SET_PITCH':
        if (mapInstance && data && typeof data.pitch === 'number') {
          mapInstance.setPitch(data.pitch);
        }
        break;

      case 'SET_CENTER':
        if (mapInstance && data && data.center) {
          mapInstance.setCenter(data.center);
        }
        break;

      case 'SHOW_HOTSPOTS':
        if (mapStore) {
          mapStore.showHotspots = true;
        }
        break;

      case 'HIDE_UI':
        document.body.classList.add('remotion-recording-mode');
        break;

      case 'SHOW_UI':
        document.body.classList.remove('remotion-recording-mode');
        break;

      default:
        console.warn('[RemotionBridge] Unknown command:', type);
    }
  });

  console.log('[RemotionBridge] Initialized');
}
