<script setup>
  import MMAImage from '../assets/category/MMA.png';
  const props = defineProps({
    categories: {
      type: Array,
      required: true,
      default: () => [],
    },
  });
  const handleImageError = (event) => {
    event.target.src = MMAImage;
  };
</script>

<template>
  <div class="flex flex-wrap gap-x-12 gap-y-6 pt-2">
    <div v-for="category in categories" :key="category.id" class="flex flex-col items-start">
      <img
        :src="category.imgUrl || MMAImage"
        :alt="category.title"
        @error="handleImageError"
        class="rounded-lg w-full h-auto cursor-pointer"
      />
      <h3 class="mt-2 text_subTitle">{{ category.title }}</h3>
      <p class="text_secondary">{{ category.views || '100' }} views</p>
    </div>
  </div>
</template>
