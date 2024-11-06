<script setup>
  const props = defineProps({
    categories: {
      type: Array,
    },
  });
</script>

<template>
  <router-link
    v-for="category in categories"
    :key="category.id"
    class="flex flex-col items-start cursor-pointer"
    :to="`/browse/categories/${category.title}`"
  >
    <img
      :src="category.imgUrl"
      :alt="category.title"
      class="rounded-lg w-full min-h-[280px] object-cover"
    />
    <h3 class="mt-2 text_subTitle">{{ category.title }}</h3>
    <p class="text_secondary">
      {{ category.totalViews || '1' }} {{ category.totalViews > 1 ? 'views' : 'view' }}
    </p>
  </router-link>
</template>
