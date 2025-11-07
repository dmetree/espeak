/* not used because always show local TZ */
export function convertToUnixTimestamp(
  timeZoneOffsetHours,
  scheduledUnixtime,
  date
) {
  // Step 1: Convert date to a JavaScript Date object
  const dateParts = date.split(' ');
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = monthNames.indexOf(dateParts[1]);
  const day = parseInt(dateParts[0], 10);
  const year = parseInt(dateParts[2], 10);

  // Step 2: Convert psyTime to hours
  const hours = parseInt(scheduledUnixtime, 10);

  // Step 3: Calculate the total offset in minutes
  const offsetHours = Math.floor(timeZoneOffsetHours);
  const offsetMinutes = Math.round((timeZoneOffsetHours - offsetHours) * 60);

  // Step 4: Create a Date object for the given date and time
  // const combinedDate = new Date(Date.UTC(year, month, day, hours, 0)); // Minutes set to 0

  const combinedDate = new Date(Date.UTC(year, month, day, hours, 0));

  // Adjust the time by the offset to obtain UTC time
  combinedDate.setUTCMinutes(
    combinedDate.getUTCMinutes() - (offsetHours * 60 + offsetMinutes)
  );

  // Step 5: Convert the Date object to a Unix timestamp
  const unixTimestamp = Math.floor(combinedDate.getTime() / 1000); // Convert milliseconds to seconds

  return unixTimestamp;
}
