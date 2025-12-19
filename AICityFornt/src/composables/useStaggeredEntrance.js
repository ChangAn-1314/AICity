import { ref, onMounted } from 'vue'

/**
 * Composable for staggered entrance animations
 * @param {Object} options Configuration options
 * @param {number} options.baseDelay Base delay in ms (default: 100)
 * @param {number} options.stepDelay Delay between steps in ms (default: 100)
 * @returns {Object} { isReady, getStaggerClass, getStaggerStyle }
 */
export function useStaggeredEntrance(options = {}) {
  const { baseDelay = 100, stepDelay = 100 } = options
  const isReady = ref(false)

  onMounted(() => {
    // Allow initial render then trigger animation
    requestAnimationFrame(() => {
      setTimeout(() => {
        isReady.value = true
      }, 50)
    })
  })

  // Helper to get style with delay variable
  const getStaggerStyle = (index) => {
    return {
      '--stagger-delay': `${baseDelay + index * stepDelay}ms`
    }
  }

  return {
    isReady,
    getStaggerStyle
  }
}
