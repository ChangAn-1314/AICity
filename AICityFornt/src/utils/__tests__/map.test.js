import { describe, it, expect } from 'vitest'
import { lngLatToCoords, calcDistance, isPointInBBox } from '../map'

describe('map.js', () => {
  describe('lngLatToCoords', () => {
    it('converts numbers', () => {
      expect(lngLatToCoords(114.1, 32.2)).toEqual([114.1, 32.2])
    })

    it('converts strings', () => {
      expect(lngLatToCoords('114.1', '32.2')).toEqual([114.1, 32.2])
    })
  })

  describe('calcDistance', () => {
    it('calculates distance between two points', () => {
      // 32.1477, 114.0913 (Xinyang) to 34.7466, 113.6253 (Zhengzhou) approx 300km
      const d = calcDistance(32.1477, 114.0913, 34.7466, 113.6253)
      expect(d).toBeGreaterThan(280)
      expect(d).toBeLessThan(320)
    })

    it('returns 0 for same point', () => {
      expect(calcDistance(10, 10, 10, 10)).toBe(0)
    })
  })

  describe('isPointInBBox', () => {
    const bbox = [100, 30, 120, 40] // minLng, minLat, maxLng, maxLat

    it('returns true for point inside', () => {
      expect(isPointInBBox([110, 35], bbox)).toBe(true)
    })

    it('returns true for point on boundary', () => {
      expect(isPointInBBox([100, 30], bbox)).toBe(true)
    })

    it('returns false for point outside', () => {
      expect(isPointInBBox([90, 35], bbox)).toBe(false)
      expect(isPointInBBox([110, 20], bbox)).toBe(false)
    })
  })
})
