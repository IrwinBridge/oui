<template>
  <div ref="datepickerContainer" class="relative">
    <VInput
      v-if="!inline"
      :invalid="!isDateValid"
      @focus="onInputFocus"
      v-model="inputDate"
    >
      <CalendarIcon />
    </VInput>
    <div
      v-show="showPicker"
      class="absolute left-0 inline-block p-4 bg-white rounded-lg shadow-lg datepicker-picker"
      :class="{ 'relative': inline }"
      :style="pickerPositionStyle"
    >
      <div class="datepicker-header">
        <div
          v-show="title"
          class="px-2 py-3 font-semibold text-center bg-white datepicker-title"
        >{{ title }}</div>
        <div class="flex justify-between datepicker-controls">
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
      <div class="p-1 datepicker-main">
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
          v-show="buttons"
          class="flex mt-2 space-x-2 datepicker-controls"
        >
          <button
            type="button"
            class="w-1/2 px-5 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg today-btn hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
            @click="onTodayClick"
          >{{ t('button.today') }}</button>
          <button
            type="button"
            class="w-1/2 px-5 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg clear-btn hover:bg-gray-100 focus:ring-4 focus:ring-blue-300"
            @click="onClearClick"
          >{{ t('button.clear') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onBeforeMount, toRefs, computed, ref, getCurrentInstance,
} from 'vue';
import { onClickOutside } from '@vueuse/core';
import { toDate, isValid } from 'date-fns';
import { useI18n } from 'vue-i18n';
import messages from './locales';
import { formatInputDate } from '../../../utils/date';
import { positionDropdown } from '../../../utils/window';
import { getLocale } from '../../../utils/i18n';
import { allModes } from '.';
import ArrowLeft from '../../icons/ArrowLeft.vue';
import ArrowRight from '../../icons/ArrowRight.vue';
import VInput from '../input/Index.vue';
import CalendarIcon from '../../icons/Calendar.vue';

const { emit } = getCurrentInstance();
const props = defineProps({
  inline: {
    type: Boolean,
    default: false,
  },
  autohide: {
    type: Boolean,
    default: false,
  },
  buttons: {
    type: Boolean,
    default: false,
  },
  mask: {
    type: String,
    default: 'MM/d/y',
  },
  title: {
    type: String,
    default: '',
  },
  locale: {
    type: String,
  },
  availableModes: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Date,
    default: new Date(),
  },
});
const {
  inline, autohide, buttons, mask, title, locale, availableModes, modelValue,
} = toRefs(props);
const t = ref(null);

onBeforeMount(() => {
  window.ouidatepicker = {
    localeId: locale.value ?? navigator.language,
  };
  const composer = useI18n({
    inheritLocale: false,
    locale: getLocale(),
    messages,
  });
  t.value = composer.t;
});

const datepickerContainer = ref(null);
const pickerPositionStyle = ref('');
const isPickerVisible = ref(false);

// validation flag for input date
const isDateValid = ref(true);

const selectedMode = ref(allModes.find((mode) => mode?.isDefault));
const cursorDate = ref(new Date());

const onInputFocus = () => {
  pickerPositionStyle.value = positionDropdown(datepickerContainer.value);
  isPickerVisible.value = true;
};

const showPicker = computed(() => inline.value || isPickerVisible.value);

onClickOutside(datepickerContainer, () => {
  isPickerVisible.value = false;
});

const switchMode = () => {
  const modeName = selectedMode.value?.name;
  const modes = availableModes.value?.length
    ? allModes.filter((mode) => availableModes.value.includes(mode.name))
    : allModes;
  const nextModeIndex = modes.findIndex((mode) => mode.name === modeName) + 1;
  const isLastMode = nextModeIndex >= modes.length;
  selectedMode.value = isLastMode
    ? modes[nextModeIndex - 1]
    : modes[nextModeIndex];
};
const onUpdate = (payload) => {
  const updatedValue = payload?.value;
  const updatedCursor = payload?.cursor;
  const forceStay = payload?.forceStay || false;
  if (updatedValue || updatedValue === null) {
    emit('update:modelValue', updatedValue);
    isDateValid.value = true;
    if (autohide.value && !forceStay) {
      isPickerVisible.value = false;
    }
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

// TODO: refactoring
const inputDate = computed({
  get() {
    return formatInputDate(modelValue.value, mask.value);
  },
  set(value) {
    try {
      const parsedMilliseconds = Date.parse(value);
      const parsedDate = toDate(parsedMilliseconds);
      if (isValid(parsedDate)) {
        onUpdate({ value: parsedDate, cursor: parsedDate, forceStay: true });
        return;
      }
      isDateValid.value = false;
    } catch (error) {
      isDateValid.value = false;
    }
  },
});
</script>

<script>
export default {
  name: 'Datepicker',
};
</script>
