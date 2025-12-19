import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useSentimentStore } from '@/stores/sentiment'

// Global state for focus mode
const isFocusMode = ref(false)

export function useFocusMode() {
  const sentimentStore = useSentimentStore()

  // Enter focus mode when a hotspot is selected
  watch(() => sentimentStore.selectedHotspot, (newVal) => {
    if (newVal) {
      isFocusMode.value = true
    } else {
      isFocusMode.value = false
    }
  })

  // Exit focus mode manually
  const exitFocusMode = () => {
    sentimentStore.selectHotspot(null)
    isFocusMode.value = false
  }

  // Handle Escape key to exit
  const handleKeydown = (e) => {
    if (e.key === 'Escape' && isFocusMode.value) {
      exitFocusMode()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    isFocusMode,
    exitFocusMode
  }
}
