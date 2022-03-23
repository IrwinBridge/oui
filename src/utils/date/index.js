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
  startOfDecade,
  endOfDecade,
  subYears,
  addYears,
  eachYearOfInterval,
  getYear,
  setYear,
  lastDayOfDecade,
  isWithinInterval,
} from 'date-fns';
import deafultLocale from 'date-fns/locale/en-US';

const NUMBER_OF_WEEKS = 6;

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
const startOfCentury = (date) => {
  const fromDecade = startOfDecade(date);
  const centuryStartYear = Math.ceil(getYear(fromDecade) / 100) * 100 - 100;
  return setYear(fromDecade, centuryStartYear);
};
const endOfCentury = (date) => {
  const fromDecade = startOfDecade(date);
  const centuryEndYear = Math.ceil(getYear(fromDecade) / 100) * 100;
  return setYear(fromDecade, centuryEndYear);
};
const eachDecadeOfInterval = ({ start, end }) => {
  const decades = eachYearOfInterval({ start, end })
    .reduce((years, year, index) => {
      if (index % 10 === 0) {
        years.push(year);
      }
      return years;
    }, []);
  return decades;
};

export const isWithinDecade = (date, decadeDate) => {
  const start = startOfDecade(decadeDate);
  const end = lastDayOfDecade(decadeDate);
  return isWithinInterval(date, { start, end });
};

export const getLocale = (options) => options?.locale || deafultLocale;
export const getWeekDays = (options) => {
  const locale = getLocale(options);
  const now = new Date();
  const start = startOfWeek(now, { locale });
  const end = endOfWeek(now, { locale });
  return eachDayOfInterval({ start, end })
    .map((day) => ({
      formatted: format(day, 'EEEEEE', { locale }),
      isWeekend: isWeekend(day),
    }));
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
export const getMonthsOfYear = (cursorDate, options) => {
  const locale = getLocale(options);
  const start = startOfYear(cursorDate);
  const end = endOfYear(cursorDate);
  return eachMonthOfInterval({ start, end })
    .map((month) => ({
      formatted: format(month, 'MMM', { locale }),
      date: month,
    }));
};
export const getYearsOfTwelfth = (cursorDate, options) => {
  const locale = getLocale(options);
  const start = subYears(startOfDecade(cursorDate), 1);
  const end = addYears(endOfDecade(cursorDate), 1);
  return eachYearOfInterval({ start, end })
    .map((year) => ({
      formatted: format(year, 'y', { locale }),
      date: year,
    }));
};
export const getDecadesOfCentury = (cursorDate, options) => {
  const locale = getLocale(options);
  const start = subYears(startOfCentury(cursorDate), 10);
  const end = endOfCentury(cursorDate);
  return eachDecadeOfInterval({ start, end })
    .map((decade) => ({
      formatted: format(decade, 'y', { locale }),
      date: decade,
    }));
};

export const formatMonth = (monthDate, options) => {
  const locale = getLocale(options);
  return format(monthDate, 'MMMM', { locale });
};
export const formatYear = (yearDate, options) => {
  const locale = getLocale(options);
  return format(yearDate, 'y', { locale });
};
export const formatTwelfYearsRange = (cursorDate, options) => {
  const locale = getLocale(options);
  const years = getYearsOfTwelfth(cursorDate, options);
  const startYear = format(years[1]?.date, 'y', { locale });
  const endYear = format(years[10]?.date, 'y', { locale });
  return `${startYear} - ${endYear}`;
};
export const formatCenturyRange = (cursorDate, options) => {
  const locale = getLocale(options);
  const years = getDecadesOfCentury(cursorDate, options);
  const startYear = format(years[1]?.date, 'y', { locale });
  const endYear = format(years[10]?.date, 'y', { locale });
  return `${startYear} - ${endYear}`;
};
