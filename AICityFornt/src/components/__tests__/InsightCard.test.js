import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import InsightCard from '@/components/features/Analysis/InsightCard.vue'
import { useSentimentStore } from '@/stores/sentiment'

// Mock echarts
vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn()
  }))
}))

describe('InsightCard.vue', () => {
  let wrapper
  
  beforeEach(() => {
    wrapper = mount(InsightCard, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false
        })]
      }
    })
  })

  it('renders correctly with data', async () => {
    const store = useSentimentStore()
    store.hotspots = [
      { id: 1, title: 'Test Hotspot', level: 'high', category: 'traffic' },
      { id: 2, title: 'Medium Hotspot', level: 'medium', category: 'medical' }
    ]
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Test Hotspot')
    expect(wrapper.text()).toContain('traffic')
    expect(wrapper.text()).toContain('50%') // 1 high out of 2 = 50% negative ratio
  })

  it('shows empty state when no data', async () => {
    const store = useSentimentStore()
    store.hotspots = []
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('暂无分析数据')
  })
})
