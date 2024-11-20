<script setup>
  import { onMounted, ref } from 'vue';
  import Hls from 'hls.js';

  const props = defineProps({
    username: String,
    isStreamer: Boolean,
    isSlider: Boolean,
    class: String,
  });

  const frameVideo = ref(null);
  const urlHls = `${import.meta.env.VITE_HLS_STREAM_URL}/${props.username || 'default'}.m3u8`;

  const initializeHLS = (videoElement, source) => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(source);
      hls.attachMedia(videoElement);
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = source;
    }
  };

  onMounted(() => {
    if (frameVideo.value) {
      initializeHLS(frameVideo.value, urlHls);
      frameVideo.value.addEventListener('error', () => {
        console.log('Reloading video due to error');
        initializeHLS(frameVideo.value, urlHls);
      });
    }
  });
</script>
<template>
  <!-- Second Video Player -->
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
