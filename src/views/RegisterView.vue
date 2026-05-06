<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const auth = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleRegister() {
  if (!name.value) {
    ElMessage.warning('请输入姓名')
    return
  }
  loading.value = true
  try {
    await auth.register(email.value, password.value, name.value)
    ElMessage.success('注册成功')
    router.push('/')
  } catch (e: any) {
    const msg = e.code === 'auth/email-already-in-use'
      ? '该邮箱已注册'
      : '注册失败，请重试'
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">注册</h1>
      <el-form @submit.prevent="handleRegister">
        <el-form-item>
          <el-input v-model="name" placeholder="姓名" size="large" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="email" placeholder="邮箱" type="email" size="large" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" placeholder="密码（至少6位）" type="password" size="large" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" class="w-full" :loading="loading" @click="handleRegister">
            注册
          </el-button>
        </el-form-item>
      </el-form>
      <div class="auth-links" style="justify-content:center">
        <router-link to="/login">已有账号？去登录</router-link>
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
  margin-top: 16px;
  font-size: 14px;
}
.auth-links a {
  color: var(--el-color-primary);
}
</style>
