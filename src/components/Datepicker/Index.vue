<template>
  <div class="datepicker-picker inline-block rounded-lg bg-white shadow-lg p-4">
    <div class="datepicker-header">
      <div
        v-show="options?.title"
        class="datepicker-title bg-white px-2 py-3 text-center font-semibold"
      >{{ options?.title }}</div>
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
        >{{ selectedMode?.header(cursorDate) }}</button>
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
          :modelValue="modelValue"
          @update="onUpdate"
        />
      </keep-alive>
    </div>
    <div class="datepicker-footer">
      <div
        v-show="options?.buttons"
        class="datepicker-controls flex space-x-2 mt-2"
      >
        <button
          type="button"
          class="
            today-btn
            text-white
            bg-blue-700
            hover:bg-blue-800
            focus:ring-4
            focus:ring-blue-300
            font-medium
            rounded-lg
            text-sm
            px-5
            py-2
            text-center
            w-1/2
          "
          @click="onTodayClick"
        >{{ todayControlsButton }}</button>
        <button
          type="button"
          class="
            clear-btn
            text-gray-900
            bg-white
            border
            border-gray-300
            hover:bg-gray-100
            focus:ring-4
            focus:ring-blue-300
            font-medium
            rounded-lg
            text-sm
            px-5
            py-2
            text-center
            w-1/2
          "
          @click="onClearClick"
        >{{ clearControlsButton }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  defineProps, toRefs, computed, ref, getCurrentInstance,
} from 'vue';
import { modes } from '.';
import ArrowLeft from '../icons/ArrowLeft.vue';
import ArrowRight from '../icons/ArrowRight.vue';

const props = defineProps({
  options: {
    type: Object,
    default: () => ({
      autohide: false,
      buttons: false,
      format: 'mm/dd/yyyy',
      title: '',
      locale: 'en-US',
    }),
  },
  modelValue: {
    type: Date,
    default: new Date(),
  },
});
const { options, modelValue } = toRefs(props);
const { emit } = getCurrentInstance();

const selectedMode = ref(modes.find((mode) => mode?.isDefault));
const cursorDate = ref(new Date());

const todayControlsButton = computed(() => 'Today');
const clearControlsButton = computed(() => 'Clear');

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
  const updatedCursor = payload?.cursor;
  if (updatedValue || updatedValue === null) {
    emit('update:modelValue', updatedValue);
  }
  if (updatedCursor) cursorDate.value = updatedCursor;
  else cursorDate.value = updatedValue;
  selectedMode.value = selectedMode.value?.comebackMode();
};
const onTodayClick = () => {
  const today = new Date();
  onUpdate({ value: today, cursor: today });
};
const onClearClick = () => {
  const today = new Date();
  onUpdate({ value: null, cursor: today });
};
</script>
