<script setup>
  import { onMounted, ref } from 'vue';
  import Slider from '@/components/Slider.vue';

  import Divider from '@/components/Divider.vue';
  import CategoryImage from '@/components/CategoryImage.vue';
  import { getAllCategory, getAllVideos } from '@/services/video';
  import GirdVideo from '@/components/GirdVideo.vue';
  import SmallLoading from '@/components/icons/smallLoading.vue';
  import { getAllCategoriesHaveView } from '@/services/browse';

  const categories = ref([]);
  const videos = ref([]);
  const isLoading = ref(true);

  const fetchAllCategoriesHaveView = async () => {
    try {
      const res = await getAllCategoriesHaveView();
      if (res.success) {
        categories.value = res.data;
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchAllVideos = async () => {
    try {
      const res = await getAllVideos();

      if (res.data.success) {
        videos.value = res.data.data;
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(async () => {
    fetchAllCategoriesHaveView();
    fetchAllVideos();
  });
</script>

<template>
  <section>
    <div class="container">
      <div class="flex items-center">
        <span class="font-bold text-[24px] pr-8">Featured</span>
        <Divider class="flex-grow mt-1" />
      </div>
      <div class="flex justify-center items-center h-[300px]" v-if="isLoading">
        <SmallLoading />
      </div>
      <div v-else>
        <Slider :videos="videos" />
      </div>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="items-center space-y-4">
        <Divider class="flex-grow mt-1" />
        <div class="flex justify-between">
          <span class="font-bold text-[24px]">Categories</span>
          <RouterLink to="/browse/categories"
            ><span class="text-sm text-primary cursor-pointer">View all</span></RouterLink
          >
        </div>
      </div>
      <div
        class="grid gap-x-12 gap-y-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
      >
        <CategoryImage :categories="categories" />
      </div>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="items-center space-y-4">
        <Divider class="flex-grow mt-1" />
        <div><span class="font-bold text-[24px] whitespace-nowrap">Video you may like</span></div>
      </div>
      <GirdVideo :videos="videos.slice(0, 6)" />
    </div>
  </section>
</template>
