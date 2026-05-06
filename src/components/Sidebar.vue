<script setup lang="ts">
import { ref } from 'vue'
import { Calendar, Setting, Fold, Expand } from '@element-plus/icons-vue'
import { useSemesterStore } from '@/stores/semester'

const semester = useSemesterStore()
const collapsed = ref(false)

function toggleCollapse() {
  collapsed.value = !collapsed.value
  document.documentElement.style.setProperty(
    '--sidebar-width',
    collapsed.value ? '64px' : '220px'
  )
}
</script>

<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="sidebar-header">
      <h2 v-show="!collapsed" class="app-title">课程表</h2>
      <el-button
        :icon="collapsed ? Expand : Fold"
        text
        class="collapse-btn"
        @click="toggleCollapse"
      />
    </div>
    <div v-show="!collapsed" class="semester-section">
      <p class="section-label">学期</p>
      <p class="semester-name">{{ semester.semesterName || '未设置' }}</p>
    </div>
    <div v-show="!collapsed" class="week-nav">
      <el-button size="small" @click="semester.prevWeek()" :disabled="semester.currentWeek <= 1">
        ‹
      </el-button>
      <span class="week-display">第 {{ semester.currentWeek }} 周</span>
      <el-button size="small" @click="semester.nextWeek()" :disabled="semester.currentWeek >= semester.totalWeeks">
        ›
      </el-button>
    </div>
    <el-button v-show="!collapsed" size="small" class="today-btn" @click="semester.goToCurrentWeek()">
      回到本周
    </el-button>
    <p v-show="!collapsed" class="week-range">{{ semester.weekDateRange }}</p>
    <nav class="sidebar-nav">
      <router-link to="/" class="nav-item">
        <el-icon><Calendar /></el-icon>
        <span v-show="!collapsed">课表</span>
      </router-link>
      <router-link to="/settings" class="nav-item">
        <el-icon><Setting /></el-icon>
        <span v-show="!collapsed">设置</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--el-bg-color);
  box-shadow: 2px 0 12px rgba(139, 129, 120, 0.08);
  display: flex;
  flex-direction: column;
  padding: 16px;
  position: fixed;
  left: 0;
  top: 0;
  transition: width 0.25s ease;
  overflow: hidden;
}
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  min-height: 24px;
}
.sidebar.collapsed .sidebar-header {
  justify-content: center;
}
.collapse-btn {
  font-size: 18px;
}
.app-title {
  font-family: "Noto Serif SC", "Songti SC", "STSong", serif;
  font-size: 20px;
  color: var(--el-text-color-primary);
  white-space: nowrap;
}
.semester-section {
  margin-bottom: 16px;
  white-space: nowrap;
}
.section-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}
.semester-name {
  font-size: 14px;
  color: var(--el-text-color-primary);
  font-weight: 500;
}
.week-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.week-display {
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}
.today-btn {
  width: 100%;
  margin-bottom: 8px;
  background: var(--el-fill-color);
  border-color: var(--el-border-color);
}
.today-btn:hover {
  background: var(--el-fill-color-dark);
}
.week-range {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  text-align: center;
  margin-bottom: 24px;
  white-space: nowrap;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  color: var(--el-text-color-regular);
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
}
.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 10px 0;
}
.nav-item:hover,
.nav-item.router-link-exact-active {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
