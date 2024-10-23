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
  const tab = ref('1');
  const keywords = ref('');
  const selectCategoryOptions = ref(0);
  const selectLevelWorkoutOptions = ref(1);

  const setKeywords = (value) => {
    keywords.value = value;
  };
  const setSelectCategoryOptions = (value) => {
    selectCategoryOptions.value = value;
  };
  const setSelectLevelWorkoutOptions = (value) => {
    selectLevelWorkoutOptions.value = value;
  };
  const setTab = (value) => {
    tab.value = value;
  };
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
  const clear = () => {
    uploadProgress.value = 0;
    uri.value = null;
    isNext.value = false;
    uploadTitle.value = '';
    uploadDescription.value = '';
    uploadCategory.value = '';
    uploadThumbnail.value = null;
    thumbnailPreview.value = '';
    duration.value = 0;
    commentSetting.value = true;
    keywords.value = '';
    selectCategoryOptions.value = 0;
    selectLevelWorkoutOptions.value = 1;
    tab.value = '1';
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
    tab,
    keywords,
    selectCategoryOptions,
    selectLevelWorkoutOptions,
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
    clear,
    setTab,
    setKeywords,
    setSelectCategoryOptions,
    setSelectLevelWorkoutOptions,
  };
});
