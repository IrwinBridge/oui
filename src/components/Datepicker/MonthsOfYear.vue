<template>
  <div class="datepicker-view datepicker-grid months w-64 grid grid-cols-4">
    <span
      v-for="(month, index) in months"
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
        text-gray-900
      "
      :class="[
        { 'bg-gray-200': isSameMonth(cursor, month.date) },
        { '!bg-blue-700 !text-white': isSameMonth(modelValue, month.date) },
      ]"
      @click="onMonthClick(month)"
    >{{ month.formatted }}</span>
  </div>
</template>

<script setup>
import {
  ref, defineProps, toRefs, getCurrentInstance,
} from 'vue';
import { isSameMonth } from 'date-fns';
import { getMonthsOfYear } from '../../utils/date';

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
const { modelValue } = toRefs(props);
const { emit } = getCurrentInstance();
const months = ref(getMonthsOfYear());
const onMonthClick = (month) => {
  emit('update', { cursor: month.date });
};
</script>
