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
    :width="width ? width : '20px'"
    :height="height ? height : '20px'"
    class="overflow-visible"
  >
    <g :class="[fill, stroke]">
      <path
        id="Path_575"
        data-name="Path 575"
        d="M988.56,298.6H985.7v7.14h7.14v-2.86h-4.28Zm-2.86-5.72h2.86v-4.29h4.28v-2.86H985.7Zm17.14,10h-4.28v2.86h7.14V298.6h-2.86Zm-4.28-17.14v2.86h4.28v4.29h2.86v-7.14h-7.14Z"
        transform="translate(-985.7 -285.73)"
      />
    </g>
  </svg>
</template>
