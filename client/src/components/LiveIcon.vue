<template>
  <div class="px-2 py-1 rounded-md">
    <div class="flex justify-center items-center text-sm gap-x-2">
      <div class="flex h-[20px] items-end gap-x-0.5">
        <div class="loader l1"></div>
        <div class="loader l2"></div>
        <div class="loader l3"></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .loader {
    width: 5px;
    height: 5px;
    background-color: #13d0b4;
    border-radius: 4px;
    animation: pulse 1s infinite ease-in-out;
  }

  .loader.l1 {
    animation-delay: 0s;
  }

  .loader.l2 {
    animation-delay: 0.2s;
  }

  .loader.l3 {
    animation-delay: 0.4s;
  }

  @keyframes pulse {
    0%,
    100% {
      height: 5px;
    }
    50% {
      height: 18px;
    }
  }
</style>
