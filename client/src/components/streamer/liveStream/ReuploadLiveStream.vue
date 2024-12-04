<script setup>
  import { ref } from 'vue';
  import EmptyImage from '@/components/icons/emptyImage.vue';
  import axiosInstance from '@services/axios';
  import * as tus from 'tus-js-client';
  import { toast } from 'vue3-toastify';
  import SmallLoading from '@/components/icons/smallLoading.vue';
  import { useLiveStreamStore } from '@/stores';
  import { reUploadLive } from '@/services/payment';

  const liveStreamStore = useLiveStreamStore();

  const selectedFile = ref(null);
  const fileInputRef = ref(null);
  const uploadProgress = ref(0);
  const uploadedVideoUrl = ref(null);
  const duration = ref('');
  const isUploading = ref(false);
  const videoUri = ref('');
  const videoId = ref('');
  const loadingPublic = ref(false);
  const publish = ref(false);

  const onFileSelected = (e) => {
    selectedFile.value = e.target.files[0];
    startUpload();
  };

  const handleSelectedFile = () => {
    fileInputRef.value.click();
  };

  //   SAVE LIVE
  const saveVideo = async (videoId) => {
    const data = {
      videoId,
      livestreamId: liveStreamStore.liveStreamData?.id,
      title: liveStreamStore.liveStreamData?.title,
      description: liveStreamStore.liveStreamData?.description,
      categoryId: liveStreamStore.liveStreamData?.categoryId,
      levelWorkoutsId: liveStreamStore.liveStreamData?.levelWorkoutsId,
      thumbnailUrl: liveStreamStore.liveStreamData?.thumbnailUrl,
      videoUrl: uploadedVideoUrl.value,
      duration: duration.value,
      status: 'private',
    };

    try {
      const response = await reUploadLive(data);
      return response;
    } catch (error) {
      console.error('Error in reUploadLive:', error);
    }
  };

  // UPLOAD LIVE
  const startUpload = async () => {
    const videoTypes = [
      'video/mp4',
      'video/x-m4v',
      'video/ogg',
      'video/webm',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-ms-wmv',
      'video/x-matroska',
      'video/x-flv',
    ];
    const MAX_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

    // Validate file type and size
    if (!selectedFile.value || !videoTypes.includes(selectedFile.value.type)) {
      toast.error('Please select a valid video file!');
      return;
    }
    if (selectedFile.value.size >= MAX_SIZE) {
      toast.error('The video file must not exceed 2GB!');
      return;
    }

    isUploading.value = true;
    uploadProgress.value = 0;

    try {
      // Get upload link from backend
      const response = await axiosInstance.post('video/upload-video', {
        fileName: selectedFile.value.name,
        fileSize: selectedFile.value.size,
      });

      if (response.status !== 200) {
        throw new Error('Failed to get upload link');
      }

      const { uploadLink, uri } = response.data.data;
      videoUri.value = uri;
      const videoId = uri.split('/').pop();

      // Setup TUS upload
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
          isUploading.value = false;
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          uploadProgress.value = Math.round((bytesUploaded / bytesTotal) * 100);
        },
        onSuccess: async () => {
          try {
            // Check video processing status
            const checkProcessing = async () => {
              const videoData = await axiosInstance.post('video/check-video-status', {
                videoUri: uri,
              });

              if (videoData.data.data.upload.status === 'complete') {
                // Get video URL
                const videoDetails = await axiosInstance.post('video/get-video', {
                  videoUri: uri,
                });
                duration.value = videoDetails.data.data.duration;
                uploadedVideoUrl.value = videoDetails.data.data.videoUrl;
                toast.success('Upload successful');
                isUploading.value = false;
                return;
              }

              // If not complete, wait and check again
              await new Promise((resolve) => setTimeout(resolve, 10000));
              return await checkProcessing();
            };
            await checkProcessing();
            saveVideo(videoId);
          } catch (error) {
            toast.error(error.message);
            isUploading.value = false;
          }
        },
      });

      upload.start();
    } catch (error) {
      toast.error(error.message);
      isUploading.value = false;
    }
  };

  //   PUBLIC LIVE
  const handlePublicLive = async () => {
    const videoId = videoUri.value.split('/').pop();
    try {
      loadingPublic.value = true;
      const response = await axiosInstance.patch('video/update-video', {
        videoId,
        updateData: {
          status: 'public',
        },
      });
      if (response.status === 200) {
        publish.value = true;
        loadingPublic.value = false;
        toast.success('Video published successfully');
      }
    } catch (error) {
      console.log(error);
    }
  };
</script>

