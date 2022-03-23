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
          @click="cursorDate = selectedMode?.prevAction(cursorDate)"
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
          @click="switchMode"
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
          @click="cursorDate = selectedMode?.nextAction(cursorDate)"
        >
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>
    </div>
    <div class="datepicker-main p-1">
      <keep-alive>
        <component
          :is="selectedMode.view"
          :cursor="cursorDate"
          :modelValue="selectedDate"
          @update="onUpdate"
        />
      </keep-alive>
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
import {
  defineProps, toRefs, computed, ref, shallowRef,
} from 'vue';
import { addMonths, startOfMonth, subMonths } from 'date-fns';
import { formatMonth, formatYear } from '../../utils/date';
import DaysOfMonth from './DaysOfMonth.vue';
import MonthsOfYear from './MonthsOfYear.vue';
import ArrowLeft from '../icons/ArrowLeft.vue';
import ArrowRight from '../icons/ArrowRight.vue';

const props = defineProps({
  autohide: {
    type: Boolean,
    default: false,
  },
});
const { autohide } = toRefs(props);

const modes = [
  {
    name: 'DaysOfMonth',
    view: shallowRef(DaysOfMonth),
    header: (date) => `${formatMonth(date)} ${formatYear(date)}`,
    prevAction: (date) => subMonths(startOfMonth(date), 1),
    nextAction: (date) => addMonths(startOfMonth(date), 1),
    isDefault: true,
    comebackMode: () => modes[0],
  },
  {
    name: 'MonthsOfYear',
    view: shallowRef(MonthsOfYear),
    header: (date) => `${formatMonth(date)}`,
    comebackMode: () => modes[0],
  },
  {
    name: 'YearsOfTwelfth',
    view: null,
    comebackMode: () => modes[1],
  },
  {
    name: 'YearsOfCentury',
    view: null,
    comebackMode: () => modes[2],
  },
];

const selectedMode = ref(modes.find((mode) => mode?.isDefault));
const selectedDate = ref(new Date());
const cursorDate = ref(new Date());

const viewSwitchContent = computed(() => {
  const date = cursorDate.value;
  return selectedMode.value?.header(date);
});

const todayControlsButton = computed(() => 'Today');
const clearControlsButton = computed(() => 'Clear');

const showTitle = computed(() => false);
const showFooterControls = computed(() => false);

const switchMode = () => {
  const modeName = selectedMode.value?.name;
  const nextModeIndex = modes.findIndex((mode) => mode.name === modeName) + 1;
  const isLastMode = nextModeIndex >= modes.length;
  selectedMode.value = isLastMode
    ? modes[nextModeIndex - 1]
    : modes[nextModeIndex];
};
const onUpdate = (payload) => {
  const updatedValue = payload?.value;
  if (updatedValue) selectedDate.value = updatedValue;
  const updatedCursor = payload?.cursor;
  if (updatedCursor) cursorDate.value = updatedCursor;
  else cursorDate.value = updatedValue;
  selectedMode.value = selectedMode.value?.comebackMode();
};
</script>
