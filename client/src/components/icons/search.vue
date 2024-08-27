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
    :width="width ? width : '18px'"
    :height="height ? height : '18px'"
    class="overflow-visible"
  >
    <g :class="[fill, stroke]">
      <path
        id="Path_580"
        data-name="Path 580"
        d="M104.24,202.03l-3.56-3.56a8.021,8.021,0,0,0,1.31-4.41,8.11,8.11,0,1,0-8.11,8.11,8.021,8.021,0,0,0,4.41-1.31l3.56,3.56a1.69,1.69,0,0,0,2.39-2.39Zm-16.56-7.97a6.2,6.2,0,1,1,11.06,3.84l-1.03,1.03a6.185,6.185,0,0,1-10.03-4.87Z"
        transform="translate(-85.77 -185.95)"
      />
    </g>
  </svg>
</template>
