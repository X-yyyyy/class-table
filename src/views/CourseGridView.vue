<script setup lang="ts">
import { ref } from 'vue'
import type { Course } from '@/types'
import CourseGrid from '@/components/grid/CourseGrid.vue'
import CourseDialog from '@/components/CourseDialog.vue'
import { useCourseStore } from '@/stores/course'
import { ElMessage } from 'element-plus'

const courseStore = useCourseStore()
const dialogVisible = ref(false)
const editingCourse = ref<Course | null>(null)
const defaultDay = ref(1)
const defaultSlot = ref(1)

function handleAddCourse(dayOfWeek: number, slotIndex: number) {
  defaultDay.value = dayOfWeek
  defaultSlot.value = slotIndex + 1 // 0-based index → 1-based startSlot
  editingCourse.value = null
  dialogVisible.value = true
}

function handleEditCourse(courseId: string) {
  const course = courseStore.courses.find((c) => c.id === courseId)
  if (course) {
    editingCourse.value = JSON.parse(JSON.stringify(course))
    dialogVisible.value = true
  }
}

async function handleSave(data: Omit<Course, 'id'>) {
  try {
    if (editingCourse.value?.id) {
      await courseStore.updateCourse(editingCourse.value.id, data)
      ElMessage.success('课程已更新')
    } else {
      await courseStore.addCourse(data)
      ElMessage.success('课程已添加')
    }
    dialogVisible.value = false
  } catch {
    ElMessage.error('保存失败')
  }
}

async function handleDelete() {
  if (editingCourse.value?.id) {
    try {
      await courseStore.deleteCourse(editingCourse.value.id)
      ElMessage.success('课程已删除')
      dialogVisible.value = false
    } catch {
      ElMessage.error('删除失败')
    }
  }
}
</script>

<template>
  <div class="course-grid-view">
    <div class="view-header">
      <h2>课表</h2>
    </div>
    <CourseGrid
      @add-course="handleAddCourse"
      @edit-course="handleEditCourse"
    />
    <CourseDialog
      v-model:visible="dialogVisible"
      :course="editingCourse"
      :defaultDay="defaultDay"
      :defaultSlot="defaultSlot"
      @save="handleSave"
      @delete="handleDelete"
    />
  </div>
</template>

<style scoped>
.course-grid-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.view-header {
  margin-bottom: 16px;
}
.view-header h2 {
  font-size: 20px;
  color: var(--el-text-color-primary);
}
</style>
