/**
 * 高德地图 3D 模型性能优化工具
 * 包含：LOD管理、视锥体剔除、按需渲染、实例化渲染
 */

import * as THREE from 'three'

/**
 * LOD 管理器 - 根据缩放级别切换模型精度
 */
export class LODManager {
  constructor() {
    this.lodLevels = new Map() // modelUrl -> { high, medium, low }
    this.currentLOD = 'high'
  }

  /**
   * 注册 LOD 级别
   * @param {string} modelId - 模型标识
   * @param {Object} levels - { high: url, medium: url, low: url }
   */
  registerLOD(modelId, levels) {
    this.lodLevels.set(modelId, levels)
  }

  /**
   * 根据缩放级别获取合适的模型 URL
   * @param {string} modelId - 模型标识
   * @param {number} zoom - 当前缩放级别
   * @returns {string} - 模型 URL
   */
  getModelUrl(modelId, zoom) {
    const levels = this.lodLevels.get(modelId)
    if (!levels) return null

    // 根据缩放级别选择 LOD
    if (zoom >= 17) {
      this.currentLOD = 'high'
      return levels.high
    } else if (zoom >= 14) {
      this.currentLOD = 'medium'
      return levels.medium || levels.high
    } else {
      this.currentLOD = 'low'
      return levels.low || levels.medium || levels.high
    }
  }

  /**
   * 获取当前 LOD 级别
   */
  getCurrentLOD() {
    return this.currentLOD
  }
}

/**
 * 视锥体剔除管理器 - 只渲染可见区域的模型
 */
export class FrustumCuller {
  constructor() {
    this.frustum = new THREE.Frustum()
    this.projScreenMatrix = new THREE.Matrix4()
  }

  /**
   * 更新视锥体
   * @param {THREE.Camera} camera
   */
  update(camera) {
    this.projScreenMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    )
    this.frustum.setFromProjectionMatrix(this.projScreenMatrix)
  }

  /**
   * 检查对象是否在视锥体内
   * @param {THREE.Object3D} object
   * @returns {boolean}
   */
  isVisible(object) {
    if (!object.geometry) {
      // 对于 Group，检查边界球
      const sphere = new THREE.Sphere()
      const box = new THREE.Box3().setFromObject(object)
      box.getBoundingSphere(sphere)
      return this.frustum.intersectsSphere(sphere)
    }
    
    // 对于 Mesh，使用几何体边界球
    if (!object.geometry.boundingSphere) {
      object.geometry.computeBoundingSphere()
    }
    const sphere = object.geometry.boundingSphere.clone()
    sphere.applyMatrix4(object.matrixWorld)
    return this.frustum.intersectsSphere(sphere)
  }

  /**
   * 批量剔除对象
   * @param {THREE.Object3D[]} objects
   */
  cullObjects(objects) {
    objects.forEach(obj => {
      obj.visible = this.isVisible(obj)
    })
  }
}

/**
 * 按需渲染控制器 - 静止时不渲染
 */
export class RenderOnDemand {
  constructor() {
    this.needsRender = true
    this.renderCount = 0
    this.lastRenderTime = 0
    this.minRenderInterval = 16 // ~60fps
  }

  /**
   * 标记需要渲染
   */
  requestRender() {
    this.needsRender = true
  }

  /**
   * 检查是否应该渲染
   * @returns {boolean}
   */
  shouldRender() {
    const now = performance.now()
    if (!this.needsRender) return false
    if (now - this.lastRenderTime < this.minRenderInterval) return false
    
    this.lastRenderTime = now
    this.renderCount++
    this.needsRender = false
    return true
  }

  /**
   * 强制渲染（用于动画）
   */
  forceRender() {
    this.needsRender = true
    this.lastRenderTime = 0
  }

  /**
   * 获取渲染统计
   */
  getStats() {
    return {
      renderCount: this.renderCount,
      lastRenderTime: this.lastRenderTime
    }
  }
}

/**
 * 模型实例化管理器 - 相同模型使用 InstancedMesh
 */
export class InstanceManager {
  constructor() {
    this.instances = new Map() // geometry+material key -> InstancedMesh
    this.maxInstances = 1000
  }

  /**
   * 创建或获取实例化网格
   * @param {THREE.BufferGeometry} geometry
   * @param {THREE.Material} material
   * @param {string} key - 唯一标识
   * @returns {THREE.InstancedMesh}
   */
  getInstancedMesh(geometry, material, key) {
    if (this.instances.has(key)) {
      return this.instances.get(key)
    }

    const instancedMesh = new THREE.InstancedMesh(
      geometry,
      material,
      this.maxInstances
    )
    instancedMesh.count = 0
    instancedMesh.frustumCulled = true
    this.instances.set(key, instancedMesh)
    return instancedMesh
  }

