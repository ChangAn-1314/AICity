import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSentimentStore } from '../../stores/sentiment'
import { mockRequest } from '../../api/client'

// Mock the client module - this is the "external HTTP" layer
vi.mock('../../api/client', () => ({
  mockRequest: vi.fn(),
  request: vi.fn()
}))

// Mock websocket service to avoid connection errors
vi.mock('@/services/websocket', () => ({
  default: {
    isConnected: false,
    connect: vi.fn(),
    subscribe: vi.fn(),
    onStatusChange: vi.fn(() => () => {}),
  }
}))

describe('Store-API Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetchHotspots calls API and updates state correctly', async () => {
    const store = useSentimentStore()
    
    // Define mock data for API responses
    const mockHotspots = [
      { id: 1, title: 'Traffic Jam', level: 'high' },
      { id: 2, title: 'Noise', level: 'low' }
    ]
    
    const mockAnalysis = {
      hotspotId: 1,
      sentimentScore: 0.9,
      keywords: [{ name: 'congestion', value: 100 }]
    }

    // Setup API mocks
    // getHotspots calls mockRequest
    mockRequest.mockResolvedValueOnce(mockHotspots)
    // getAnalysis calls mockRequest
    mockRequest.mockResolvedValueOnce(mockAnalysis)

    // Execute action
    await store.fetchHotspots()

    // Verify API was called (via client mock)
    expect(mockRequest).toHaveBeenCalledTimes(2)
    
    // Verify state updates
    expect(store.hotspots).toEqual(mockHotspots)
    expect(store.analysisResult).toEqual(mockAnalysis)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('handles API errors gracefully', async () => {
    const store = useSentimentStore()
    
    // Mock API error
    const errorMsg = 'API Error'
    mockRequest.mockRejectedValueOnce(new Error(errorMsg))

    // Execute action
    await store.fetchHotspots()

    // Verify error state
    expect(store.error).toBe(errorMsg)
    expect(store.loading).toBe(false)
    expect(store.hotspots).toEqual([])
  })
})
