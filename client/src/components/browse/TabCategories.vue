<script setup>
  import { onMounted, ref } from 'vue';
  import { getAllCategoriesHaveView } from '@/services/browse';
  import CategoryImage from '../CategoryImage.vue';

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
    class="grid gap-x-8 gap-y-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
  >
    <CategoryImage :categories="categories" :loading="loading" :qualitySkeleton="6" />
  </div>
</template>
