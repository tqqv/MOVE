<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import Hls from 'hls.js';
import { useUserStore, useLiveStreamStore } from '@/stores';
import axiosInstance from '@/services/axios';

const props = defineProps({
  username: String,
  isStreamer: Boolean,
  isSlider: Boolean,
  class: String,
});

const userStore = useUserStore();
const livestreamStore = useLiveStreamStore();
const { user } = userStore;
const frameVideo = ref(null);
const urlHls = `${import.meta.env.VITE_HLS_STREAM_URL}/${props.username || 'default'}.m3u8`;

const playbackTime = ref(0);
let startTime = 0;
let lastRecordedTime = 0;
let apiCalled = false;

const initializeHLS = (videoElement, source) => {
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(source);
    hls.attachMedia(videoElement);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoElement.currentTime = 0;
    });
  } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
    videoElement.src = source;
    videoElement.addEventListener('loadedmetadata', () => {
      videoElement.currentTime = 0;
    });
  }
};


const updateViewTime = async (viewTime) => {
    if (user?.id) {
      try {
        const res = await axiosInstance.post('livestream/saveDateViewer', {
          userId: user?.id,
          viewTime: viewTime,
          livestreamId: livestreamStore.liveStreamData.id,
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  };

onMounted(() => {
  livestreamStore.fetchLiveStreamData(props.username);
  if (frameVideo.value) {
    initializeHLS(frameVideo.value, urlHls);

    frameVideo.value.addEventListener('error', () => {
      initializeHLS(frameVideo.value, urlHls);
    });

    frameVideo.value.addEventListener('timeupdate', () => {
      if (!frameVideo.value.paused && !frameVideo.value.ended) {
        const currentTime = Date.now();

        if (startTime === 0) {
          startTime = currentTime;
        }

        if (lastRecordedTime === 0) {
          lastRecordedTime = currentTime;
        }

        playbackTime.value += (currentTime - lastRecordedTime) / 1000;
        lastRecordedTime = currentTime;

        if (Math.floor(playbackTime.value) >= 5 && !apiCalled) {
          apiCalled = true;
          updateViewTime(Math.floor(playbackTime.value));
        }
      }
    });
    onBeforeUnmount(() => {
      updateViewTime(Math.floor(playbackTime.value));
    });
    frameVideo.value.addEventListener('loadedmetadata', () => {
      startTime = 0;
      lastRecordedTime = 0;
      playbackTime.value = 0;
    });
  }
});
</script>


<template>
  <div class="relative w-full max-w-full bg-black flex justify-center items-center">
    <video
      ref="frameVideo"
      class="w-[70vw] h-[70%] object-cover"
      :class="{ 'h-full': isStreamer || isSlider }"
      playsinline
      controls
      autoplay
      muted
      controlsList="nodownload noplaybackrate"
    ></video>
    <div class="absolute top-3 left-3 bg-red text-white px-3 py-1 rounded-md text-sm">
      <span>Live</span>
    </div>
  </div>
</template>
<style scoped>
  video::-webkit-media-controls-timeline,
  video::-webkit-media-controls-current-time-display,
  video::-webkit-media-controls-time-remaining-display {
    display: none;
  }
</style>
