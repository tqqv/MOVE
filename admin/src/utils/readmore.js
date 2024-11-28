import { ref, watch, onMounted } from 'vue';

export function useReadMore(content, maxLength = 100) {
  const showFullText = ref(false);
  const textElement = ref(null);
  const isLongText = content.length > maxLength;
  const isTallText = ref(false);

  const displayedText = () => {
    if (isLongText && !showFullText.value) {
      return content.slice(0, maxLength);
    }

    if (isTallText.value && !showFullText.value) {
      return content.slice(0, 20);
    }

    return showFullText.value || !isLongText || isTallText.value
      ? content
      : content.slice(0, maxLength);
  };

  const toggleText = () => {
    showFullText.value = !showFullText.value;
  };

  const checkHeight = () => {
    if (textElement.value) {
      isTallText.value = textElement.value.scrollHeight > 50;
    }
  };

  onMounted(() => {
    checkHeight();
    window.addEventListener('resize', checkHeight);
  });

  watch(() => content, checkHeight);

  return {
    showFullText,
    displayedText,
    toggleText,
    isLongText,
    isTallText,
    textElement,
  };
}
