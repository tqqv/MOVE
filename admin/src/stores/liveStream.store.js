import { fetchLiveStreamByStreamer } from '@/services/liveStream';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLiveStreamStore = defineStore('liveStream', () => {
  const complete = ref(false);
  const liveStreamData = ref({});

  const setCompleteStatus = (status) => {
    complete.value = status;
  };
  const updateLiveStreamData = (newData) => {
    Object.assign(liveStreamData.value, newData);
  };

  const fetchLiveStreamData = async (username) => {
    try {
      const response = await fetchLiveStreamByStreamer(username);
      liveStreamData.value = response.data.livestream;
      return response.data;
    } catch (error) {
      error.value = 'Failed to load followers';
    } finally {
    }
  };

  return {
    complete,
    liveStreamData,
    setCompleteStatus,
    updateLiveStreamData,
    fetchLiveStreamData,
  };
});
