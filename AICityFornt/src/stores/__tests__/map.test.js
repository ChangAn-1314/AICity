import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useMapStore } from '../map'

describe('Map Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default values', () => {
    const store = useMapStore()
    expect(store.currentCity).toBe('信阳')
    expect(store.viewMode).toBe('3D')
    expect(store.layers.boundary).toBe(true)
  })

  it('updates city', () => {
    const store = useMapStore()
    store.setCity('郑州')
    expect(store.currentCity).toBe('郑州')
  })

  it('toggles layers', () => {
    const store = useMapStore()
    expect(store.layers.heatmap).toBe(false)
    store.toggleLayer('heatmap')
    expect(store.layers.heatmap).toBe(true)
    store.toggleLayer('heatmap')
    expect(store.layers.heatmap).toBe(false)
  })

  it('updates camera state', () => {
    const store = useMapStore()
    store.updateCameraState({ zoom: 15 })
    expect(store.cameraState.zoom).toBe(15)
    // Check if other properties are preserved
    expect(store.cameraState.pitch).toBe(45)
  })
})
