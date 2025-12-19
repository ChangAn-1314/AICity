import { describe, it, expect, vi, beforeEach } from 'vitest'
import { request } from '../client'

// Mock global fetch
global.fetch = vi.fn()

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('request makes a fetch call with correct params', async () => {
    const mockResponse = { success: true, data: 'test' }
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    const result = await request('/test-endpoint', { method: 'POST', body: JSON.stringify({ a: 1 }) })
    
    // Check if fetch was called with correct URL
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/test-endpoint'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: '{"a":1}'
      })
    )
    
    expect(result).toEqual(mockResponse)
  })

  it('request handles non-200 responses', async () => {
    fetch.mockResolvedValue({
      ok: false,
      statusText: 'Unauthorized'
    })

    await expect(request('/protected')).rejects.toThrow('API request failed: Unauthorized')
  })

  it('request handles network errors', async () => {
    fetch.mockRejectedValue(new Error('Network Error'))

    await expect(request('/test')).rejects.toThrow('Network Error')
  })
})
