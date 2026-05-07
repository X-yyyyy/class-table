<script setup lang="ts">
import { computed } from 'vue'
import { useCourseStore } from '@/stores/course'
import { useSemesterStore } from '@/stores/semester'
import { useTimeSlotStore } from '@/stores/timeSlot'
import type { Course, Schedule } from '@/types'
import GridHeader from './GridHeader.vue'
import TimeColumn from './TimeColumn.vue'
import CourseCard from './CourseCard.vue'

const courseStore = useCourseStore()
const semesterStore = useSemesterStore()
const timeSlotStore = useTimeSlotStore()

const emit = defineEmits<{
  addCourse: [dayOfWeek: number, slot: number]
  editCourse: [courseId: string]
}>()

const scheduleEntries = computed(() => {
  const entries: Array<{ course: Course; schedule: Schedule; slotIndex: number }> = []
  for (const course of courseStore.courses) {
    for (const schedule of course.schedules) {
      if (courseStore.isScheduleVisible(schedule, semesterStore.currentWeek)) {
        entries.push({ course, schedule, slotIndex: schedule.startSlot - 1 })
      }
    }
  }
  return entries
})

function handleCellClick(dayOfWeek: number, slotIndex: number) {
  emit('addCourse', dayOfWeek, slotIndex)
}

function handleEditCourse(course: Course) {
  if (course.id) {
    emit('editCourse', course.id)
  }
}

const daySlots = computed(() => {
  return timeSlotStore.timeSlots
})
</script>

<template>
  <div v-loading="courseStore.loading || timeSlotStore.loading" class="grid-wrapper">
    <div
      class="course-grid"
      :style="{
        gridTemplateColumns: `var(--time-column-width) repeat(7, 1fr)`,
        gridTemplateRows: `auto repeat(${daySlots.length}, 1fr)`,
      }"
    >
      <GridHeader />
      <TimeColumn :timeSlots="daySlots" />

      <!-- Empty cells for clicking to add -->
      <template v-for="(_slot, si) in daySlots" :key="'row-' + si">
        <div
          v-for="day in 7"
          :key="'cell-' + day + '-' + si"
          class="grid-cell"
          :class="{ 'cell-last': day === 7 }"
          :style="{
            gridColumn: day + 1,
            gridRow: si + 2,
          }"
          @click="handleCellClick(day, si)"
        />
      </template>

      <!-- Course cards (one per schedule) -->
      <CourseCard
        v-for="(entry, i) in scheduleEntries"
        :key="entry.course.id + '-' + i"
        :course="entry.course"
        :schedule="entry.schedule"
        :slotIndex="entry.slotIndex"
        @edit="handleEditCourse"
      />
    </div>
  </div>
</template>

<style scoped>
.grid-wrapper {
  height: 100%;
  overflow: auto;
}
.course-grid {
  display: grid;
  min-width: 800px;
  position: relative;
}
.grid-cell {
  border-bottom: 1px dashed var(--grid-border-color);
  border-right: 1px solid var(--grid-border-color);
  min-height: 60px;
  cursor: pointer;
  transition: background-color 0.15s;
}
.grid-cell:hover {
  background-color: var(--el-color-primary-light-9);
}
.grid-cell:nth-child(7n) {
  border-right: none;
}
.cell-last {
  border-right: none;
}
</style>
