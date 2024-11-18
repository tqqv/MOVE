export const formatDuration = (durationInSeconds) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const genreDuration = (duration) => {
  if (duration > 60) {
    return `> 1 hour`;
  } else if (duration <= 60 && duration >= 30) {
    return `< 1 hour`;
  } else if (duration < 30 && duration > 0) return `< 30 mins`;
};
