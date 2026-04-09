import { ref } from 'vue'

export const useDemoMode = () => {
  const isDemoPlaying = ref(false)
  const demoProgress = ref(0)
  
  let demoTimer: number | null = null
  let mapInstance: any = null
  let mapStore: any = null

  const initDemo = (map: any, store: any) => {
    mapInstance = map
    mapStore = store
  }

  const playDemo = async () => {
    if (!mapInstance || isDemoPlaying.value) return
    
    isDemoPlaying.value = true
    demoProgress.value = 0

    try {
      await executeScene3Demo()
    } finally {
      isDemoPlaying.value = false
      demoProgress.value = 0
    }
  }

  const executeScene3Demo = async () => {
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    demoProgress.value = 10
    await sleep(500)

    demoProgress.value = 20
    mapInstance.setZoomAndCenter(4, [113.5, 34.5], false)
    mapInstance.setPitch(0)
    await sleep(2000)

    demoProgress.value = 40
    mapInstance.setZoomAndCenter(14, [114.0859, 32.1270], true, 2000)
    await sleep(2500)

    demoProgress.value = 60
    mapInstance.setPitch(70, true, 1000)
    await sleep(1500)

    demoProgress.value = 80
    if (mapStore) {
      mapStore.triggerHotspotAnimation?.()
    }
    await sleep(2000)

    demoProgress.value = 90
    if (mapStore) {
      mapStore.showSidePanel = true
    }
    await sleep(2000)

    demoProgress.value = 100
    await sleep(3000)
  }

  const stopDemo = () => {
    if (demoTimer) {
      clearTimeout(demoTimer)
      demoTimer = null
    }
    isDemoPlaying.value = false
    demoProgress.value = 0
  }

  return {
    isDemoPlaying,
    demoProgress,
    initDemo,
    playDemo,
    stopDemo,
  }
}
