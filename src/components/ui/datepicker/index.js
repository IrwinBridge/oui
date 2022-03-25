/* eslint-disable import/prefer-default-export */
import { shallowRef } from 'vue';
import {
  startOfMonth, addMonths, subMonths, subYears, addYears,
} from 'date-fns';
import {
  formatMonth, formatYear, formatTwelfYearsRange, formatCenturyRange,
} from '../../../utils/date';
import DaysOfMonth from './DaysOfMonth.vue';
import MonthsOfYear from './MonthsOfYear.vue';
import YearsOfTwelfth from './YearsOfTwelfth.vue';
import DecadesOfCentury from './DecadesOfCentury.vue';

export const allModes = [
  {
    name: 'DaysOfMonth',
    view: shallowRef(DaysOfMonth),
    header: (date) => `${formatMonth(date)} ${formatYear(date)}`,
    prevAction: (date) => subMonths(startOfMonth(date), 1),
    nextAction: (date) => addMonths(startOfMonth(date), 1),
    comebackMode: () => allModes[0],
    isDefault: true,
  },
  {
    name: 'MonthsOfYear',
    view: shallowRef(MonthsOfYear),
    header: (date) => `${formatYear(date)}`,
    prevAction: (date) => subYears(startOfMonth(date), 1),
    nextAction: (date) => addYears(startOfMonth(date), 1),
    comebackMode: () => allModes[0],
  },
  {
    name: 'YearsOfTwelfth',
    view: shallowRef(YearsOfTwelfth),
    header: (date) => `${formatTwelfYearsRange(date)}`,
    prevAction: (date) => subYears(startOfMonth(date), 10),
    nextAction: (date) => addYears(startOfMonth(date), 10),
    comebackMode: () => allModes[1],
  },
  {
    name: 'YearsOfCentury',
    view: shallowRef(DecadesOfCentury),
    header: (date) => `${formatCenturyRange(date)}`,
    prevAction: (date) => subYears(startOfMonth(date), 100),
    nextAction: (date) => addYears(startOfMonth(date), 100),
    comebackMode: () => allModes[2],
  },
];
