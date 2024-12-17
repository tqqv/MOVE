// src/stores/useVideoStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useVideoStore = defineStore('videoStore', () => {
  const selectedDate = ref('');
  const videosByDate = ref({});

  const setSelectedDate = (date) => {
    selectedDate.value = date;
    if (!videosByDate.value[date]) {
      videosByDate.value[date] = [];
    }
  };

  const toggleVideoSelection = (video) => {
    const currentVideos = videosByDate.value[selectedDate.value] || [];
    const index = currentVideos.findIndex((v) => v.id === video.id);

    if (index === -1) {
      videosByDate.value[selectedDate.value] = [...currentVideos, video];
    } else {
      videosByDate.value[selectedDate.value] = currentVideos.filter((v) => v.id !== video.id);
    }
  };

  const selectedVideos = () => videosByDate.value[selectedDate.value] || [];

  return { selectedDate, videosByDate, setSelectedDate, toggleVideoSelection, selectedVideos };
});
