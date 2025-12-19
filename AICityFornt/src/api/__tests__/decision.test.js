import { describe, it, expect, vi, beforeEach } from 'vitest'
import { decisionApi } from '../decision'
import { mockRequest } from '../client'

// Mock the client module
vi.mock('../client', () => ({
  mockRequest: vi.fn(),
  request: vi.fn()
}))

describe('Decision API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getOptions', () => {
    it('returns decision options successfully', async () => {
      const mockOptions = [
        { id: 'opt1', label: 'Option 1', risk: 'low' },
        { id: 'opt2', label: 'Option 2', risk: 'high' }
      ]
      mockRequest.mockResolvedValue(mockOptions)

      const result = await decisionApi.getOptions('hotspot-1')
      
      expect(mockRequest).toHaveBeenCalled()
      expect(result).toEqual(mockOptions)
      expect(result).toHaveLength(2)
    })
  })

  describe('simulate', () => {
    it('returns simulation result successfully', async () => {
      const mockResult = {
        hotspotId: 'hotspot-1',
        decisionId: 'opt1',
        result: {
          score: 85,
          impact: { traffic: '+10%' }
        }
      }
      mockRequest.mockResolvedValue(mockResult)

      const result = await decisionApi.simulate('hotspot-1', 'opt1')
      
      expect(mockRequest).toHaveBeenCalled()
      expect(result).toEqual(mockResult)
    })

    it('handles simulation errors', async () => {
      mockRequest.mockRejectedValue(new Error('Simulation Failed'))
      
      await expect(decisionApi.simulate('h1', 'd1')).rejects.toThrow('Simulation Failed')
    })
  })

  describe('customSimulate', () => {
    it('returns custom simulation result successfully', async () => {
      const mockResult = {
        hotspotId: 'hotspot-1',
        customDescription: 'custom plan',
        result: { score: 70 }
      }
      mockRequest.mockResolvedValue(mockResult)

      const result = await decisionApi.customSimulate('hotspot-1', 'custom plan')
      
      expect(mockRequest).toHaveBeenCalled()
      expect(result).toEqual(mockResult)
    })
  })
})
