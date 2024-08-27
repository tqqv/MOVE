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
    :width="width ? width : '18px'"
    :height="height ? height : '20px'"
    class="overflow-visible"
  >
    <g :class="[fill, stroke]">
      <path
        id="Path_598"
        data-name="Path 598"
        d="M504.6,398.07V404a.986.986,0,0,1-.99.99H488.2a.986.986,0,0,1-.99-.99V392.39a.986.986,0,0,1,.99-.99h6.19l-1.98,1.98h-3.22v9.64h10.27l.1.1.1-.1h2.97v-2.97Zm3.45-4.88a.209.209,0,0,1-.08.16l-6.84,4.76a.2.2,0,0,1-.11.03.293.293,0,0,1-.09-.02.194.194,0,0,1-.1-.17v-2.8c-1.47-.22-5.43-.26-8.4,4.66a.192.192,0,0,1-.16.09.127.127,0,0,1-.06-.01.184.184,0,0,1-.13-.19c0-.09.52-8.47,8.75-8.73v-2.53a.194.194,0,0,1,.1-.17.2.2,0,0,1,.2.01l6.84,4.76A.176.176,0,0,1,508.05,393.19Z"
        transform="translate(-487.21 -388.249)"
      />
    </g>
  </svg>
</template>
