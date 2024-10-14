<script setup>
  const props = defineProps({
    width: {
      type: String,
      default: '22px',
    },
    height: {
      type: String,
      default: '22px',
    },
    fill: {
      type: String,
      default: '#000000',
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
      <path
        d="M463.748 48.251c-64.336-64.336-169.013-64.335-233.349.001-43.945 43.945-59.209 108.706-40.181 167.461L4.396 401.536a14.988 14.988 0 0 0-4.395 10.606V497c0 8.291 6.709 15 15 15h84.858c3.984 0 7.793-1.582 10.605-4.395l21.211-21.226a15.002 15.002 0 0 0 4.292-12.334l-2.637-22.793 31.582-2.974a14.975 14.975 0 0 0 13.521-13.521l2.974-31.582 22.793 2.651c4.233.571 8.496-.85 11.704-3.691a15.04 15.04 0 0 0 5.024-11.206V363h27.422c3.984 0 7.793-1.582 10.605-4.395l38.467-37.958c58.74 19.043 122.381 4.929 166.326-39.046 64.336-64.335 64.336-169.014 0-233.35zm-42.435 106.07c-17.549 17.549-46.084 17.549-63.633 0s-17.549-46.084 0-63.633 46.084-17.549 63.633 0 17.548 46.084 0 63.633z"
        :fill="fill"
        opacity="1"
        data-original="#000000"
        class=""
      ></path>
    </g>
  </svg>
</template>
