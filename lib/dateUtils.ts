export const getDateAndTime = (dateTime: Date) => {
  const dateString = `${dateTime.getDay()}.${dateTime.getMonth()}.${dateTime.getFullYear()}`;
  const timeString = `${dateTime.getHours()}:${dateTime.getMinutes()}`;
  return { dateString, timeString };
};
