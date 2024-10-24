<script setup>
  import { onMounted, ref } from 'vue';
  import Hls from 'hls.js';

  const video2 = ref(null);
  const videoSrcHieune = 'http://localhost:8080/hls/thehoang.17.m3u8';

  const initializeHLS = (videoElement, source) => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(source);
      hls.attachMedia(videoElement);
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari which has built-in HLS support
      videoElement.src = source;
    }
  };

  onMounted(() => {
    if (video2.value) {
      initializeHLS(video2.value, videoSrcHieune);
    }
  });
</script>
<template>
  <div class="w-full">
    <!-- Second Video Player -->
    <div class="relative min-h-[560px] w-full max-w-full bg-black flex justify-center items-center">
      <video
        ref="video2"
        class="w-full h-full object-cover"
        controls
        autoplay
        muted
        controlsList="nodownload noplaybackrate"
      ></video>
      <div class="absolute top-3 left-3 bg-red text-white px-3 py-1 rounded-md text-sm">
        <span>Live</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
  video::-webkit-media-controls-timeline,
  video::-webkit-media-controls-current-time-display,
  video::-webkit-media-controls-time-remaining-display {
  }
</style>
