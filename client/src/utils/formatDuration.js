export const formatDuration = (durationInSeconds) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const genreDuration = (duration) => {
  if (duration > 3600) {
    return `> 1 hour`;
  } else if (duration <= 3600 && duration >= 1800) {
    return `< 1 hour`;
  } else if (duration < 1800 && duration > 0) return `< 30 mins`;
};
