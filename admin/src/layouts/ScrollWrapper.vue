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
</script>

<template>
  <div ref="scrollContainerRef" class="flex-1 overflow-y-scroll mr-0.5">
    <slot></slot>
  </div>
</template>
