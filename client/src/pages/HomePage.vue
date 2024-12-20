<script setup>
  import { onMounted, ref, onUnmounted } from 'vue';
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
  import Skeleton from 'primevue/skeleton';

  const categories = ref([]);
  const dataSlider = ref([]);
  const isLoadingSlider = ref(true);
  const videos = ref([]);
  const currentDate = ref('');
  const localDate = new Date();

  const currentPage = ref(1);
  const totalPage = ref();
  const pageSize = ref(8);
  const loading = ref(true);
  const loadingMore = ref(false);
  const isFetchingMore = ref(false);

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
  async function loadMoreData() {
    if (videos.value.length === 0 || isFetchingMore.value || currentPage.value >= totalPage.value)
      return;
    isFetchingMore.value = true;
    loadingMore.value = true;
    currentPage.value += 1;

    try {
      const response = await getTopVideo(currentPage.value, pageSize.value);
      if (response.data?.data?.listVideo?.rows) {
        videos.value.push(...response.data.data.listVideo.rows);
        totalPage.value = response.data.data.totalPages;
      } else {
        console.error('Invalid response structure:', response);
      }
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      isFetchingMore.value = false;
      loadingMore.value = false;
    }
  }
  onMounted(async () => {
    fetchAllCategoriesHaveView();

    await fetchDataSlider(currentDate.value);
    fetchVideoYouMayLike();
  });

  onMounted(() => {
    const container = document.querySelector('.flex-1.overflow-y-scroll');
    container?.addEventListener('near-bottom', loadMoreData);
  });

  onUnmounted(() => {
    const container = document.querySelector('.flex-1.overflow-y-scroll');
    if (container) {
      container.removeEventListener('near-bottom', loadMoreData);
    }
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
        <div><span class="font-bold text-[24px] whitespace-nowrap">Top videos</span></div>
      </div>
      <GirdVideo :videos="videos" :loading="isLoadingSlider" />
      <div
        v-if="loadingMore"
        class="flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 h-[230px] gap-x-5"
      >
        <div v-for="n in 4" :key="n" class="flex flex-col gap-y-3">
          <Skeleton height="200px" />
          <div class="flex mt-4">
            <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
            <div>
              <Skeleton width="10rem" class="mb-2"></Skeleton>
              <Skeleton width="5rem" class="mb-2"></Skeleton>
              <Skeleton height=".5rem"></Skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
