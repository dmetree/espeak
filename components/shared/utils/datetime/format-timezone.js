export const getTimeZoneFormatted = () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offsetInMinutes = new Date().getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetInMinutes) / 60);
  const offsetMinutes = Math.abs(offsetInMinutes) % 60;
  const sign = offsetInMinutes < 0 ? '+' : '-';

  return `(GMT${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes
    .toString()
    .padStart(2, '0')}) ${timeZone}`;
};