  /**
   * 添加实例
   * @param {string} key
   * @param {THREE.Matrix4} matrix - 变换矩阵
   * @returns {number} - 实例索引
   */
  addInstance(key, matrix) {
    const mesh = this.instances.get(key)
    if (!mesh || mesh.count >= this.maxInstances) return -1

    const index = mesh.count
    mesh.setMatrixAt(index, matrix)
    mesh.count++
    mesh.instanceMatrix.needsUpdate = true
    return index
  }

  /**
   * 更新实例变换
   * @param {string} key
   * @param {number} index
   * @param {THREE.Matrix4} matrix
   */
  updateInstance(key, index, matrix) {
    const mesh = this.instances.get(key)
    if (!mesh || index >= mesh.count) return

    mesh.setMatrixAt(index, matrix)
    mesh.instanceMatrix.needsUpdate = true
  }

  /**
   * 清除所有实例
   */
  clear() {
    this.instances.forEach((mesh, key) => {
      mesh.count = 0
      mesh.instanceMatrix.needsUpdate = true
    })
  }

  /**
   * 释放资源
   */
  dispose() {
    this.instances.forEach(mesh => {
      mesh.geometry.dispose()
      mesh.material.dispose()
    })
    this.instances.clear()
  }
}

/**
 * 高德地图专用优化器
 */
export class AMapOptimizer {
  constructor(map) {
    this.map = map
    this.lodManager = new LODManager()
    this.frustumCuller = new FrustumCuller()
    this.renderController = new RenderOnDemand()
    this.instanceManager = new InstanceManager()
    
    // 缓存上一帧的缩放级别，避免频繁切换 LOD
    this.lastZoom = 0
    this.zoomChangeThreshold = 0.5
    
    // 绑定地图事件
    this._bindMapEvents()
  }

  _bindMapEvents() {
    if (!this.map) return

    // 地图移动时请求渲染
    this.map.on('mapmove', () => {
      this.renderController.requestRender()
    })

    // 缩放时请求渲染
    this.map.on('zoomchange', () => {
      this.renderController.requestRender()
    })

    // 旋转/倾斜时请求渲染
    this.map.on('rotatechange', () => {
      this.renderController.requestRender()
    })
  }

  /**
   * 检查是否需要切换 LOD
   * @returns {boolean}
   */
  shouldSwitchLOD() {
    const currentZoom = this.map.getZoom()
    const diff = Math.abs(currentZoom - this.lastZoom)
    
    if (diff > this.zoomChangeThreshold) {
      this.lastZoom = currentZoom
      return true
    }
    return false
  }

  /**
   * 获取当前缩放级别对应的模型可见性配置
   */
  getVisibilityConfig() {
    const zoom = this.map.getZoom()
    
    return {
      showDetailedModels: zoom >= 16,    // 详细 3D 模型
      showSimpleMarkers: zoom >= 10,      // 简化标记
      showHeatmap: zoom < 14,             // 热力图（远距离）
      showBuildings: zoom >= 15,          // 3D 建筑
      showLabels: zoom >= 12,             // 标签
      modelScale: this._calculateModelScale(zoom)
    }
  }

  _calculateModelScale(zoom) {
    // 根据缩放级别计算模型缩放比例
    // zoom 17 = scale 1.0
    if (zoom <= 6) {
      return 0.8 + (zoom - 3) * 0.1
    }
    return Math.max(0.3, Math.pow(1.15, zoom - 17))
  }

  /**
   * 释放资源
   */
  dispose() {
    this.instanceManager.dispose()
  }
}

/**
 * 创建缩放级别依赖的模型显示控制
 * @param {Object} map - 高德地图实例
 * @param {Array} models - 3D 模型数组
 */
export function createZoomBasedVisibility(map, models) {
  let lastZoom = map.getZoom()
  
  const updateVisibility = () => {
    const zoom = map.getZoom()
    if (Math.abs(zoom - lastZoom) < 0.3) return
    
    lastZoom = zoom
    
    models.forEach(model => {
      // 根据模型的 LOD 配置决定可见性
      const lodConfig = model.userData.lod || { minZoom: 14, maxZoom: 20 }
      model.visible = zoom >= lodConfig.minZoom && zoom <= lodConfig.maxZoom
    })
  }

  map.on('zoomend', updateVisibility)
  updateVisibility() // 初始化

  return () => {
    map.off('zoomend', updateVisibility)
  }
}

/**
 * 性能监控器
 */
export class PerformanceMonitor {
  constructor() {
    this.frameCount = 0
    this.lastTime = performance.now()
    this.fps = 0
    this.drawCalls = 0
    this.triangles = 0
  }

  update(renderer) {
    this.frameCount++
    const now = performance.now()
    
    if (now - this.lastTime >= 1000) {
      this.fps = this.frameCount
      this.frameCount = 0
      this.lastTime = now
      
      if (renderer && renderer.info) {
        this.drawCalls = renderer.info.render.calls
        this.triangles = renderer.info.render.triangles
      }
    }
  }

  getStats() {
    return {
      fps: this.fps,
      drawCalls: this.drawCalls,
      triangles: this.triangles
    }
  }

