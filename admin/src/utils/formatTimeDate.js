export const formatTimeDate = (isoString) => {
  const date = new Date(isoString);
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
  const formattedDate = date
    .toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
    .replace(',', '');
  return `${time} - ${formattedDate}`;
};
