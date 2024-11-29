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
      id="Group_1845"
      data-name="Group 1845"
      transform="translate(-62.5 -485.68)"
      :class="[fill, stroke]"
    >
      <path
        id="Path_603"
        data-name="Path 603"
        d="M95.82,486.68v8.74a.986.986,0,0,1-.99.99H88.19a.986.986,0,0,1-.99-.99v-8.74a.986.986,0,0,1,.99-.99h6.64A.986.986,0,0,1,95.82,486.68Z"
        transform="translate(-24.7)"
      />
      <path
        id="Path_604"
        data-name="Path 604"
        d="M98.07,504.16V495.4a.986.986,0,0,1,.99-.99h6.64a.986.986,0,0,1,.99.99v8.76a.986.986,0,0,1-.99.99H99.06A.992.992,0,0,1,98.07,504.16Z"
        transform="translate(-24.7)"
      />
      <path
        id="Path_605"
        data-name="Path 605"
        d="M106.7,486.67v4.42a.986.986,0,0,1-.99.99H99.08a.986.986,0,0,1-.99-.99v-4.42a.986.986,0,0,1,.99-.99h6.63A.992.992,0,0,1,106.7,486.67Z"
        transform="translate(-24.7)"
      />
      <path
        id="Path_606"
        data-name="Path 606"
        d="M87.21,504.15v-4.41a.986.986,0,0,1,.99-.99h6.64a.986.986,0,0,1,.99.99v4.41a.986.986,0,0,1-.99.99H88.2A.992.992,0,0,1,87.21,504.15Z"
        transform="translate(-24.7)"
      />
    </g>
  </svg>
</template>
