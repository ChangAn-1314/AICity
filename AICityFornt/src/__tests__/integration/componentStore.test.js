import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useSentimentStore } from '../../stores/sentiment'
import InsightCard from '../../components/features/Analysis/InsightCard.vue'
import NewsTicker from '../../components/features/Monitor/NewsTicker.vue'

// Mock echarts
vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn()
  }))
}))

// Mock sentiment API (to avoid real calls in store)
vi.mock('../../api/sentiment', () => ({
  sentimentApi: {
    getHotspots: vi.fn().mockResolvedValue([]),
    getAnalysis: vi.fn().mockResolvedValue(null)
  }
}))

// Mock websocket
vi.mock('@/services/websocket', () => ({
  default: {
    isConnected: false,
    connect: vi.fn(),
    subscribe: vi.fn(),
    onStatusChange: vi.fn(() => () => {})
  }
}))

describe('Component-Store Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('InsightCard Integration', () => {
    it('displays sentiment analysis from store', async () => {
      const store = useSentimentStore()
      // Setup store state directly
      store.hotspots = [
        { id: 1, level: 'high', category: 'traffic' },
        { id: 2, level: 'low', category: 'health' },
        { id: 3, level: 'high', category: 'traffic' }
      ]
      
      const wrapper = mount(InsightCard)
      
      // Wait for computed properties to update
      await wrapper.vm.$nextTick()
      
      // Check if stats are calculated correctly from store data
      // highCount = 2, total = 3. negativeRatio = round(2/3*100) = 67
      expect(wrapper.text()).toContain('67%') // Negative ratio
      expect(wrapper.text()).toContain('33%') // Positive (remainder)
    })

    it('updates chart when store data changes', async () => {
      const store = useSentimentStore()
      store.hotspots = []
      
      const wrapper = mount(InsightCard)
      
      // Update store
      store.hotspots = [{ id: 1, level: 'high', category: 'traffic' }]
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('100%') // Negative ratio (1/1)
    })
  })

  describe('NewsTicker Integration', () => {
    it('displays hotspots from store', async () => {
      const store = useSentimentStore()
      store.hotspots = [
        { id: 1, title: 'News 1', level: 'high', time: Date.now(), category: 'Test' }
      ]
      
      const wrapper = mount(NewsTicker)
      
      expect(wrapper.text()).toContain('Test: News 1')
      expect(wrapper.find('.text-pink-400').exists()).toBe(true) // High level class
    })

    it('updates store selectedHotspot on item click', async () => {
      const store = useSentimentStore()
      const hotspot = { id: 123, title: 'News Click', level: 'medium', time: Date.now() }
      store.hotspots = [hotspot]
      
      const wrapper = mount(NewsTicker)
      
      // Click the item
      await wrapper.find('.group').trigger('click')
      
      // Verify store state updated
      expect(store.selectedHotspot).toEqual(hotspot)
      // Verify event emitted
      expect(wrapper.emitted('item-click')).toBeTruthy()
      expect(wrapper.emitted('item-click')[0][0]).toEqual(hotspot)
    })
  })
})
