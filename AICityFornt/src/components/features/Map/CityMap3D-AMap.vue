<script setup>
import { onMounted, onUnmounted, ref, shallowRef, computed, watch } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Location, ArrowDown, Filter, Close, TrendCharts, Warning, Connection, OfficeBuilding, Aim, Grid } from '@element-plus/icons-vue'
import { useSentimentStore } from '@/stores/sentiment'
import { useMapStore } from '@/stores/map'
import { useFocusMode } from '@/composables/useFocusMode'
import { AMapOptimizer, FrustumCuller, RenderOnDemand, PerformanceMonitor, createAMapGltfLoader } from '@/utils/mapOptimization'

const emit = defineEmits(['hotspot-click'])
const sentimentStore = useSentimentStore()
const mapStore = useMapStore()
const { isFocusMode } = useFocusMode()

// 高德地图 Key - 请在高德开放平台申请: https://lbs.amap.com/
const AMAP_KEY = '2f5760aea1bba05bbe5fbd4d8fbd02ce'  // TODO: 替换为你的 Key
const AMAP_SECRET = '215065a4f4714692d2c56e76a2d25bb5'  // 如果使用安全密钥模式

const container = ref(null)
const mapInstance = shallowRef(null)
const AMap = shallowRef(null)
const buildingsLayerRef = shallowRef(null)  // 保存建筑图层引用
const heatmapInstance = shallowRef(null)    // 热力图实例
const districtSearchInstance = shallowRef(null) // 行政区查询实例
const districtPolygons = shallowRef([]) // 行政区边界多边形
const glCustomLayerRef = shallowRef(null) // GL 自定义图层
const threeScene = shallowRef(null)
const threeCamera = shallowRef(null)
const threeRenderer = shallowRef(null)
const sceneModels = shallowRef([]) // 3D 模型引用
const eventChainLines = shallowRef([]) // 事件链连接线引用

// 单例 Loader 实例 - 避免重复创建导致卡顿
let gltfLoaderInstance = null
let dracoLoaderInstance = null
let modelCache = new Map() // 模型缓存

// 性能优化实例
let mapOptimizer = null
let frustumCuller = null
let renderController = null
let performanceMonitor = null
let amapGltfLoader = null // 高德官方 GltfLoader（可选）

// 模型加载方式：'threejs' 使用 Three.js GLTFLoader（支持自定义效果），'amap' 使用高德官方 GltfLoader（性能更优）
const MODEL_LOADER_TYPE = 'threejs'

const getGLTFLoader = () => {
  if (!gltfLoaderInstance) {
    gltfLoaderInstance = new GLTFLoader()
    dracoLoaderInstance = new DRACOLoader()
    dracoLoaderInstance.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    dracoLoaderInstance.preload() // 预加载解码器
    gltfLoaderInstance.setDRACOLoader(dracoLoaderInstance)
  }
  return gltfLoaderInstance
}

// 正确释放 Three.js 资源
const disposeObject = (obj) => {
  if (!obj) return
  obj.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose()
    }
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(m => {
          if (m.map) m.map.dispose()
          m.dispose()
        })
      } else {
        if (child.material.map) child.material.map.dispose()
        child.material.dispose()
      }
    }
  })
}

// 地图状态显示
const currentZoom = ref(14)
const currentPitch = ref(70)
const currentRotation = ref(-15)
const currentExpandDirection = ref('right')  // 当前展开方向，用于缩放时保持一致

// 舆情热点数据
const hotspotMarkers = shallowRef([])  // 存储标记引用
const showDetailPanel = ref(false)     // 显示详情面板
const filterLevels = ref(['high', 'medium', 'low'])  // 筛选等级
const isNavigating = ref(false)        // 是否正在跳转动画中（防止提前展开）

// 缓存行政区边界数据
const boundaryCache = new Map()

// 非线性缓动动画工具函数
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
const easeInCubic = (t) => t * t * t

// 通用动画函数：从 start 到 end 值，调用 onUpdate 更新
const animateValue = (start, end, duration, onUpdate, onComplete, easing = easeOutCubic) => {
  const startTime = performance.now()
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easing(progress)
    const value = start + (end - start) * easedProgress
    onUpdate(value)
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      if (onComplete) onComplete()
    }
  }
  requestAnimationFrame(animate)
}

// 转换 store 数据为地图可用格式
const currentHotspots = computed(() => {
  return sentimentStore.hotspots.map(h => {
    // 兼容两种坐标格式: location: {lng, lat} 或直接 lng, lat
    const lng = h.location?.lng ?? h.lng
    const lat = h.location?.lat ?? h.lat
    return {
      ...h,
      position: [lng, lat],
      count: h.count ?? h.heat ?? Math.floor(Math.random() * 10000),
      trend: h.trend || (Math.random() > 0.5 ? 'up' : 'down')
    }
  })
})

const filteredHotspots = computed(() => {
  return currentHotspots.value.filter(h => filterLevels.value.includes(h.level))
})

const hotspotStats = computed(() => {
  const spots = currentHotspots.value
  return {
    total: spots.length,
    high: spots.filter(h => h.level === 'high').length,
    medium: spots.filter(h => h.level === 'medium').length,
    low: spots.filter(h => h.level === 'low').length,
    totalCount: spots.reduce((sum, h) => sum + (h.count || 0), 0)
  }
})

// 监听 store 数据变化更新地图
watch(() => sentimentStore.hotspots, () => {
  if (mapInstance.value) {
    // 延迟更新以确保地图状态稳定
    setTimeout(() => {
      updateBuildingStylesByPOI()
      addHotspotBuildingEffects(mapInstance.value, AMap.value)
      updateHeatmapData()
      updateSceneModels(mapInstance.value)
    }, 100)
  }
}, { deep: true })

// 监听热力图开关 - 带非线性动画（渐变效果）
watch(() => mapStore.layers.heatmap, (visible) => {
  if (heatmapInstance.value) {
    if (visible) {
      heatmapInstance.value.show()
      updateHeatmapData()
      // 渐入动画：opacity 从 0 到 0.8
      animateValue(0, 0.8, 500, (val) => {
        heatmapInstance.value.setOptions({ opacity: [0, val] })
      })
    } else {
      // 渐出动画：opacity 从 0.8 到 0
      animateValue(0.8, 0, 400, (val) => {
        heatmapInstance.value.setOptions({ opacity: [0, val] })
      }, () => {
        heatmapInstance.value.hide()
      }, easeInCubic)
    }
  }
})

// 监听边界图层开关
watch(() => mapStore.layers.boundary, (visible) => {
  if (visible) {
    drawDistrictBoundaries(currentCity.value.name)
  } else {
    clearDistrictBoundaries()
  }
})

// 监听悬浮标志开关 - 带非线性动画
watch(() => mapStore.layers.markers, (visible) => {
  if (window.hotspotBalloons) {
    if (visible) {
      window.hotspotBalloons.forEach(marker => marker.show())
      // 渐入动画
      animateValue(0, 1, 500, (val) => {
        document.querySelectorAll('.teardrop-marker, .cluster-marker').forEach(el => {
          el.style.opacity = val
          el.style.transform = `scale(${0.5 + 0.5 * val})`
        })
      })
    } else {
      // 渐出动画
      animateValue(1, 0, 400, (val) => {
        document.querySelectorAll('.teardrop-marker, .cluster-marker').forEach(el => {
          el.style.opacity = val
          el.style.transform = `scale(${0.5 + 0.5 * val})`
        })
      }, () => {
        window.hotspotBalloons.forEach(marker => marker.hide())
      }, easeInCubic)
    }
  }
})

// 监听 3D 模型开关 - 带非线性动画
watch(() => mapStore.layers.models, (visible) => {
  // Three.js Models - 渐变透明度
  if (sceneModels.value && sceneModels.value.length > 0) {
    if (visible) {
      sceneModels.value.forEach(model => model.visible = true)
      animateValue(0, 1, 500, (val) => {
        sceneModels.value.forEach(model => {
          model.traverse(child => {
            if (child.material) child.material.opacity = val * 0.8
          })
        })
      })
    } else {
      animateValue(1, 0, 400, (val) => {
        sceneModels.value.forEach(model => {
          model.traverse(child => {
            if (child.material) child.material.opacity = val * 0.8
          })
        })
      }, () => {
        sceneModels.value.forEach(model => model.visible = false)
      }, easeInCubic)
    }
  }
  // AMap Buildings Layer
  if (buildingsLayerRef.value) {
    visible ? buildingsLayerRef.value.show() : buildingsLayerRef.value.hide()
  }
})

// 监听关联线开关 - 带非线性动画（从主事件端逐渐显现到次事件端）
watch(() => mapStore.layers.lines, (visible) => {
  if (eventChainLines.value && eventChainLines.value.length > 0) {
    if (visible) {
      eventChainLines.value.forEach(line => {
        line.visible = true
        if (line.material.uniforms) {
          line.material.uniforms.progress.value = 0
        }
      })
      // 从主事件端逐渐显现到次事件端
      animateValue(0, 1, 800, (val) => {
        eventChainLines.value.forEach(line => {
          if (line.material.uniforms) {
            line.material.uniforms.progress.value = val
          }
        })
      })
    } else {
      // 从次事件端逐渐消失到主事件端
      animateValue(1, 0, 500, (val) => {
        eventChainLines.value.forEach(line => {
          if (line.material.uniforms) {
            line.material.uniforms.progress.value = val
          }
        })
      }, () => {
        eventChainLines.value.forEach(line => line.visible = false)
      }, easeInCubic)
    }
  }
})

// 切换筛选等级
const toggleFilter = (level) => {
  const idx = filterLevels.value.indexOf(level)
  if (idx > -1) {
    filterLevels.value.splice(idx, 1)
  } else {
    filterLevels.value.push(level)
  }
  // 更新标记显示
  updateMarkerVisibility()
}

// 更新标记可见性 (现在更新建筑和气球)
const updateMarkerVisibility = () => {
  // 由于舆情现在集成在建筑中，需要重新应用建筑样式
  if (mapInstance.value && AMap.value && buildingsLayerRef.value) {
    // 延迟更新以确保地图状态稳定
    setTimeout(() => {
      updateBuildingStylesByPOI()
      addHotspotBuildingEffects(mapInstance.value, AMap.value) // Ensure balloons are updated too
      updateHeatmapData() // Filter affects heatmap too
    }, 100)
  }
}

// 更新热力图数据
const updateHeatmapData = () => {
  if (!heatmapInstance.value || !mapStore.layers.heatmap) return
  
  const points = filteredHotspots.value.map(spot => ({
    lng: spot.position[0],
    lat: spot.position[1],
    count: spot.count // Use discussion count as weight
  }))
  
  // 计算最大权重以归一化
  const max = Math.max(...points.map(p => p.count), 100)
  
  heatmapInstance.value.setDataSet({
    data: points,
    max: max
  })
}

