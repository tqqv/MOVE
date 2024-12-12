// stores/bookingStore.js
import { defineStore } from 'pinia';

export const useBookingStore = defineStore('bookingStore', {
  state: () => ({
    selectedVideosByDate: new Map(), // Map lưu video theo ngày
  }),
  actions: {
    // Thêm video vào ngày
    addVideoToDate(date, video) {
      const formattedDate = date.toISOString(); // Format ngày
      const videos = this.selectedVideosByDate.get(formattedDate) || [];
      if (!videos.some((v) => v.id === video.id)) {
        videos.push(video); // Thêm video vào danh sách
        this.selectedVideosByDate.set(formattedDate, videos); // Lưu vào Map
      }
    },
    // Xóa video khỏi ngày
    removeVideoFromDate(date, videoId) {
      const formattedDate = date.toISOString();
      const videos = this.selectedVideosByDate.get(formattedDate) || [];
      const updatedVideos = videos.filter((v) => v.id !== videoId);
      this.selectedVideosByDate.set(formattedDate, updatedVideos); // Cập nhật Map
    },
    // Lấy danh sách video theo ngày
    getVideosByDate(date) {
      const formattedDate = date.toISOString();
      return this.selectedVideosByDate.get(formattedDate) || [];
    },
  },
});
