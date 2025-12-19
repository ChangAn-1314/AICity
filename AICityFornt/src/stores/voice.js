import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVoiceStore = defineStore('voice', () => {
  // State
  const isListening = ref(false)
  const isSpeaking = ref(false)
  const transcript = ref('')
  const lastCommand = ref(null)
  const error = ref(null)

  // Mock WebSocket connection for future XunFei integration
  let ws = null
  
  // Actions
  function startListening() {
    if (isListening.value) return
    
    isListening.value = true
    transcript.value = ''
    error.value = null
    
    // TODO: Initialize XunFei WebSocket connection
    // mockWsConnection()
    
    console.log('[Voice] Started listening...')
    
    // Mock partial results
    setTimeout(() => {
      if (isListening.value) transcript.value = '切换到...'
    }, 1000)
    
    setTimeout(() => {
      if (isListening.value) transcript.value = '切换到信阳'
    }, 2000)
  }
  
  function stopListening() {
    if (!isListening.value) return
    
    isListening.value = false
    console.log('[Voice] Stopped listening. Final result:', transcript.value)
    
    // Mock command processing
    if (transcript.value) {
      lastCommand.value = {
        raw: transcript.value,
        timestamp: Date.now()
      }
    }
    
    // TODO: Close WebSocket
    if (ws) {
      ws.close()
      ws = null
    }
  }
  
  function speak(text) {
    if (!text || isSpeaking.value) return
    
    isSpeaking.value = true
    console.log('[Voice] Speaking:', text)
    
    // TODO: Call TTS API
    // Mock TTS duration based on text length
    const duration = Math.min(Math.max(text.length * 200, 1000), 5000)
    
    setTimeout(() => {
      isSpeaking.value = false
      console.log('[Voice] Finished speaking')
    }, duration)
  }
  
  function cancelSpeech() {
    if (isSpeaking.value) {
      isSpeaking.value = false
      // TODO: Cancel TTS audio
    }
  }
  
  function setTranscript(text) {
    transcript.value = text
  }

  function setCommand(command) {
    lastCommand.value = command
  }

  function setError(msg) {
    error.value = msg
  }
  
  return {
    isListening,
    isSpeaking,
    transcript,
    lastCommand,
    error,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
    setTranscript,
    setCommand,
    setError
  }
})
