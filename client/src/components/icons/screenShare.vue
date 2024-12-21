<script setup>
  const props = defineProps({
    width: {
      type: String,
      default: '22px',
    },
    height: {
      type: String,
      default: '22px',
    },
    fill: {
      type: String,
      default: '#000000',
    },
    stroke: String,
  });
</script>
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :width="width"
    :height="height"
    x="0"
    y="0"
    viewBox="0 0 48 48"
    style="enable-background: new 0 0 512 512"
    xml:space="preserve"
    class=""
  >
    <g>
      <path
        d="M41.2 38.1h-1.8c.4-.6.6-1.4.6-2.2V19.2c0-2.3-1.9-4.2-4.2-4.2h-6.2c-.6 0-1 .4-1 1s.4 1 1 1h6.2c1.2 0 2.2 1 2.2 2.2V36c0 1.2-1 2.2-2.2 2.2H12.1c-1.2 0-2.2-1-2.2-2.2V19.2c0-1.2 1-2.2 2.2-2.2H23v4.7c0 1.3 2 1.3 2 0V7.6l3.4 3.6c.9.9 2.3-.4 1.5-1.4L25 4.6c-.5-.5-1.4-.5-1.9 0l-4.9 5.2c-.9 1 .5 2.3 1.5 1.4l3.4-3.6V15h-11c-2.3 0-4.2 1.9-4.2 4.2V36c0 .8.2 1.5.6 2.2H6.8c-1 0-1.9.9-1.9 1.9v1c0 1.5 1.2 2.7 2.7 2.7h32.8c1.5 0 2.7-1.2 2.7-2.7v-1c0-1.1-.8-2-1.9-2zm-.1 3c0 .4-.3.7-.7.7H7.6c-.9 0-.7-1-.7-1.6h34.2z"
        :fill="fill"
        opacity="1"
        data-original="#000000"
      ></path>
    </g>
  </svg>
</template>
