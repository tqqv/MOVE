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
    version="1.1"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :width="width ? width : '20px'"
    :height="height ? height : '20px'"
    x="0"
    y="0"
    viewBox="0 0 24 24"
    style="enable-background: new 0 0 512 512"
    xml:space="preserve"
    class=""
  >
    <g>
      <g fill-rule="evenodd" clip-rule="evenodd">
        <path
          fill="#ff0b0b"
          d="M16 11.9a4.974 4.974 0 0 0-1.028-3.037 1 1 0 0 1 1.587-1.217A6.974 6.974 0 0 1 18 11.901c0 1.666-.584 3.199-1.557 4.4a1 1 0 0 1-1.554-1.257A4.975 4.975 0 0 0 16 11.9zM8 11.9c0-1.145.384-2.198 1.03-3.04a1 1 0 1 0-1.586-1.218A6.974 6.974 0 0 0 6 11.9c0 1.666.583 3.197 1.554 4.4a1 1 0 1 0 1.556-1.258A4.975 4.975 0 0 1 8 11.9z"
          opacity="1"
          data-original="#ff0b0b"
        ></path>
        <g fill="#ff8b8b">
          <path
            d="M10 11.9a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM20 11.9a8.96 8.96 0 0 0-2.156-5.845 1 1 0 1 1 1.52-1.3A10.96 10.96 0 0 1 22 11.9c0 2.79-1.04 5.338-2.75 7.277a1 1 0 1 1-1.5-1.324A8.962 8.962 0 0 0 20 11.9zM4 11.9a8.96 8.96 0 0 1 2.156-5.845 1 1 0 0 0-1.52-1.3A10.96 10.96 0 0 0 2 11.9c0 2.786 1.036 5.331 2.743 7.269a1 1 0 1 0 1.501-1.322A8.962 8.962 0 0 1 4 11.9z"
            fill="#ff8b8b"
            opacity="1"
            data-original="#ff8b8b"
          ></path>
        </g>
      </g>
    </g>
  </svg>
</template>
