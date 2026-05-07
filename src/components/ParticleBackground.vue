<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  imageUrl: string
  enabled: boolean
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId = 0
let particlesArray: Particle[] = []

const mouse = {
  x: -1000,
  y: -1000,
  radius: 80,
}

function handleMouseMove(event: MouseEvent) {
  mouse.x = event.clientX
  mouse.y = event.clientY
}

function handleMouseLeave() {
  mouse.x = -1000
  mouse.y = -1000
}

class Particle {
  x: number
  y: number
  originX: number
  originY: number
  color: string
  size: number
  vx: number
  vy: number
  friction: number
  ease: number

  constructor(x: number, y: number, color: string) {
    this.x = window.innerWidth / 2 + (Math.random() - 0.5) * 500
    this.y = window.innerHeight / 2 + (Math.random() - 0.5) * 500
    this.originX = x
    this.originY = y
    this.color = color
    this.size = Math.random() * 1.5 + 1
    this.vx = 0
    this.vy = 0
    this.friction = 0.88 + Math.random() * 0.05
    this.ease = 0.05 + Math.random() * 0.05
  }

  update() {
    const dxMouse = mouse.x - this.x
    const dyMouse = mouse.y - this.y
    const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

    if (distanceMouse < mouse.radius && distanceMouse > 0) {
      const forceDirectionX = dxMouse / distanceMouse
      const forceDirectionY = dyMouse / distanceMouse
      const force = (mouse.radius - distanceMouse) / mouse.radius
      this.vx += forceDirectionX * force * -5
      this.vy += forceDirectionY * force * -5
    }

    const dxOrigin = this.originX - this.x
    const dyOrigin = this.originY - this.y
    this.vx += dxOrigin * this.ease
    this.vy += dyOrigin * this.ease
    this.vx *= this.friction
    this.vy *= this.friction
    this.x += this.vx
    this.y += this.vy
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.size, this.size)
  }
}

function clearCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx?.clearRect(0, 0, canvas.width, canvas.height)
}

function initParticles() {
  const canvas = canvasRef.value
  if (!canvas || !props.enabled || !props.imageUrl) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const source = props.imageUrl
  const img = new Image()
  img.onload = () => {
    if (!props.enabled || props.imageUrl !== source) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const offCanvas = document.createElement('canvas')
    const offCtx = offCanvas.getContext('2d')!

    const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
    const w = img.width * scale
    const h = img.height * scale
    const dx = (canvas.width - w) / 2
    const dy = (canvas.height - h) / 2

    offCanvas.width = canvas.width
    offCanvas.height = canvas.height
    offCtx.drawImage(img, dx, dy, w, h)

    const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height).data
    const nextParticles: Particle[] = []
    const step = 9

    for (let y = 0; y < offCanvas.height; y += step) {
      for (let x = 0; x < offCanvas.width; x += step) {
        const index = (y * offCanvas.width + x) * 4
        const alpha = imageData[index + 3]

        if (alpha > 128) {
          const r = imageData[index]
          const g = imageData[index + 1]
          const b = imageData[index + 2]
          nextParticles.push(new Particle(x, y, `rgb(${r},${g},${b})`))
        }
      }
    }

    particlesArray = nextParticles
    cancelAnimationFrame(animationId)
    animate()
  }
  img.src = source
}

function animate() {
  const canvas = canvasRef.value
  if (!canvas || !props.enabled) return

  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const particle of particlesArray) {
    particle.update()
    particle.draw(ctx)
  }

  animationId = requestAnimationFrame(animate)
}

watch(() => [props.imageUrl, props.enabled], () => {
  cancelAnimationFrame(animationId)
  if (props.enabled) {
    initParticles()
  } else {
    clearCanvas()
    particlesArray = []
  }
})

function handleResize() {
  if (props.enabled) initParticles()
}

onMounted(() => {
  if (props.enabled) initParticles()
  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseout', handleMouseLeave)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseout', handleMouseLeave)
})
</script>

<template>
  <canvas ref="canvasRef" class="particle-canvas"></canvas>
</template>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
}
</style>
