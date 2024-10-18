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
    viewBox="0 0 31.106 31.106"
    style="enable-background: new 0 0 512 512"
    xml:space="preserve"
    class=""
  >
    <g>
      <path
        d="M21.239 5.555C21.239 2.488 19.233 0 15.553 0c-3.684 0-5.557 2.488-5.557 5.555V6.88h11.242V5.555h.001zM15.553 19.997c3.68 0 5.686-2.486 5.686-5.553V7.851H9.996v6.592c0 3.068 1.873 5.554 5.557 5.554z"
        :fill="fill"
        opacity="1"
        data-original="#000000"
      ></path>
      <path
        d="M23.33 6.666v7.778c0 4.288-2.877 7.776-7.777 7.776s-7.777-3.488-7.777-7.776V6.666c-1.239-1.239-2.221 0-2.221 0v7.778c0 5.145 3.889 9.38 8.887 9.933v3.451l-4.428.01-1.129 3.268h12.97l-1.105-3.281-4.087.001v-3.451c5-.554 8.887-4.788 8.887-9.933h.002V6.666c-1.364-1.361-2.222 0-2.222 0z"
        :fill="fill"
        opacity="1"
        data-original="#000000"
      ></path>
    </g>
  </svg>
</template>
