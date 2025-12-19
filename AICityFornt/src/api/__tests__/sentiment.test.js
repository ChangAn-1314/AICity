import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sentimentApi } from '../sentiment'
import { mockRequest } from '../client'

// Mock the client module
vi.mock('../client', () => ({
  mockRequest: vi.fn(),
  request: vi.fn()
}))

describe('Sentiment API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getHotspots', () => {
    it('returns hotspots list successfully', async () => {
      const mockData = [
        { id: 1, title: 'Hotspot 1', level: 'high' },
        { id: 2, title: 'Hotspot 2', level: 'low' }
      ]
      mockRequest.mockResolvedValue(mockData)

      const result = await sentimentApi.getHotspots()
      
      expect(mockRequest).toHaveBeenCalled()
      expect(result).toEqual(mockData)
      expect(result).toHaveLength(2)
    })

    it('handles API errors', async () => {
      const error = new Error('Network Error')
      mockRequest.mockRejectedValue(error)
      
      await expect(sentimentApi.getHotspots()).rejects.toThrow('Network Error')
    })
  })

  describe('getHotspotDetail', () => {
    it('returns hotspot details successfully', async () => {
      const mockDetail = {
        id: 1,
        title: 'Detail Title',
        content: 'Content'
      }
      mockRequest.mockResolvedValue(mockDetail)

      const result = await sentimentApi.getHotspotDetail(1)
      
      expect(mockRequest).toHaveBeenCalled()
      expect(result).toEqual(mockDetail)
      expect(result.id).toBe(1)
    })
  })

  describe('getAnalysis', () => {
    it('returns analysis data successfully', async () => {
      const mockAnalysis = {
        hotspotId: 1,
        sentimentScore: 0.85,
        keywords: [{ name: 'test', value: 10 }]
      }
      mockRequest.mockResolvedValue(mockAnalysis)

      const result = await sentimentApi.getAnalysis(1)
      
      expect(mockRequest).toHaveBeenCalled()
      expect(result).toEqual(mockAnalysis)
      expect(result.hotspotId).toBe(1)
    })
  })
})
