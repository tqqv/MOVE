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
    :width="width ? width : '15px'"
    :height="height ? height : '15px'"
    class="overflow-visible"
  >
    <g :class="[fill, stroke]">
      <path
        id="Path_577"
        data-name="Path 577"
        d="M804.5,285.7c-.18.03-.37.06-.57.08a33.6,33.6,0,0,1-3.47.3,21.22,21.22,0,0,1-4.48-.7,21.791,21.791,0,0,0-4.62-.64c-3.22,0-4.31.69-4.43.77l-.23.17v20.24a.811.811,0,0,0,.7.82.8.8,0,0,0,.89-.69c0-.03.01-.07.01-.11V297.1a.451.451,0,0,1,.37-.45,13.508,13.508,0,0,1,2.69-.22,21.242,21.242,0,0,1,4.39.89,20.25,20.25,0,0,0,4.78.66,26.957,26.957,0,0,0,4.11-.38.454.454,0,0,0,.4-.45V286.17a.467.467,0,0,0-.47-.46.172.172,0,0,0-.07-.01"
        transform="translate(-786.7 -284.74)"
      />
    </g>
  </svg>
</template>
