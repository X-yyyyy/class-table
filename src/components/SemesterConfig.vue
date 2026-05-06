<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSemesterStore } from '@/stores/semester'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const store = useSemesterStore()
const form = ref({
  name: '',
  startDate: '',
  totalWeeks: 20,
})

watch([() => store.semesterName, () => store.startDate, () => store.totalWeeks], ([name, date, weeks]) => {
  form.value = {
    name: name || '',
    startDate: date ? dayjs(date).format('YYYY-MM-DD') : '',
    totalWeeks: weeks,
  }
}, { immediate: true })

async function save() {
  if (!form.value.name || !form.value.startDate) {
    ElMessage.warning('请填写完整信息')
    return
  }
  await store.saveSemester({
    name: form.value.name,
    startDate: form.value.startDate,
    totalWeeks: form.value.totalWeeks,
  })
  ElMessage.success('学期设置已保存')
}
</script>

<template>
  <div class="semester-config">
    <h3>学期设置</h3>
    <el-form label-width="100px" class="config-form">
      <el-form-item label="学期名称">
        <el-input v-model="form.name" placeholder="例如：2026 春季学期" />
      </el-form-item>
      <el-form-item label="开学日期">
        <el-date-picker v-model="form.startDate" type="date" value-format="YYYY-MM-DD" format="YYYY-MM-DD" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="总周数">
        <el-input-number v-model="form.totalWeeks" :min="10" :max="30" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.semester-config {
  margin-bottom: 24px;
}
.semester-config h3 {
  font-size: 16px;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
}
.config-form {
  max-width: 400px;
}
</style>