  log() {
    console.log(`[Performance] FPS: ${this.fps}, DrawCalls: ${this.drawCalls}, Triangles: ${this.triangles}`)
  }
}

/**
 * 高德官方 GltfLoader 封装
 * 使用 AMap.GltfLoader 插件加载模型，性能更优
 */
export class AMapGltfLoaderWrapper {
  constructor(AMap) {
    this.AMap = AMap
    this.loader = null
    this.object3DLayer = null
    this.loadedModels = new Map()
    this.isPluginLoaded = false
  }

  /**
   * 初始化加载器（需要先加载插件）
   * @param {Object} map - 高德地图实例
   * @returns {Promise}
   */
  async init(map) {
    return new Promise((resolve, reject) => {
      this.AMap.plugin(['AMap.GltfLoader'], () => {
        this.loader = new this.AMap.GltfLoader()
        this.object3DLayer = new this.AMap.Object3DLayer()
        map.add(this.object3DLayer)
        this.isPluginLoaded = true
        resolve(this)
      })
    })
  }

  /**
   * 加载 GLTF 模型
   * @param {string} url - 模型 URL
   * @param {Object} options - 配置选项
   * @param {Array} options.position - [lng, lat] 经纬度位置
   * @param {number} options.scale - 缩放比例
   * @param {number} options.height - 高度
   * @param {Object} options.rotation - { x, y, z } 旋转角度
   * @returns {Promise<Object>} - 加载的模型对象
   */
  load(url, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isPluginLoaded) {
        reject(new Error('AMap.GltfLoader plugin not loaded. Call init() first.'))
        return
      }

      this.loader.load(url, (gltfModel) => {
        if (!gltfModel) {
          reject(new Error(`Failed to load model: ${url}`))
          return
        }

        // 设置模型属性
        const {
          position = [114.0579, 32.1238],
          scale = 1,
          height = 0,
          rotation = { x: 0, y: 0, z: 0 },
          scene = 0
        } = options

        gltfModel.setOption({
          position: new this.AMap.LngLat(position[0], position[1]),
          scale,
          height,
          scene
        })

        // 设置旋转
        if (rotation.x) gltfModel.rotateX(rotation.x)
        if (rotation.y) gltfModel.rotateY(rotation.y)
        if (rotation.z) gltfModel.rotateZ(rotation.z)

        // 添加到图层
        this.object3DLayer.add(gltfModel)
        
        // 缓存模型
        const modelId = `${url}_${Date.now()}`
        this.loadedModels.set(modelId, gltfModel)
        
        resolve({ model: gltfModel, id: modelId })
      })
    })
  }

  /**
   * 批量加载模型
   * @param {Array} configs - [{ url, options }]
   * @returns {Promise<Array>}
   */
  async loadBatch(configs) {
    const results = []
    for (const config of configs) {
      try {
        const result = await this.load(config.url, config.options)
        results.push(result)
      } catch (err) {
        console.warn(`Failed to load model: ${config.url}`, err)
      }
    }
    return results
  }

  /**
   * 移除模型
   * @param {string} modelId - 模型 ID
   */
  remove(modelId) {
    const model = this.loadedModels.get(modelId)
    if (model) {
      this.object3DLayer.remove(model)
      this.loadedModels.delete(modelId)
    }
  }

  /**
   * 移除所有模型
   */
  removeAll() {
    this.loadedModels.forEach((model) => {
      this.object3DLayer.remove(model)
    })
    this.loadedModels.clear()
  }

  /**
   * 更新模型位置
   * @param {string} modelId
   * @param {Array} position - [lng, lat]
   */
  updatePosition(modelId, position) {
    const model = this.loadedModels.get(modelId)
    if (model) {
      model.setOption({
        position: new this.AMap.LngLat(position[0], position[1])
      })
    }
  }

  /**
   * 设置模型可见性
   * @param {string} modelId
   * @param {boolean} visible
   */
  setVisible(modelId, visible) {
    const model = this.loadedModels.get(modelId)
    if (model) {
      model.show = visible
    }
  }

  /**
   * 获取图层
   */
  getLayer() {
    return this.object3DLayer
  }

  /**
   * 释放资源
   */
  dispose() {
    this.removeAll()
    this.object3DLayer = null
    this.loader = null
  }
}

/**
 * 创建高德官方模型加载器（推荐）
 * @param {Object} AMap - 高德地图 SDK
 * @param {Object} map - 地图实例
 * @returns {Promise<AMapGltfLoaderWrapper>}
 */
export async function createAMapGltfLoader(AMap, map) {
  const loader = new AMapGltfLoaderWrapper(AMap)
  await loader.init(map)
  return loader
}

export default {
  LODManager,
  FrustumCuller,
  RenderOnDemand,
  InstanceManager,
  AMapOptimizer,
  createZoomBasedVisibility,
  PerformanceMonitor,
  AMapGltfLoaderWrapper,
  createAMapGltfLoader
}
