<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const auth = useAuthStore()
const email = ref('')
const loading = ref(false)
const sent = ref(false)

async function handleReset() {
  if (!email.value) {
    ElMessage.warning('请输入邮箱')
    return
  }
  loading.value = true
  try {
    await auth.resetPassword(email.value)
    sent.value = true
    ElMessage.success('密码重置邮件已发送')
  } catch {
    ElMessage.error('发送失败，请检查邮箱地址')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">找回密码</h1>
      <p class="auth-desc">输入注册邮箱，我们将发送密码重置链接</p>
      <el-form v-if="!sent" @submit.prevent="handleReset">
        <el-form-item>
          <el-input v-model="email" placeholder="邮箱" type="email" size="large" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" class="w-full" :loading="loading" @click="handleReset">
            发送重置邮件
          </el-button>
        </el-form-item>
      </el-form>
      <div v-else class="sent-msg">
        <p>邮件已发送至 <strong>{{ email }}</strong></p>
        <p>请检查收件箱并按照指引重置密码</p>
      </div>
      <div class="auth-links" style="justify-content:center">
        <router-link to="/login">返回登录</router-link>
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
  margin-bottom: 12px;
  font-size: 28px;
  color: var(--el-text-color-primary);
}
.auth-desc {
  text-align: center;
  color: var(--el-text-color-secondary);
  margin-bottom: 24px;
  font-size: 14px;
}
.w-full { width: 100%; }
.sent-msg { text-align: center; line-height: 2; color: var(--el-text-color-regular); }
.auth-links {
  display: flex;
  margin-top: 16px;
  font-size: 14px;
}
.auth-links a { color: var(--el-color-primary); }
</style>
