<script setup>
  const props = defineProps({
    categories: {
      type: Array,
    },
    girdCol: {
      type: String,
    },
  });
</script>

<template>
  <div
    :class="`grid gap-x-12 gap-y-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${girdCol} `"
  >
    <RouterLink
      v-for="category in categories"
      :key="category.id"
      class="flex flex-col items-start cursor-pointer"
      :to="`/category/${category.title}`"
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
    </RouterLink>
  </div>
</template>
