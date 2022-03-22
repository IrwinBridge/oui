<template>
  <div class="datepicker-picker inline-block rounded-lg bg-white shadow-lg p-4">
    <div class="datepicker-header">
      <div
        v-show="showTitle"
        class="datepicker-title bg-white px-2 py-3 text-center font-semibold"
      ></div>
      <div class="datepicker-controls flex justify-between">
        <button
          type="button"
          class="
            prev-button
            bg-white
            text-gray-500
            hover:bg-gray-100
            hover:text-gray-900
            text-lg
            p-2.5
            focus:outline-none
            focus:ring-2
            focus:ring-gray-200
          "
          @click="onPrevAction"
        >
          <ArrowLeft class="w-4 h-4" />
        </button>
        <button
          type="button"
          class="
            view-switch
            text-sm
            rounded-lg
            text-gray-900
            bg-white
            font-semibold
            py-2.5
            px-5
            hover:bg-gray-100
            focus:outline-none
            focus:ring-2
            focus:ring-gray-200
          "
        >{{ viewSwitchContent }}</button>
        <button
          type="button"
          class="
            next-button
            bg-white
            text-gray-500
            hover:bg-gray-100
            hover:text-gray-900
            text-lg
            p-2.5
            focus:outline-none
            focus:ring-2
            focus:ring-gray-200
          "
          @click="onNextAction"
        >
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>
    </div>
    <div class="datepicker-main p-1">
      <!-- will switch this component -->
      <DaysView v-model="selectedDate" />
    </div>
    <div class="datepicker-footer">
      <div v-show="showFooterControls" class="datepicker-controls flex space-x-2 mt-2">
        <button
          type="button"
          class="today-btn text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center w-1/2"
        >{{ todayControlsButton }}</button>
        <button
          type="button"
          class="clear-btn text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center w-1/2"
        >{{ clearControlsButton }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { addMonths, startOfMonth, subMonths } from 'date-fns';
import { formatMonth, formatYear } from '../../utils/date';
import DaysView from './PickerDaysView.vue';
import ArrowLeft from '../icons/ArrowLeft.vue';
import ArrowRight from '../icons/ArrowRight.vue';

// To be refactored
const MODE_DAYS_OF_MONTH = 'daysOfMonth';
const MODE_MONTHS_OF_YEAR = 'monthsOfYear';
const MODE_YEARS = 'years';
const MODES = [MODE_DAYS_OF_MONTH, MODE_MONTHS_OF_YEAR, MODE_YEARS];
const mode = ref(MODE_DAYS_OF_MONTH);

const selectedDate = ref(new Date());

const viewSwitchContent = computed(() => `${
  formatMonth(selectedDate.value)
} ${
  formatYear(selectedDate.value)
}`);
const todayControlsButton = computed(() => 'Today');
const clearControlsButton = computed(() => 'Clear');
const showTitle = computed(() => false);
const showFooterControls = computed(() => false);

const onPrevAction = () => {
  if (mode.value === MODE_DAYS_OF_MONTH) {
    selectedDate.value = subMonths(startOfMonth(selectedDate.value), 1);
  }
};
const onNextAction = () => {
  if (mode.value === MODE_DAYS_OF_MONTH) {
    selectedDate.value = addMonths(startOfMonth(selectedDate.value), 1);
  }
};
</script>
