<script setup>
  import Button from 'primevue/button';
</script>
<template>
  <div class="w-full md:w-[604px] shadow-xl mx-3 rounded-lg">
    <div class="flex flex-col mx-5">
      <div class="flex flex-col py-5">
        <div class="flex items-center justify-between">
          <h1 class="text_title text-[16px] md:text-[24px]">Order Confirmation</h1>
          <div
            class="flex justify-center items-center p-2 rounded-full cursor-pointer hover:bg-gray-dark"
          >
            <i class="pi pi-times !font-bold text-lg"></i>
          </div>
        </div>
        <h2 class="text-[11px]  mb-4 md:text-[15px] font-bold text-body">
          Your purchase of 300 REPs is successful!
        </h2>
        <span class="text_secondary text-[10px] md:text-[12px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non mattis justo.</span
        >
        <div class="flex justify-center mt-10">
          <Button class="btn px-14 min-w-[104px] text-nowrap text-[12px] md:text-[16px] w-auto"
            >Confirm</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>
