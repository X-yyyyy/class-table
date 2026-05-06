<script setup lang="ts">
const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
</script>

<template>
  <div class="grid-header">
    <div class="time-corner"></div>
    <div v-for="(name, i) in dayNames" :key="i" class="day-header">
      {{ name }}
    </div>
  </div>
</template>

<style scoped>
.grid-header {
  display: contents;
}
.time-corner {
  grid-column: 1;
  grid-row: 1;
  background: var(--grid-header-bg);
  border-bottom: 1px solid var(--grid-border-color);
  border-right: 1px solid var(--grid-border-color);
  position: sticky;
  top: 0;
  z-index: 3;
}
.day-header {
  background: var(--grid-header-bg);
  border-bottom: 1px solid var(--grid-border-color);
  border-right: 1px solid var(--grid-border-color);
  text-align: center;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  position: sticky;
  top: 0;
  z-index: 2;
}
.day-header:last-child {
  border-right: none;
}
</style>
