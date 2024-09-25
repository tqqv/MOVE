import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useVideoStore = defineStore('video', () => {
  const uploadProgress = ref(0);
  const uri = ref(null);
  const isNext = ref(false);
  const uploadTitle = ref('');
  const uploadDescription = ref('');
  const uploadCategory = ref('');
  const uploadThumbnail = ref(null);
  const thumbnailPreview = ref('');
  const duration = ref(0);
  const commentSetting = ref(true);

  const setUploadProgress = (value) => {
    uploadProgress.value = value;
  };
  const setUri = (value) => {
    uri.value = value;
  };
  const setIsNext = (value) => {
    isNext.value = value;
  };
  const setUploadTitle = (value) => {
    uploadTitle.value = value;
  };
  const setUploadDescription = (value) => {
    uploadDescription.value = value;
  };
  const setUploadCategory = (value) => {
    uploadCategory.value = value;
  };
  const setUploadThumbnail = (value) => {
    uploadThumbnail.value = value;
  };
  const setThumbnailPreview = (value) => {
    thumbnailPreview.value = value;
  };
  const setDuration = (value) => {
    duration.value = value;
  };
  const setCommentSetting = (value) => {
    commentSetting.value = value;
  };

  return {
    uploadProgress,
    uri,
    isNext,
    uploadTitle,
    uploadDescription,
    uploadCategory,
    uploadThumbnail,
    thumbnailPreview,
    duration,
    commentSetting,
    setUploadProgress,
    setUri,
    setIsNext,
    setUploadTitle,
    setUploadDescription,
    setUploadCategory,
    setUploadThumbnail,
    setThumbnailPreview,
    setDuration,
    setCommentSetting,
  };
});
