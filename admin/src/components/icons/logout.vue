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
    :height="height ? width : '24px'"
    class="overflow-visible"
  >
    <g :class="[fill, stroke]">
      <path
        id="Path_612"
        data-name="Path 612"
        d="M400.5,492.45V488.8a1.067,1.067,0,0,0-1.06-1.06H386.4a1.067,1.067,0,0,0-1.06,1.06v14.95a1.066,1.066,0,0,0,.56.93l8.04,4.16a.536.536,0,0,0,.78-.48v-4.05h4.72a1.067,1.067,0,0,0,1.06-1.06v-5.78h-2.12v4.19a.521.521,0,0,1-.53.53h-3.12v-8.97a1.066,1.066,0,0,0-.56-.93l-4.74-2.43h8.43a.521.521,0,0,1,.53.53v2.08h2.12v-.02Zm0,0"
        transform="translate(-385.34 -487.74)"
      />
      <path
        id="Path_613"
        data-name="Path 613"
        d="M403.21,490.72l3.44,3.44a1.052,1.052,0,0,1,0,1.53l-3.44,3.44a1.075,1.075,0,0,1-1.55.02,1.121,1.121,0,0,1,.04-1.55l1.55-1.53h-6.01a1.024,1.024,0,0,1-.79-.35,1.19,1.19,0,0,1,.27-1.81,1.1,1.1,0,0,1,.53-.14h6.01s-1.53-1.53-1.55-1.53a1.1,1.1,0,0,1-.04-1.53,1.055,1.055,0,0,1,1.54.01Zm0,0"
        transform="translate(-385.34 -487.74)"
      />
    </g>
  </svg>
</template>
