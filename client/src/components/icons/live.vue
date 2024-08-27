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
    :width="width ? width : '54px'"
    :height="height ? height : '26px'"
    class="overflow-visible"
  >
    <g
      id="Group_1844"
      data-name="Group 1844"
      transform="translate(-744 -383)"
      :class="[fill, stroke]"
    >
      <path
        id="Path_579"
        data-name="Path 579"
        d="M772.7,383h46a4,4,0,0,1,4,4v18a4,4,0,0,1-4,4h-46a4,4,0,0,1-4-4V387a4,4,0,0,1,4-4"
        transform="translate(-24.7)"
      />
      <text
        id="LIVE"
        transform="translate(754 402)"
        fill="#fff"
        stroke="rgba(0,0,0,0)"
        stroke-width="1"
        font-size="15"
        font-family="SegoeUI-Bold, Segoe UI"
        font-weight="700"
      >
        <tspan x="0" y="0">LIVE</tspan>
      </text>
    </g>
  </svg>
</template>
