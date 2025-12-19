<script setup>
import { ref, watch, onBeforeUnmount, nextTick } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { VideoCamera, RefreshRight, Close } from '@element-plus/icons-vue'
import { generate3D, pollTaskCompletion } from '@/api/scene'
import GlassPanel from '@/components/ui/GlassPanel.vue'
import NeonButton from '@/components/ui/NeonButton.vue'

const props = defineProps({
  hotspotId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: 'A detailed 3D scene of the incident area.'
  }
})

const status = ref('idle') // idle, generating, viewing, error
const progress = ref(0)
const errorMessage = ref('')
const containerRef = ref(null)

// Three.js instances
let renderer = null
let scene = null
let camera = null
let controls = null
let animationId = null
let model = null

const handleGenerate = async () => {
  status.value = 'generating'
  progress.value = 0
  errorMessage.value = ''
  
  try {
    const { taskId } = await generate3D(props.hotspotId, props.description)
    
    // Poll for completion
    const result = await pollTaskCompletion(taskId, {
      interval: 1000,
      onProgress: (data) => {
        progress.value = data.progress
      }
    })
    
    status.value = 'viewing'
    nextTick(() => {
      initThreeJS(result.modelUrl)
    })
    
  } catch (error) {
    console.error('Scene generation failed:', error)
    status.value = 'error'
    errorMessage.value = error.message || '生成失败，请稍后重试'
  }
}

const initThreeJS = (modelUrl) => {
  if (!containerRef.value) return
  
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  
  // Scene
  scene = new THREE.Scene()
  scene.background = null // Transparent to show glass panel bg or use specific color
  // Actually usually 3D viewer looks better with dark bg. Let's make it semi-transparent black.
  // Or just clear color.
  
  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 1.5, 4)
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  containerRef.value.appendChild(renderer.domElement)
  
  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.autoRotate = true
  controls.autoRotateSpeed = 2.0
  
  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  
  const dirLight = new THREE.DirectionalLight(0xffffff, 1)
  dirLight.position.set(5, 10, 7.5)
  scene.add(dirLight)
  
  const backLight = new THREE.DirectionalLight(0x00ffff, 0.5)
  backLight.position.set(-5, 0, -5)
  scene.add(backLight)
  
  // Grid
  const gridHelper = new THREE.GridHelper(10, 10, 0x00ffff, 0x333333)
  scene.add(gridHelper)
  
  // Load Model
  const loader = new GLTFLoader()
  loader.load(modelUrl, (gltf) => {
    model = gltf.scene
    
    // Center and scale model
    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    
    const maxDim = Math.max(size.x, size.y, size.z)
    const targetSize = 2.5 // Target size in scene units
    const scale = targetSize / maxDim
    model.scale.setScalar(scale)
    
    model.position.sub(center.multiplyScalar(scale))
    model.position.y += (size.y * scale) / 2 // Sit on grid
    
    scene.add(model)
    
  }, (xhr) => {
    // console.log((xhr.loaded / xhr.total * 100) + '% loaded')
  }, (error) => {
    console.error('Error loading model:', error)
    // Could show a toast here, but just logging for now as we have a mock model
  })
  
  // Animation Loop
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    if (controls) controls.update()
    if (renderer && scene && camera) renderer.render(scene, camera)
  }
  animate()
  
  // Resize Handler
  window.addEventListener('resize', handleResize)
}

const handleResize = () => {
  if (!containerRef.value || !camera || !renderer) return
  
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

const cleanupThreeJS = () => {
  window.removeEventListener('resize', handleResize)
  if (animationId) cancelAnimationFrame(animationId)
  
  if (renderer) {
    renderer.dispose()
    if (containerRef.value && renderer.domElement) {
      containerRef.value.removeChild(renderer.domElement)
    }
  }
  
  if (scene) {
    scene.clear()
  }
  
  renderer = null
  scene = null
  camera = null
  controls = null
  model = null
}

const closeViewer = () => {
  cleanupThreeJS()
  status.value = 'idle'
}

onBeforeUnmount(() => {
  cleanupThreeJS()
})

watch(() => props.hotspotId, () => {
  // Reset if hotspot changes
  closeViewer()
})
</script>

<template>
  <GlassPanel className="h-full flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden transition-all duration-500">
    <!-- Idle State -->
    <div v-if="status === 'idle'" class="text-center space-y-4 z-10 p-6">
      <div class="text-cyan-400 text-lg font-bold mb-2">现场还原</div>
      <p class="text-gray-400 text-sm mb-6 max-w-xs">
        利用 Tripo AI 技术生成现场 3D 全息影像，辅助决策研判。
      </p>
      <NeonButton variant="primary" @click="handleGenerate">
        <div class="flex items-center">
          <el-icon class="mr-2"><VideoCamera /></el-icon>
          <span>开始还原</span>
        </div>
      </NeonButton>
    </div>

    <!-- Generating State -->
    <div v-else-if="status === 'generating'" class="w-full max-w-xs space-y-6 z-10 text-center p-6">
      <div class="text-cyan-400 text-lg font-bold animate-pulse">正在生成全息影像...</div>
      
      <div class="w-full">
        <el-progress 
          :percentage="progress" 
          :status="progress === 100 ? 'success' : ''"
          :stroke-width="15"
          striped
          striped-flow
          :text-inside="true"
        />
      </div>
      
      <div class="text-xs text-gray-400 flex flex-col gap-2">
        <span>正在连接 Tripo AI 算力集群...</span>
        <span>解析场景数据并构建 3D 模型...</span>
      </div>
    </div>

    <!-- Viewing State -->
    <div v-else-if="status === 'viewing'" class="absolute inset-0 z-0 bg-gradient-to-b from-black/20 to-cyan-900/10">
      <div ref="containerRef" class="w-full h-full cursor-move"></div>
      
      <!-- Controls Overlay -->
      <div class="absolute bottom-4 right-4 z-10 flex gap-2">
         <NeonButton variant="primary" class="text-xs py-1 px-3" @click="() => controls?.reset()">
            <el-icon class="mr-1"><RefreshRight /></el-icon> 复位
         </NeonButton>
         <NeonButton variant="alert" class="text-xs py-1 px-3" @click="closeViewer">
            <el-icon class="mr-1"><Close /></el-icon> 关闭
         </NeonButton>
      </div>
      
      <!-- HUD Overlay -->
      <div class="absolute top-4 left-4 z-10 pointer-events-none">
        <div class="text-xs text-cyan-500 font-mono bg-black/40 p-2 rounded border border-cyan-500/30 backdrop-blur-sm">
          <div>TARGET: {{ hotspotId }}</div>
          <div>STATUS: ONLINE</div>
          <div>MODE: HOLOGRAPHIC</div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="status === 'error'" class="text-center space-y-4 z-10 p-6">
       <div class="text-red-400 text-lg font-bold">生成失败</div>
       <p class="text-gray-400 text-sm max-w-xs">{{ errorMessage }}</p>
       <div class="flex gap-4 justify-center mt-4">
         <NeonButton variant="primary" @click="handleGenerate">
           <div class="flex items-center"><el-icon class="mr-1"><RefreshRight /></el-icon> 重试</div>
         </NeonButton>
         <NeonButton variant="alert" @click="closeViewer">
           <div class="flex items-center"><el-icon class="mr-1"><Close /></el-icon> 取消</div>
         </NeonButton>
       </div>
    </div>
  </GlassPanel>
</template>
