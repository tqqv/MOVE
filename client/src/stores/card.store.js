import { getCardInfo } from '@/services/payment';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCardStore = defineStore('getCard', () => {
  const card = ref({});

  const fetchCard = async () => {
    const res = await getCardInfo();

    if (res && res.status === 200) {
      card.value = res.data.data;
    } else {
      console.error('get card failed');
    }
  };

  const clearCard = () => {
    card.value = null;
  };

  return {
    card,
    fetchCard,
    clearCard,
  };
});
