<script setup>
  import { onMounted, ref } from 'vue';
  import Hls from 'hls.js';

  const props = defineProps({
    username: String,
  });

  const frameVideo = ref(null);
  const urlHls = `${import.meta.env.VITE_HLS_STREAM_URL}/${props.username || 'default'}.m3u8`;
  let lastPausedTime = 0;

  const initializeHLS = (videoElement, source) => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(source);
      hls.attachMedia(videoElement);
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = source;
    }
  };

  const handlePause = () => {
    // Store the current time when the video is paused
    lastPausedTime = frameVideo.value.currentTime;
  };

  const handlePlay = () => {
    // Seek to the latest available time when the video resumes playing
    const videoElement = frameVideo.value;
    if (videoElement && videoElement.seekable.length > 0) {
      const latestTime = videoElement.seekable.end(0);
      if (lastPausedTime < latestTime) {
        videoElement.currentTime = latestTime; // Jump to the latest time
      }
    }
  };

  onMounted(() => {
    if (frameVideo.value) {
      initializeHLS(frameVideo.value, urlHls);

      // Add event listeners for pause and play
      frameVideo.value.addEventListener('pause', handlePause);
      frameVideo.value.addEventListener('play', handlePlay);

      frameVideo.value.addEventListener('error', () => {
        console.log('Reloading video due to error');
        initializeHLS(frameVideo.value, urlHls);
      });
    }
  });
</script>

<template>
  <div class="w-full">
    <!-- Second Video Player -->
    <div class="relative min-h-[560px] w-full max-w-full bg-black flex justify-center items-center">
      <video
        ref="frameVideo"
        class="w-full h-full object-cover"
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
  </div>
</template>

<style scoped>
  video::-webkit-media-controls-timeline,
  video::-webkit-media-controls-current-time-display,
  video::-webkit-media-controls-time-remaining-display {
    display: none;
  }
</style>
