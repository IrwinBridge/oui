<template>
  <div
    class="
      w-full
      h-screen
      flex
      flex-col
      items-center
      justify-center
    bg-gray-50
    "
    style="height: 200vh"
    >
    <Datepicker v-bind="datepickerOptions" v-model="deadline" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Datepicker from './components/ui/datepicker/Index.vue';

const deadline = ref(new Date());
const datepickerOptions = ref({
  // If you want picker to be always visible and don't want date input to show
  inline: false,
  // date-fns mask for date input
  mask: 'MM/d/y',
  // When you need a title at the top of picker
  // title: '',
  // If you need today and clear buttons to show up
  buttons: true,
  // If you want picker to close on date pick
  autohide: true,
  // Available modes:
  // DaysOfMonth, MonthsOfYear, YearsOfTwelfth, YearsOfCentury
  // DaysOfMonth is a default mode and cannot be ommited
  availableModes: ['DaysOfMonth', 'MonthsOfYear', 'YearsOfTwelfth'],
  // default locale is your current browser locale
  // fallback locale is en-US
  // locale: 'en-US',
});
</script>
