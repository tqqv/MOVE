<script setup>
  import { ref, watch } from 'vue';
  import VideoUpload from '@icons/videoUpload.vue';
  import { useVideoStore } from '@stores';
  import axios from '@/services/axios';
  import { toast } from 'vue3-toastify';
  const videoStore = useVideoStore();
  const { setIsNext, setUploadTitle, setUploadDescription, setUploadThumbnail } = videoStore;
  const previewUrl = ref('');
  const isLoading = ref(false);
  const thumbnail = ref(null);
  const title = ref('');
  const description = ref('');
  const uploadProgress = ref(0);

  const checkNextStatus = () => {
    setIsNext(
      title.value.trim() !== '' && thumbnail.value !== null && description.value.trim() !== '',
    );
  };
  const onFileSelected = (event) => {
    thumbnail.value = event.target.files[0];
    isLoading.value = true;
    if (thumbnail.value) {
      setUploadThumbnail(thumbnail.value);
      previewUrl.value = URL.createObjectURL(thumbnail.value);
      isLoading.value = false;
      startUpload();
      checkNextStatus();
    }
  };
  const deletePreview = () => {
    previewUrl.value = '';
    setUploadThumbnail(null);
    checkNextStatus();
  };
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
    uploadProgress.value = 0;

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
          uploadProgress.value = percentCompleted;
        },
      });
      toast.success('Upload thumbnail successful');
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
      class="input_custom mt-2"
      v-model="title"
    />
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
        class="relative border-2 border-dashed border-primary"
        :class="{ 'border-none': previewUrl }"
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
          <p>loading...</p>
        </div>
        <div v-else class="relative">
          <img :src="previewUrl" alt="Thumbnail preview" class="w-full h-full object-cover" />
          <button
            @click="deletePreview"
            class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>
      <div class="h-full bg-red">1</div>
      <div class="h-full bg-primary">2</div>
      <div class="h-full bg-blue">3</div>
      <div class="h-full bg-gray-dark">4</div>
    </div>
  </div>
</template>
