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
    :width="width ? width : '45px'"
    :height="height ? width : '36px'"
    class="overflow-visible"
  >
    <g :class="[fill, stroke]">
      <path
        id="Icon_awesome-photo-video"
        data-name="Icon awesome-photo-video"
        d="M42.75,0H11.25A2.25,2.25,0,0,0,9,2.25V9H20.25V4.5h13.5V27h9A2.25,2.25,0,0,0,45,24.75V2.25A2.25,2.25,0,0,0,42.75,0ZM16.313,7.242a.633.633,0,0,1-.633.633H13.57a.633.633,0,0,1-.633-.633V5.133A.633.633,0,0,1,13.57,4.5H15.68a.633.633,0,0,1,.633.633Zm24.75,14.625a.633.633,0,0,1-.633.633H38.32a.633.633,0,0,1-.633-.633V19.758a.633.633,0,0,1,.633-.633H40.43a.633.633,0,0,1,.633.633Zm0-7.312a.633.633,0,0,1-.633.633H38.32a.633.633,0,0,1-.633-.633V12.445a.633.633,0,0,1,.633-.633H40.43a.633.633,0,0,1,.633.633Zm0-7.312a.633.633,0,0,1-.633.633H38.32a.633.633,0,0,1-.633-.633V5.133A.633.633,0,0,1,38.32,4.5H40.43a.633.633,0,0,1,.633.633ZM29.25,11.25h-27A2.25,2.25,0,0,0,0,13.5V33.75A2.25,2.25,0,0,0,2.25,36h27a2.25,2.25,0,0,0,2.25-2.25V13.5A2.25,2.25,0,0,0,29.25,11.25Zm-22.5,4.5A2.25,2.25,0,1,1,4.5,18a2.25,2.25,0,0,1,2.25-2.25ZM27,31.5H4.5V29.25L9,24.75,11.25,27l9-9L27,24.75Z"
        fill="#13d0b4"
      />
    </g>
  </svg>
</template>
