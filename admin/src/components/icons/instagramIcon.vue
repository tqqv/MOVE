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
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="32"
    height="32"
    viewBox="0 0 32 32"
  >
    <defs>
      <radialGradient
        id="radial-gradient"
        cx="0.198"
        cy="0.974"
        r="1.29"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0" stop-color="#fcee21" />
        <stop offset="0.044" stop-color="#fbe721" />
        <stop offset="0.11" stop-color="#fad322" />
        <stop offset="0.189" stop-color="#f8b222" />
        <stop offset="0.277" stop-color="#f48523" />
        <stop offset="0.35" stop-color="#f15a24" />
        <stop offset="0.5" stop-color="#d4145a" />
        <stop offset="0.8" stop-color="#93278f" />
        <stop offset="1" stop-color="#93278f" />
      </radialGradient>
    </defs>
    <g id="instagram-icon-8" transform="translate(-50 -49.576)">
      <circle
        id="Ellipse_58"
        data-name="Ellipse 58"
        cx="16"
        cy="16"
        r="16"
        transform="translate(50 49.576)"
        fill="#fff"
      />
      <g id="Group_4033" data-name="Group 4033" transform="translate(50 49.576)">
        <circle
          id="Ellipse_59"
          data-name="Ellipse 59"
          cx="16"
          cy="16"
          r="16"
          fill="url(#radial-gradient)"
        />
      </g>
      <g id="Group_4034" data-name="Group 4034" transform="translate(55.291 55.128)">
        <path
          id="Path_1128"
          data-name="Path 1128"
          d="M215.52,200h-9.877A5.66,5.66,0,0,0,200,205.644v9.877a5.66,5.66,0,0,0,5.644,5.644h9.877a5.66,5.66,0,0,0,5.644-5.644v-9.877A5.66,5.66,0,0,0,215.52,200Zm3.88,14.931a4.482,4.482,0,0,1-4.469,4.469h-8.7a4.482,4.482,0,0,1-4.469-4.469v-8.7a4.482,4.482,0,0,1,4.469-4.469h8.7a4.481,4.481,0,0,1,4.466,4.469Z"
          transform="translate(-200 -200)"
          fill="#fff"
        />
        <path
          id="Path_1129"
          data-name="Path 1129"
          d="M334.646,328.6a6.046,6.046,0,1,0,6.046,6.046A6.046,6.046,0,0,0,334.646,328.6Zm0,9.9a3.859,3.859,0,1,1,3.859-3.859A3.86,3.86,0,0,1,334.646,338.5Z"
          transform="translate(-324.064 -324.064)"
          fill="#fff"
        />
        <circle
          id="Ellipse_60"
          data-name="Ellipse 60"
          cx="1.21"
          cy="1.21"
          r="1.21"
          transform="translate(15.418 3.326)"
          fill="#fff"
        />
      </g>
    </g>
  </svg>
</template>
