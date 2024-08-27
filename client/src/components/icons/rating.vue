<script setup>
  const props = defineProps({
    width: String,
    height: String,
    fill: String,
    stroke: String,
  });
</script>
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width ? width : '21px'"
    :height="height ? height : '20px'"
    class="overflow-visible"
  >
    <g :class="[fill, stroke]">
      <path
        id="Path_566"
        data-name="Path 566"
        d="M503.28,192.97h-5.66l-1.72-5.13a.626.626,0,0,0-.8-.37.616.616,0,0,0-.37.37l-1.72,5.13h-5.7a.615.615,0,0,0-.61.62.34.34,0,0,0,.01.1.563.563,0,0,0,.26.43l4.65,3.28-1.78,5.19a.612.612,0,0,0,.21.69.582.582,0,0,0,.35.15.733.733,0,0,0,.38-.14l4.54-3.24,4.54,3.24a.766.766,0,0,0,.38.14.532.532,0,0,0,.34-.15.612.612,0,0,0,.21-.69L499,197.4l4.61-3.31.11-.1a.6.6,0,0,0,.06-.83.579.579,0,0,0-.5-.19Z"
        transform="translate(-486.7 -187.431)"
      />
    </g>
  </svg>
</template>