<template>
  <div class="flex justify-between items-center">
    <h1 class="font-semibold">Repost livestream</h1>
    <input
      type="file"
      id="myFile"
      name="filename"
      ref="fileInputRef"
      class="hidden"
      @change="onFileSelected"
      accept="video/*, .mkv"
    />
    <h1 class="text-sm cursor-pointer text-primary underline" @click="handleSelectedFile">
      Choose livestream
    </h1>
  </div>
  <span class="text-footer text-xs italic my-2">
    You can upload your livestream video so that users can watch it again.
  </span>

  <!-- Upload Progress -->
  <div v-if="isUploading" class="flex flex-col">
    <div class="flex flex-col gap-y-2 justify-between my-4">
      <div class="flex justify-between mb-1">
        <div class="loader">
          <div class="scanner font-semibold">
            <span>Loading...</span>
          </div>
        </div>
        <span class="text-sm font-medium"
          >{{ uploadProgress === 0 ? 0 : uploadProgress - 5 }}%</span
        >
      </div>
      <div class="w-full bg-gray-dark rounded-full h-2.5">
        <div
          class="bg-primary h-2.5 rounded-full"
          :style="{ width: ` ${uploadProgress === 100 ? uploadProgress - 5 : uploadProgress}%` }"
        ></div>
      </div>
    </div>
  </div>

  <!-- Uploaded Video Display -->
  <div v-if="uploadedVideoUrl" class="mt-4 rounded-md overflow-hidden">
    <iframe
      :src="`${uploadedVideoUrl}&title=0&byline=0&portrait=0`"
      width="100%"
      height="260"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
    >
    </iframe>
  </div>

  <!-- Empty State -->
  <div
    v-else-if="!isUploading"
    class="flex flex-col items-center justify-center rounded-md py-20 bg-gray-light/40 border-2 border-dashed border-gray-dark mt-3"
  >
    <EmptyImage />
    <p class="mt-4 text-gray-500">No video uploaded yet</p>
  </div>
  <div v-if="uploadedVideoUrl && !publish" class="flex justify-end mt-3">
    <div @click="handlePublicLive" class="btn w-32 text-center cursor-pointer">
      <SmallLoading v-if="loadingPublic" />
      <span v-else>Publish</span>
    </div>
  </div>

  <div v-if="publish" class="flex gap-x-1 justify-end mt-4 text-sm">
    <RouterLink :to="`/video/${videoUri.split('/').pop()}`">
      <button class="learn-more">
        <span class="circle" aria-hidden="true">
          <span class="icon arrow"></span>
        </span>
        <span class="button-text">View video</span>
      </button>
    </RouterLink>
  </div>
</template>

<style scoped>
  .scanner span {
    color: transparent;
    font-size: 0.875rem;
    position: relative;
    overflow: hidden;
  }

  .scanner span::before {
    content: 'Loading...';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    border-right: 4px solid #000000;
    overflow: hidden;
    color: #000000;
    animation: load91371 2s linear infinite;
  }

  @keyframes load91371 {
    0%,
    10%,
    100% {
      width: 0;
    }

    10%,
    20%,
    30%,
    40%,
    50%,
    60%,
    70%,
    80%,
    90%,
    100% {
      border-right-color: transparent;
    }

    11%,
    21%,
    31%,
    41%,
    51%,
    61%,
    71%,
    81%,
    91% {
      border-right-color: #000000;
    }

    60%,
    80% {
      width: 100%;
    }
  }

  button {
    position: relative;
    display: inline-block;
    cursor: pointer;
    outline: none;
    border: 0;
    vertical-align: middle;
    text-decoration: none;
    background: transparent;
    padding: 0;
    font-size: inherit;
    font-family: inherit;
  }

  button.learn-more {
    width: 8rem;
    height: auto;
  }

  button.learn-more .circle {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: relative;
    display: block;
    margin: 0;
    width: 2rem;
    height: 2rem;
    background: #13d0b4;
    border-radius: 1rem;
  }

  button.learn-more .circle .icon {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #fff;
  }

  button.learn-more .circle .icon.arrow {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    left: 0.5rem;
    width: 0.74rem;
    height: 0.02rem;
    background: none;
  }

  button.learn-more .circle .icon.arrow::before {
    position: absolute;
    content: '';
    top: -0.1478rem;
    right: 0.05rem;
    width: 0.4rem;
    height: 0.4rem;
    border-top: 0.1rem solid #fff;
    border-right: 0.1rem solid #fff;
    transform: rotate(45deg);
  }

  button.learn-more .button-text {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0.5rem 0;
    margin: 0 0 0 1.5rem;
    color: #13d0b4;
    font-weight: 700;
    line-height: 1.4;
    text-align: center;
    text-transform: uppercase;
    font-size: 0.7rem;
  }

  button:hover .circle {
    width: 100%;
  }

  button:hover .circle .icon.arrow {
    background: #fff;
    transform: translate(0.8rem, 0);
  }

  button:hover .button-text {
    color: #fff;
  }
</style>
