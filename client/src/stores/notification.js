import { getAllNotifications, getQuantity, receivedNoti } from '@/services/notification';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const listNotifications = ref([]);
  const quantityNotifications = ref();
  const loading = ref(false);
  const fetchListNotifications = async () => {
    try {
      loading.value = true;
      const response = await getAllNotifications();
      listNotifications.value = response.data.data;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

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
    listNotifications,
    quantityNotifications,
    fetchListNotifications,
    fetchQuantifyNotifications,
    markReceivedQuantity,
  };
});
