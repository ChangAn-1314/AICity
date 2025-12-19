const BASE_URL = '/api/v1'

/**
 * 后端统一错误响应格式
 * @typedef {Object} ErrorResponse
 * @property {string} detail - 错误描述
 * @property {string} code - 错误代码
 * @property {string} timestamp - 时间戳
 * @property {string} path - 请求路径
 * @property {string} request_id - 请求追踪 ID
 */

/**
 * API 错误类，包含后端错误详情
 */
export class ApiError extends Error {
  constructor(status, data, url) {
    super(data?.detail || `API request failed: ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.code = data?.code || 'UNKNOWN_ERROR'
    this.detail = data?.detail || ''
    this.timestamp = data?.timestamp || new Date().toISOString()
    this.path = data?.path || url
    this.requestId = data?.request_id || ''
  }

  /** 是否为认证错误 */
  isAuthError() {
    return this.status === 401 || this.code === 'AUTH_FAILED'
  }

  /** 是否为权限错误 */
  isForbidden() {
    return this.status === 403 || this.code === 'FORBIDDEN'
  }

  /** 是否为资源不存在 */
  isNotFound() {
    return this.status === 404 || this.code === 'NOT_FOUND'
  }

  /** 是否为验证错误 */
  isValidationError() {
    return this.status === 422
  }

  /** 是否为服务不可用 */
  isServiceUnavailable() {
    return this.status === 503 || this.code === 'SERVICE_UNAVAILABLE'
  }

  /** 是否为速率限制 */
  isRateLimited() {
    return this.status === 429
  }
}

/**
 * 获取存储的 JWT Token
 */
function getAuthToken() {
  return localStorage.getItem('access_token')
}

/**
 * 统一请求函数
 */
export async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const token = getAuthToken()
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      let errorData = null
      try {
        errorData = await response.json()
      } catch {
        errorData = { detail: response.statusText }
      }
      
      const apiError = new ApiError(response.status, errorData, endpoint)
      
      // 认证错误：清除 token 并可触发重新登录
      if (apiError.isAuthError()) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.dispatchEvent(new CustomEvent('auth:expired'))
      }
      
      throw apiError
    }
    
    // 204 No Content
    if (response.status === 204) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      console.warn(`[API ${error.status}] ${error.code}: ${error.detail}`)
      throw error
    }
    // 网络错误等
    console.error('[API Network Error]', error)
    throw new ApiError(0, { detail: error.message, code: 'NETWORK_ERROR' }, endpoint)
  }
}

// Mock helper for development
export function mockRequest(data, delay = 500) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}
