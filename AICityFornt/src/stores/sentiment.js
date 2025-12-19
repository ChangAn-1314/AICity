import { defineStore } from 'pinia'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import websocketService from '@/services/websocket'
import { sentimentApi } from '@/api/sentiment'

export const useSentimentStore = defineStore('sentiment', () => {
  // State
  const hotspots = ref([])
  const selectedHotspot = ref(null)
  const filters = ref({
    level: 'all', // all, high, medium, low
    category: 'all',
    timeRange: '24h'
  })
  const analysisResult = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const isConnected = ref(false)

  // Getters
  const filteredHotspots = computed(() => {
    return hotspots.value.filter(hotspot => {
      const matchLevel = filters.value.level === 'all' || hotspot.level === filters.value.level
      const matchCategory = filters.value.category === 'all' || hotspot.category === filters.value.category
      // TODO: Implement time range filtering logic
      return matchLevel && matchCategory
    })
  })

  const highPriorityCount = computed(() => {
    return hotspots.value.filter(h => h.level === 'high').length
  })

  // WebSocket Integration
  const handleHotspotUpdate = (data) => {
    console.log('[SentimentStore] Received hotspot update:', data)
    
    // Normalize data if it's a single object or array
    const updates = Array.isArray(data) ? data : [data]
    
    updates.forEach(newHotspot => {
      const index = hotspots.value.findIndex(h => h.id === newHotspot.id)
      if (index !== -1) {
        // Update existing
        hotspots.value[index] = { ...hotspots.value[index], ...newHotspot }
        // If currently selected, update selection too
        if (selectedHotspot.value && selectedHotspot.value.id === newHotspot.id) {
          selectedHotspot.value = hotspots.value[index]
        }
      } else {
        // Add new (at the beginning)
        hotspots.value.unshift(newHotspot)
      }
    })
  }

  // Actions
  async function fetchHotspots() {
    loading.value = true
    error.value = null
    try {
      // Ensure WebSocket is connected
      if (!websocketService.isConnected) {
        websocketService.connect()
      }

      // Listen for updates
      websocketService.subscribe('hotspot_update', handleHotspotUpdate)
      
      // Watch connection status
      const cleanupStatus = websocketService.onStatusChange((status) => {
        isConnected.value = status.connected
      })

      // Call API to get hotspots
      const data = await sentimentApi.getHotspots()
      hotspots.value = data
      
      // If we have hotspots, get analysis for the first one or general analysis
      if (data.length > 0) {
         // For now, we mock a general analysis or fetch specifically
         // In a real app, we might have a separate getGeneralAnalysis endpoint
         // or just get analysis for the first item
         const analysis = await sentimentApi.getAnalysis(data[0].id)
         analysisResult.value = analysis
      }
      
    } catch (e) {
      console.error('Failed to fetch hotspots:', e)
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function selectHotspot(hotspot) {
    selectedHotspot.value = hotspot
  }

  function updateFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function setAnalysisResult(result) {
    analysisResult.value = result
  }

  return {
    hotspots,
    selectedHotspot,
    filters,
    analysisResult,
    loading,
    error,
    isConnected,
    filteredHotspots,
    highPriorityCount,
    fetchHotspots,
    selectHotspot,
    updateFilters,
    setAnalysisResult
  }
}, {
  persist: true
})
