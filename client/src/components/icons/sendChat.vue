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
    :width="width ? width : '16px'"
    :height="height ? height : '14px'"
    viewBox="0 0 18 10"
    class="overflow-visible"
  >
    <g :class="[fill, stroke]">
      <path
        id="Path_572"
        data-name="Path 572"
        d="M87.71,304.05l18.99-8.31-18.99-8.31-.01,6.46,13.57,1.85L87.7,297.59Z"
        transform="translate(-87.7 -287.43)"
      />
    </g>
  </svg>
</template>
