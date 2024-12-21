<script setup>
  import Divider from '../Divider.vue';
  import GirdVideo from '../GirdVideo.vue';
  import CategoryImage from '../CategoryImage.vue';
  import ChannelList from '../ChannelList.vue';
  import { useRoute } from 'vue-router';
  import { searchInformation } from '@/services/search';
  import { onMounted, ref, watch } from 'vue';
  import VideoCard from '../VideoCard.vue';
  import EmptyPage from '@/pages/EmptyPage.vue';
  import Skeleton from 'primevue/skeleton';

  const route = useRoute();
  const query = ref(route.query.q || '');
  const categories = ref([]);
  const users = ref([]);
  const videos = ref([]);
  const loading = ref(true);

  const fetchSearchResults = async () => {
    if (query.value) {
      try {
        loading.value = true;
        const response = await searchInformation(query.value, 8, 0);
        const data = response.data.data;
        categories.value = data.categories;
        videos.value = data.videos;
        users.value = data.users;
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        loading.value = false;
      }
    } else {
      categories.value = [];
      videos.value = [];
      users.value = [];
      loading.value = false;
    }
  };

  watch(
    () => route.query.q,
    (newQuery) => {
      query.value = newQuery || '';
      fetchSearchResults();
    },
  );

  onMounted(() => {
    fetchSearchResults();
  });
</script>
<template>
  <section class="flex-grow h-full">
    <div class="container">
      <div>
        <div class="flex items-center gap-x-[30px]">
          <h1 class="text_title flex-shrink-0">Search results for {{ query }}</h1>
          <Divider />
        </div>
        <div
          v-if="loading"
          class="flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 h-[230px] gap-x-5 my-8"
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
        <div
          v-if="query && (categories.length || users.length || videos.length) && !loading"
          class="my-2"
        >
          <!-- CATEGORIES -->
          <div v-if="categories.length" class="">
            <div class="flex justify-between items-center">
              <h1 class="text_subTitle mb-2">Categories</h1>
             
            </div>
            <div
              class="grid gap-x-6 gap-y-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              <CategoryImage :categories="categories" :loading="loading" qualitySkeleton="3" />
            </div>
          </div>
          <hr v-if="categories.length" class="h-px my-10 bg-gray-dark border-0" />
          <!-- CHANNELS -->
          <div v-if="users.length">
            <div class="flex justify-between items-center">
              <h1 class="text_subTitle mb-2">User</h1>
              <RouterLink
                :to="`/total-search?q=${query}&type=users`"
                v-if="users.length == 8"
                class="text-primary text-sm cursor-pointer"
              >
                View all <i class="pi pi-chevron-right text-xs"></i>
              </RouterLink>
            </div>
            <ChannelList :users="users" />
          </div>
          <hr v-if="users.length" class="h-px my-10 bg-gray-dark border-0" />
          <!-- VIDEOS -->
          <div v-if="videos.length">
            <div class="flex justify-between items-center">
              <h1 class="text_subTitle mb-2">Video</h1>
              <RouterLink
                :to="`/total-search?q=${query}&type=videos`"
                v-if="videos.length == 8"
                class="text-primary text-sm cursor-pointer"
              >
                View all <i class="pi pi-chevron-right text-xs"></i>
              </RouterLink>
            </div>
            <div class="w-full py-4">
              <div
                class="flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8"
              >
                <VideoCard :videos="videos" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!query || (query && !categories.length && !videos.length && !users.length && !loading)"
      class="h-[80%] flex justify-center items-center"
    >
      <EmptyPage
        title="No results found"
        subTitle="Try different keywords or remove search filters"
      />
    </div>
  </section>
</template>
