<template>
  <div class="datepicker-view days">
    <div class="days-of-week grid grid-cols-7">
      <span
        v-for="(weekDay, index) in weekDays"
        :key="index"
        class="
          dow
          text-center
          h-6
          leading-6
          text-sm
          font-medium
          text-gray-500
        "
        :class="{ 'text-red-500': weekDay.isWeekend }"
      >{{ weekDay.formatted }}</span>
    </div>
    <div class="datepicker-grid w-64 grid grid-cols-7 mt-1">
      <span
        v-for="(day, index) in days"
        :key="index"
        class="
          datepicker-cell
          hover:bg-gray-100
          block
          flex-1
          leading-9
          border-0
          rounded-lg
          cursor-pointer
          text-center
          font-semibold
          text-sm
        "
        :class="[
          { 'text-gray-900': day.color === 'businessday-active' },
          { 'text-gray-400': day.color === 'businessday-inactive' },
          { 'text-red-500': day.color === 'weekend-active' },
          { 'text-red-300': day.color === 'weekend-inactive' },
          { '!bg-blue-700 !text-white': isSameDate(day.date, modelValue) },
        ]"
        @click="onDateSelect(day)"
      >{{ day.formatted }}</span>
    </div>
  </div>
</template>

<script setup>
import {
  ref, computed, toRefs, getCurrentInstance,
} from 'vue';
import {
  isSameDay, isSameMonth, isSameYear, isDate,
} from 'date-fns';
import { getWeekDays, getDaysForMonth } from '../../../utils/date';

const props = defineProps({
  cursor: {
    type: Date,
    default: new Date(),
  },
  modelValue: {
    type: Date,
    default: new Date(),
  },
});
const { cursor, modelValue } = toRefs(props);
const { emit } = getCurrentInstance();

const weekDays = ref(getWeekDays());
const days = computed(() => getDaysForMonth(cursor.value));
const isSameDate = (left, right) => {
  if (!isDate(left) || !isDate(right)) return false;
  const sameDay = isSameDay(left, right);
  const sameMonth = isSameMonth(left, right);
  const sameYear = isSameYear(left, right);
  return sameDay && sameMonth && sameYear;
};
const onDateSelect = (day) => {
  emit('update', { value: day.date });
};
</script>
