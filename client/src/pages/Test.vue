<script setup>
  import { useAuthStore } from '@/stores';
  import { storeToRefs } from 'pinia';

  import logo from '@assets/logo.svg';
  import wallet from '@icons/wallet.vue';
  import Button from 'primevue/button';
  import Divider from '@/components/Divider.vue';
  import Navbar from '@/components/Navbar.vue';

  const store = useAuthStore();
  // get state, getter
  const { name, doubleCount, count } = storeToRefs(store);

  // get actions
  const { increment } = store;
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
    <div class="container mt-3 text-center">
      <h1>Auth Page</h1>
      <p>Name: {{ name }}</p>
      <p>Count: {{ count }}</p>
      <p>Double Count: {{ doubleCount }}</p>
      <Button @click="increment">Increment</Button>
    </div>
    <div class="container mt-3 text-center">
      <div class="flex gap-x-3 justify-center">
        <h1>I18n</h1>
        <select v-model="$i18n.locale">
          <option v-for="locale in $i18n.availableLocales" :key="locale" :value="locale">
            {{ locale }}
          </option>
        </select>
      </div>
      <p>{{ $t('heading', { msg: 'Viet' }) }}</p>
    </div>
  </section>
</template>
