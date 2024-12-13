<script setup>
  import { onMounted, ref, watch } from 'vue';
  import Slider from '@/components/Slider.vue';

  import Divider from '@/components/Divider.vue';
  import CategoryImage from '@/components/CategoryImage.vue';
  import { getDataSlider } from '@/services/home';
  import GirdVideo from '@/components/GirdVideo.vue';
  import SmallLoading from '@/components/icons/smallLoading.vue';
  import { getAllCategoriesHaveView } from '@/services/browse';
  import { getTopVideo } from '@/services/browse';
  import { fetchViewLiveStreamByUsername } from '@/services/liveStream';
  import { getAllVideos } from '@/services/video';

  const categories = ref([]);
  const dataSlider = ref([]);
  const isLoadingSlider = ref(true);
  const videos = ref([]);
  const currentDate = ref('');
  const localDate = new Date();

  const formatDate = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    currentDate.value = localDate.toISOString();
  };

  formatDate();

  const fetchAllCategoriesHaveView = async () => {
    try {
      const res = await getAllCategoriesHaveView();
      if (res.success) {
        categories.value = res.data.slice(0, 6);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchDataSlider = async (currentDate) => {
    isLoadingSlider.value = true;
    try {
      const res = await getDataSlider(currentDate);

      if (res.data.success) {
        dataSlider.value = res.data.data;
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      isLoadingSlider.value = false;
    }
  };
  const fetchVideoYouMayLike = async () => {
    try {
      const res = await getTopVideo();

      if (res.data.success) {
        videos.value = res.data.data.listVideo.rows;
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  onMounted(async () => {
    fetchAllCategoriesHaveView();
    console.log(currentDate.value);

    await fetchDataSlider(currentDate.value);
    fetchVideoYouMayLike();
  });
</script>

<template>
  <section>
    <div class="container items-center">
      <div class="flex items-center">
        <span class="font-bold text-[24px] pr-8">Featured</span>
        <Divider class="flex-grow mt-1" />
      </div>

      <div class="mt-14">
        <Slider :dataSlider="dataSlider" :isLoadingSlider="isLoadingSlider" />
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
        class="grid gap-x-6 gap-y-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
      >
        <CategoryImage :categories="categories" :loading="isLoadingSlider" :qualitySkeleton="6" />
      </div>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="items-center space-y-4">
        <Divider class="flex-grow mt-1" />
        <div><span class="font-bold text-[24px] whitespace-nowrap">Video you may like</span></div>
      </div>
      <GirdVideo :videos="videos.slice(0, 8)" :loading="isLoadingSlider" />
    </div>
  </section>
</template>
