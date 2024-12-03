export const formatPercentage = (value) => {
  const percentage = Math.min(Math.max(value, 0), 100);

  return `${percentage.toFixed(0)}`;
};
