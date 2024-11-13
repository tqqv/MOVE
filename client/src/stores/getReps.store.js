import { getListRepPackage } from '@/services/payment';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGetRepsStore = defineStore('getReps', () => {
  const reps = ref(null);
  const money = ref(null);
  const selectedOption = ref(null);

  const purchaseOptions = ref([
    // { reps: 300, money: 1.5, discount: '29', firstTime: true },
    // { reps: 500, money: 3.5, discount: '' },
    // { reps: 1500, money: 9.95, discount: '5' },
    // { reps: 5000, money: 32.5, discount: '7' },
    // { reps: 25000, money: 154.0, discount: '12' },
  ]);

  const getRepPackages = async () => {
    const res = await getListRepPackage();
    console.log(res);

    if (res && res.status === 200) {
      purchaseOptions.value = res.data.data;
    } else {
      console.error('get list rep package failed');
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
  };
});
