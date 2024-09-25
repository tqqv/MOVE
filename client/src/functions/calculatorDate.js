import moment from 'moment';
export const formatDate = (dateString) => {
  const date = moment(dateString);
  return date.fromNow();
};

export const genreDuration = (duration) => {
  if (duration > 60) {
    return `> 1 hour`;
  } else if (duration <= 60 || duration > 30) {
    return `< 1 hour`;
  } else return `< 30 mins`;
};
