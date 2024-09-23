<script setup>
  import { ref } from 'vue';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import videoUpload from '@/components/icons/videoUpload.vue';
  import * as tus from 'tus-js-client';
  import axiosInstance from '@services/axios';
  import { storeToRefs } from 'pinia';
  import { usePopupStore, useVideoStore } from '@/stores';
  import { toast } from 'vue3-toastify';

  const selectedFile = ref(null);
  const uploadProgress = ref(0);
  const popupStore = usePopupStore();
  const videoStore = useVideoStore();
  const { showUploadVideoPopup } = storeToRefs(popupStore);
  const { openVideoDetailPopup, openUploadVideoPopup, closeUploadVideoPopup } = popupStore;
  const { setUploadProgress, setUri } = videoStore;
  const onFileSelected = (event) => {
    selectedFile.value = event.target.files[0];
    startUpload();
  };

  const startUpload = async () => {
    if (!selectedFile.value) return;
    uploadProgress.value = 0;

    try {
      openVideoDetailPopup();
      const response = await axiosInstance.post('video/upload-video', {
        fileName: selectedFile.value.name,
        fileSize: selectedFile.value.size,
      });

      if (!response.status === 200) {
        toast.error('Failed to get upload link');
        throw new Error('Failed to get upload link');
      }

      const { uploadLink, uri } = response.data.data;
      const upload = new tus.Upload(selectedFile.value, {
        endpoint: uploadLink,
        uploadUrl: uploadLink,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
          filename: selectedFile.value.name,
          filetype: selectedFile.value.type,
        },
        onError: (error) => {
          toast.error(error.message);
        },
        onProgress: async (bytesUploaded, bytesTotal) => {
          uploadProgress.value = Math.round((bytesUploaded / bytesTotal) * 100);
          setUploadProgress(uploadProgress.value);
        },
        onSuccess: async () => {
          toast.success('Upload successful');
          setUri(uri);
          closeUploadVideoPopup();
        },
      });

      upload.start();
    } catch (error) {
      toast.error(error.message);
    }
  };
</script>
<template>
  <Button label="Upload video" @click="openUploadVideoPopup" />
  <Dialog
    v-model:visible="showUploadVideoPopup"
    modal
    header="Upload a video"
    :draggable="false"
    :style="{ width: '842px', height: '400px' }"
  >
    <div>
      <div class="flex items-center justify-center flex-col py-14 border border-primary rounded-xl">
        <input
          type="file"
          @change="onFileSelected"
          accept="video/*"
          class="opacity-0 w-100 h-[279.6px] absolute"
        />
        <videoUpload class="cursor-pointer fill-primary" />
        <p class="mt-6 mb-0">Drag and drop your video to upload.</p>
        <span class="capitalize mt-1">or</span>
        <div class="mt-1">
          <p class="btn hover:bg-primary-light leading-none">Select a video</p>
        </div>
        <span class="text-footer mt-1">Max file size: 2GB</span>
      </div>
    </div>
  </Dialog>
</template>
