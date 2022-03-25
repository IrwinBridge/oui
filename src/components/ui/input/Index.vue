<template>
  <div class="relative">
    <div
      class="
        flex
        absolute
        inset-y-0
        left-0
        items-center
        pl-3
        pointer-events-none
        text-gray-500
        dark:text-gray-400
      ">
      <slot />
    </div>
    <input
      type="text"
      class="
        datepicker-input
        block
        w-full
        p-2.5
        bg-gray-50
        border
        border-gray-300
        rounded-lg
        text-gray-900
        sm:text-sm
        dark:bg-gray-700
        dark:border-gray-600
        dark:placeholder-gray-400
        dark:text-white
        focus:ring-blue-500
        focus:border-blue-500
        outline-none
      "
      :class="[
        { 'pl-10': $slots.default },
        { 'border-red-500 focus:ring-red-500 focus:border-red-500' : invalid },
      ]"
      placeholder="Select date"
      :value="modelValue"
      @input="onInput"
      @focus="emit('focus')"
      @blur="onBlur"
    >
  </div>
</template>

<script setup>
import { toRefs, getCurrentInstance } from 'vue';

const props = defineProps({
  invalid: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: '',
  },
});
const { modelValue } = toRefs(props);
const { emit } = getCurrentInstance();

const onInput = (event) => {
  emit('update:modelValue', event.target.value);
};
const onBlur = (event) => {
  emit('blur', event);
};
</script>
