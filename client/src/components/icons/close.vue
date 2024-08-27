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
    :height="height ? height : '16px'"
    class="overflow-visible"
  >
    <g :class="[fill, stroke]">
      <path
        id="Path_571"
        data-name="Path 571"
        d="M298.16,295.74l5.2-5.2a1.606,1.606,0,0,0,0-2.26l-.15-.15a1.606,1.606,0,0,0-2.26,0l-5.2,5.2-5.2-5.2a1.606,1.606,0,0,0-2.26,0l-.15.15a1.606,1.606,0,0,0,0,2.26l5.2,5.2-5.2,5.2a1.606,1.606,0,0,0,0,2.26l.15.15a1.606,1.606,0,0,0,2.26,0l5.2-5.2,5.2,5.2a1.593,1.593,0,0,0,2.26,0l.15-.15a1.606,1.606,0,0,0,0-2.26Z"
        transform="translate(-287.675 -287.665)"
      />
    </g>
  </svg>
</template>
