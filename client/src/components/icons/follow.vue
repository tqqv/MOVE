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
    :width="width ? width : '14px'"
    :height="height ? height : '12px'"
    class="overflow-visible"
  >
    <g :class="[fill, stroke]">
      <path
        id="Path_595"
        data-name="Path 595"
        d="M201.14,390.72a4.387,4.387,0,0,0-6.98.47,4.387,4.387,0,0,0-6.98-.47,5.158,5.158,0,0,0-1.25,3.44,6.172,6.172,0,0,0,1.7,4.08,35.394,35.394,0,0,0,4.02,3.76c.6.51,1.22,1.04,1.89,1.63a.947.947,0,0,0,1.26-.02c.66-.58,1.28-1.1,1.88-1.61a36.217,36.217,0,0,0,4.02-3.76,6.191,6.191,0,0,0,1.7-4.08A5.289,5.289,0,0,0,201.14,390.72Z"
        transform="translate(-185.93 -389.21)"
      />
    </g>
  </svg>
</template>
