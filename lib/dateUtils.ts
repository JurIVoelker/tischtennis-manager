export const getDateAndTime = (dateTime: Date) => {
  const dateString = dateTime.toLocaleDateString("de-DE", {
    timeZone: "Europe/Berlin",
  });
  const timeString = dateTime.toLocaleTimeString("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
  });
  return { dateString, timeString };
};
