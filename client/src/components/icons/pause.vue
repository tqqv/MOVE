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
    :width="width ? width : '16.61px'"
    :height="height ? height : '20.13px'"
    class="overflow-visible"
  >
    <g :class="[fill, stroke]">
      <path
        id="Path_573"
        data-name="Path 573"
        d="M491.76,305.74h-4.49a.53.53,0,0,1-.57-.5v-19a.537.537,0,0,1,.57-.5h4.49a.537.537,0,0,1,.57.5v19a.536.536,0,0,1-.57.5"
        transform="translate(-486.7 -285.739)"
      />
      <path
        id="Path_574"
        data-name="Path 574"
        d="M502.13,305.74h-4.49a.53.53,0,0,1-.57-.5v-19a.537.537,0,0,1,.57-.5h4.49a.543.543,0,0,1,.57.5v19a.53.53,0,0,1-.57.5"
        transform="translate(-486.7 -285.739)"
      />
    </g>
  </svg>
</template>
