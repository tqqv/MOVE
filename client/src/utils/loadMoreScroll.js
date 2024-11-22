export function loadMoreScroll(loadFunction, offset = 200) {
  return function () {
    const bottomOfPage =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - offset;
    if (bottomOfPage) {
      loadFunction();
    }
  };
}
