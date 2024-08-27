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
    :width="width ? width : '24px'"
    :height="height ? height : '20px'"
    class="overflow-visible"
  >
    <g :class="[fill, stroke]">
      <path
        id="Path_591"
        data-name="Path 591"
        d="M693.1,286.06a.726.726,0,0,0-.79.16l-5.61,5.61h-2.89a.717.717,0,0,0-.72.72v6.37a.717.717,0,0,0,.72.72h2.89l5.61,5.62a.711.711,0,0,0,.51.21.919.919,0,0,0,.28-.05.72.72,0,0,0,.45-.67V286.72A.727.727,0,0,0,693.1,286.06Z"
        transform="translate(-683.09 -286.006)"
      />
      <path
        id="Path_592"
        data-name="Path 592"
        d="M700.37,295.72l2.61-2.59a.813.813,0,1,0-1.15-1.15l-2.61,2.6-2.61-2.6a.813.813,0,0,0-1.15,1.15l2.61,2.59-2.61,2.6a.809.809,0,0,0,0,1.15.818.818,0,0,0,.58.24.8.8,0,0,0,.57-.24l2.62-2.6,2.61,2.6a.812.812,0,0,0,.57.24.779.779,0,0,0,.57-.24.818.818,0,0,0,0-1.15Z"
        transform="translate(-683.09 -286.006)"
      />
    </g>
  </svg>
</template>
