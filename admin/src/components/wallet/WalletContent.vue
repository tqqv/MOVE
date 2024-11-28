<script setup>
  import { ref, markRaw, onMounted } from 'vue';
  import Divider from '@/components/Divider.vue';

  const tabWallet = ref([
    { id: 1, title: 'Payment method', link: '/wallet/payment-method' },
    { id: 2, title: 'Payment history', link: '/wallet/payment-history' },
  ]);
</script>

<template>
  <section class="flex-grow">
    <div class="container">
      <div class="flex items-center pl-4">
        <span class="font-bold text-[24px]">Wallet</span>
        <Divider class="flex-grow mx-4" />
      </div>
      <div class="px-[18px] mt-4">
        <div
          class="flex flex-wrap items-center justify-center md:justify-start gap-x-12 border-b border-[#e2e8f0]"
        >
          <router-link
            v-for="tab in tabWallet"
            :key="tab.id"
            :to="tab.link"
            class="tab_custom"
            active-class="text-primary font-bold border-b-4 border-primary hover:text-primary"
          >
            {{ tab.title }}
          </router-link>
        </div>
      </div>
      <div>
        <div class="mt-7 mx-4">
          <router-view />
        </div>
      </div>
    </div>
  </section>
</template>
