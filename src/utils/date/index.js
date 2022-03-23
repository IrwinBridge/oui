import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isWeekend,
  differenceInCalendarDays,
  subDays,
  addDays,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
} from 'date-fns';
import deafultLocale from 'date-fns/locale/en-US';

const NUMBER_OF_WEEKS = 6;

export const getLocale = (options) => options?.locale || deafultLocale;

export const getWeekDays = (options) => {
  const locale = getLocale(options);
  const now = new Date();
  const start = startOfWeek(now, { locale });
  const end = endOfWeek(now, { locale });
  return eachDayOfInterval({ start, end })
    .map((day) => format(day, 'EEEEEE', { locale }));
};

export const getMonthsOfYear = (options) => {
  const locale = getLocale(options);
  const now = new Date();
  const start = startOfYear(now, { locale });
  const end = endOfYear(now, { locale });
  return eachMonthOfInterval({ start, end })
    .map((month) => ({
      formatted: format(month, 'MMM', { locale }),
      date: month,
    }));
};

const buildPrevMonthDays = (thisMonthStart, locale) => {
  const startOfAWeek = startOfWeek(thisMonthStart);
  const prevMonthDiff = differenceInCalendarDays(thisMonthStart, startOfAWeek);
  if (prevMonthDiff > 0) {
    return eachDayOfInterval({
      start: startOfAWeek, end: subDays(thisMonthStart, 1),
    }).map((day) => ({
      formatted: format(day, 'd', { locale }),
      date: day,
      color: isWeekend(day) ? 'weekend-inactive' : 'businessday-inactive',
    }));
  }
  return [];
};

const buildNextMonthDays = (thisMonthStart, thisMonthEnd, locale) => {
  const firstDay = startOfWeek(thisMonthStart);
  const lastDay = addDays(firstDay, NUMBER_OF_WEEKS * 7 - 1);
  const nextMonthDiff = differenceInCalendarDays(lastDay, thisMonthEnd);
  if (nextMonthDiff > 0) {
    return eachDayOfInterval({
      start: addDays(thisMonthEnd, 1), end: lastDay,
    }).map((day) => ({
      formatted: format(day, 'd', { locale }),
      date: day,
      color: isWeekend(day) ? 'weekend-inactive' : 'businessday-inactive',
    }));
  }
  return [];
};

export const getDaysForMonth = (options) => {
  const locale = getLocale(options);
  const month = options?.monthDate || new Date();
  const thisMonthStart = startOfMonth(month);
  const thisMonthEnd = endOfMonth(month);
  const prevMonthDays = buildPrevMonthDays(thisMonthStart);
  const thisMonthDays = eachDayOfInterval({
    start: thisMonthStart, end: thisMonthEnd,
  }).map((day) => ({
    formatted: format(day, 'd', { locale }),
    date: day,
    color: isWeekend(day) ? 'weekend-active' : 'businessday-active',
  }));
  const nextMonthDays = buildNextMonthDays(thisMonthStart, thisMonthEnd);
  const compiledDays = [...prevMonthDays, ...thisMonthDays, ...nextMonthDays];
  return compiledDays || [];
};

export const formatMonth = (monthDate, options) => {
  const locale = getLocale(options);
  return format(monthDate, 'MMMM', { locale });
};

export const formatYear = (yearDate, options) => {
  const locale = getLocale(options);
  return format(yearDate, 'y', { locale });
};
