import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSentimentStore } from '../sentiment'

// Mock websocket service
vi.mock('@/services/websocket', () => {
  return {
    default: {
      isConnected: false,
      connect: vi.fn(),
      subscribe: vi.fn(),
      onStatusChange: vi.fn(() => () => {}), // return cleanup fn
    }
  }
})

// Mock sentiment API
vi.mock('@/api/sentiment', () => ({
  sentimentApi: {
    getHotspots: vi.fn(),
    getAnalysis: vi.fn()
  }
}))

import { sentimentApi } from '@/api/sentiment'

describe('Sentiment Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetches hotspots and updates state', async () => {
    const store = useSentimentStore()
    expect(store.loading).toBe(false)
    
    // Mock API responses
    const mockHotspots = [{ id: 1, title: 'Test', level: 'high' }]
    const mockAnalysis = { hotspotId: 1, sentimentScore: 0.8 }
    
    sentimentApi.getHotspots.mockResolvedValue(mockHotspots)
    sentimentApi.getAnalysis.mockResolvedValue(mockAnalysis)
    
    const promise = store.fetchHotspots()
    
    expect(store.loading).toBe(true)
    
    await promise
    
    expect(store.loading).toBe(false)
    expect(store.hotspots.length).toBe(1)
    expect(store.analysisResult).toEqual(mockAnalysis)
  })

  it('selects a hotspot', () => {
    const store = useSentimentStore()
    const hotspot = { id: 1, title: 'Test' }
    store.selectHotspot(hotspot)
    expect(store.selectedHotspot).toEqual(hotspot)
  })

  it('filters hotspots', async () => {
    const store = useSentimentStore()
    
    // Setup data
    store.hotspots = [
      { id: 1, level: 'high', category: 'traffic' },
      { id: 2, level: 'low', category: 'traffic' },
      { id: 3, level: 'high', category: 'medical' }
    ]
    
    store.updateFilters({ level: 'high' })
    expect(store.filteredHotspots.length).toBe(2)
    
    store.updateFilters({ category: 'traffic' })
    expect(store.filteredHotspots.length).toBe(1)
    expect(store.filteredHotspots[0].id).toBe(1)
  })
  
  it('counts high priority hotspots', () => {
    const store = useSentimentStore()
    store.hotspots = [
      { id: 1, level: 'high' },
      { id: 2, level: 'low' },
      { id: 3, level: 'high' }
    ]
    expect(store.highPriorityCount).toBe(2)
  })

  it('handles errors during fetch', async () => {
    const store = useSentimentStore()
    
    sentimentApi.getHotspots.mockRejectedValue(new Error('Connection failed'))
    
    await store.fetchHotspots()
    
    expect(store.error).toBe('Connection failed')
    expect(store.loading).toBe(false)
  })
})
