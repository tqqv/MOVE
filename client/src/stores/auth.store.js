import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore('auth', () => {
  // State
  const count = ref(0);
  const name = ref('Vit');

  // Getter
  const doubleCount = computed(() => count.value * 2);

  // actions
  function increment() {
    count.value++;
  }

  return { count, name, doubleCount, increment };
});
