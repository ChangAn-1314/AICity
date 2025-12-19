import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  // State
  const currentCity = ref('信阳')
  const viewMode = ref('3D') // 2D, 3D
  const layers = ref({
    heatmap: false,
    boundary: true,
    traffic: false,
    markers: true, // 悬浮标志
    models: true,  // 3D 还原建模
    lines: true    // 关联线
  })
  const cameraState = ref({
    center: [114.0913, 32.1477],
    zoom: 12,
    pitch: 45,
    rotation: 0
  })
  
  // Screen position of the selected hotspot { x: 0, y: 0 }
  const hotspotScreenPosition = ref(null)
  
  // Actions
  function setCity(city) {
    currentCity.value = city
    // TODO: update camera center based on city
  }

  function setViewMode(mode) {
    viewMode.value = mode
  }

  function toggleLayer(layerName) {
    if (Object.prototype.hasOwnProperty.call(layers.value, layerName)) {
      layers.value[layerName] = !layers.value[layerName]
    }
  }

  function updateCameraState(newState) {
    cameraState.value = { ...cameraState.value, ...newState }
  }

  return {
    currentCity,
    viewMode,
    layers,
    cameraState,
    hotspotScreenPosition,
    setCity,
    setViewMode,
    toggleLayer,
    updateCameraState
  }
}, {
  persist: true
})
