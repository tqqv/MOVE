<script setup>
  const props = defineProps({
    width: String,
    height: String,
    fill: {
      type: String,
      default: '#ffb564',
    },
    stroke: String,
  });
</script>
<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="17.231" height="16" viewBox="0 0 17.231 16">
    <path
      id="Icon_ionic-ios-star"
      data-name="Icon ionic-ios-star"
      d="M18.827,8.913H13.169L11.45,3.783a.623.623,0,0,0-1.169,0L8.562,8.913h-5.7a.617.617,0,0,0-.615.615.452.452,0,0,0,.012.1.591.591,0,0,0,.258.435l4.65,3.277L5.385,18.533a.617.617,0,0,0,.212.692.6.6,0,0,0,.346.15.754.754,0,0,0,.385-.138L10.865,16,15.4,19.237a.721.721,0,0,0,.385.138.553.553,0,0,0,.342-.15.61.61,0,0,0,.212-.692l-1.785-5.188,4.612-3.308.112-.1a.588.588,0,0,0-.454-1.027Z"
      transform="translate(-2.25 -3.375)"
      :fill="fill"
    />
  </svg>
</template>
