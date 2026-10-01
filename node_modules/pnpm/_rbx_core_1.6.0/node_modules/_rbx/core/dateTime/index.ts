// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../intlRelativeTimeFormat.d.ts" />

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;
const DAYS_IN_YEAR = 365;

async function loadRelativeTimeFormatPolyfill() {
  await import('intl-relative-time-format');
  await import('intl-relative-time-format/locale-data/en');
}

const locale: string = 'en';
if (!('RelativeTimeFormat' in Intl)) {
  void loadRelativeTimeFormatPolyfill();
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
});

const fullDateTimeFormat: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
};

const intl = new Intl.DateTimeFormat(undefined, fullDateTimeFormat);

interface Division {
  amount: number;
  name: 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';
}

const DIVISIONS: Division[] = [
  { amount: 60, name: 'second' },
  { amount: 60, name: 'minute' },
  { amount: 24, name: 'hour' },
  { amount: 7, name: 'day' },
  { amount: 4.34524, name: 'week' },
  { amount: 12, name: 'month' },
  { amount: Number.POSITIVE_INFINITY, name: 'year' },
];

export function getYear(date: Date) {
  return date.getFullYear();
}

export function getCurrentYear() {
  return getYear(new Date());
}

export function getFormattedDate(date: Date) {
  return date.toLocaleDateString();
}

export function getFormattedDateTime(date: Date) {
  return intl.format(date);
}

export function getInternationalizedFormattedDate(date: Date) {
  const dateParts = dateFormatter.formatToParts(date);
  const month = dateParts.find((element) => element.type === 'month')?.value;
  const day = dateParts.find((element) => element.type === 'day')?.value;
  const year = dateParts.find((element) => element.type === 'year')?.value;

  const monthAbbreviation = month?.slice(0, 3);

  return `${monthAbbreviation} ${day}, ${year}`;
}

export function getDateFromUTC(epoch: number) {
  return new Date(epoch * MILLISECONDS_IN_SECOND);
}

export function getTimeSinceDate(date: Date) {
  const formatter = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
  });

  let duration = (date.valueOf() - Date.now().valueOf()) / MILLISECONDS_IN_SECOND;

  if (duration > 0) {
    duration = 0;
  }

  let timeSince = '';

  for (let i = 0; i <= DIVISIONS.length; i += 1) {
    const division = DIVISIONS[i];
    if (division) {
      if (Math.abs(Math.round(duration)) < division.amount) {
        timeSince = formatter.format(Math.round(duration), division.name);
        break;
      }
      duration /= division.amount;
    }
  }

  return timeSince;
}

export function dateHasPassed(date: Date) {
  return (date.valueOf() - Date.now().valueOf()) / MILLISECONDS_IN_SECOND < 0;
}

export function getTimeSinceDateShorthand(date: Date) {
  const now = new Date();
  const rawDuration = (date.valueOf() - now.valueOf()) / MILLISECONDS_IN_SECOND / SECONDS_IN_MINUTE;

  let duration = Math.round(Math.abs(rawDuration));
  if (rawDuration > 0 || duration < 1) {
    return 'Just now';
  }

  if (duration < MINUTES_IN_HOUR) {
    return `${duration} min ago`;
  }

  duration = Math.round(duration / MINUTES_IN_HOUR);
  if (duration < HOURS_IN_DAY) {
    return `${duration} hr ago`;
  }

  const dateParts = dateFormatter.formatToParts(date);
  duration = Math.round(duration / HOURS_IN_DAY);
  if (duration < DAYS_IN_WEEK) {
    return dateParts.find((element) => element.type === 'weekday')?.value;
  }

  const MILLISECONDS_IN_YEAR =
    MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_YEAR;
  if (now.getTime() - date.getTime() < MILLISECONDS_IN_YEAR) {
    const month = dateParts.find((element) => element.type === 'month')?.value;
    const abbreviation = month?.slice(0, 3);
    const day = dateParts.find((element) => element.type === 'day')?.value;

    return `${abbreviation} ${day}`;
  }

  return `${now.getFullYear() - date.getFullYear()} yr ago`;
}

export function getPreviousDateShorthand(date: Date) {
  const dateParts = dateFormatter.formatToParts(date);
  const month = dateParts.find((element) => element.type === 'month')?.value;
  const year = dateParts.find((element) => element.type === 'year')?.value;

  const monthAbbreviation = month?.slice(0, 3);

  return `${monthAbbreviation} ${year}`;
}

export const getMonthNames = () => {
  const months = [];
  for (let month = 0; month < 12; month += 1) {
    const dateParts = dateFormatter.formatToParts(new Date(0, month, 2, 0, 0, 0));
    months.push(dateParts.find((element) => element.type === 'month')?.value);
  }
  return months;
};

export const getElapsedMonthNamesInYear = (year: number | undefined) => {
  return getMonthNames().filter((month: string | undefined, index: number) => {
    const now = new Date();

    // If its in the past, or nothing has been set yet then every month is an option
    if (year === undefined || year < now.getFullYear()) {
      return true;
    }

    // Sort out future months
    return index <= now.getMonth();
  });
};

export const getYearNamesSince = (startYear: number) => {
  const now = new Date();

  const years = [];

  for (let year = startYear; year <= now.getFullYear(); year += 1) {
    const dateParts = dateFormatter.formatToParts(new Date(year, 2, 2, 0, 0, 0));
    years.push(dateParts.find((element) => element.type === 'year')?.value);
  }
  return years;
};

export function getNumberFromMonthName(nameOfMonth: string) {
  const month = getMonthNames().indexOf(nameOfMonth);
  return month !== undefined ? month + 1 : null;
}

export function getMonthNameFromNumber(numberOfMonth: number) {
  const index = numberOfMonth - 1;
  const months = getMonthNames();
  return months.length >= index ? months[index] : null;
}

export function getStandardTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  });
}

export default {
  getYear,
  getCurrentYear,
  getFormattedDate,
  getFormattedDateTime,
  getInternationalizedFormattedDate,
  getDateFromUTC,
  getTimeSinceDate,
  dateHasPassed,
  getTimeSinceDateShorthand,
  getPreviousDateShorthand,
  getMonthNames,
  getElapsedMonthNamesInYear,
  getYearNamesSince,
  getMonthNameFromNumber,
  getNumberFromMonthName,
  getStandardTime,
};
