<script setup>
  const props = defineProps({
    width: {
      type: String,
      default: '30px',
    },
    height: {
      type: String,
      default: '30px',
    },
    fill: {
      type: String,
      default: '#666666',
    },
    stroke: {
      type: String,
      default: 'none',
    },
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
    viewBox="0 0 512 512"
    style="enable-background: new 0 0 512 512"
    xml:space="preserve"
    class=""
  >
    <g>
      <path
        fill-rule="evenodd"
        d="m44.389 220.363 112.168-34.293-87.582-69.588-51.529 15.754zm0 0h450.165v257.961c0 18.522-15.155 33.676-33.677 33.676H78.066c-18.522 0-33.677-15.155-33.677-33.676zm277.604 145.818-52.522-30.323-52.521-30.323v121.293l52.521-30.323zM196.102 173.979l-87.582-69.588 83.477-25.521c29.193 23.196 58.389 46.391 87.581 69.588zm123.022-37.611 83.477-25.521-2.527-2.008-85.054-67.581-83.477 25.522 87.581 69.588zm123.022-37.612-87.581-69.588L449.97 0l26.943 88.127z"
        clip-rule="evenodd"
        :fill="fill"
        opacity="1"
        data-original="#000000"
        class=""
      ></path>
    </g>
  </svg>
</template>
