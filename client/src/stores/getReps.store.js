import { getListRepPackage } from '@/services/payment';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGetRepsStore = defineStore('getReps', () => {
  const reps = ref(null);
  const money = ref(null);
  const selectedOption = ref(null);
  const purchaseOptions = ref([]);
  const isLoadingRepPackages = ref(false);

  const getRepPackages = async () => {
    isLoadingRepPackages.value = true;
    try {
      const res = await getListRepPackage();
      console.log(res);

      if (res && res.status === 200) {
        purchaseOptions.value = res.data.data;
      } else {
        console.error('get list rep package failed');
      }
    } catch (error) {
      console.error('Error fetching rep packages:', error);
    } finally {
      isLoadingRepPackages.value = false;
    }
  };
  const setSelectedOption = (option) => {
    selectedOption.value = option;
  };
  const clearSelectedOption = () => {
    selectedOption.value = null;
  };

  return {
    reps,
    money,
    purchaseOptions,
    selectedOption,
    setSelectedOption,
    clearSelectedOption,
    getRepPackages,
    isLoadingRepPackages,
  };
});
