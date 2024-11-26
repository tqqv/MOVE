<script setup>
  import { computed, watch } from 'vue';
  import { useLoadingStore } from '@stores';
  import LogoBlack from '@assets/logoBlack.svg';
  import LogoIcon from './icons/logoIcon.vue';

  const loadingStore = useLoadingStore();
  const isLoading = computed(() => loadingStore.isLoading);
  watch(isLoading, (value) => {
    if (value) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  });
</script>

<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 top-0 left-0 w-full h-full bg-white flex items-center justify-center z-[101] overflow-hidden"
  >
    <LogoIcon width="100px" height="100px" />
    <div class="absolute bottom-10 flex flex-col items-center gap-y-3">
      <p class="font-semibold text-body">from</p>
      <img :src="LogoBlack" alt="" />
    </div>
  </div>
</template>
