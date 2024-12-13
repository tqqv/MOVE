import { getAllNotifications, getQuantity, receivedNoti } from '@/services/notification';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const loading = ref(false);
  const quantityNotifications = ref();

  const notifications = ref([]);
  const newNotification = ref(null);
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

  const addNotification = (notification) => {
    notifications.value.push(notification);
    newNotification.value = notification;

    if (quantityNotifications.value) {
      quantityNotifications.value.unRecievedCount =
        (quantityNotifications.value.unRecievedCount || 0) + 1;
    } else {
      quantityNotifications.value = {
        unRecievedCount: 1,
      };
    }
  };
  return {
    loading,
    quantityNotifications,
    fetchQuantifyNotifications,
    markReceivedQuantity,
    newNotification,
    addNotification,
  };
});
