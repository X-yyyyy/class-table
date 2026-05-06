<script setup lang="ts">
import type { Course, Schedule } from '@/types'

const props = defineProps<{
  course: Course
  schedule: Schedule
  slotIndex: number
}>()

const emit = defineEmits<{
  edit: [course: Course]
}>()

function getGridPosition() {
  return {
    gridColumn: (props.schedule.dayOfWeek ?? 1) + 1,
    gridRow: `${(props.slotIndex) + 2} / span ${props.schedule.duration ?? 1}`,
  }
}
</script>

<template>
  <div
    class="course-card"
    :style="{
      ...getGridPosition(),
      backgroundColor: course.color + '20',
      borderLeft: `4px solid ${course.color}`,
    }"
    @click="emit('edit', course)"
  >
    <div class="card-name" :style="{ color: course.color }">{{ course.name }}</div>
    <div class="card-info">{{ course.teacher }}</div>
    <div class="card-info">{{ course.location }}</div>
  </div>
</template>

<style scoped>
.course-card {
  padding: 4px 6px;
  border-radius: var(--el-border-radius-base);
  cursor: pointer;
  overflow: hidden;
  min-height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: box-shadow 0.25s, transform 0.25s;
}
.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 129, 120, 0.15);
}
.card-name {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 2px;
}
.card-info {
  font-size: 11px;
  color: var(--el-text-color-regular);
  line-height: 1.3;
}
</style>
