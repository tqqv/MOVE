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
  <div
    ref="scrollContainerRef"
    class="flex-1 mr-0.5 mt-[72px] min-h-screen overflow-y-scroll mb-7 bg-[#f4f7fe] pb-20"
  >
    <slot></slot>
  </div>
</template>
