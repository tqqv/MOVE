<script setup>
  import logo from '@assets/logo.svg';
  import wallet from '@icons/wallet.vue';
  import Button from 'primevue/button';
  import Divider from '@/components/Divider.vue';
  import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <Navbar />
  <section class="padding-nav">
    <div class="bg-black flex justify-center"><img :src="logo" alt="" width="200px" /></div>
    <div class="container">
      <!-- Icon Custom -->
      <div class="p-5"><wallet fill="fill-primary" stroke="stroke-none" /></div>
      <!-- Icon PrimeVue -->
      <div class="p-5"><i class="pi pi-star text-[50px] text-primary"></i></div>
      <div class="flex items-center gap-x-[30px]">
        <h1 class="text_title">Featured</h1>
        <Divider />
      </div>
      <div class="text-center w-full h-40 shadow flex justify-center items-center flex-col">
        <h1 class="text_subTitle">What are your interests?</h1>
        <p class="text_para">
          Choose 1 or more category below. This will help us to provide you with the most relevant
          contents on MOVE.
        </p>
        <div class="p-5"><Button label="Choose your interest" class="btn" /></div>
      </div>
    </div>
    <div class="container">
      <!-- Icon Custom -->
      <div class="p-5"><wallet fill="fill-primary" stroke="stroke-none" /></div>
      <!-- Icon PrimeVue -->
      <div class="p-5"><i class="pi pi-star text-[50px] text-primary"></i></div>
      <div class="flex items-center gap-x-[30px]">
        <h1 class="text_title">Featured</h1>
        <Divider />
      </div>
      <div class="text-center w-full h-40 shadow flex justify-center items-center flex-col">
        <h1 class="text_subTitle">What are your interests?</h1>
        <p class="text_para">
          Choose 1 or more category below. This will help us to provide you with the most relevant
          contents on MOVE.
        </p>
        <div class="p-5"><Button label="Choose your interest" class="btn" /></div>
      </div>
    </div>
    <div class="container">
      <!-- Icon Custom -->
      <div class="p-5"><wallet fill="fill-primary" stroke="stroke-none" /></div>
      <!-- Icon PrimeVue -->
      <div class="p-5"><i class="pi pi-star text-[50px] text-primary"></i></div>
      <div class="flex items-center gap-x-[30px]">
        <h1 class="text_title">Featured</h1>
        <Divider />
      </div>
      <div class="text-center w-full h-40 shadow flex justify-center items-center flex-col">
        <h1 class="text_subTitle">What are your interests?</h1>
        <p class="text_para">
          Choose 1 or more category below. This will help us to provide you with the most relevant
          contents on MOVE.
        </p>
        <div class="p-5"><Button label="Choose your interest" class="btn" /></div>
      </div>
    </div>
  </section>
</template>
