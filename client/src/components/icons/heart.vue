<script setup>
  const props = defineProps({
    width: {
      type: String,
      default: '15.716px',
    },
    height: {
      type: String,
      default: '14.231',
    },
    fill: String,
    stroke: String,
  });
</script>
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 15.716 14.231"
  >
    <g :class="[fill, stroke]">
      <path
        id="Icon_awesome-heart"
        data-name="Icon awesome-heart"
        d="M12.382,3.068a3.663,3.663,0,0,0-5,.364l-.528.544-.528-.544a3.663,3.663,0,0,0-5-.364,3.846,3.846,0,0,0-.265,5.569l5.183,5.352a.84.84,0,0,0,1.213,0l5.183-5.352a3.844,3.844,0,0,0-.262-5.569Z"
        transform="translate(1.002 -1.017)"
        stroke-width="2"
      />
    </g>
  </svg>
</template>
