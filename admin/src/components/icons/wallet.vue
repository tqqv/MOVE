<script setup>
  const props = defineProps({
    width: String,
    height: String,
    stroke: String,
    fill: {
      type: String,
      default: '#ffffff',
    },
  });
</script>
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width ? width : '20px'"
    :height="height ? height : '24px'"
    class="overflow-visible"
  >
    <g id="Wallet" transform="translate(-158.01 -484.24)" :fill="fill">
      <path
        id="Path_607"
        data-name="Path 607"
        d="M198.03,489.44H186.45l9.09-1.92.9-.19.19-.04a.873.873,0,0,1,1.03.65Z"
        transform="translate(-24.7)"
      />
      <path
        id="Path_608"
        data-name="Path 608"
        d="M195.08,486.73l-10.21,2.15,7.84-4.52a.851.851,0,0,1,.66-.09.874.874,0,0,1,.53.41Z"
        transform="translate(-24.7)"
      />
      <path
        id="Path_609"
        data-name="Path 609"
        d="M197.52,500.6a1.752,1.752,0,0,1-1.75-1.75v-2.62a1.752,1.752,0,0,1,1.75-1.75h3.99V491.2a.871.871,0,0,0-.87-.87H183.58a.839.839,0,0,0-.47.14.859.859,0,0,0-.2.18.881.881,0,0,0-.2.55v12.68a.871.871,0,0,0,.87.87h17.06a.871.871,0,0,0,.87-.87V500.6Z"
        transform="translate(-24.7)"
      />
      <path
        id="Path_610"
        data-name="Path 610"
        d="M202.33,495.35h-4.81a.871.871,0,0,0-.87.87v2.62a.871.871,0,0,0,.87.87h4.81a.871.871,0,0,0,.87-.87v-2.62A.871.871,0,0,0,202.33,495.35Zm-3.69,3.17a.98.98,0,1,1,.98-.98A.982.982,0,0,1,198.64,498.52Z"
        transform="translate(-24.7)"
      />
    </g>
  </svg>
</template>
