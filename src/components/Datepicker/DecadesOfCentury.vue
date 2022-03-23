<template>
  <div class="
    datepicker-view
    datepicker-grid
    years-of-century
    w-64
    grid
    grid-cols-4
  ">
    <span
      v-for="(year, index) in years"
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
        { 'bg-gray-200': isWithinDecade(cursor, year.date) },
        { '!bg-blue-700 !text-white': isWithinDecade(modelValue, year.date) },
      ]"
      @click="onYearClick(year)"
    >{{ year.formatted }}</span>
  </div>
</template>

<script setup>
import {
  computed, defineProps, toRefs, getCurrentInstance,
} from 'vue';
import { getDecadesOfCentury, isWithinDecade } from '../../utils/date';

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
const years = computed(() => getDecadesOfCentury(cursor.value));
const onYearClick = (year) => {
  emit('update', { cursor: year.date });
};
</script>