// 选中热点显示详情 - 直接扩展为详情面板
const selectHotspot = (spot) => {
  // 先收起之前展开的标记
  const prevSelected = sentimentStore.selectedHotspot
  if (prevSelected && prevSelected.id !== spot.id) {
    const prevEl = document.querySelector(`.teardrop-marker[data-spot-id="${prevSelected.id}"]`)
    if (prevEl) prevEl.classList.remove('expanded')
  }
  
  sentimentStore.selectHotspot(spot)
  showDetailPanel.value = true
  emit('hotspot-click', spot)
  
  // 跳转并放大到该点，完成后再展开
  if (mapInstance.value) {
    isNavigating.value = true  // 标记正在跳转，防止 zoomend 提前展开
    mapInstance.value.setZoomAndCenter(17, spot.position, false, 800)
    // 等待地图跳转动画完成后再展开
    setTimeout(() => {
      isNavigating.value = false
      // 导航完成后重新计算方向（因为标记可能被重建，位置也变了）
      updateMarkerExpandDirection(spot.id)
      const el = document.querySelector(`.teardrop-marker[data-spot-id="${spot.id}"]`)
      if (el) el.classList.add('expanded')
    }, 850)
  } else {
    // 地图未初始化时立即展开
    updateMarkerExpandDirection(spot.id)
    const el = document.querySelector(`.teardrop-marker[data-spot-id="${spot.id}"]`)
    if (el) el.classList.add('expanded')
  }
}

const closeDetailPanel = () => {
  // 收起当前展开的标记
  const currentSelected = sentimentStore.selectedHotspot
  if (currentSelected) {
    const el = document.querySelector(`.teardrop-marker[data-spot-id="${currentSelected.id}"]`)
    if (el) el.classList.remove('expanded')
  }
  
  showDetailPanel.value = false
  sentimentStore.selectHotspot(null)
}

// 城市配置 - 降低默认 zoom 以显示更大范围
const CITIES = {
  // zoom 15 是 3D 建筑显示的最低级别 (高德 API 限制)
  china: { center: [105.0, 36.0], zoom: 4, name: '中国' },
  xinyang: { center: [114.0913, 32.1477], zoom: 15, name: '信阳' },
  shanghai: { center: [121.4737, 31.2304], zoom: 15, name: '上海' },
  beijing: { center: [116.4074, 39.9042], zoom: 15, name: '北京' },
  shenzhen: { center: [114.0579, 22.5431], zoom: 15, name: '深圳' },
}

const currentCity = ref(CITIES.xinyang) // Default to Xinyang

// 切换城市
const changeCity = (cityKeyOrName) => {
  // 1. Try to find in CITIES by key or name
  let city = CITIES[cityKeyOrName] || Object.values(CITIES).find(c => c.name === cityKeyOrName)

  if (city) {
    // Preset found
    if (currentCity.value.name === city.name && currentCity.value.zoom === city.zoom) return 
    
    currentCity.value = city
    closeDetailPanel()
    performMapJump(city)
  } else {
    // 2. Dynamic Search (for cities not in presets)
    if (!districtSearchInstance.value) return
    
    districtSearchInstance.value.search(cityKeyOrName, (status, result) => {
      if (status === 'complete' && result.districtList?.length) {
        const d = result.districtList[0]
        const newCity = {
          name: d.name,
          center: [d.center.lng, d.center.lat],
          zoom: d.level === 'province' ? 8 : 10 // Adjust zoom based on level
        }
        
        if (currentCity.value.name === newCity.name) return
        
        currentCity.value = newCity
        closeDetailPanel()
        performMapJump(newCity)
      }
    })
  }
}

// Helper for map movement and updates
const performMapJump = (city) => {
  if (!mapInstance.value) return
  
  // Set navigating flag to prevent auto-detection interference
  isNavigating.value = true

  const map = mapInstance.value
  const currentCenter = map.getCenter()
  const targetCenter = city.center
  
  // Simple distance heuristic (Euclidean distance in degrees)
  // 1 degree ~ 111km. Threshold 5 degrees ~ 550km.
  const dx = currentCenter.getLng() - targetCenter[0]
  const dy = currentCenter.getLat() - targetCenter[1]
  const distanceSq = dx * dx + dy * dy
  
  // If distance is large (> 5 degrees), use "Fly To" animation (Up then Down)
  if (distanceSq > 25) {
      console.log('Performing High Altitude Jump')
      
      // Phase 1: Lift up to National View (Zoom 4.5) & Pan to Target
      map.setZoomAndCenter(4.5, targetCenter, false, 1500)
      
      // Phase 2: Wait for load, then Dive in
      setTimeout(() => {
          // Phase 3: Zoom into target level
          map.setZoom(city.zoom, false, 1200)
          
          // Finalize updates after landing
          setTimeout(() => {
             finalizeMapUpdate(city)
          }, 1300)
          
      }, 2000) // Wait 2s (1.5s animation + 0.5s pause)
      
  } else {
      // Standard direct jump for short distances
      map.setZoomAndCenter(city.zoom, city.center, false, 1000)
      setTimeout(() => {
         finalizeMapUpdate(city)
      }, 1200)
  }
}

// Unified update logic
const finalizeMapUpdate = (city) => {
    updateBuildingStylesByPOI()
    refreshHotspotMarkers()
    updateHeatmapData()
    // 绘制新城市的边界
    if (mapStore.layers.boundary) {
       drawDistrictBoundaries(city.name)
    }
    
    // Reset navigating flag
    isNavigating.value = false
}

// 监听 mapStore.currentCity 变化 (Support external switching)
watch(() => mapStore.currentCity, (newVal) => {
  if (newVal && newVal !== currentCity.value.name) {
    changeCity(newVal)
  }
})

// 刷新热点标记 (城市切换时调用)
const refreshHotspotMarkers = () => {
  if (!mapInstance.value || !AMap.value) return
  
  // 清除旧标记 (handled by addHotspotBuildingEffects clearing window.hotspotBalloons)
  addHotspotBuildingEffects(mapInstance.value, AMap.value)
  
  // 更新 3D 模型
  updateSceneModels(mapInstance.value)
}

// 绘制行政区边界
const drawDistrictBoundaries = (keyword) => {
  if (!mapInstance.value || !AMap.value || !districtSearchInstance.value) return

  // 先清除旧边界 (带动画)
  clearDistrictBoundaries()
  
  // 检查缓存
  if (boundaryCache.has(keyword)) {
    renderBoundaries(boundaryCache.get(keyword), keyword === '中国')
    return
  }

  districtSearchInstance.value.search(keyword, (status, result) => {
    if (status === 'complete') {
      let bounds = result.districtList[0].boundaries
      if (bounds) {
        // Optimization for China: Filter small islands to reduce lag
        if (keyword === '中国' || keyword === '中华人民共和国') {
           console.log(`[Map] Optimizing ${keyword} boundary: Reduced from ${bounds.length} to top 50 polygons.`);
           bounds = bounds.sort((a, b) => b.length - a.length).slice(0, 50);
           
           // Further Optimization: Downsample coordinates for smoother animation
           // China boundary is extremely detailed. For zoom <= 6, we don't need all points.
           bounds = bounds.map(path => {
              if (path.length > 500) {
                 // Keep every 10th point to reduce vertex count
                 return path.filter((_, i) => i % 10 === 0);
              }
              return path;
           });
        }

        // 存入缓存
        boundaryCache.set(keyword, bounds)
        renderBoundaries(bounds, keyword === '中国')
      } else {
        console.error('District search failed:', result)
      }
    } else {
      console.error('District search failed:', result)
    }
  })
}

// 渲染边界
const renderBoundaries = (bounds, isNational = false) => {
  if (!mapInstance.value || !AMap.value) return
  
  const AMapModule = AMap.value
  const map = mapInstance.value
  
  const polygons = []
  
  for (let i = 0; i < bounds.length; i++) {
    // Optimization: Simplified style for National view
    if (isNational) {
        // Cyberpunk Style for National (Simplified but consistent)
        // 1. Glow Line
        const glowLine = new AMapModule.Polyline({
          path: bounds[i],
          strokeColor: '#06b6d4', // cyan-500
          strokeWeight: 4,
          strokeOpacity: 0, // Start invisible
          zIndex: 40,
          bubble: true,
          lineJoin: 'round'
        })

        // 2. Core Line (High brightness)
        const coreLine = new AMapModule.Polyline({
          path: bounds[i],
          strokeColor: '#a5f3fc', // cyan-200
          strokeWeight: 1,
          strokeOpacity: 0, // Start invisible
          zIndex: 41,
          bubble: true,
          lineJoin: 'round'
        })
        
        polygons.push(glowLine, coreLine)
        map.add([glowLine, coreLine])
        
        // Fade In
        animateOverlayOpacity(glowLine, { strokeOpacity: 0 }, { strokeOpacity: 0.4 }, 600);
        animateOverlayOpacity(coreLine, { strokeOpacity: 0 }, { strokeOpacity: 0.9 }, 600);
        continue;
    }

    // Standard Cyberpunk Style for Cities (3 layers)
    // 1. 底部宽线 (光晕效果)
    const glowLine = new AMapModule.Polyline({
      path: bounds[i],
      strokeColor: '#06b6d4', // cyan-500
      strokeWeight: 6,
      strokeOpacity: 0, // Start invisible
      zIndex: 40,
      bubble: true
    })
    
    // 2. 顶部细线 (高亮核心)
    const coreLine = new AMapModule.Polyline({
      path: bounds[i],
      strokeColor: '#a5f3fc', // cyan-200
      strokeWeight: 1,
      strokeOpacity: 0, // Start invisible
      zIndex: 41,
      bubble: true,
      strokeStyle: 'dashed',
      strokeDasharray: [10, 5]
    })
    
    // 3. 填充区域 (微弱背景)
    const polygon = new AMapModule.Polygon({
      path: bounds[i],
      strokeWeight: 0,
      fillColor: '#06b6d4',
      fillOpacity: 0, // Start invisible
      zIndex: 39,
      bubble: true
    })
    
    polygons.push(glowLine, coreLine, polygon)
    map.add([glowLine, coreLine, polygon])
    
    // Fade In Animations
    animateOverlayOpacity(glowLine, { strokeOpacity: 0 }, { strokeOpacity: 0.3 }, 600);
    animateOverlayOpacity(coreLine, { strokeOpacity: 0 }, { strokeOpacity: 1 }, 600);
    animateOverlayOpacity(polygon, { fillOpacity: 0 }, { fillOpacity: 0.05 }, 600);
  }
  
  districtPolygons.value = polygons
}

