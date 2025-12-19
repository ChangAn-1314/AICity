import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia

// 导出所有 store
export * from './sentiment'
export * from './map'
export * from './voice'
export * from './scene'
export * from './auth'
