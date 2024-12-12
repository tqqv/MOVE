<script setup>
  import { ref, watch, computed } from 'vue';
  import VideoUpload from '@icons/videoUpload.vue';
  import { useVideoStore } from '@stores';
  import { storeToRefs } from 'pinia';
  import axios from '@/services/axios';
  import { toast } from 'vue3-toastify';
  const videoStore = useVideoStore();
  const {
    thumbnailPreview,
    uploadTitle,
    uploadDescription,
    uploadThumbnail,
    uploadProgress,
    isEdit,
  } = storeToRefs(videoStore);
  const { setIsNext, setUploadTitle, setUploadDescription, setUploadThumbnail } = videoStore;
  const previewUrl = ref('');
  const isLoading = ref(false);
  const title = computed({
    get: () => uploadTitle.value || '',
    set: (val) => setUploadTitle(val),
  });

  const description = computed({
    get: () => uploadDescription.value || '',
    set: (val) => setUploadDescription(val),
  });

  const thumbnail = computed({
    get: () => uploadThumbnail.value || null,
    set: (val) => setUploadThumbnail(val),
  });
  const uploadProgress2 = ref(uploadProgress.value || 0);

  const checkNextStatus = () => {
    if (isEdit.value) {
      setIsNext(
        title?.value?.trim() !== '' &&
          thumbnailPreview?.value !== null &&
          description?.value?.trim() !== '',
      );
    } else {
      setIsNext(
        title.value.trim() !== '' &&
          thumbnailPreview.value !== null &&
          description.value.trim() !== '',
      );
    }
  };
  const onFileSelected = (event) => {
    thumbnail.value = event.target.files[0];
    isLoading.value = true;
    if (thumbnail.value) {
      console.log(thumbnail.value);
      setUploadThumbnail(thumbnail.value);
      if (thumbnailPreview.value != '') {
        previewUrl.value = URL.createObjectURL(thumbnail.value);
      }
      isLoading.value = false;
      startUpload();
    }
  };
  const deletePreview = () => {
    previewUrl.value = '';
    setUploadThumbnail(null);
    checkNextStatus();
  };
  watch(thumbnailPreview, () => {
    checkNextStatus();
  });
  watch(title, () => {
    setUploadTitle(title.value);
    checkNextStatus();
  });
  watch(description, () => {
    setUploadDescription(description.value);
    checkNextStatus();
  });
  const startUpload = async () => {
    if (!thumbnail.value) return;
    uploadProgress2.value = 0;

    try {
      const formData = new FormData();
      if (videoStore.uri && thumbnail.value) {
        formData.append('videoUri', videoStore.uri);
        formData.append('thumbnailPath', thumbnail.value);
      }
      const response = await axios.post('video/upload-thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          uploadProgress2.value = percentCompleted;
        },
      });
      console.log(response.data.data.base_link);
    } catch (error) {
      toast.error('Upload thumbnail failed');
    }
  };
</script>
<template>
  <div>
    <label for="title" class="text-[16px] font-medium">Video title</label>
    <input
      id="title"
      name="title"
      type="text"
      placeholder="Add a title"
      class="input_custom mt-2 mb-3"
      v-model="title"
    />
    <label for="description" class="text-[16px] font-medium">Video description</label>
    <textarea
      id="description"
      name="description"
      type="text"
      placeholder="Add a description"
      class="input_custom mt-2"
      v-model="description"
    />
  </div>
  <div>
    <h3 class="text-[16px] font-medium mt-3">Video thumbnail</h3>
    <div class="mt-2 grid grid-flow-col auto-cols-[220px] overflow-x-auto gap-4 scrollbar-hide">
      <div
        class="relative border-2 border-dashed border-primary w-[220px] h-[121px]"
        :class="{ 'border-none': previewUrl }"
        v-if="thumbnailPreview"
      >
        <div
          v-if="!previewUrl && !isLoading"
          class="flex items-center justify-center flex-col py-5 text-center"
        >
          <input
            type="file"
            @change="onFileSelected"
            accept="image/*"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <VideoUpload class="cursor-pointer fill-primary" />
          <p class="mt-6 mb-0 text-[12px]">Upload thumbnail</p>
        </div>
        <div v-else-if="isLoading" class="flex items-center justify-center h-full">
          <div class="custom-spinner w-10"></div>
        </div>
        <div v-else class="relative">
          <img :src="previewUrl" alt="Thumbnail preview" class="object-cover w-[220px] h-[121px]" />
          <button
            @click="deletePreview"
            class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>
      <div v-else class="w-[220px] h-[121px] bg-gray-dark flex items-center justify-center">
        <div class="custom-spinner w-10"></div>
      </div>
      <div class="w-[220px] h-[121px] relative" v-if="thumbnailPreview">
        <img :src="thumbnailPreview" alt="Thumbnail preview" class="w-full h-full object-cover" />
        <span class="bg-primary text-white absolute top-0 right-0 px-1 py-1 text-[12px] font-bold"
          >Default</span
        >
      </div>
      <div class="w-[220px] h-[121px] bg-gray-dark flex items-center justify-center" v-else>
        <div class="custom-spinner w-10"></div>
      </div>
    </div>
  </div>
</template>
