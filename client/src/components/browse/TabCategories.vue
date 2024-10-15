<script setup>
  import { onMounted, ref } from 'vue';
  import { getAllCategoriesHaveView } from '@/services/browse';
  import CategoryImage from '../CategoryImage.vue';

  const categories = ref([]);

  const fetchAllCategoriesHaveView = async () => {
    try {
      const response = await getAllCategoriesHaveView();
      categories.value = response.data;
    } catch (error) {
      console.log(error);
    }
  };
  onMounted(() => {
    fetchAllCategoriesHaveView();
  });
</script>

<template>
  <div
    class="grid gap-x-12 gap-y-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
  >
    <CategoryImage :categories="categories" />
  </div>
</template>