// 动画工具函数: 渐变不透明度
const animateOverlayOpacity = (overlay, startState, endState, duration = 500, onComplete) => {
  const startTime = performance.now();
  const animate = (time) => {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Cubic Ease Out
    const ease = 1 - Math.pow(1 - progress, 3);
    
    const options = {};
    if (startState.strokeOpacity !== undefined && endState.strokeOpacity !== undefined) {
      options.strokeOpacity = startState.strokeOpacity + (endState.strokeOpacity - startState.strokeOpacity) * ease;
    }
    if (startState.fillOpacity !== undefined && endState.fillOpacity !== undefined) {
      options.fillOpacity = startState.fillOpacity + (endState.fillOpacity - startState.fillOpacity) * ease;
    }
    
    overlay.setOptions(options);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      if (onComplete) onComplete();
    }
  };
  requestAnimationFrame(animate);
};

// 清除行政区边界
const clearDistrictBoundaries = () => {
  const oldPolygons = districtPolygons.value;
  if (oldPolygons.length > 0) {
    // Animate fade out then remove
    oldPolygons.forEach(overlay => {
       const opts = overlay.getOptions();
       const startState = {
         strokeOpacity: opts.strokeOpacity !== undefined ? opts.strokeOpacity : 0,
         fillOpacity: opts.fillOpacity !== undefined ? opts.fillOpacity : 0
       };
       const endState = {
         strokeOpacity: 0,
         fillOpacity: 0
       };
       
       animateOverlayOpacity(overlay, startState, endState, 400, () => {
         overlay.setMap(null); // Remove from map
       });
    });
    
    // Immediately clear reference so new boundaries can be set
    districtPolygons.value = []
  }
}

// 初始化 Three.js 图层
const initThreeLayer = (map, AMapModule) => {
  if (!AMapModule.GLCustomLayer) {
    console.warn('[AMap] GLCustomLayer not supported')
    return
  }

  const glCustomLayer = new AMapModule.GLCustomLayer({
    zIndex: 110, // Higher than buildings
    init: (gl) => {
      const width = container.value.clientWidth
      const height = container.value.clientHeight
      
      const renderer = new THREE.WebGLRenderer({
        context: gl,
        alpha: true,
        antialias: true
      })
      renderer.autoClear = false
      threeRenderer.value = renderer
      
      const scene = new THREE.Scene()
      threeScene.value = scene
      
      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      scene.add(ambientLight)
      const dirLight = new THREE.DirectionalLight(0xffffff, 1)
      dirLight.position.set(100, 100, 100)
      scene.add(dirLight)
      
      const camera = new THREE.PerspectiveCamera(60, width / height, 100, 1 << 30)
      threeCamera.value = camera
      
      // Update models initially
      updateSceneModels(map)
    },
    render: () => {
      const renderer = threeRenderer.value
      const scene = threeScene.value
      const camera = threeCamera.value
      
      if (!renderer || !scene || !camera) return
      
      // Sync Camera
      const customCoords = map.customCoords
      if (customCoords) {
         const data = customCoords.getCameraParams()
         const { near, far, fov, up, lookAt, position } = data
         
         camera.near = near
         camera.far = far
         camera.fov = fov
         camera.position.set(...position)
         camera.up.set(...up)
         camera.lookAt(...lookAt)
         camera.updateProjectionMatrix()
      }
      
      renderer.state.reset()
      renderer.render(scene, camera)
      renderer.resetState()
    }
  })
  
  map.addLayer(glCustomLayer)
  glCustomLayerRef.value = glCustomLayer
  
  // 初始化性能优化器
  frustumCuller = new FrustumCuller()
  renderController = new RenderOnDemand()
  performanceMonitor = new PerformanceMonitor()
  
  // 绑定地图事件触发渲染
  map.on('mapmove', () => renderController.requestRender())
  map.on('zoomchange', () => renderController.requestRender())
  map.on('rotatechange', () => renderController.requestRender())
  
  // Animation loop - 带性能优化
  let hasAnimation = false
  const animate = () => {
    if (threeRenderer.value && mapInstance.value) {
       hasAnimation = false
       
       // Animate Hotspot Models
       if (sceneModels.value.length > 0) {
           sceneModels.value.forEach(mesh => {
              if (mesh.userData.animate) {
                 mesh.rotation.y += 0.02 
                 mesh.position.z = 40 + Math.sin(Date.now() * 0.002) * 5
                 hasAnimation = true
              }
           })
       }
       
       // Animate Event Chain Lines (Flow Effect)
       if (eventChainLines.value.length > 0) {
           eventChainLines.value.forEach(mesh => {
               if (mesh.userData.isFlowLine && mesh.material.uniforms) {
                   const direction = mesh.userData.flowDirection || 1;
                   mesh.material.uniforms.flowOffset.value -= 0.01 * direction;
                   hasAnimation = true
               }
           })
       }

       // 视锥体剔除 - 只渲染可见模型
       if (threeCamera.value && sceneModels.value.length > 0) {
           frustumCuller.update(threeCamera.value)
           sceneModels.value.forEach(model => {
               if (mapStore.layers.models) {
                   model.visible = frustumCuller.isVisible(model)
               }
           })
       }

       // 按需渲染：有动画时强制渲染，否则检查是否需要渲染
       if (hasAnimation) {
           renderController.forceRender()
       }
       
       if (renderController.shouldRender() || hasAnimation) {
           mapInstance.value.render()
           performanceMonitor.update(threeRenderer.value)
       }
    }
    requestAnimationFrame(animate)
  }
  animate()
}

// 将模型添加到场景的辅助函数
const addModelToScene = (model, position, spotId, holoMaterial, wireframeMaterial) => {
  // Scale and Orientation
  model.scale.set(5, 5, 5)
  model.rotation.x = Math.PI / 2
  model.rotation.y = Math.PI * 1.2
  
  // Apply materials
  model.traverse((child) => {
    if (child.isMesh) {
      child.material = holoMaterial
      // 检查是否已有 wireframe，避免重复添加
      const hasWireframe = child.children.some(c => c.type === 'LineSegments')
      if (!hasWireframe) {
        const wireframe = new THREE.LineSegments(
          new THREE.WireframeGeometry(child.geometry),
          wireframeMaterial
        )
        child.add(wireframe)
      }
    }
  })
  
  // Container for positioning
  const container = new THREE.Group()
  container.position.set(position[0], position[1], 0)
  model.position.set(0, 0, 0)
  
  // Ground alignment
  const box = new THREE.Box3().setFromObject(model)
  model.position.z = -box.min.z
  
  container.add(model)
  container.userData = { animate: false, spotId }
  
  threeScene.value.add(container)
  sceneModels.value.push(container)
  container.visible = mapStore.layers.models
}

