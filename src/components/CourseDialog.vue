<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Course, CourseType, Schedule } from '@/types'
import { COLORS } from '@/types'
import { useSemesterStore } from '@/stores/semester'
import { ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElMessage, ElColorPicker } from 'element-plus'

const semesterStore = useSemesterStore()
const maxWeeks = computed(() => semesterStore.totalWeeks || 20)

const props = defineProps<{
  visible: boolean
  course: Partial<Course> | null
  defaultDay: number
  defaultSlot: number
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  save: [data: Omit<Course, 'id'>]
  delete: []
}>()

const form = ref({
  name: '',
  teacher: '',
  location: '',
  type: 'elective' as CourseType,
  color: COLORS[0],
  schedules: [{ dayOfWeek: 1, startSlot: 1, duration: 2, weekType: 'all' as Schedule['weekType'] }] as Schedule[],
})

watch(() => props.visible, (val) => {
  if (val) {
    if (props.course) {
      form.value = {
        name: props.course.name || '',
        teacher: props.course.teacher || '',
        location: props.course.location || '',
        type: props.course.type || 'elective',
        color: props.course.color || COLORS[0],
        schedules: props.course.schedules?.length
          ? [...props.course.schedules]
          : [{ dayOfWeek: 1, startSlot: 1, duration: 2, weekType: 'all' as Schedule['weekType'] }] as Schedule[],
      }
    } else {
      form.value = {
        name: '',
        teacher: '',
        location: '',
        type: 'elective',
        color: COLORS[0],
        schedules: [{ dayOfWeek: props.defaultDay, startSlot: props.defaultSlot, duration: 2, weekType: 'all' as Schedule['weekType'] }] as Schedule[],
      }
    }
  }
})

function addSchedule() {
  form.value.schedules.push({ dayOfWeek: 1, startSlot: 1, duration: 2, weekType: 'all' } as Schedule)
}

function removeSchedule(index: number) {
  if (form.value.schedules.length > 1) {
    form.value.schedules.splice(index, 1)
  }
}

function onWeekTypeChange(s: Schedule) {
  if (s.weekType === 'custom') {
    if (!s.customWeeks || s.customWeeks.length === 0) {
      s.customWeeks = []
    }
  } else {
    delete s.customWeeks
  }
}

function handleSave() {
  if (!form.value.name) {
    ElMessage.warning('请输入课程名称')
    return
  }
  for (const s of form.value.schedules) {
    if (s.weekType === 'custom' && (!s.customWeeks || s.customWeeks.length === 0)) {
      ElMessage.warning('请选择自定义周次')
      return
    }
  }
  emit('save', { ...form.value })
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    :title="course ? '编辑课程' : '添加课程'"
    width="520px"
    destroy-on-close
  >
    <el-form label-width="80px">
      <el-form-item label="课程名称">
        <el-input v-model="form.name" placeholder="例如：高等数学" />
      </el-form-item>
      <el-form-item label="授课教师">
        <el-input v-model="form.teacher" placeholder="教师姓名" />
      </el-form-item>
      <el-form-item label="上课地点">
        <el-input v-model="form.location" placeholder="例如：教学楼301" />
      </el-form-item>
      <el-form-item label="课程类型">
        <el-select v-model="form.type">
          <el-option label="必修" value="required" />
          <el-option label="选修" value="elective" />
        </el-select>
      </el-form-item>
      <el-form-item label="颜色">
        <el-color-picker v-model="form.color" :predefine="COLORS" />
      </el-form-item>
      <el-form-item label="上课时间">
        <div class="schedule-list">
          <template v-for="(s, i) in form.schedules" :key="i">
            <div class="schedule-item">
              <el-select v-model="s.dayOfWeek" style="width:100px">
                <el-option :value="1" label="周一" />
                <el-option :value="2" label="周二" />
                <el-option :value="3" label="周三" />
                <el-option :value="4" label="周四" />
                <el-option :value="5" label="周五" />
                <el-option :value="6" label="周六" />
                <el-option :value="7" label="周日" />
              </el-select>
              <el-select v-model="s.startSlot" style="width:100px">
                <el-option v-for="n in 12" :key="n" :value="n" :label="`第${n}节`" />
              </el-select>
              <el-select v-model="s.duration" style="width:90px">
                <el-option v-for="n in 6" :key="n" :value="n" :label="`${n}节`" />
              </el-select>
              <el-select v-model="s.weekType" style="width:90px" @change="onWeekTypeChange(s)">
                <el-option value="all" label="每周" />
                <el-option value="odd" label="单周" />
                <el-option value="even" label="双周" />
                <el-option value="custom" label="自定义" />
              </el-select>
              <el-button v-if="form.schedules.length > 1" type="danger" size="small" @click="removeSchedule(i)">
                删除
              </el-button>
            </div>
            <div v-if="s.weekType === 'custom'" class="custom-weeks-row">
              <el-select v-model="s.customWeeks" multiple collapse-tags placeholder="选择周次" style="width:100%">
                <el-option v-for="w in maxWeeks" :key="w" :value="w" :label="`第${w}周`" />
              </el-select>
            </div>
          </template>
          <el-button size="small" @click="addSchedule">+ 添加时间段</el-button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button v-if="course" type="danger" @click="emit('delete')">删除</el-button>
      <el-button @click="emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
.schedule-item {
  display: flex;
  gap: 8px;
  align-items: center;
}
.custom-weeks-row {
  padding-left: 8px;
}
</style>
