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
    :height="height ? height : '16px'"
    class="overflow-visible"
  >
    <g :class="[fill, stroke]">
      <path
        id="Path_585"
        data-name="Path 585"
        d="M398.93,292.14a4.393,4.393,0,0,1-2.31,3.87,4.386,4.386,0,0,1-4.18,0,4.4,4.4,0,1,1,6.49-3.87Z"
        transform="translate(-386.53 -287.74)"
      />
      <path
        id="Path_586"
        data-name="Path 586"
        d="M398.27,296.69a6.273,6.273,0,0,1-.94.65,5.91,5.91,0,0,1-2.8.71,5.825,5.825,0,0,1-2.8-.71,5.612,5.612,0,0,1-.94-.65,7.975,7.975,0,0,0-4.26,7.05h16A7.975,7.975,0,0,0,398.27,296.69Z"
        transform="translate(-386.53 -287.74)"
      />
    </g>
  </svg>
</template>
