import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import NeonButton from '@/components/ui/NeonButton.vue'

describe('NeonButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(NeonButton, {
      slots: {
        default: 'Click Me'
      }
    })
    expect(wrapper.text()).toContain('Click Me')
  })

  it('applies primary variant class by default', () => {
    const wrapper = mount(NeonButton)
    expect(wrapper.classes()).toContain('text-cyan-300')
  })
})
