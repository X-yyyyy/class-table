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

onMounted(async () => {
  if (authStore.user) {
    const snap = await getDoc(doc(db, 'users', authStore.user.uid))
    if (snap.exists()) {
      darkMode.value = !!snap.data()?.settings?.darkMode
    }
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
</style>
