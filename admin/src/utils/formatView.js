export const formatView = (views) => {
  if (!views) {
    return `0`;
  } else if (views < 1000) {
    return views.toString();
  } else if (views < 1000000) {
    const rounded = Math.round(views / 100) / 10;
    return `${rounded % 1 === 0 ? Math.floor(rounded) : rounded}K`;
  } else {
    const rounded = Math.round(views / 100000) / 10;
    return `${rounded % 1 === 0 ? Math.floor(rounded) : rounded}M`;
  }
};
