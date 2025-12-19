import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as sceneApi from '@/api/scene'

// Maximum cache size (number of models)
const MAX_CACHE_SIZE = 10

// Memory pressure threshold (in bytes, ~50MB)
const MEMORY_PRESSURE_THRESHOLD = 50 * 1024 * 1024

export const useSceneStore = defineStore('scene', () => {
  // ==================== State ====================
  
  // Currently generating model - tracks active generation requests
  // Map<hotspotId, { taskId, progress, status }>
  const generating = ref(new Map())
  
  // Model cache - keyed by hotspotId
  // Map<hotspotId, { modelUrl, metadata, cachedAt, size }>
  const models = ref(new Map())
  
  // Currently active/displayed model
  const currentModel = ref(null)
  
  // Error state
  const error = ref(null)
  
  // ==================== Getters ====================
  
  // Check if any generation is in progress
  const isGenerating = computed(() => generating.value.size > 0)
  
  // Check if a specific hotspot is generating
  const isHotspotGenerating = computed(() => {
    return (hotspotId) => generating.value.has(hotspotId)
  })
  
  // Get generation progress for a hotspot
  const getGenerationProgress = computed(() => {
    return (hotspotId) => {
      const gen = generating.value.get(hotspotId)
      return gen ? gen.progress : 0
    }
  })
  
  // Check if model is cached for a hotspot
  const isCached = computed(() => {
    return (hotspotId) => models.value.has(hotspotId)
  })
  
  // Get cached model count
  const cacheSize = computed(() => models.value.size)
  
  // Estimate total cache memory usage
  const estimatedCacheMemory = computed(() => {
    let total = 0
    models.value.forEach(model => {
      total += model.size || 0
    })
    return total
  })
  
  // ==================== Actions ====================
  
  /**
   * Generate a 3D scene for a hotspot
   * Handles concurrent requests - if already generating, returns existing task
   * @param {string} hotspotId - Hotspot identifier
   * @param {string} description - Scene description for AI generation
   * @returns {Promise<object>} - Generated model result
   */
  async function generateScene(hotspotId, description) {
    // Check if already generating for this hotspot (prevent concurrent duplicates)
    if (generating.value.has(hotspotId)) {
      console.log(`[SceneStore] Already generating for hotspot ${hotspotId}, waiting...`)
      // Return existing generation promise if stored
      const existingGen = generating.value.get(hotspotId)
      if (existingGen.promise) {
        return existingGen.promise
      }
      // Otherwise, continue to poll existing task
      return pollExistingTask(hotspotId, existingGen.taskId)
    }
    
    error.value = null
    
    // Create generation entry
    const generationEntry = {
      taskId: null,
      progress: 0,
      status: 'STARTING',
      promise: null
    }
    
    // Create the actual promise
    generationEntry.promise = (async () => {
      try {
        // Start generation
        const { taskId } = await sceneApi.generate3D(hotspotId, description)
        
        // Update entry with taskId
        generationEntry.taskId = taskId
        generationEntry.status = 'QUEUED'
        generating.value.set(hotspotId, { ...generationEntry })
        
        console.log(`[SceneStore] Started generation task ${taskId} for hotspot ${hotspotId}`)
        
        // Poll for completion
        const result = await sceneApi.pollTaskCompletion(taskId, {
          interval: 1500,
          timeout: 120000,
          onProgress: (data) => {
            // Update progress reactively
            const current = generating.value.get(hotspotId)
            if (current) {
              generating.value.set(hotspotId, {
                ...current,
                progress: data.progress,
                status: data.status
              })
            }
          }
        })
        
        // Cache the result
        await cacheModel(hotspotId, result.modelUrl)
        
        // Set as current model
        currentModel.value = {
          hotspotId,
          modelUrl: result.modelUrl,
          loadedAt: Date.now()
        }
        
        console.log(`[SceneStore] Generation complete for hotspot ${hotspotId}`)
        
        return result
        
      } catch (err) {
        error.value = err.message
        console.error(`[SceneStore] Generation failed for hotspot ${hotspotId}:`, err)
        throw err
        
      } finally {
        // Clean up generating state
        generating.value.delete(hotspotId)
      }
    })()
    
    // Store the entry with promise
    generating.value.set(hotspotId, generationEntry)
    
    return generationEntry.promise
  }
  
  /**
   * Poll an existing task (used when rejoining an in-progress generation)
   */
  async function pollExistingTask(hotspotId, taskId) {
    try {
      const result = await sceneApi.pollTaskCompletion(taskId, {
        interval: 1500,
        timeout: 120000,
        onProgress: (data) => {
          const current = generating.value.get(hotspotId)
          if (current) {
            generating.value.set(hotspotId, {
              ...current,
              progress: data.progress,
              status: data.status
            })
          }
        }
      })
      
      await cacheModel(hotspotId, result.modelUrl)
      
      currentModel.value = {
        hotspotId,
        modelUrl: result.modelUrl,
        loadedAt: Date.now()
      }
      
      return result
      
    } finally {
      generating.value.delete(hotspotId)
    }
  }
  
  /**
   * Load a cached model for display
   * @param {string} hotspotId - Hotspot identifier
   * @returns {object|null} - Cached model or null if not found
   */
  function loadCachedModel(hotspotId) {
    const cached = models.value.get(hotspotId)
    
    if (cached) {
      console.log(`[SceneStore] Loading cached model for hotspot ${hotspotId}`)
      
      // Update current model
      currentModel.value = {
        hotspotId,
        modelUrl: cached.modelUrl,
        loadedAt: Date.now(),
        fromCache: true
      }
      
      // Update cache hit time for LRU
      cached.lastAccessed = Date.now()
      models.value.set(hotspotId, cached)
      
      return cached
    }
    
    console.log(`[SceneStore] No cached model for hotspot ${hotspotId}`)
    return null
  }
  
  /**
   * Cache a model with memory management
   */
  async function cacheModel(hotspotId, modelUrl) {
    // Check memory pressure before caching
    if (estimatedCacheMemory.value > MEMORY_PRESSURE_THRESHOLD) {
      console.log('[SceneStore] Memory pressure detected, clearing old cache entries')
      clearOldestCache()
    }
    
    // Check max cache size
    if (models.value.size >= MAX_CACHE_SIZE) {
      console.log('[SceneStore] Cache full, removing oldest entry')
      clearOldestCache()
    }
    
    // Get model metadata
    let metadata = null
    let size = 5 * 1024 * 1024 // Default 5MB estimate
    
    try {
      metadata = await sceneApi.loadModel(modelUrl)
      size = metadata.size || size
    } catch (err) {
      console.warn('[SceneStore] Failed to load model metadata:', err)
    }
    
    // Store in cache
    models.value.set(hotspotId, {
      modelUrl,
      metadata,
      size,
      cachedAt: Date.now(),
      lastAccessed: Date.now()
    })
    
    console.log(`[SceneStore] Cached model for hotspot ${hotspotId} (${(size / 1024 / 1024).toFixed(2)}MB)`)
  }
  
  /**
   * Clear oldest cache entry (LRU eviction)
   */
  function clearOldestCache() {
    let oldestKey = null
    let oldestTime = Infinity
    
    models.value.forEach((value, key) => {
      const accessTime = value.lastAccessed || value.cachedAt
      if (accessTime < oldestTime) {
        oldestTime = accessTime
        oldestKey = key
      }
    })
    
    if (oldestKey) {
      models.value.delete(oldestKey)
      console.log(`[SceneStore] Evicted cache entry for hotspot ${oldestKey}`)
    }
  }
  
  /**
   * Clear entire cache (for memory pressure or cleanup)
   */
  function clearCache() {
    models.value.clear()
    console.log('[SceneStore] Cache cleared')
  }
  
  /**
   * Clear current model display
   */
  function clearCurrentModel() {
    currentModel.value = null
  }
  
  /**
   * Cancel ongoing generation (if supported)
   */
  function cancelGeneration(hotspotId) {
    if (generating.value.has(hotspotId)) {
      // Note: Actual cancellation would require backend support
      // For now, we just remove from tracking
      generating.value.delete(hotspotId)
      console.log(`[SceneStore] Cancelled generation tracking for hotspot ${hotspotId}`)
    }
  }
  
  /**
   * Handle memory pressure event (can be called from global listener)
   */
  function onMemoryPressure() {
    console.warn('[SceneStore] Memory pressure event - clearing cache')
    clearCache()
    currentModel.value = null
  }
  
  // ==================== Return ====================
  
  return {
    // State
    generating,
    models,
    currentModel,
    error,
    
    // Getters
    isGenerating,
    isHotspotGenerating,
    getGenerationProgress,
    isCached,
    cacheSize,
    estimatedCacheMemory,
    
    // Actions
    generateScene,
    loadCachedModel,
    clearCache,
    clearCurrentModel,
    cancelGeneration,
    onMemoryPressure
  }
})
