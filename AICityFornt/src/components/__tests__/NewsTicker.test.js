import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import NewsTicker from '@/components/features/Monitor/NewsTicker.vue'
import { useSentimentStore } from '@/stores/sentiment'

describe('NewsTicker.vue', () => {
  let wrapper
  
  beforeEach(() => {
    wrapper = mount(NewsTicker, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false
        })]
      }
    })
  })

  it('renders items from store', async () => {
    const store = useSentimentStore()
    store.hotspots = [
      { id: 1, title: 'Event 1', category: 'Cat1', level: 'high', time: Date.now() },
      { id: 2, title: 'Event 2', category: 'Cat2', level: 'low', time: Date.now() - 1000 }
    ]
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Cat1: Event 1')
    expect(wrapper.text()).toContain('Cat2: Event 2')
    expect(wrapper.findAll('.group').length).toBe(2)
  })

  it('emits item-click event when clicked', async () => {
    const store = useSentimentStore()
    const hotspot = { id: 1, title: 'Event 1', category: 'Cat1', level: 'high' }
    store.hotspots = [hotspot]
    
    await wrapper.vm.$nextTick()
    
    const item = wrapper.find('.group')
    await item.trigger('click')
    
    expect(wrapper.emitted('item-click')).toBeTruthy()
    expect(wrapper.emitted('item-click')[0]).toEqual([hotspot])
    expect(store.selectHotspot).toHaveBeenCalledWith(hotspot)
  })
  
  it('shows empty state', async () => {
    const store = useSentimentStore()
    store.hotspots = []
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('暂无实时舆情')
  })
})
