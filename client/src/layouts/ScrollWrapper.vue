<!-- ScrollWrapper.vue -->
<script setup>
  import { watch, ref } from 'vue';
  import { useRoute } from 'vue-router';

  const scrollContainerRef = ref(null);
  const route = useRoute();

  watch(
    [() => route.path, () => route.params],
    () => {
      if (scrollContainerRef.value) {
        scrollContainerRef.value.scrollTop = 0;
      }
    },
    { deep: true },
  );

  // check scroll near bottom
  function emitScrollEvent() {
    const container = scrollContainerRef.value;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - scrollTop - clientHeight < 200) {
      // when near bottom (cach 200px) call near-bottom
      container.dispatchEvent(new CustomEvent('near-bottom'));
    }
  }
</script>

<template>
  <div ref="scrollContainerRef" @scroll="emitScrollEvent" class="flex-1 overflow-y-scroll mr-0.5">
    <slot></slot>
  </div>
</template>
