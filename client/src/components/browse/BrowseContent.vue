<script setup>
  import { ref, markRaw, onMounted } from 'vue';
  import Divider from '@/components/Divider.vue';

  const tabBrowse = ref([
    { id: 1, title: 'Categories', link: '/browse/categories' },
    { id: 2, title: 'Top videos', link: '/browse/top-videos' },
    { id: 3, title: 'Most viewed', link: '/browse/most_viewed' },
    { id: 4, title: 'Highest rated', link: '/browse/highest_rated' },
  ]);
</script>

<template>
  <section class="flex-grow">
    <div class="container">
      <div class="flex items-center pl-4">
        <span class="font-bold text-[24px]">Browse</span>
        <Divider class="flex-grow mx-4" />
      </div>
      <div class="px-[18px] mt-4">
        <div class="flex flex-wrap items-center justify-center md:justify-start gap-x-6 border-b border-[#e2e8f0]">
          <router-link
            v-for="tab in tabBrowse"
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
