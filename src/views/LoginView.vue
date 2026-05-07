<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (e: any) {
    const msg = e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password'
      ? '邮箱或密码错误'
      : e.code === 'auth/invalid-credential'
        ? '邮箱或密码错误'
        : '登录失败，请重试'
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}

async function handleGoogleLogin() {
  loading.value = true
  try {
    await auth.loginWithGoogle()
  } catch {
    ElMessage.error('Google 登录失败')
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">课程表</h1>
      <el-form @submit.prevent="handleLogin">
        <el-form-item>
          <el-input v-model="email" placeholder="邮箱" type="email" size="large" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" placeholder="密码" type="password" size="large" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" class="w-full" :loading="loading" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <el-divider>或</el-divider>
      <el-button size="large" class="w-full" @click="handleGoogleLogin" :disabled="loading">
        Google 登录
      </el-button>
      <div class="auth-links">
        <router-link to="/register">注册账号</router-link>
        <router-link to="/forgot-password">忘记密码</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-bg-color-page);
}
.auth-card {
  width: 400px;
  padding: 40px;
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(139, 129, 120, 0.10);
}
.auth-title {
  text-align: center;
  margin-bottom: 32px;
  font-size: 28px;
  color: var(--el-text-color-primary);
}
.w-full {
  width: 100%;
}
.auth-links {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 14px;
}
.auth-links a {
  color: var(--el-color-primary);
}
</style>
