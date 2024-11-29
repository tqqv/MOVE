import { defineStore } from 'pinia';
import { getVideoById } from '@/services/video';
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
  const selectCategoryOptions = ref('0');
  const selectLevelWorkoutOptions = ref('1');
  const videoIdDetail = ref(0);
  const isEdit = ref(false);

  const setIsEdit = (value) => {
    isEdit.value = value;
  };
  const setVideoIdDetail = (value) => {
    videoIdDetail.value = value;
  };
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
  const getVideo = async (videoId) => {
    try {
      if (videoId !== 0) {
        const response = await getVideoById(videoId);
        if (response.success) {
          uploadProgress.value = 100;
          uri.value = `/videos/${response.data.id}`;
          uploadTitle.value = response.data.title;
          uploadDescription.value = response.data.description;
          uploadCategory.value = response.data.category;
          uploadThumbnail.value = response.data.thumbnailUrl;
          thumbnailPreview.value = response.data.thumbnailUrl;
          duration.value = response.data.duration;
          commentSetting.value = response.data.isCommentable || true;
          selectCategoryOptions.value = response.data.categoryId || '0';
          selectLevelWorkoutOptions.value = response.data.levelWorkoutsId || '1';
        }
      }
    } catch (err) {
      console.log(err);
    }
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
    videoIdDetail.value = 0;
    isEdit.value = false;
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
    videoIdDetail,
    isEdit,
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
    getVideo,
    setVideoIdDetail,
    setIsEdit,
  };
});
