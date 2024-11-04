export const formatTimeInStream = (seconds) => {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${secs}`;
};

export const formatTimeEndLive = (time) => {
  const date = new Date(time);

  return new Intl.DateTimeFormat('en-US', {
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true, 
  }).format(date);
};
