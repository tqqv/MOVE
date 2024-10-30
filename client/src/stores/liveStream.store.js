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

  return {
    complete,
    liveStreamData,
    setCompleteStatus,
    updateLiveStreamData,
  };
});
