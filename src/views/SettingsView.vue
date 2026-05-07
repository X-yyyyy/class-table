<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SemesterConfig from '@/components/SemesterConfig.vue'
import TimeSlotEditor from '@/components/TimeSlotEditor.vue'
import { useAuthStore } from '@/stores/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()
const darkMode = ref(false)
const backgroundImage = ref('')
const particleEnabled = ref(false)

function applyDarkMode(enabled: boolean) {
  document.documentElement.classList.toggle('dark', enabled)
  darkMode.value = enabled
}

async function toggleDarkMode(val: boolean) {
  applyDarkMode(val)
  if (authStore.user) {
    try {
      const ref = doc(db, 'users', authStore.user.uid)
      await setDoc(ref, { settings: { darkMode: val } }, { merge: true })
    } catch {
      ElMessage.error('保存失败')
    }
  }
}

function applyBackground(url: string) {
  if (url) {
    document.documentElement.style.setProperty('--custom-bg', `url(${JSON.stringify(url)})`)
    document.body.classList.add('has-custom-bg')
  } else {
    document.documentElement.style.removeProperty('--custom-bg')
    document.body.classList.remove('has-custom-bg')
  }
  window.dispatchEvent(new Event('settings-updated'))
}

function handleUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  target.value = ''

  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let w = img.width
      let h = img.height
      const max = 1920
      if (w > max || h > max) {
        const ratio = Math.min(max / w, max / h)
        w = Math.round(w * ratio)
        h = Math.round(h * ratio)
      }
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      backgroundImage.value = dataUrl
      localStorage.setItem('bgImage', dataUrl)
      applyBackground(dataUrl)
    }
    img.src = reader.result as string
  }
  reader.readAsDataURL(file)
}

function removeBackground() {
  backgroundImage.value = ''
  localStorage.removeItem('bgImage')
  applyBackground('')
  particleEnabled.value = false
  localStorage.setItem('bgParticle', 'false')
  window.dispatchEvent(new Event('settings-updated'))
}

function toggleParticle(val: boolean) {
  particleEnabled.value = val
  localStorage.setItem('bgParticle', val ? 'true' : 'false')
  window.dispatchEvent(new Event('settings-updated'))
}

onMounted(async () => {
  let dark = false
  if (authStore.user) {
    const snap = await getDoc(doc(db, 'users', authStore.user.uid))
    if (snap.exists()) {
      dark = !!snap.data()?.settings?.darkMode
    }
  }
  applyDarkMode(dark)
  const savedBg = localStorage.getItem('bgImage') || ''
  backgroundImage.value = savedBg
  particleEnabled.value = localStorage.getItem('bgParticle') === 'true' && !!savedBg
  if (savedBg) {
    applyBackground(savedBg)
  }
})
</script>

<template>
  <div class="settings-page">
    <h2 class="page-title">设置</h2>
    <SemesterConfig />
    <TimeSlotEditor />
    <div class="setting-section">
      <h3>外观</h3>
      <div class="setting-row">
        <span class="setting-label">深色模式</span>
        <el-switch :model-value="darkMode" @update:model-value="toggleDarkMode" />
      </div>
    </div>
    <div class="setting-section">
      <h3>自定义背景</h3>
      <div class="setting-row">
        <input id="bg-upload" type="file" accept="image/*" @change="handleUpload" />
        <label for="bg-upload" class="upload-label">选择图片</label>
        <el-button v-if="backgroundImage" type="danger" @click="removeBackground">
          移除背景
        </el-button>
      </div>
      <div v-if="backgroundImage" class="bg-preview-wrapper">
        <img :src="backgroundImage" class="bg-preview" />
      </div>
      <p class="setting-hint">建议使用宽屏图片，最大 1920px，会自动压缩</p>
    </div>
    <div class="setting-section">
      <h3>粒子效果</h3>
      <div class="setting-row">
        <span class="setting-label">粒子背景动画</span>
        <el-switch
          :model-value="particleEnabled"
          :disabled="!backgroundImage"
          @update:model-value="toggleParticle"
        />
      </div>
      <p class="setting-hint">将背景图片转为粒子动画效果，需要先上传背景图片。性能较弱的设备建议关闭。</p>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  max-width: 700px;
}
.page-title {
  font-size: 20px;
  color: var(--el-text-color-primary);
  margin-bottom: 24px;
}
.setting-section {
  margin-bottom: 24px;
}
.setting-section h3 {
  font-size: 16px;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
}
.setting-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.setting-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
}
.bg-preview-wrapper {
  margin-top: 12px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
}
.bg-preview {
  display: block;
  max-width: 100%;
  max-height: 200px;
  object-fit: cover;
}
.setting-hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 6px;
}
#bg-upload {
  position: fixed;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}
.upload-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 15px;
  font-size: 14px;
  border-radius: 6px;
  background: var(--el-color-primary);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
  user-select: none;
}
.upload-label:hover {
  background: var(--el-color-primary-light-3);
}
</style>
