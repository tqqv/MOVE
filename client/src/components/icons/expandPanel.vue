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
    :height="height ? height : '14px'"
    class="overflow-visible"
  >
    <g :class="[fill, stroke]">
      <path
        id="Path_569"
        data-name="Path 569"
        d="M906.81,202.45l.83.82a.875.875,0,0,0,1.25,0h0l7.21-7.21a.875.875,0,0,0,0-1.25h0l-7.21-7.21a.875.875,0,0,0-1.25,0h0l-.83.82a.887.887,0,0,0,0,1.26l.01.01,4.47,4.26H900.63a.892.892,0,0,0-.89.89v1.19a.892.892,0,0,0,.89.89h10.66l-4.47,4.26a.884.884,0,0,0-.04,1.25.077.077,0,0,1,.03.02"
        transform="translate(-893.96 -187.337)"
      />
    </g>
  </svg>
</template>
