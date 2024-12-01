import { getCardInfo } from '@/services/payment';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCardStore = defineStore('getCard', () => {
  const card = ref(null);
  const isLoadingCard = ref(false);

  const fetchCard = async () => {
    isLoadingCard.value = true;
    try {
      const res = await getCardInfo();

      if (res && res.status === 200) {
        card.value = res.data.data;
      } else {
        console.error('Get card failed');
      }
    } catch (error) {
      console.error('Error fetching card:', error);
    } finally {
      isLoadingCard.value = false;
    }
  };

  const clearCard = () => {
    card.value = null;
  };

  return {
    card,
    fetchCard,
    clearCard,
    isLoadingCard,
  };
});
