export const getDateAndTime = (dateTime: Date) => {
  const dateString = `${dateTime.toLocaleDateString()}`;
  const timeString = `${dateTime.getHours()}:${dateTime.getMinutes()}`;
  return { dateString, timeString };
};
