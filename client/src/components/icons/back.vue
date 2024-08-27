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
        id="Path_618"
        data-name="Path 618"
        d="M197.8,206.21a1.673,1.673,0,0,1-.845-.152,1.347,1.347,0,0,1-.65-.444l-7.963-7.963a2.008,2.008,0,0,1-.6-1.5,2.044,2.044,0,0,1,.6-1.441l7.963-7.909a1.991,1.991,0,0,1,1.5-.6,2.072,2.072,0,0,1,1.5.6,2.1,2.1,0,0,1,.6,1.4,2.477,2.477,0,0,1-.6,1.5l-6.522,6.468,6.522,6.522a2.477,2.477,0,0,1,.6,1.5,2.1,2.1,0,0,1-.6,1.441,1.267,1.267,0,0,1-.748.444,1.518,1.518,0,0,1-.748.141Z"
        transform="translate(-187.75 -186.21)"
        fill-rule="evenodd"
      />
    </g>
  </svg>
</template>
