<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示')
    await auth.logout()
    router.push('/login')
  } catch {
    // cancelled
  }
}
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <!-- mobile menu toggle placeholder -->
    </div>
    <div class="topbar-right">
      <el-dropdown trigger="click">
        <div class="user-info">
          <el-avatar :size="32" :src="auth.user?.photoURL || ''">
            {{ auth.user?.email?.charAt(0).toUpperCase() }}
          </el-avatar>
          <span class="user-name">{{ auth.user?.displayName || auth.user?.email }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-item @click="router.push('/settings')">设置</el-dropdown-item>
          <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: var(--topbar-height);
  border-bottom: 1px solid var(--grid-border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: var(--el-bg-color);
}
.topbar-right {
  margin-left: auto;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.user-name {
  font-size: 14px;
  color: var(--el-text-color-primary);
}
</style>
