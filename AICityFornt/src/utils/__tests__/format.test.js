import { describe, it, expect } from 'vitest'
import { formatDate, formatNumber, formatLevel, getLevelColor } from '../format'

describe('format.js', () => {
  describe('formatDate', () => {
    it('formats date object', () => {
      const date = new Date('2023-01-01T12:30:45')
      expect(formatDate(date)).toBe('2023-01-01 12:30:45')
    })

    it('formats timestamp', () => {
      const date = new Date('2023-01-01T12:30:45')
      expect(formatDate(date.getTime())).toBe('2023-01-01 12:30:45')
    })

    it('supports custom format', () => {
      const date = new Date('2023-01-01T12:30:45')
      expect(formatDate(date, 'YYYY/MM/DD')).toBe('2023/01/01')
    })

    it('returns empty string for invalid date', () => {
      expect(formatDate('invalid')).toBe('')
      expect(formatDate(null)).toBe('')
      expect(formatDate(undefined)).toBe('')
    })
  })

  describe('formatNumber', () => {
    it('formats integer', () => {
      expect(formatNumber(1234)).toBe('1,234')
    })

    it('formats decimal', () => {
      expect(formatNumber(1234.5678, 2)).toBe('1,234.57')
    })

    it('handles string input', () => {
      expect(formatNumber('1234')).toBe('1,234')
    })

    it('returns "0" for invalid input', () => {
      expect(formatNumber(null)).toBe('0')
      expect(formatNumber(undefined)).toBe('0')
      expect(formatNumber(NaN)).toBe('0')
      expect(formatNumber('abc')).toBe('0')
    })
  })

  describe('formatLevel', () => {
    it('maps known levels', () => {
      expect(formatLevel('high')).toBe('高风险')
      expect(formatLevel('MEDIUM')).toBe('中风险')
      expect(formatLevel('Low')).toBe('低风险')
    })

    it('returns original if unknown', () => {
      expect(formatLevel('unknown')).toBe('unknown')
    })

    it('returns default for null/undefined', () => {
      expect(formatLevel(null)).toBe('未知')
      expect(formatLevel(undefined)).toBe('未知')
    })
  })

  describe('getLevelColor', () => {
    it('returns color for known levels', () => {
      expect(getLevelColor('high')).toBe('#ef4444')
      expect(getLevelColor('medium')).toBe('#f97316')
    })

    it('returns default color for unknown', () => {
      expect(getLevelColor('unknown')).toBe('#94a3b8')
      expect(getLevelColor(null)).toBe('#94a3b8')
    })
  })
})
