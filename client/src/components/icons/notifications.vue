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
    :width="width ? width : '24px'"
    :height="height ? height : '24px'"
    class="overflow-visible"
  >
    <g
      id="Group_1852"
      data-name="Group 1852"
      transform="translate(-662.677 -186.16)"
      :class="[fill, stroke]"
    >
      <path
        id="XMLID_5_"
        d="M702.95,201.29H688.07a.679.679,0,0,1-.52-1.13l1.89-2.09a1.7,1.7,0,0,0,.44-1.13v-3.12a5.585,5.585,0,0,1,5.9-5.52,5.672,5.672,0,0,1,5.36,5.67v2.96a1.686,1.686,0,0,0,.44,1.13l1.89,2.09A.688.688,0,0,1,702.95,201.29Zm-7.44,3.43a2.567,2.567,0,0,1-2.59-2.54h5.18A2.567,2.567,0,0,1,695.51,204.72Z"
        transform="translate(-24.7)"
        fill-rule="evenodd"
      />
      <path
        id="XMLID_2_"
        d="M695.51,190.38h0a1.018,1.018,0,0,1-1.02-1.02v-2.18a1.018,1.018,0,0,1,1.02-1.02h0a1.018,1.018,0,0,1,1.02,1.02v2.18A1.024,1.024,0,0,1,695.51,190.38Z"
        transform="translate(-24.7)"
      />
    </g>
  </svg>
</template>
