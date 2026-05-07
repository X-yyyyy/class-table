<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ParticleBackground from '@/components/ParticleBackground.vue'

const bgImage = ref('')
const bgParticleEnabled = ref(false)

function loadSettings() {
  bgImage.value = localStorage.getItem('bgImage') || ''
  bgParticleEnabled.value = localStorage.getItem('bgParticle') === 'true' && !!bgImage.value
}

onMounted(() => {
  loadSettings()
  window.addEventListener('settings-updated', loadSettings)
})

onUnmounted(() => {
  window.removeEventListener('settings-updated', loadSettings)
})
</script>

<template>
  <router-view />
  <ParticleBackground :image-url="bgImage" :enabled="bgParticleEnabled" />
</template>
