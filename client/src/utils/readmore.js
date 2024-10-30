import { ref } from 'vue';

export function useReadMore(content, maxLength = 100) {
  const showFullText = ref(false);

  const isLongText = content.length > maxLength;
  const displayedText = () =>
    showFullText.value || !isLongText ? content : content.slice(0, maxLength);

  const toggleText = () => {
    showFullText.value = !showFullText.value;
  };

  return {
    showFullText,
    displayedText,
    toggleText,
    isLongText,
  };
}
