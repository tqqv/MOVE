<script setup>
  const props = defineProps({
    width: {
      type: String,
      default: '18.133',
    },
    height: {
      type: String,
      default: '20',
    },
    fill: {
      type: String,
      default: '#13d0b4',
    },
    stroke: String,
  });
</script>
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 18.113 20">
    <path
      id="Icon_ionic-md-share"
      data-name="Icon ionic-md-share"
      d="M19.586,17.265a2.75,2.75,0,0,0-1.968.754L10.4,13.848a3.379,3.379,0,0,0,.1-.7,3.378,3.378,0,0,0-.1-.7l7.114-4.12a3.019,3.019,0,1,0-.959-2.211,3.359,3.359,0,0,0,.1.7l-7.114,4.12a3.037,3.037,0,0,0-2.069-.8A2.987,2.987,0,0,0,4.5,13.144a3.038,3.038,0,0,0,5.1,2.211l7.165,4.171a2.521,2.521,0,0,0-.1.653,2.926,2.926,0,1,0,2.926-2.914Z"
      transform="translate(-4.5 -3.094)"
      :fill="fill"
    />
  </svg>
</template>
