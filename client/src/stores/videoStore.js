// stores/videoStore.js
import { defineStore } from 'pinia';

export const useVideoStore = defineStore('videoStore', {
  state: () => ({
    selectedVideosByDate: new Map(), // Lưu trữ video đã chọn theo ngày
  }),
  actions: {
    // Thêm hoặc xóa video cho một ngày
    toggleVideoSelection(date, video) {
      const dateKey = date.toISOString(); // Chuyển ngày thành chuỗi để làm key trong Map

      // Kiểm tra xem video đã được chọn cho ngày này chưa
      if (this.selectedVideosByDate.has(dateKey)) {
        // Nếu video đã có trong Map, thêm video vào mảng
        const videosForDate = this.selectedVideosByDate.get(dateKey);
        const index = videosForDate.findIndex((v) => v.id === video.id);
        if (index === -1) {
          videosForDate.push(video); // Thêm video nếu chưa có
        } else {
          videosForDate.splice(index, 1); // Xóa video nếu đã chọn trước đó
        }
      } else {
        // Nếu chưa có video cho ngày này, tạo mới
        this.selectedVideosByDate.set(dateKey, [video]);
      }
    },
    getVideosForDate(date) {
      const dateKey = date.toISOString();
      return this.selectedVideosByDate.get(dateKey) || [];
    },
  },
});
