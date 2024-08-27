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
    :width="width ? width : '12px'"
    :height="height ? height : '20px'"
    class="overflow-visible"
  >
    <g :class="[fill, stroke]">
      <path
        id="Path_582"
        data-name="Path 582"
        d="M293.24,204.67a1.314,1.314,0,0,1-.69-.14,1.223,1.223,0,0,1-.69-.41,1.962,1.962,0,0,1-.55-1.33,2.287,2.287,0,0,1,.55-1.38l6.02-6.02-6.02-5.97a2.263,2.263,0,0,1-.55-1.38,1.963,1.963,0,0,1,.55-1.29,1.912,1.912,0,0,1,1.38-.55,1.867,1.867,0,0,1,1.38.55l7.35,7.3a1.9,1.9,0,0,1,.55,1.33,1.869,1.869,0,0,1-.55,1.38l-7.35,7.35a1.1,1.1,0,0,1-.6.41,1.472,1.472,0,0,1-.78.15Z"
        transform="translate(-291.31 -186.2)"
        fill-rule="evenodd"
      />
    </g>
  </svg>
</template>
