<script setup>
  import { onMounted, ref } from 'vue';
  import { getAllCategoriesHaveView } from '@/services/browse';
  import CategoryImage from '../CategoryImage.vue';
  import Skeleton from 'primevue/skeleton';

  const categories = ref([]);
  const loading = ref(true);
  const fetchAllCategoriesHaveView = async () => {
    try {
      loading.value = true;
      const response = await getAllCategoriesHaveView();
      categories.value = response.data;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };
  onMounted(() => {
    fetchAllCategoriesHaveView();
  });
</script>

<template>
  <div
    v-if="loading"
    class="grid gap-x-12 gap-y-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 h-[420px]"
  >
    <div v-for="n in 5" :key="n" class="flex flex-col gap-y-3">
      <Skeleton width="100%" height="100%"></Skeleton>
      <Skeleton width="5rem" height="1rem"></Skeleton>
      <Skeleton width="8rem" height="1rem"></Skeleton>
    </div>
  </div>

  <div
    v-else
    class="grid gap-x-12 gap-y-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
  >
    <CategoryImage :categories="categories" />
  </div>
</template>
