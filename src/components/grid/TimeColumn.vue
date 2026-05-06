<script setup lang="ts">
import type { TimeSlot } from '@/types'

defineProps<{
  timeSlots: TimeSlot[]
}>()
</script>

<template>
  <div class="time-column">
    <div
      v-for="slot in timeSlots"
      :key="slot.slot"
      class="time-cell"
    >
      <span class="slot-number">第{{ slot.slot }}节</span>
      <span class="slot-time">{{ slot.startTime }}-{{ slot.endTime }}</span>
    </div>
  </div>
</template>

<style scoped>
.time-column {
  display: contents;
}
.time-cell {
  grid-column: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--grid-border-color);
  border-right: 1px solid var(--grid-border-color);
  background: var(--grid-header-bg);
  font-size: 12px;
  color: var(--el-text-color-regular);
}
.slot-number {
  font-weight: 500;
}
.slot-time {
  font-size: 11px;
  color: var(--el-text-color-secondary);
}
</style>
