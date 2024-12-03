export const formatView = (views) => {
  if (!views) {
    return `0`;
  } else if (views < 1000) {
    return views.toLocaleString('en-US');
  } else if (views < 1000000) {
    const rounded = Math.round(views / 100) / 10;
    return `${rounded % 1 === 0 ? Math.floor(rounded) : rounded.toLocaleString('en-US')}K`;
  } else {
    const rounded = Math.round(views / 100000) / 10;
    return `${rounded % 1 === 0 ? Math.floor(rounded) : rounded.toLocaleString('en-US')}M`;
  }
};
