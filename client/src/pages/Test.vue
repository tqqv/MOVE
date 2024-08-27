<script setup>
  import logo from '@assets/logo.svg';
  import wallet from '@icons/wallet.vue';
</script>

<template>
  <section class="">
    <div class="container">
      <div class="bg-black inline-block"><img :src="logo" alt="" width="200px" /></div>
      <div class="p-5"><wallet fill="fill-primary" stroke="stroke-none" /></div>
    </div>
  </section>
</template>