// 更新 3D 模型 (Holographic Effect) - 带缓存优化
const updateSceneModels = (map) => {
  if (!threeScene.value || !map.customCoords) return
  
  // 正确释放旧模型资源，防止内存泄漏（但保留缓存）
  sceneModels.value.forEach(model => {
    // 只从场景移除，不 dispose 缓存的原始模型
    threeScene.value.remove(model)
  })
  sceneModels.value = []
  
  const hotspots = currentHotspots.value.filter(h => filterLevels.value.includes(h.level))
  
  // 使用单例 loader
  const loader = getGLTFLoader()
  
  // 共享的全息材质 - 避免每个模型都创建新材质
  const sharedHoloMaterial = new THREE.MeshPhongMaterial({
    color: 0x06b6d4,
    emissive: 0x06b6d4,
    emissiveIntensity: 1.2,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
    flatShading: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  
  const sharedWireframeMaterial = new THREE.LineBasicMaterial({ 
    color: 0xffffff, 
    transparent: true, 
    opacity: 0.25 
  })
  
  hotspots.forEach(spot => {
    const center = spot.position
    const position = map.customCoords.lngLatToCoord(center)
    
    // Check if custom GLB model exists
    if (spot.modelUrl) {
       // 检查缓存
       const cached = modelCache.get(spot.modelUrl)
       if (cached) {
         // 使用缓存的模型克隆
         addModelToScene(cached.clone(), position, spot.id, sharedHoloMaterial, sharedWireframeMaterial)
       } else {
         // 首次加载，存入缓存
         loader.load(spot.modelUrl, (gltf) => {
           const originalModel = gltf.scene
           // 存入缓存
           modelCache.set(spot.modelUrl, originalModel)
           // 使用克隆添加到场景
           addModelToScene(originalModel.clone(), position, spot.id, sharedHoloMaterial, sharedWireframeMaterial)
         }, undefined, (error) => {
           console.error('Error loading model:', error)
         })
       }
    } else {
        // Default Cone
        const geometry = new THREE.ConeGeometry(20, 60, 4) 
        const color = spot.level === 'high' ? 0xef4444 : (spot.level === 'medium' ? 0xf97316 : 0x22c55e)
        
        const material = new THREE.MeshPhongMaterial({
           color: color,
           transparent: true,
           opacity: 0.6,
           side: THREE.DoubleSide,
           emissive: color,
           emissiveIntensity: 0.5,
           flatShading: true
        })
        
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(position[0], position[1], 40)
        mesh.rotation.x = Math.PI / 2
        mesh.userData = { animate: true }
        
        const wireframeGeom = new THREE.WireframeGeometry(geometry)
        const wireframeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
        const wireframe = new THREE.LineSegments(wireframeGeom, wireframeMat)
        mesh.add(wireframe)
        
        // Apply visibility state
        mesh.visible = mapStore.layers.models
        
        threeScene.value.add(mesh)
        sceneModels.value.push(mesh)
    }
  })
  
  // 更新事件链连接线
  updateEventChainLines(map)
}

// 更新事件链连接线
const updateEventChainLines = (map) => {
  if (!threeScene.value || !map.customCoords) return
  
  // Clear old lines
  eventChainLines.value.forEach(line => {
      if (line.geometry) line.geometry.dispose();
      if (line.material) {
          if (line.material.map) line.material.map.dispose();
          line.material.dispose();
      }
      threeScene.value.remove(line)
  })
  eventChainLines.value = []
  
  const hotspots = currentHotspots.value.filter(h => filterLevels.value.includes(h.level))
  const hotspotMap = new Map(hotspots.map(h => [h.id, h]))
  
  // 用于去重：确保每对事件之间只有一条单向线
  const createdLinks = new Set()
  
  // Create gradient texture for flow effect
  const flowTexture = createFlowTexture();
  const zoom = map.getZoom();
  
  hotspots.forEach(spot => {
    if (spot.relatedIds && spot.relatedIds.length) {
      spot.relatedIds.forEach(targetId => {
        const targetSpot = hotspotMap.get(targetId)
        if (targetSpot) {
          // 生成唯一的连接标识（小ID在前，确保双向引用只创建一条线）
          const linkKey = [spot.id, targetId].sort((a, b) => a - b).join('-')
          if (createdLinks.has(linkKey)) return // 已存在，跳过
          createdLinks.add(linkKey)
          
          // 根据时间先后决定流向：从先发生的事件流向后发生的事件
          const spotTime = spot.time || 0
          const targetTime = targetSpot.time || 0
          // flowDirection: 1 = 从 spot 流向 target (spot 先发生)
          //               -1 = 从 target 流向 spot (target 先发生)
          const flowDirection = spotTime <= targetTime ? 1 : -1
          
          // Calculate positions
          const startPos = map.customCoords.lngLatToCoord(spot.position)
          const endPos = map.customCoords.lngLatToCoord(targetSpot.position)
          
          // Bezier Curve
          const midX = (startPos[0] + endPos[0]) / 2
          const midY = (startPos[1] + endPos[1]) / 2
          const distance = Math.sqrt(Math.pow(endPos[0] - startPos[0], 2) + Math.pow(endPos[1] - startPos[1], 2))
          
          // 平滑插值函数
          const smoothstep = (min, max, value) => {
             const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
             return x * x * (3 - 2 * x);
          };
          
          const startZoom = 4;
          const endZoom = 18;
          
          // 进度 0..1
          const t = smoothstep(startZoom, endZoom, zoom);
          
          // 1. 高度插值：
          // Zoom 4 (Country): Height ~ distance * 0.5
          // Zoom 18 (Street): Height ~ distance * 0.2
          const hStart = distance * 0.5 + 50000; 
          const hEnd = distance * 0.2 + 50;
          const midZ = hStart * (1 - t) + hEnd * t;

          // 2. 半径插值：
          // Zoom 4: Radius 15000 (Very thick for visibility)
          // Zoom 18: Radius 5
          // 使用指数插值，因为视觉尺度变化是指数级的
          const rStart = 15000;
          const rEnd = 5;
          const radius = rStart * Math.pow(rEnd / rStart, t);
          
          const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(startPos[0], startPos[1], 20),
            new THREE.Vector3(midX, midY, midZ),
            new THREE.Vector3(endPos[0], endPos[1], 20)
          )
          
          // Tube Geometry - 固定分段数以保证无缝变换
          const tubularSegments = 64; 
          const radialSegments = 8;
          const tubeGeometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
          
          // Flow Material - 使用 ShaderMaterial 支持进度动画和流动效果
          const material = new THREE.ShaderMaterial({
            uniforms: {
              flowMap: { value: flowTexture },
              color: { value: new THREE.Color(0x06b6d4) },
              emissiveIntensity: { value: 3.0 },
              progress: { value: 1.0 }, // 0-1 控制显示进度
              flowOffset: { value: 0.0 }, // 流动动画偏移
              opacity: { value: 1.0 }
            },
            vertexShader: `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform sampler2D flowMap;
              uniform vec3 color;
              uniform float emissiveIntensity;
              uniform float progress;
              uniform float flowOffset;
              uniform float opacity;
              varying vec2 vUv;
              
              void main() {
                // 进度裁剪：uv.x > progress 的部分完全透明
                if (vUv.x > progress) discard;
                
                // 应用流动偏移和纹理重复
                vec2 flowUv = vec2(vUv.x * 2.0 + flowOffset, vUv.y);
                vec4 texColor = texture2D(flowMap, flowUv);
                vec3 finalColor = color * (1.0 + emissiveIntensity) * texColor.rgb;
                gl_FragColor = vec4(finalColor, texColor.a * opacity);
              }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
          })
          
          const mesh = new THREE.Mesh(tubeGeometry, material)
          mesh.userData = { isFlowLine: true, flowDirection: flowDirection }
          
          // Apply visibility state
          mesh.visible = mapStore.layers.lines
          
          threeScene.value.add(mesh)
          eventChainLines.value.push(mesh)
        }
      })
    }
  })
}

// Helper for flow texture (Gradient with alpha)
const createFlowTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128; // Longer for flow
    canvas.height = 32;
    const context = canvas.getContext('2d');
    
    // Gradient: Transparent -> Opaque (Bright) -> Transparent
    // Represents a pulse of energy moving through the tube
    const gradient = context.createLinearGradient(0, 0, 128, 0);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0)');
    gradient.addColorStop(0.3, 'rgba(6, 182, 212, 0.1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)'); // Core Brightness
    gradient.addColorStop(0.7, 'rgba(6, 182, 212, 0.1)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 32);
    
    const texture = new THREE.Texture(canvas);
    texture.wrapS = THREE.RepeatWrapping; // Allow looping
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(2, 1); // Repeat twice along length
    texture.needsUpdate = true;
    return texture;
}

// 初始化地图
const initMap = async () => {
  try {
    // 设置安全密钥 (如果使用)
    if (AMAP_SECRET) {
      window._AMapSecurityConfig = {
        securityJsCode: AMAP_SECRET
      }
    }

    // 加载高德地图
    const AMapModule = await AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: [
        'AMap.Scale',
        'AMap.ToolBar',
        'AMap.ControlBar',  // 3D 控制
        'AMap.HawkEye',     // 鹰眼
        'AMap.Buildings',   // 3D 建筑图层
        'AMap.PlaceSearch', // POI 搜索，用于获取实际建筑类型位置
        'AMap.HeatMap',     // 热力图插件
        'AMap.DistrictSearch', // 行政区查询插件
        'AMap.Geocoder',       // 地理编码插件
        'AMap.GltfLoader',     // 高德官方 GLTF 加载器（性能优化）
        'AMap.Object3DLayer',  // 3D 对象图层
      ]
    })

    AMap.value = AMapModule

    // 创建 3D 地图 - 优化渲染距离配置
    const map = new AMapModule.Map(container.value, {
      viewMode: '3D',
      pitch: 75,           // 增加俯仰角 (0-83度)，更高角度可以看到更远建筑
      rotation: -15,       // 旋转角度
      zoom: currentCity.value.zoom,
      center: currentCity.value.center,
      zooms: [3, 20],      // 扩展缩放范围，允许更远视距
      
      // 显示图层 - 不包含 building，后面用自定义 Buildings 图层
      features: ['bg', 'road', 'point'],
      
      // 地图样式 - 使用深色主题
      mapStyle: 'amap://styles/blue',  // 蓝色夜景风格
      
      // 关闭默认建筑，使用自定义 Buildings 图层
      showBuildingBlock: false,
      buildingAnimation: false,
      
      // 天空颜色
      skyColor: '#0a0f1a',
      
      // 其他配置
      jogEnable: true,
      animateEnable: true,
      resizeEnable: true,
      
      // WebGL 渲染优化
      WebGLParams: {
        preserveDrawingBuffer: true
      }
    })

    mapInstance.value = map

    // 初始化热力图
    const heatmap = new AMapModule.HeatMap(map, {
      radius: 25, // 给定半径
      opacity: [0, 0.8],
      gradient: {
        0.5: 'blue',
        0.65: 'rgb(117,211,248)',
        0.7: 'rgb(0, 255, 0)',
        0.9: '#ffea00',
        1.0: 'red'
      },
      zIndex: 5 // 确保在建筑下方 (buildings zIndex is 10)
    })
    heatmapInstance.value = heatmap
    // 初始状态
    if (mapStore.layers.heatmap) {
      heatmap.show()
      updateHeatmapData()
    } else {
      heatmap.hide()
    }

    // 初始化高德官方 GltfLoader（可选，用于简单模型加载）
    if (MODEL_LOADER_TYPE === 'amap') {
      try {
        amapGltfLoader = await createAMapGltfLoader(AMapModule, map)
        console.log('[AMap] 官方 GltfLoader 初始化成功')
      } catch (err) {
        console.warn('[AMap] GltfLoader 初始化失败，回退到 Three.js:', err)
      }
    }

    // 初始化行政区查询
    const districtSearch = new AMapModule.DistrictSearch({
      subdistrict: 0, // 不返回下级行政区
      extensions: 'all', // 返回行政区边界坐标组等具体信息
      // level: 'city' // Remove strict level to allow province/district search
    })
    districtSearchInstance.value = districtSearch
    
    // 初始绘制边界
    if (mapStore.layers.boundary) {
      drawDistrictBoundaries(currentCity.value.name)
    }

    // 初始化地理编码服务 (用于自动检测城市)
    const geocoder = new AMapModule.Geocoder({
      city: "全国",
    });

    // 自动检测城市/层级
    let detectionTimer = null;
    const handleMapUpdate = () => {
      // 如果正在进行导航跳转动画，暂停自动检测
      if (isNavigating.value) return;

      if (detectionTimer) clearTimeout(detectionTimer);
      detectionTimer = setTimeout(() => {
        const zoom = map.getZoom();
        const center = map.getCenter();
        console.log('Map Update:', zoom, center);
        
        // 层级检测
        if (zoom <= 6) {
           const nationalName = '中国';
           if (mapStore.currentCity !== nationalName) {
             console.log('Switching to National View');
             mapStore.setCity(nationalName);
             // Draw national boundary if enabled
             if (mapStore.layers.boundary) {
               drawDistrictBoundaries(nationalName);
             } else {
               clearDistrictBoundaries();
             }
           }
           return;
        }
        
        // 逆地理编码检测城市
        geocoder.getAddress(center, (status, result) => {
          if (status === 'complete' && result.regeocode) {
            const comp = result.regeocode.addressComponent;
            let regionName = '';
            
            if (zoom <= 9) {
               // 省级
               regionName = comp.province || '未知省份';
            } else {
               // 市级
               regionName = comp.city || comp.province; 
            }
            
            // 更新 Store (仅当变化时)
            if (regionName && mapStore.currentCity !== regionName) {
               console.log('Detected Region Change:', regionName);
               mapStore.setCity(regionName);
               // 如果是市级/省级且开启了边界，更新边界
               if (mapStore.layers.boundary) {
                 drawDistrictBoundaries(regionName);
               }
            }
          } else {
            console.warn('Geocoder failed:', status, result);
          }
        });
      }, 800);
    };

    map.on('moveend', handleMapUpdate);
    map.on('zoomend', handleMapUpdate);

    // 添加 3D 控制条
    map.addControl(new AMapModule.ControlBar({
      position: { right: '20px', top: '20px' },
      showZoomBar: true,
      showPitchBar: true,
      showRotateBar: true,
    }))

    // 添加比例尺
    map.addControl(new AMapModule.Scale({
      position: 'LB'
    }))

    // 自定义建筑样式 (赛博朋克风格)
    customizeBuildingStyle(map, AMapModule)

    // 添加舆情热点标记
    addHotspotBuildingEffects(map, AMapModule)

    // 初始化 Three.js 3D 图层
    initThreeLayer(map, AMapModule)

    console.log('[AMap] 高德 3D 地图初始化成功')
    
    // Fetch initial data
    await sentimentStore.fetchHotspots()

  } catch (error) {
    console.error('[AMap] 地图加载失败:', error)
    console.error('[AMap] 错误详情:', {
      message: error?.message || '无消息',
      name: error?.name || '无名称',
      stack: error?.stack || '无堆栈',
      stringified: JSON.stringify(error, Object.getOwnPropertyNames(error || {}))
    })
    console.error('[AMap] 请检查: 1) API Key 是否有效 2) 域名是否已在高德控制台白名单 3) 网络是否正常')
  }
};

// 赛博朋克主题配色
const CYBER_THEME = {
  // 主色调 - 霓虹青色系
  neonCyan: "#06b6d4",
  neonPink: "#ec4899",
  neonPurple: "#a855f7",
  neonYellow: "#facc15",

  // 建筑颜色 - 使用 rgba 字符串格式以确保兼容性
  building: {
    // 基础建筑
    base: {
      wall: "rgba(13, 20, 30, 0.4)", // 增加透明度 (0.8 -> 0.6)
      roof: "rgba(6, 182, 212, 0.8)", // 青色屋顶
    },
    // 商业区 (高亮)
    commercial: {
      wall: "rgba(20, 10, 30, 0.7)",
      roof: "rgba(236, 72, 153, 0.9)", // 粉色屋顶 (商场)
    },
    // 科技/办公区
    tech: {
      wall: "rgba(10, 20, 30, 0.7)",
      roof: "rgba(168, 85, 247, 0.9)", // 紫色屋顶 (写字楼)
    },
    // 教育/学校
    education: {
      wall: "rgba(10, 30, 20, 0.7)",
      roof: "rgba(34, 197, 94, 0.9)", // 绿色屋顶 (学校)
    },
    // 医疗/医院
    medical: {
      wall: "rgba(30, 10, 10, 0.7)",
      roof: "rgba(239, 68, 68, 0.9)", // 红色屋顶 (医院)
    },
    // 政府机构
    government: {
      wall: "rgba(30, 25, 10, 0.7)",
      roof: "rgba(234, 179, 8, 0.9)", // 黄色屋顶 (政府)
    },
  },
};

// 舆情建筑可视化系统 - 不再基于POI类型染色建筑

// 监听 Focus Mode 变化
watch(isFocusMode, (val) => {
  // 只更新 markers，不修改建筑颜色（避免闪烁）
  if (mapInstance.value && AMap.value) {
    addHotspotBuildingEffects(mapInstance.value, AMap.value)
  }
})

// 根据舆情热点动态更新建筑样式
const updateBuildingStylesByPOI = () => {
  if (!mapInstance.value || !AMap.value || !buildingsLayerRef.value) {
    return;
  }

  const AMapModule = AMap.value;
  const buildingsLayer = buildingsLayerRef.value;

  // 只处理舆情建筑样式
  const hotspotAreas = createHotspotBuildingAreas();

  // 注意：不再在聚焦模式下修改 wallColor/roofColor
  // 因为这会导致建筑图层重新渲染并闪烁
  // 聚焦效果通过 CSS 覆盖层实现

  buildingsLayer.setStyle({
    hideWithoutStyle: false,
    wallColor: CYBER_THEME.building.base.wall,
    roofColor: CYBER_THEME.building.base.roof,
    areas: hotspotAreas,
  });

  // 添加舆情建筑的发光效果和气球标签
  addHotspotBuildingEffects(mapInstance.value, AMapModule);
};

// 创建舆情建筑区域样式
const createHotspotBuildingAreas = () => {
  const hotspotAreas = [];
  const targetId = sentimentStore.selectedHotspot?.id;

  currentHotspots.value.forEach((spot) => {
    // Focus Mode: Only render selected hotspot
    if (isFocusMode.value && spot.id !== targetId) return;
    
    if (!filterLevels.value.includes(spot.level)) return;

    const lng = spot.position[0];
    const lat = spot.position[1];
    const r = 0.001; // 建筑物范围

    // 根据等级确定颜色和发光强度
    // REQ-1: high=red, medium=orange, low=green
    const levelConfig = {
      high: {
        wall: "rgba(239, 68, 68, 0.8)", // Red
        roof: "rgba(239, 68, 68, 1)",
        glow: "rgba(239, 68, 68, 0.6)",
        heightFactor: 5,
      },
      medium: {
        wall: "rgba(249, 115, 22, 0.7)", // Orange
        roof: "rgba(249, 115, 22, 1)",
        glow: "rgba(249, 115, 22, 0.5)",
        heightFactor: 3.5,
      },
      low: {
        wall: "rgba(34, 197, 94, 0.6)", // Green
        roof: "rgba(34, 197, 94, 1)",
        glow: "rgba(34, 197, 94, 0.4)",
        heightFactor: 2.5,
      },
    };

    const config = levelConfig[spot.level] || levelConfig.low;

    // Focus Mode: Enhance the selected building
    if (isFocusMode.value && spot.id === targetId) {
        config.wall = config.wall.replace(/[\d.]+\)$/, '1)') // Full opacity
        config.roof = config.roof.replace(/[\d.]+\)$/, '1)')
        config.heightFactor *= 1.2 // Taller
    }

    // 生成建筑物区域
    const path = [
      [lng - r, lat - r],
      [lng + r, lat - r],
      [lng + r, lat + r],
      [lng - r, lat + r],
    ];

    hotspotAreas.push({
      color1: config.roof,
      color2: config.wall,
      path: path,
      rejectTexture: true,
      // 存储热点信息用于后续处理
      _hotspotData: spot,
      _heightFactor: config.heightFactor,
    });
  });

  return hotspotAreas;
};

// 添加舆情建筑的发光效果和倒水滴标签
const addHotspotBuildingEffects = (map, AMapModule) => {
  // 清除旧的标签
  if (window.hotspotBalloons) {
    window.hotspotBalloons.forEach((balloon) => map.remove(balloon));
  }
  window.hotspotBalloons = [];

  // 根据等级设置高度和颜色
  const zoom = map.getZoom();
  const isNationalView = zoom <= 6;
  
  // 全国视图下增加基础高度，使其更壮观
  const baseHeight = isNationalView ? 150000 : 0; // 这里的单位取决于 CSS/地图投影，但在像素计算中通常不起作用，因为 Marker 是基于像素的。
  // 实际上 AMap.Marker 的 content 是 DOM 元素，不受地图单位影响。
  // 但是我们在 connect-line 的 height 中使用了这个值。
  // 在全国视图下，我们需要显著增加 Connector Line 的长度，让气球飘得更高。
  
  const levelConfig = {
    high: {
      height: isNationalView ? 300 : 200, // 增加像素高度
      color: "#ef4444",
      glowColor: "rgba(239, 68, 68, 0.8)",
      priority: 3,
    }, // Red
    medium: {
      height: isNationalView ? 250 : 150,
      color: "#f97316",
      glowColor: "rgba(249, 115, 22, 0.7)",
      priority: 2,
    }, // Orange
    low: {
      height: isNationalView ? 200 : 100,
      color: "#22c55e",
      glowColor: "rgba(34, 197, 94, 0.6)",
      priority: 1,
    }, // Green
  };

  // 获取当前需要显示的热点
  const visibleSpots = currentHotspots.value.filter((spot) => {
    if (isFocusMode.value && spot.id !== sentimentStore.selectedHotspot?.id) return false;
    return filterLevels.value.includes(spot.level);
  });

  // 检测重叠并合并 (基于像素距离)
  const mergeDistance = 80; // 像素距离阈值
  const clusters = clusterHotspots(
    visibleSpots,
    map,
    AMapModule,
    mergeDistance
  );

  // 为每个簇创建标签
  clusters.forEach((cluster) => {
    if (cluster.spots.length === 1) {
      // 单个热点：显示倒水滴标签
      createTeardropMarker(map, AMapModule, cluster.spots[0], levelConfig);
    } else {
      // 多个热点合并：显示聚合标签
      createClusterMarker(map, AMapModule, cluster, levelConfig);
    }
  });

  // 展开状态现在在 createTeardropMarker 中直接处理，无需额外恢复

  // 应用当前显示状态
  if (window.hotspotBalloons) {
    window.hotspotBalloons.forEach(marker => {
        if (mapStore.layers.markers) {
            marker.show();
        } else {
            marker.hide();
        }
    })
  }

  // 监听缩放变化，重新计算聚合
  if (!window.zoomChangeHandler) {
    // 缩放结束：更新聚合状态（较重）
    window.zoomChangeHandler = () => {
      addHotspotBuildingEffects(map, AMapModule);
      updateEventChainLines(map); 
    };
    
    // 缩放过程中：使用节流优化，避免频繁重计算导致卡顿
    let zoomThrottleTimer = null;
    window.zoomLiveHandler = () => {
       if (zoomThrottleTimer) return; // 节流中
       zoomThrottleTimer = setTimeout(() => {
         zoomThrottleTimer = null;
         updateEventChainLines(map);
       }, 100); // 100ms 节流
    };
    
    map.on("zoomend", window.zoomChangeHandler);
    map.on("zoomchange", window.zoomLiveHandler);
  }
};

// 验证坐标是否有效
const isValidCoordinate = (position) => {
  if (!position || !Array.isArray(position) || position.length < 2) return false;
  const [lng, lat] = position;
  return typeof lng === 'number' && typeof lat === 'number' &&
         !isNaN(lng) && !isNaN(lat) &&
         lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
};

// 聚合热点算法
const clusterHotspots = (spots, map, AMapModule, threshold) => {
  // 过滤无效坐标的热点
  const validSpots = spots.filter(spot => {
    if (!isValidCoordinate(spot.position)) {
      console.warn('[AMap] 跳过无效坐标热点:', spot.id, spot.position);
      return false;
    }
    return true;
  });

  if (validSpots.length === 0) {
    console.warn('[AMap] 无有效热点数据');
    return [];
  }

  const clusters = [];
  const used = new Set();
  const zoom = map.getZoom();
  const isNationalView = zoom <= 6;

  // 省级聚合模式 (全国视角)
  if (isNationalView) {
      // 按省份分组
      const provinceGroups = {};
      validSpots.forEach((spot, i) => {
          const province = spot.province || '其他';
          // 如果没有省份信息（如 city 级别数据），尝试从 city 或其他信息推断，或者单独成组
          // 这里假设所有数据都有 province 字段，如果没有则归为 "其他"
          if (!provinceGroups[province]) {
              provinceGroups[province] = [];
          }
          provinceGroups[province].push(spot);
      });

      // 每个省生成一个簇
      Object.keys(provinceGroups).forEach(prov => {
          const groupSpots = provinceGroups[prov];
          if (groupSpots.length > 0) {
              // 计算中心点
              const avgLng = groupSpots.reduce((sum, s) => sum + s.position[0], 0) / groupSpots.length;
              const avgLat = groupSpots.reduce((sum, s) => sum + s.position[1], 0) / groupSpots.length;
              
              clusters.push({
                  spots: groupSpots,
                  center: [avgLng, avgLat],
                  isProvinceCluster: true // 标记为省级聚合
              });
          }
      });
      return clusters;
  }

  // 默认距离聚合模式 (城市/区县级)
  validSpots.forEach((spot, i) => {
    if (used.has(i)) return;

    const cluster = { spots: [spot], center: spot.position };
    used.add(i);

    // 获取当前热点的像素位置
    const pixel1 = map.lngLatToContainer(spot.position);
    if (!pixel1 || isNaN(pixel1.x) || isNaN(pixel1.y)) return; // 额外保护

    // 查找附近的热点
    validSpots.forEach((otherSpot, j) => {
      if (i === j || used.has(j)) return;

      const pixel2 = map.lngLatToContainer(otherSpot.position);
      if (!pixel2 || isNaN(pixel2.x) || isNaN(pixel2.y)) return; // 额外保护
      const distance = Math.sqrt(
        Math.pow(pixel1.x - pixel2.x, 2) + Math.pow(pixel1.y - pixel2.y, 2)
      );

      if (distance < threshold) {
        cluster.spots.push(otherSpot);
        used.add(j);
      }
    });

    // 计算簇中心
    if (cluster.spots.length > 1) {
      const avgLng =
        cluster.spots.reduce((sum, s) => sum + s.position[0], 0) /
        cluster.spots.length;
      const avgLat =
        cluster.spots.reduce((sum, s) => sum + s.position[1], 0) /
        cluster.spots.length;
      cluster.center = [avgLng, avgLat];
    }

    clusters.push(cluster);
  });

  return clusters;
};

// 计算标记展开方向
const calculateExpandDirection = (markerEl) => {
  if (!markerEl || !container.value) return 'right';
  
  const rect = markerEl.getBoundingClientRect();
  const containerRect = container.value.getBoundingClientRect();
  
  const panelWidth = 280;  // 展开面板宽度
  const panelHeight = 320; // 展开面板高度
  const margin = 20;       // 边距
  
  // 计算各方向可用空间
  const spaceRight = containerRect.right - rect.left - margin;
  const spaceLeft = rect.left - containerRect.left - margin;
  const spaceBottom = containerRect.bottom - rect.bottom - margin;
  
  // 优先右侧
  if (spaceRight >= panelWidth) return 'right';
  // 其次左侧
  if (spaceLeft >= panelWidth) return 'left';
  // 最后底部
  if (spaceBottom >= panelHeight) return 'bottom';
  // 默认右侧（空间都不够时）
  return 'right';
};

// 更新标记展开方向类
const updateMarkerExpandDirection = (spotId) => {
  const markerEl = document.querySelector(`.teardrop-marker[data-spot-id="${spotId}"]`);
  if (!markerEl) return;
  
  // 移除旧的方向类
  markerEl.classList.remove('expand-left', 'expand-right', 'expand-bottom');
  
  // 计算并添加新方向
  const direction = calculateExpandDirection(markerEl);
  markerEl.classList.add(`expand-${direction}`);
  
  // 存储当前方向，用于缩放时保持一致
  currentExpandDirection.value = direction;
};

// 全局热点点击处理器 - 供 HTML onclick 调用
window.__hotspotClickHandler = (spotId, event) => {
  event.stopPropagation();
  const spot = currentHotspots.value.find(h => h.id === spotId);
  if (spot) {
    // 先计算展开方向
    updateMarkerExpandDirection(spotId);
    selectHotspot(spot);
  }
};

// 全局关闭处理器
window.__hotspotCloseHandler = (event) => {
  event.stopPropagation();
  closeDetailPanel();
};

// 创建单个倒水滴标签 - 支持直接扩展为详情面板
const createTeardropMarker = (map, AMapModule, spot, levelConfig) => {
  const config = levelConfig[spot.level];
  
  // 检查是否是当前选中的热点（用于缩放时保持展开状态）
  const isSelected = sentimentStore.selectedHotspot?.id === spot.id && !isNavigating.value;
  // 使用存储的展开方向（保持缩放前后一致），添加 no-animate 类禁用过渡动画
  const expandDirection = isSelected ? `expand-${currentExpandDirection.value}` : '';
  const expandedClass = isSelected ? `expanded ${expandDirection} no-animate` : '';
  
  // 格式化数字显示
  const formatCount = (count) => count > 1000 ? (count / 1000).toFixed(1) + "k" : count;
  
  // 趋势显示
  const trendIcon = spot.trend === 'up' ? '&#9650;' : spot.trend === 'down' ? '&#9660;' : '&#9644;';
  const trendColor = spot.trend === 'up' ? '#ef4444' : spot.trend === 'down' ? '#22c55e' : '#94a3b8';
  
  // 脉冲动画配置
  let pulseDuration = '3s';
  let pulseScale = '1.5';
  let pulseOpacity = '0.6';
  
  if (spot.level === 'high') {
    pulseDuration = '1.5s'; // 高级别更快更强
    pulseScale = '2.5';
    pulseOpacity = '0.8';
  } else if (spot.level === 'medium') {
    pulseDuration = '2.5s';
    pulseScale = '1.8';
    pulseOpacity = '0.6';
  }
  
  // 生成模拟内容
  const mockContent = `据监测，${spot.title}引发了广泛关注。当前讨论热度为${spot.count}，趋势显示为${spot.trend === 'up' ? '上升' : '平稳'}。主要涉及${spot.category}领域，建议相关部门持续关注。`;

  const marker = new AMapModule.Marker({
    position: spot.position,
    anchor: "bottom-center",
    offset: new AMapModule.Pixel(0, 0), // 设为 0，让 CSS scale 能够正确缩放整个结构（从底部开始）
    content: `
      <div class="teardrop-marker ${expandedClass}" data-spot-id="${spot.id}" onclick="window.__hotspotClickHandler('${spot.id}', event)" style="
        --marker-color: ${config.color};
        --marker-glow: ${config.glowColor};
        position: relative;
        cursor: pointer;
        filter: drop-shadow(0 4px 12px ${config.glowColor});
        /* 透视变换：随地图缩放而缩放，随地图倾斜而微调角度增强立体感 */
        transform: scale(var(--map-zoom-scale, 1)) rotateX(calc(var(--map-pitch, 0deg) * 0.3));
        transform-origin: bottom center;
        /* 3D 容器 */
        transform-style: preserve-3d;
        perspective: 1000px;
        /* 容器大小设为 0，因为是通过 absolute 定位向上延伸的 */
        width: 0;
        height: 0;
        overflow: visible;
      ">
        <!-- 连接线 (向上延伸) -->
        <div class="connector-line" style="
          position: absolute;
          bottom: 0; /* 底部对齐地图点 */
          left: 50%;
          width: 3px;
          height: ${config.height}px;
          background: linear-gradient(to bottom, ${config.color}, ${config.color}80, transparent);
          transform: translateX(-50%);
          transform-origin: bottom center;
          animation: lineGlow 2s ease-in-out infinite;
          transition: height 0.4s ease, opacity 0.3s ease;
          pointer-events: none; /* 避免遮挡点击 */
        "></div>
        
        <!-- 主体容器 - 位于连接线顶部 -->
        <div class="marker-body" style="
          position: absolute;
          bottom: ${config.height}px; /* 位于连接线顶部 */
          left: 50%;
          width: 50px;
          height: 70px;
          transform: translateX(-50%); /* 居中 */
          transform-origin: bottom center;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        ">
          <!-- 脉冲光环 (新增) -->
          <div class="marker-pulse-ring" style="
            position: absolute;
            top: 25px;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: ${config.color};
            z-index: -1;
            animation: pulse-ring ${pulseDuration} cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
            --pulse-scale: ${pulseScale};
            --pulse-opacity: ${pulseOpacity};
            pointer-events: none;
          "></div>

          <!-- 背景容器 - 从圆形变为矩形 -->
          <div class="marker-bg" style="
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 50px;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95));
            border: 2px solid ${config.color};
            border-radius: 50%;
            box-shadow: 0 0 25px ${config.glowColor}, inset 0 0 15px ${config.glowColor}30;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            overflow: hidden;
          "></div>
          
          <!-- 收起状态内容 -->
          <div class="collapsed-content" style="
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 2;
            transition: opacity 0.2s ease;
          ">
            <div style="
              color: ${config.color};
              font-size: 11px;
              font-weight: bold;
              text-align: center;
              line-height: 1.1;
              text-shadow: 0 0 10px ${config.glowColor};
            ">${formatCount(spot.count)}</div>
            <div style="
              color: #94a3b8;
              font-size: 8px;
            ">${spot.category}</div>
          </div>
          
          <!-- 展开状态内容 -->
          <div class="expanded-content" style="
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 280px;
            opacity: 0;
            pointer-events: none;
            z-index: 3;
            transition: opacity 0.3s ease 0.15s;
          ">
            <!-- 头部 -->
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding: 12px 12px 10px;
              border-bottom: 1px solid rgba(255,255,255,0.1);
            ">
              <div>
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                  <span style="
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 9px;
                    font-weight: 600;
                    text-transform: uppercase;
                    background: ${config.color}30;
                    color: ${config.color};
                    border: 1px solid ${config.color}50;
                  ">${spot.level}</span>
                  <span style="color: #94a3b8; font-size: 10px; font-family: monospace;">${spot.category}</span>
                </div>
                <div style="color: white; font-size: 13px; font-weight: 600; line-height: 1.3;">${spot.title}</div>
              </div>
              <button class="close-btn" onclick="window.__hotspotCloseHandler(event)" style="
                color: #64748b;
                background: transparent;
                border: none;
                padding: 4px;
                cursor: pointer;
                font-size: 16px;
                line-height: 1;
                border-radius: 4px;
                transition: all 0.2s;
              " onmouseover="this.style.background='rgba(255,255,255,0.1)';this.style.color='white'" onmouseout="this.style.background='transparent';this.style.color='#64748b'">&times;</button>
            </div>
            
            <!-- 统计数据 -->
            <div style="
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 8px;
              padding: 10px 12px;
            ">
              <div style="background: rgba(30,41,59,0.5); border-radius: 6px; padding: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                <div style="color: ${config.color}; font-size: 14px; font-weight: bold; font-family: monospace;">${formatCount(spot.count)}</div>
                <div style="color: #64748b; font-size: 9px;">讨论量</div>
              </div>
              <div style="background: rgba(30,41,59,0.5); border-radius: 6px; padding: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                <div style="color: ${trendColor}; font-size: 14px; font-weight: bold;">${trendIcon}</div>
                <div style="color: #64748b; font-size: 9px;">趋势</div>
              </div>
              <div style="background: rgba(30,41,59,0.5); border-radius: 6px; padding: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                <div style="color: #f87171; font-size: 14px; font-weight: bold;">68%</div>
                <div style="color: #64748b; font-size: 9px;">负面</div>
              </div>
            </div>
            
            <!-- 内容摘要 -->
            <div style="padding: 0 12px 10px;">
              <div style="
                color: #06b6d4;
                font-size: 10px;
                font-weight: 600;
                margin-bottom: 6px;
                display: flex;
                align-items: center;
                gap: 6px;
              ">
                <div style="width: 2px; height: 10px; background: #06b6d4; border-radius: 1px;"></div>
                事件概述
              </div>
              <div style="
                color: #cbd5e1;
                font-size: 11px;
                line-height: 1.5;
                background: rgba(30,41,59,0.3);
                padding: 8px;
                border-radius: 6px;
                border: 1px solid rgba(255,255,255,0.05);
                max-height: 60px;
                overflow: hidden;
              ">${mockContent}</div>
            </div>
            
            <!-- 操作按钮 -->
            <div style="
              display: flex;
              gap: 8px;
              padding: 10px 12px 12px;
              border-top: 1px solid rgba(255,255,255,0.1);
            ">
              <button style="
                flex: 1;
                padding: 8px;
                background: rgba(6,182,212,0.15);
                border: 1px solid rgba(6,182,212,0.3);
                border-radius: 6px;
                color: #06b6d4;
                font-size: 11px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
              " onmouseover="this.style.background='rgba(6,182,212,0.25)'" onmouseout="this.style.background='rgba(6,182,212,0.15)'">生成报告</button>
              <button style="
                flex: 1;
                padding: 8px;
                background: rgba(168,85,247,0.15);
                border: 1px solid rgba(168,85,247,0.3);
                border-radius: 6px;
                color: #a855f7;
                font-size: 11px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
              " onmouseover="this.style.background='rgba(168,85,247,0.25)'" onmouseout="this.style.background='rgba(168,85,247,0.15)'">加入研判</button>
            </div>
          </div>
          
          <!-- 水滴尖端 - 展开时隐藏 -->
          <div class="teardrop-tip" style="
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            transition: opacity 0.2s ease;
          ">
            <div style="
              width: 0;
              height: 0;
              border-left: 12px solid transparent;
              border-right: 12px solid transparent;
              border-top: 25px solid ${config.color};
              filter: drop-shadow(0 0 8px ${config.glowColor});
            "></div>
            <div style="
              position: absolute;
              bottom: 3px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 9px solid transparent;
              border-right: 9px solid transparent;
              border-top: 20px solid rgba(15, 23, 42, 0.95);
            "></div>
          </div>
        </div>
        
        <!-- 标题悬浮提示 -->
        <div class="teardrop-title" style="
          position: absolute;
          bottom: calc(100% + 5px);
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95));
          border: 1px solid ${config.color}80;
          border-radius: 6px;
          padding: 6px 10px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        ">
          <div style="color: ${config.color}; font-size: 11px; font-weight: bold;">${spot.title}</div>
        </div>
      </div>
    `,
    zIndex: 1000 + config.priority,
  });

  marker.on("click", (e) => {
    // 检查是否点击了关闭按钮
    if (e.originEvent && e.originEvent.target && e.originEvent.target.classList.contains('close-btn')) {
      closeDetailPanel();
    } else {
      selectHotspot(spot);
    }
  });
  
  // Apply visibility before adding to map to prevent flickering
  if (!mapStore.layers.markers) {
    marker.hide();
  }
  
  map.add(marker);
  window.hotspotBalloons.push(marker);
};

// 创建聚合标签
const createClusterMarker = (map, AMapModule, cluster, levelConfig) => {
  // 获取簇中最高优先级
  const maxPriority = Math.max(
    ...cluster.spots.map((s) => levelConfig[s.level].priority)
  );
  const dominantLevel = Object.keys(levelConfig).find(
    (k) => levelConfig[k].priority === maxPriority
  );
  const config = levelConfig[dominantLevel];

  const totalCount = cluster.spots.reduce((sum, s) => sum + s.count, 0);
  const highCount = cluster.spots.filter((s) => s.level === "high").length;
  const mediumCount = cluster.spots.filter((s) => s.level === "medium").length;
  const lowCount = cluster.spots.filter((s) => s.level === "low").length;

  const marker = new AMapModule.Marker({
    position: cluster.center,
    anchor: "bottom-center",
    offset: new AMapModule.Pixel(0, 0), // 设为 0，让 CSS scale 能够正确缩放
    content: `
      <div class="cluster-marker" style="
        position: relative;
        cursor: pointer;
        filter: drop-shadow(0 4px 16px ${config.glowColor});
        transform: scale(var(--map-zoom-scale, 1)) rotateX(calc(var(--map-pitch, 0deg) * 0.3));
        transform-origin: bottom center;
        transform-style: preserve-3d;
        perspective: 1000px;
        width: 0;
        height: 0;
        overflow: visible;
      ">
        <!-- 连接线 -->
        <div style="
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 4px;
          height: ${config.height + 30}px;
          background: linear-gradient(to bottom, ${config.color}, ${
      config.color
    }60, transparent);
          transform: translateX(-50%);
          transform-origin: bottom center;
          animation: lineGlow 1.5s ease-in-out infinite;
        "></div>
        
        <!-- 聚合水滴主体 -->
        <div style="
          position: absolute;
          bottom: ${config.height + 30}px;
          left: 50%;
          width: 70px;
          height: 90px;
          transform: translateX(-50%);
          transform-origin: bottom center;
        ">
          <!-- 大水滴 -->
          <div style="
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 70px;
            height: 70px;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95));
            border: 3px solid ${config.color};
            border-radius: 50%;
            box-shadow: 0 0 30px ${config.glowColor}, 0 0 60px ${
      config.glowColor
    }50;
            animation: clusterPulse 1.5s ease-in-out infinite;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              color: white;
              font-size: 18px;
              font-weight: bold;
              text-shadow: 0 0 10px ${config.color};
            ">${cluster.spots.length}</div>
            <div style="
              color: #94a3b8;
              font-size: 8px;
            ">EVENTS</div>
            
            <!-- 等级指示点 -->
            <div style="
              display: flex;
              gap: 3px;
              margin-top: 2px;
            ">
              ${
                highCount > 0
                  ? `<div style="width: 6px; height: 6px; background: #ec4899; border-radius: 50%;"></div>`
                  : ""
              }
              ${
                mediumCount > 0
                  ? `<div style="width: 6px; height: 6px; background: #a855f7; border-radius: 50%;"></div>`
                  : ""
              }
              ${
                lowCount > 0
                  ? `<div style="width: 6px; height: 6px; background: #06b6d4; border-radius: 50%;"></div>`
                  : ""
              }
            </div>
          </div>
          
          <!-- 尖端 -->
          <div style="
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-top: 28px solid ${config.color};
            filter: drop-shadow(0 0 10px ${config.glowColor});
          "></div>
          <div style="
            position: absolute;
            bottom: 4px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 11px solid transparent;
            border-right: 11px solid transparent;
            border-top: 22px solid rgba(15, 23, 42, 0.95);
          "></div>
        </div>
        
        <!-- 总数提示 -->
        <div style="
          position: absolute;
          bottom: calc(100% + 5px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid ${config.color}80;
          border-radius: 4px;
          padding: 4px 8px;
          white-space: nowrap;
        ">
          <span style="color: white; font-size: 10px; font-weight: bold;">${totalCount.toLocaleString()}</span>
          <span style="color: #64748b; font-size: 9px;"> 讨论</span>
        </div>
      </div>
    `,
    zIndex: 2000,
  });

  // 点击聚合标记：如果只有少量则展开第一个，否则放大地图
  marker.on("click", () => {
    if (cluster.spots.length <= 3) {
      // 选中第一个热点
      selectHotspot(cluster.spots[0]);
    } else {
      // 放大地图到聚合中心
      map.setZoomAndCenter(map.getZoom() + 1, cluster.center, false, 500);
    }
  });

  // Apply visibility before adding to map to prevent flickering
  if (!mapStore.layers.markers) {
    marker.hide();
  }

  map.add(marker);
  window.hotspotBalloons.push(marker);
};

// 自定义建筑样式 - 赛博朋克风格
const customizeBuildingStyle = (map, AMapModule) => {
  // 创建自定义 3D 建筑图层
  const buildingsLayer = new AMapModule.Buildings({
    zooms: [15, 20], // 高德 API 限制: 3D 建筑只在 zoom 15-20 渲染
    zIndex: 10,
    heightFactor: 3, // 增大高度系数，让建筑更突出
    visible: true,
    wallColor: CYBER_THEME.building.base.wall,
    roofColor: CYBER_THEME.building.base.roof,
  });

  // 保存引用，供后续城市切换时使用
  buildingsLayerRef.value = buildingsLayer;

  // 添加建筑图层到地图
  map.addLayer(buildingsLayer);

  // 初始加载完成后，执行 POI 搜索
  map.on("complete", () => {
    console.log("[AMap] 赛博朋克 3D 建筑图层已加载");
    updateBuildingStylesByPOI();
    // 初始化状态值
    currentZoom.value = map.getZoom();
    currentPitch.value = map.getPitch();
    currentRotation.value = map.getRotation();
    updateZoomScale();
  });

  // 监听地图状态变化
  const updateScreenPosition = () => {
    if (sentimentStore.selectedHotspot && map) {
      // selectedHotspot 可能没有 position 属性，需要从 lng/lat 构建
      const hotspot = sentimentStore.selectedHotspot;
      // 兼容新旧数据格式：优先使用 location 对象，回退到 lng/lat 分开字段
      const position = hotspot.position || 
        (hotspot.location ? [hotspot.location.lng, hotspot.location.lat] : [hotspot.lng, hotspot.lat]);
      if (position && position[0] !== undefined && position[1] !== undefined) {
        const pixel = map.lngLatToContainer(position);
        mapStore.hotspotScreenPosition = { x: pixel.x, y: pixel.y };
      }
    } else {
      mapStore.hotspotScreenPosition = null;
    }
  };

  // 更新缩放比例变量
  const updateZoomScale = () => {
    const zoom = map.getZoom();
    const pitch = map.getPitch();
    const rotation = map.getRotation();
    
    // Base zoom 17 = scale 1.0. 
    // 在全国视图 (zoom 4) 下，如果按照 1.4^(4-17) 计算，结果极小。
    // 我们需要调整曲线，使得在低 Zoom 下 Scale 不会过小。
    // 使用分段函数：
    let scale;
    if (zoom <= 6) {
        // 全国视图：显著增大比例 (0.8 - 1.2)
        scale = 0.8 + (zoom - 3) * 0.1; 
    } else {
        // 城市视图：调整底数，使过渡更平缓
        scale = Math.max(0.4, Math.pow(1.2, zoom - 17));
    }
    
    if (container.value) {
      container.value.style.setProperty('--map-zoom-scale', scale);
      container.value.style.setProperty('--map-pitch', pitch + 'deg');
      container.value.style.setProperty('--map-rotation', rotation + 'deg');
    }
  };

  map.on("mapmove", updateScreenPosition);
  map.on("zoomchange", () => {
    currentZoom.value = map.getZoom();
    mapStore.updateCameraState({ zoom: map.getZoom() });
    updateScreenPosition();
    updateZoomScale();
  });
  map.on("rotatechange", () => {
    currentPitch.value = map.getPitch();
    currentRotation.value = map.getRotation();
    updateZoomScale(); // 旋转同时也更新 pitch 变量
  });

  // 监听选中热点变化，更新屏幕位置（用于其他组件引用）
  watch(() => sentimentStore.selectedHotspot, (newVal, oldVal) => {
    setTimeout(() => {
      updateScreenPosition();
      
      // 收起旧标记
      if (oldVal) {
        const oldEl = document.querySelector(`.teardrop-marker[data-spot-id="${oldVal.id}"]`);
        if (oldEl) oldEl.classList.remove('expanded');
      }
      
      // 导航动画进行中时，先等待 selectHotspot 中的延迟展开逻辑
      if (!newVal || isNavigating.value) return;
      
      // 计算展开方向并展开新标记
      updateMarkerExpandDirection(newVal.id);
      const newEl = document.querySelector(`.teardrop-marker[data-spot-id="${newVal.id}"]`);
      if (newEl) newEl.classList.add('expanded');
    }, 0);
  });

};

// 跳转到指定热点
const navigateToHotspot = (hotspotId) => {
  console.log('[Map] navigateToHotspot called with id:', hotspotId);
  console.log('[Map] currentHotspots:', currentHotspots.value.map(h => ({ id: h.id, position: h.position })));
  
  const spot = currentHotspots.value.find((h) => h.id === hotspotId);
  console.log('[Map] Found spot:', spot);
  
  if (spot && mapInstance.value) {
    console.log('[Map] Navigating to position:', spot.position, 'zoom: 17');
    mapInstance.value.setZoomAndCenter(17, spot.position, false, 800);
    setTimeout(() => {
      selectHotspot(spot);
    }, 500);
  } else {
    console.warn('[Map] Cannot navigate: spot not found or map not ready', { spot, mapReady: !!mapInstance.value });
  }
};

// 全局事件处理器 - 供其他组件调用
const handleGlobalNavigate = (event) => {
  if (event.detail && event.detail.hotspotId) {
    navigateToHotspot(event.detail.hotspotId);
  }
};

onMounted(() => {
  initMap();
  // 监听全局跳转事件
  window.addEventListener("navigate-to-hotspot", handleGlobalNavigate);
});

onUnmounted(() => {
  // 移除全局事件监听
  window.removeEventListener("navigate-to-hotspot", handleGlobalNavigate);
  // 清理缩放监听器
  if (window.zoomChangeHandler && mapInstance.value) {
    mapInstance.value.off("zoomend", window.zoomChangeHandler);
    window.zoomChangeHandler = null;
  }
  // 清理标签
  if (window.hotspotBalloons) {
    window.hotspotBalloons = [];
  }
  // 销毁地图
  if (mapInstance.value) {
    mapInstance.value.destroy();
    mapInstance.value = null;
  }
  // 销毁 Three.js 渲染器
  if (threeRenderer.value) {
    threeRenderer.value.dispose()
    threeRenderer.value.forceContextLoss()
    threeRenderer.value = null
  }
  // 销毁高德官方 GltfLoader
  if (amapGltfLoader) {
    amapGltfLoader.dispose()
    amapGltfLoader = null
  }
  // 清理性能优化实例
  frustumCuller = null
  renderController = null
  performanceMonitor = null
});
</script>

<template>
  <div class="w-full h-full relative overflow-hidden">
    <!-- 地图容器 -->
    <div ref="container" class="w-full h-full"></div>


    <!-- 聚焦模式暗化层 (CSS 过渡，无闪烁) -->
    <!-- z-index: 10 确保在地图 canvas 之上但在 markers (z-1000+) 之下 -->
    <!-- 
      <div 
        class="absolute inset-0 bg-slate-900/70 pointer-events-none transition-opacity duration-500 z-10"
        :class="isFocusMode ? 'opacity-100' : 'opacity-0'"
      ></div>
    -->

    <!-- 热点详情已集成到水滴标记中，点击水滴直接展开为详情面板 -->
  </div>
</template>

<style>
/* 脉冲光环动画 */
@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: var(--pulse-opacity, 0.5);
  }
  70%, 100% {
    transform: translate(-50%, -50%) scale(var(--pulse-scale, 2));
    opacity: 0;
  }
}

/* 脉冲动画 */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.7;
  }
}

/* 建筑发光动画 */
@keyframes buildingGlow {
  0% {
    box-shadow: 0 0 20px var(--glow-color), 0 0 40px var(--glow-color);
    transform: translateX(-50%) scale(1);
  }
  100% {
    box-shadow: 0 0 30px var(--glow-color), 0 0 60px var(--glow-color),
      0 0 80px var(--glow-color);
    transform: translateX(-50%) scale(1.1);
  }
}

/* 倒水滴脉冲动画 */
@keyframes teardropPulse {
  0%,
  100% {
    box-shadow: 0 0 25px var(--glow-color, rgba(236, 72, 153, 0.8)),
      inset 0 0 15px rgba(255, 255, 255, 0.1);
    transform: translateX(-50%) scale(1);
  }
  50% {
    box-shadow: 0 0 35px var(--glow-color, rgba(236, 72, 153, 0.9)),
      0 0 50px var(--glow-color, rgba(236, 72, 153, 0.5)),
      inset 0 0 20px rgba(255, 255, 255, 0.15);
    transform: translateX(-50%) scale(1.02);
  }
}

/* 聚合标记脉冲 */
@keyframes clusterPulse {
  0%,
  100% {
    box-shadow: 0 0 30px var(--glow-color, rgba(236, 72, 153, 0.8)),
      0 0 60px var(--glow-color, rgba(236, 72, 153, 0.4));
    transform: translateX(-50%) scale(1);
  }
  50% {
    box-shadow: 0 0 45px var(--glow-color, rgba(236, 72, 153, 0.9)),
      0 0 80px var(--glow-color, rgba(236, 72, 153, 0.6));
    transform: translateX(-50%) scale(1.03);
  }
}

/* 连接线发光动画 */
@keyframes lineGlow {
  0%,
  100% {
    opacity: 0.7;
    filter: brightness(1);
  }
  50% {
    opacity: 1;
    filter: brightness(1.3);
  }
}

/* 气球浮动动画 */
@keyframes balloonFloat {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 详情面板滑入动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 倒水滴标签样式 */
.teardrop-marker {
  transition: transform 0.2s ease, z-index 0s;
}

.teardrop-marker:hover {
  transform: scale(1.08);
}

.teardrop-marker:hover .teardrop-title {
  opacity: 1 !important;
}

/* 展开时隐藏脉冲 */
.teardrop-marker.expanded .marker-pulse-ring {
  display: none;
}

/* 禁用过渡动画 - 用于缩放时保持展开状态 */
.teardrop-marker.no-animate,
.teardrop-marker.no-animate .marker-body,
.teardrop-marker.no-animate .marker-bg,
.teardrop-marker.no-animate .collapsed-content,
.teardrop-marker.no-animate .expanded-content,
.teardrop-marker.no-animate .connector-line {
  transition: none !important;
}

/* ===== 水滴展开为详情面板的动画 ===== */
.teardrop-marker.expanded {
  z-index: 9999 !important;
  transform: scale(var(--map-zoom-scale, 1)) !important;
}

.teardrop-marker.expanded:hover {
  transform: scale(var(--map-zoom-scale, 1)) !important;
}

/* 展开时隐藏标题提示 */
.teardrop-marker.expanded .teardrop-title {
  opacity: 0 !important;
  pointer-events: none;
}

/* 水滴尖端隐藏 */
.teardrop-marker.expanded .teardrop-tip {
  opacity: 0 !important;
  pointer-events: none;
}

/* 收起状态内容隐藏 */
.teardrop-marker.expanded .collapsed-content {
  opacity: 0 !important;
  pointer-events: none;
}

/* 展开状态内容显示 */
.teardrop-marker.expanded .expanded-content {
  opacity: 1 !important;
  pointer-events: auto !important;
}

/* 连接线变短 */
.teardrop-marker.expanded .connector-line {
  height: 30px !important;
}

/* 基础展开样式 */
.teardrop-marker.expanded .marker-body {
  width: 280px !important;
  height: auto !important;
  /* 默认向右展开，增加偏移量避免遮挡 */
  transform: translateX(30px) !important;
}

.teardrop-marker.expanded .marker-bg {
  width: 280px !important;
  height: 320px !important;
  border-radius: 12px !important;
  box-shadow: 0 0 40px var(--marker-glow), 0 25px 50px rgba(0,0,0,0.5) !important;
  /* 默认左对齐 */
  left: 0 !important;
  transform: translateX(0) !important;
}

.teardrop-marker.expanded .collapsed-content,
.teardrop-marker.expanded .expanded-content {
  left: 0 !important;
  transform: translateX(0) !important;
}

/* ===== 向右展开 (默认) ===== */
/* 面板左边缘对齐连接线，整个面板在连接线右侧 */
.teardrop-marker.expanded.expand-right .marker-body {
  transform: translateX(150px) !important; /* 向右偏移，避免遮挡建筑 */
}

.teardrop-marker.expanded.expand-right .marker-bg,
.teardrop-marker.expanded.expand-right .collapsed-content,
.teardrop-marker.expanded.expand-right .expanded-content {
  left: 0 !important;
  transform: translateX(0) !important;
}

/* ===== 向左展开 ===== */
/* 面板右边缘对齐连接线，整个面板在连接线左侧 */
.teardrop-marker.expanded.expand-left .marker-body {
  transform: translateX(-100%) !important; /* 整体向左偏移一个面板宽度 */
}

.teardrop-marker.expanded.expand-left .marker-bg,
.teardrop-marker.expanded.expand-left .collapsed-content,
.teardrop-marker.expanded.expand-left .expanded-content {
  left: 0 !important;
  transform: translateX(0) !important;
}

/* ===== 向下展开 ===== */
/* 面板顶部对齐连接线底部，向下展开 */
.teardrop-marker.expanded.expand-bottom .marker-body {
  transform: translateX(-50%) !important;
  bottom: auto !important;
  top: 40px !important;
}

.teardrop-marker.expanded.expand-bottom .marker-bg,
.teardrop-marker.expanded.expand-bottom .collapsed-content,
.teardrop-marker.expanded.expand-bottom .expanded-content {
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.teardrop-marker.expanded.expand-bottom .connector-line {
  height: 60px !important;
}

/* 聚合标签样式 */
.cluster-marker {
  transition: transform 0.2s ease;
}

.cluster-marker:hover {
  transform: scale(1.05);
}

/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.3);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(6, 182, 212, 0.5);
}

/* 隐藏高德 Logo (可选，注意合规) */
.amap-logo {
  display: none !important;
}

.amap-copyright {
  opacity: 0.3;
}
</style>