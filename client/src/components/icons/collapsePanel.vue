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
        id="Path_568"
        data-name="Path 568"
        d="M798.26,202.45l-.82.82a.875.875,0,0,1-1.25,0h0l-7.21-7.21a.875.875,0,0,1,0-1.25h0l7.21-7.21a.875.875,0,0,1,1.25,0h0l.82.82a.887.887,0,0,1,0,1.26l-.01.01-4.47,4.26h10.67a.892.892,0,0,1,.89.89h0v1.19a.892.892,0,0,1-.89.89H793.78l4.47,4.26a.885.885,0,0,1,.04,1.25c-.02.01-.03.01-.03.02"
        transform="translate(-788.718 -187.337)"
      />
    </g>
  </svg>
</template>
