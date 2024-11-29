import { ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchData } from '@/services/address';

export const useContryStore = defineStore('country', () => {
  const error = ref(null);
  const loading = ref(false);
  const countries = ref(null);

  const fetchCountries = async () => {
    loading.value = true;
    try {
      const response = await fetchData();

      if (!response.error) {
        countries.value = response;
      } else {
        error.value = response.message;
      }
    } catch (error) {
      error.value = 'Failed to load categories';
    } finally {
      loading.value = false;
    }
  };

  return { countries, fetchCountries, loading, error };
});
