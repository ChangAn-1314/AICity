import { request, mockRequest } from './client'

// In-memory mock storage for development
const mockTasks = new Map()

/**
 * Retry helper for async operations
 * @param {Function} fn - Async function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Delay between retries in ms
 */
async function withRetry(fn, retries = 3, delay = 1000) {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) throw error
    await new Promise(resolve => setTimeout(resolve, delay))
    return withRetry(fn, retries - 1, delay)
  }
}

/**
 * Generate a 3D model from a description (Mocking Tripo AI)
 * @param {string} hotspotId - ID of the hotspot
 * @param {string} description - Text description for 3D generation
 * @returns {Promise<{taskId: string, status: string}>}
 */
export async function generate3D(hotspotId, description) {
  // Mock implementation: Create a task
  const taskId = `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  
  // Store mock task state
  mockTasks.set(taskId, {
    status: 'QUEUED', // QUEUED, RUNNING, SUCCEEDED, FAILED
    progress: 0,
    startTime: Date.now(),
    modelUrl: null,
    hotspotId
  })
  
  console.log(`[SceneAPI] Generated task ${taskId} for hotspot ${hotspotId}`)
  
  // Return initial response
  return mockRequest({
    taskId,
    status: 'QUEUED',
    message: 'Task successfully created'
  }, 800)
}

/**
 * Get the status of a 3D generation task
 * @param {string} taskId 
 * @returns {Promise<{status: string, progress: number, modelUrl?: string, error?: string}>}
 */
export async function getModelStatus(taskId) {
  // Use withRetry to handle potential network hiccups
  return withRetry(async () => {
    // Mock logic: Simulate progress over time
    const task = mockTasks.get(taskId)
    
    if (!task) {
      // In real scenario, this might be a 404 from server
      // For mock, we'll return a mock 404 error if not found in memory
      // But since we might reload, let's just create a fake completed one if missing for robustness in demo
      // or throw error. Let's throw error to be realistic.
      // However, for development convenience if state is lost, let's fake it.
      console.warn(`[SceneAPI] Task ${taskId} not found in memory, creating fake result`)
      return mockRequest({
          status: 'SUCCEEDED',
          progress: 100,
          modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb'
      }, 500)
    }
    
    const elapsed = Date.now() - task.startTime
    
    // Simulate state transitions
    if (task.status === 'QUEUED' && elapsed > 2000) {
      task.status = 'RUNNING'
    }
    
    if (task.status === 'RUNNING') {
      // Simulate progress taking about 10 seconds total
      // Progress from 0 to 100
      const runDuration = 8000 // 8 seconds running
      const runElapsed = elapsed - 2000
      task.progress = Math.min(99, Math.floor((runElapsed / runDuration) * 100))
      
      if (runElapsed > runDuration) {
        task.status = 'SUCCEEDED'
        task.progress = 100
        // Use a public sample GLB for testing
        task.modelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb'
      }
    }
    
    return mockRequest({
      status: task.status,
      progress: task.progress,
      modelUrl: task.modelUrl,
      error: task.error
    }, 500)
  })
}

/**
 * Load a 3D model (Metadata or Blob)
 * @param {string} modelUrl 
 * @returns {Promise<any>}
 */
export async function loadModel(modelUrl) {
  return withRetry(async () => {
    // In a real app, this might verify the URL or fetch headers
    return mockRequest({
      url: modelUrl,
      size: 5 * 1024 * 1024, // Mock 5MB
      format: 'glb'
    }, 500)
  })
}

/**
 * Poll task status until completion or failure
 * @param {string} taskId 
 * @param {object} options - { interval: number, timeout: number, onProgress: Function }
 * @returns {Promise<object>} - Final result with modelUrl
 */
export async function pollTaskCompletion(taskId, options = {}) {
  const { 
    interval = 2000, 
    timeout = 60000,
    onProgress = () => {}
  } = options
  
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeout) {
    try {
      const result = await getModelStatus(taskId)
      
      onProgress(result)
      
      if (result.status === 'SUCCEEDED') {
        return result
      }
      
      if (result.status === 'FAILED') {
        throw new Error(result.error || '3D Generation failed')
      }
      
      // Wait for interval
      await new Promise(resolve => setTimeout(resolve, interval))
      
    } catch (error) {
      // If it's a polling error (network), we might want to continue unless it's critical
      console.error('[SceneAPI] Polling error:', error)
      // For now, rethrow to stop polling on error
      throw error
    }
  }
  
  throw new Error('3D Generation timed out')
}
