<script setup>
  const props = defineProps({
    width: {
      type: String,
      default: '30px',
    },
    height: {
      type: String,
      default: '30px',
    },
    fill: {
      type: String,
      default: '#ffffff',
    },
    stroke: String,
  });
</script>
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :width="width"
    :height="height"
    x="0"
    y="0"
    viewBox="0 0 512 512"
    style="enable-background: new 0 0 512 512"
    xml:space="preserve"
    class=""
  >
    <g>
      <g fill-rule="evenodd" clip-rule="evenodd">
        <circle
          cx="256"
          cy="256"
          r="256"
          fill="#13d0b4"
          transform="rotate(-45 255.972 256.066)"
          opacity="1"
          data-original="#e04f5f"
          class=""
        ></circle>
        <path
          fill="#ffffff"
          d="m324.949 310.713 59.579 30.061c3.403 1.717 7.15 1.558 10.396-.44s5.075-5.272 5.075-9.084v-150.5c0-3.811-1.829-7.086-5.075-9.084s-6.993-2.156-10.396-.439l-59.579 30.061zM138.361 163.736h141.124c14.499 0 26.362 11.863 26.362 26.362v131.807c0 14.499-11.863 26.361-26.362 26.361H138.361c-14.499 0-26.361-11.862-26.361-26.361V190.097c-.001-14.499 11.862-26.361 26.361-26.361zm45.782 109.331h49.56c9.426 0 17.066-7.641 17.066-17.066 0-9.426-7.641-17.066-17.066-17.066h-49.56c-9.426 0-17.066 7.641-17.066 17.066s7.641 17.066 17.066 17.066z"
          opacity="1"
          data-original="#ffffff"
          class=""
        ></path>
      </g>
    </g>
  </svg>
</template>
