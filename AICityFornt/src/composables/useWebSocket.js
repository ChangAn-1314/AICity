import { ref, onMounted, onUnmounted } from 'vue'
import websocketService from '@/services/websocket'

/**
 * Composable for WebSocket interaction
 * Provides reactive connection state and auto-cleanup subscriptions
 */
export function useWebSocket() {
  const isConnected = ref(websocketService.isConnected)
  const error = ref(null)
  
  // Store active subscriptions for cleanup
  const subscriptions = new Set()
  let statusCleanup = null

  // Update status when service status changes
  const handleStatusChange = (status) => {
    isConnected.value = status.connected
    if (!status.connected && status.reason) {
        // Only set error if it's an error disconnect, not manual
        if (status.reason !== 'manual') {
            error.value = status.reason
        }
    } else {
        error.value = null
    }
  }

  /**
   * Subscribe to a WebSocket event
   * @param {string} event 
   * @param {Function} callback 
   */
  const subscribe = (event, callback) => {
    websocketService.subscribe(event, callback)
    subscriptions.add({ event, callback })
  }

  /**
   * Unsubscribe from a WebSocket event
   * @param {string} event 
   * @param {Function} callback 
   */
  const unsubscribe = (event, callback) => {
    websocketService.unsubscribe(event, callback)
    // Remove from tracking
    for (const sub of subscriptions) {
      if (sub.event === event && sub.callback === callback) {
        subscriptions.delete(sub)
        break
      }
    }
  }
  
  /**
   * Emit an event
   * @param {string} event 
   * @param {any} data 
   */
  const emit = (event, data) => {
      websocketService.emit(event, data)
  }

  onMounted(() => {
    // Ensure connected (idempotent)
    if (!websocketService.isConnected) {
        websocketService.connect()
    }
    statusCleanup = websocketService.onStatusChange(handleStatusChange)
  })

  onUnmounted(() => {
    // Clean up status listener
    if (statusCleanup) statusCleanup()
    
    // Clean up all component subscriptions
    subscriptions.forEach(({ event, callback }) => {
      websocketService.unsubscribe(event, callback)
    })
    subscriptions.clear()
  })

  return {
    isConnected,
    error,
    subscribe,
    unsubscribe,
    emit
  }
}
