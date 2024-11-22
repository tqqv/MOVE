import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getProfileChannel } from '@/services/streamer';

export const useStreamerStore = defineStore('streamer', () => {
  const error = ref(null);
  const loading = ref(false);
  const streamerChannel = ref(null);
  const fetchProfileChannel = async () => {
    loading.value = true;
    try {
      const response = await getProfileChannel();
      if (!response.error) {
        streamerChannel.value = response.data.data;
      } else {
        error.value = response.message;
      }
    } catch (error) {
      error.value = 'Failed to load followers';
    } finally {
      loading.value = false;
    }
  };

  return { loading, streamerChannel, fetchProfileChannel };
});
