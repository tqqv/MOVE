<script setup>
  const props = defineProps({
    width: String,
    height: String,
    fill: String,
    stroke: String,
  });
</script>
<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="20" viewBox="0 0 40 20">
    <g id="Group_1914" data-name="Group 1914" transform="translate(-273.403 29.628)">
      <rect
        id="Rectangle_284"
        data-name="Rectangle 284"
        width="40"
        height="20"
        rx="4"
        transform="translate(273.403 -29.628)"
        fill="#ff647a"
      />
      <text
        id="LIVE"
        transform="translate(293.403 -15.628)"
        fill="#fff"
        font-size="11"
        font-family="SegoeUI-Bold, Segoe UI"
        font-weight="700"
      >
        <tspan x="-11.15" y="0">LIVE</tspan>
      </text>
    </g>
  </svg>
</template>
