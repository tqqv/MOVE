import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false);

  function showLoading() {
    isLoading.value = true;
  }

  function hideLoading() {
    isLoading.value = false;
  }

  return { isLoading, showLoading, hideLoading };
});
