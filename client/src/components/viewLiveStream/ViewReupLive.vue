<script setup>
  const props = defineProps({
    username: String,
    isStreamer: Boolean,
    isSlider: Boolean,
    class: String,
  });
</script>

<template>
  <div class="relative w-full h-[74vh] bg-black flex justify-center items-center">
    <iframe
      :src="`https://player.vimeo.com/video/1035904378?title=0&byline=0&portrait=0&autoplay=1&app_id=122963`"
      class="w-full h-full object-cover"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
    >
    </iframe>
  </div>
</template>
