<template>
  <div class="
    w-full
    h-screen
    flex
    flex-col
    items-center
    justify-center
    bg-gray-50
  ">
    <Datepicker :options="datepickerOptions" v-model="deadline" />
    <div class="mt-4">Selected Date: {{ format(deadline, 'MM/dd/y') }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { format } from 'date-fns';
import Datepicker from './components/Datepicker/Index.vue';

const deadline = ref(new Date());
const datepickerOptions = ref({
  buttons: true,
});
</script>
