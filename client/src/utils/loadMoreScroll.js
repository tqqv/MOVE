import { onMounted, onUnmounted } from 'vue';

export function useLoadMoreScroll(scrollContainerRef, loadFunction, offset = 200) {
  const handleScroll = () => {
    if (!scrollContainerRef.value) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.value;

    const bottomOfContainer = scrollTop + clientHeight >= scrollHeight - offset;

    console.log(bottomOfContainer);

    if (bottomOfContainer) {
      loadFunction();
    }
  };

  onMounted(() => {
    if (scrollContainerRef.value) {
      scrollContainerRef.value.addEventListener('scroll', handleScroll);
    }
  });

  onUnmounted(() => {
    if (scrollContainerRef.value) {
      scrollContainerRef.value.removeEventListener('scroll', handleScroll);
    }
  });

  return { handleScroll };
}
