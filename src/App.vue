<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ParticleBackground from '@/components/ParticleBackground.vue'

const bgImage = ref('')
const particleVisible = ref(false)

onMounted(() => {
  bgImage.value = localStorage.getItem('bgImage') || ''
  particleVisible.value = localStorage.getItem('bgParticle') === 'true'
})
</script>

<template>
  <ParticleBackground :image-src="bgImage" :visible="particleVisible" />
  <router-view />
</template>
