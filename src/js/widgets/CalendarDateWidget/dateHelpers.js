// dateString will be either a string in the form "2011-11-11" or undefined
export function parseISODate(dateString) {
  if (typeof dateString === 'string') {
    const [year, month, day] = dateString.split('-', 3);
    return {
      month,
      day,
      year
    };
  }
  return {
    month: '',
    day: '',
    year: '',
  };
}

export function formatYear(val) {
  return val;
}

export function formatDayMonth(val) {
  if (val === '') return '';
  const numberVal = Number(val);
  if (numberVal) {
    const dayOrMonth = val.toString();
    if (Number(dayOrMonth) && dayOrMonth.length === 1) {
      return `0${val}`;
    } else if (Number(dayOrMonth)) {
      return dayOrMonth;
    }
  }
  return '';
}

export function formatISOPartialDate({ month, day, year }) {
  if (month && day && year) {
    return `${formatYear(year)}-${formatDayMonth(month)}-${formatDayMonth(day)}`;
  }

  return undefined;
}
