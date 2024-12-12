import { getAllNotifications, getQuantity, receivedNoti } from '@/services/notification';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const loading = ref(false);
  const quantityNotifications = ref();

  const fetchQuantifyNotifications = async () => {
    try {
      const response = await getQuantity();
      quantityNotifications.value = response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const markReceivedQuantity = async () => {
    try {
      const response = await receivedNoti();
      quantityNotifications.value = response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    loading,
    quantityNotifications,
    fetchQuantifyNotifications,
    markReceivedQuantity,
  };
});
