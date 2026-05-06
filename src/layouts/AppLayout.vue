<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'
import { useCourseStore } from '@/stores/course'
import { useSemesterStore } from '@/stores/semester'
import { useTimeSlotStore } from '@/stores/timeSlot'
import { useAuthStore } from '@/stores/auth'
import { onMounted, onUnmounted } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'

const courseStore = useCourseStore()
const semesterStore = useSemesterStore()
const timeSlotStore = useTimeSlotStore()
const authStore = useAuthStore()

function applyDarkMode(enabled: boolean) {
  document.documentElement.classList.toggle('dark', enabled)
}

onMounted(async () => {
  courseStore.fetchCourses()
  semesterStore.fetchSemester()
  timeSlotStore.fetchTimeSlots()
  if (authStore.user) {
    const snap = await getDoc(doc(db, 'users', authStore.user.uid))
    if (snap.exists()) {
      applyDarkMode(!!snap.data()?.settings?.darkMode)
    }
  }
})

onUnmounted(() => {
  courseStore.stopListening()
  timeSlotStore.stopListening()
})
</script>

<template>
  <div class="layout">
    <Sidebar />
    <div class="main-area">
      <TopBar />
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}
.main-area {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.main-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
}
</style>
