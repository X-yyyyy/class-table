<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
  color: string
  size: number
  phase: number
}

const props = defineProps<{
  imageSrc: string
  visible: boolean
}>()

const canvasRef = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let rafId = 0
let mouseX = -10000
let mouseY = -10000
let time = 0

function initParticles() {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const oc = document.createElement('canvas')
    const w = Math.min(img.width, canvas.width)
    const h = Math.min(img.height, canvas.height)
    oc.width = w
    oc.height = h
    const octx = oc.getContext('2d')!
    octx.drawImage(img, 0, 0, w, h)
    const imageData = octx.getImageData(0, 0, w, h).data

    const gap = Math.max(2, Math.round(Math.max(w, h) / 120))
    const newParticles: Particle[] = []

    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        const idx = (y * w + x) * 4
        const r = imageData[idx]
        const g = imageData[idx + 1]
        const b = imageData[idx + 2]
        const a = imageData[idx + 3]
        if (a < 128) continue

        const sx = (x / w) * canvas.width
        const sy = (y / h) * canvas.height
        newParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          targetX: sx,
          targetY: sy,
          color: `rgb(${r},${g},${b})`,
          size: Math.max(1.5, 3 - gap * 0.02),
          phase: Math.random() * Math.PI * 2,
        })
      }
    }
    particles = newParticles
  }
  img.src = props.imageSrc
}

function animate() {
  if (!ctx || !canvasRef.value) return
  const canvas = canvasRef.value
  time += 0.008

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const mRadius = 80
  const mForce = 6

  for (const p of particles) {
    let dx = (p.targetX - p.x) * 0.018
    let dy = (p.targetY - p.y) * 0.018

    dx += Math.sin(time + p.phase) * 0.3
    dy += Math.cos(time + p.phase * 1.3) * 0.3

    const mx = p.x - mouseX
    const my = p.y - mouseY
    const dist = Math.sqrt(mx * mx + my * my)
    if (dist < mRadius && dist > 0) {
      const force = (mRadius - dist) / mRadius * mForce
      dx += (mx / dist) * force
      dy += (my / dist) * force
    }

    p.x += dx
    p.y += dy

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.fill()
  }

  rafId = requestAnimationFrame(animate)
}

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
}

function onResize() {
  if (!canvasRef.value) return
  canvasRef.value.width = window.innerWidth
  canvasRef.value.height = window.innerHeight
  initParticles()
}

function start() {
  if (!canvasRef.value) return
  ctx = canvasRef.value.getContext('2d')
  if (!ctx) return
  initParticles()
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)
  rafId = requestAnimationFrame(animate)
}

function stop() {
  cancelAnimationFrame(rafId)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('resize', onResize)
  particles = []
}

watch(() => props.visible, (val) => {
  if (val) start()
  else stop()
})

watch(() => props.imageSrc, () => {
  if (props.visible) {
    stop()
    start()
  }
})

onMounted(() => {
  if (props.visible) start()
})

onUnmounted(() => {
  stop()
})
</script>

<template>
  <canvas ref="canvasRef" class="particle-canvas" />
</template>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9998;
}
</style>
