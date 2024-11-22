<script setup>
  import Skeleton from 'primevue/skeleton';

  const props = defineProps({
    categories: {
      type: Array,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    qualitySkeleton: {
      type: Number,
      default: 5,
    },
  });
</script>

<template>
  <div
    v-if="props.loading"
    v-for="n in qualitySkeleton"
    :key="n"
    class="flex flex-col gap-y-3 h-[360px]"
  >
    <Skeleton width="100%" height="100%"></Skeleton>
    <Skeleton width="5rem" height="1rem"></Skeleton>
    <Skeleton width="8rem" height="1rem"></Skeleton>
  </div>
  <router-link
    v-else
    v-for="category in categories"
    :key="category.id || category.category?.id"
    class="flex flex-col items-start cursor-pointer"
    :to="`/browse/categories/${category.title || category.category?.title}`"
  >
    <img
      :src="category.imgUrl || category.category?.imgUrl"
      :alt="category.title || category.category?.title"
      class="rounded-lg w-full h-full object-cover"
    />
    <h3 class="mt-2 text_subTitle">{{ category.title || category.category?.title }}</h3>
    <p class="text_secondary">
      {{ category.totalViews || category.category?.totalViews || '0' }}
      {{ category.totalViews || category.category?.totalViews > 1 ? 'views' : 'view' }}
    </p>
  </router-link>
</template>
