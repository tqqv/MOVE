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
      default: '#ffffff',
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
    viewBox="0 0 32 32"
    style="enable-background: new 0 0 512 512"
    xml:space="preserve"
    class=""
  >
    <g :class="[fill, stroke]">
      <path
        d="M30.527 7.414a.6.6 0 0 0-.827-.189l-5.657 3.555V8.959a2.155 2.155 0 0 0-2.152-2.153H3.533A2.157 2.157 0 0 0 1.38 8.959v14.082a2.157 2.157 0 0 0 2.153 2.153h18.358a2.155 2.155 0 0 0 2.152-2.153V21.22l5.657 3.555a.6.6 0 0 0 .919-.508V7.733a.6.6 0 0 0-.092-.319zm-13.054 8.867a.63.63 0 0 1-.226.23h-.004l-3.236 1.865-3.235 1.866a.622.622 0 0 1-.932-.539v-7.47a.62.62 0 0 1 .931-.537l3.233 1.869 3.234 1.87a.62.62 0 0 1 .235.846z"
        :fill="fill"
        opacity="1"
        data-original="#000000"
      ></path>
    </g>
  </svg>
</template>
