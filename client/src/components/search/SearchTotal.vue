<script setup>
  import { searchUser, searchVideo, searchCate } from '@/services/search';
  import { useRoute } from 'vue-router';
  import Divider from '../Divider.vue';
  import ChannelList from '../ChannelList.vue';
  import CategoryImage from '../CategoryImage.vue';
  import { onMounted, onUnmounted, ref } from 'vue';
  import VideoCard from '../VideoCard.vue';
  import Skeleton from 'primevue/skeleton';
  import { loadMoreScroll } from '@/utils';
  import GirdVideo from '../GirdVideo.vue';

  const route = useRoute();
  const query = ref(route.query.q || '');
  const type = ref(route.query.type || '');
  const users = ref([]);
  const categories = ref([]);
  const videos = ref([]);
  const totalUser = ref(0);
  const totalCate = ref(0);
  const totalVideo = ref(0);
  const loading = ref(true);
  const page = ref(1);
  const totalPage = ref(0);
  const isFetchingMore = ref(false);
  const loadingMore = ref(false);

  async function loadMoreData() {
    if (!isFetchingMore.value && query.value && page.value < totalPage.value) {
      isFetchingMore.value = true;
      page.value += 1;
      loadingMore.value = true;
      try {
        if (type.value === 'categories') {
          const response = await searchCate(query.value, 4, page.value);
          categories.value.push(...response.data.data.categories.rows);
          totalCate.value = response.data.data.categories.count;
          totalPage.value = response.data.data.totalPages;
        } else if (type.value === 'users') {
          const response = await searchUser(query.value, 4, page.value);
          users.value.push(...response.data.data.users.rows);
          totalUser.value = response.data.data.users.count;
          totalPage.value = response.data.data.totalPages;
        } else if (type.value === 'videos') {
          const response = await searchVideo(query.value, 4, page.value);
          videos.value.push(...response.data.data.videos.rows);
          totalVideo.value = response.data.data.videos.count;
          totalPage.value = response.data.data.totalPages;
        }
      } catch (error) {
        console.error('Error loading more data:', error);
      } finally {
        isFetchingMore.value = false;
        loadingMore.value = false;
      }
    }
  }

  onMounted(async () => {
    if (query.value) {
      try {
        loading.value = true;
        if (type.value === 'categories') {
          const response = await searchCate(query.value, 4, 1);
          categories.value = response.data.data.categories.rows;
          totalCate.value = response.data.data.categories.count;
          totalPage.value = response.data.data.totalPages;
        } else if (type.value === 'users') {
          const response = await searchUser(query.value, 24, 1);
          users.value = response.data.data.users.rows;
          totalUser.value = response.data.data.users.count;
          totalPage.value = response.data.data.totalPages;
        } else if (type.value === 'videos') {
          const response = await searchVideo(query.value, 8, 1);
          videos.value = response.data.data.videos.rows;
          totalVideo.value = response.data.data.videos.count;
          totalPage.value = response.data.data.totalPages;
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        loading.value = false;
      }
      window.addEventListener('scroll', loadMoreScroll(loadMoreData, 200));
    } else {
      loading.value = false;
    }
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', loadMoreScroll(loadMoreData, 200));
  });
</script>

<template>
  <section class="flex-grow">
    <div class="container">
      <div>
        <div class="flex items-center gap-x-[30px]">
          <h1 class="text_title flex-shrink-0">
            Search <span v-if="type === 'categories'">{{ totalCate }}</span>
            <span v-else-if="type === 'users'">{{ totalUser }}</span>
            <span v-else-if="type === 'videos'">{{ totalVideo }}</span> {{ type }} for
            {{ query }}
          </h1>
          <Divider />
        </div>
        <div class="my-2">
          <div v-if="type === 'categories'">
            <div v-if="categories.length" class="flex justify-between items-center">
              <h1 class="text_subTitle mb-2">Categories</h1>
            </div>
            <div
              class="grid gap-x-6 gap-y-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              <CategoryImage :categories="categories" :loading="loading" :qualitySkeleton="5" />
            </div>
          </div>
          <!-- CHANNELS -->
          <!-- Users Skeleton -->

          <div v-if="type === 'users'">
            <div v-if="users.length" class="flex justify-between items-center">
              <h1 class="text_subTitle mb-2">User</h1>
            </div>
            <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-4 gap-4 ml-4 my-4">
              <div v-for="n in 4" :key="n" class="flex items-center gap-x-3">
                <Skeleton shape="circle" size="5rem"></Skeleton>
                <div class="flex flex-col gap-y-3">
                  <Skeleton width="9rem" height="1rem"></Skeleton>
                  <Skeleton width="5rem" height="1rem"></Skeleton>
                </div>
              </div>
            </div>
            <ChannelList v-if="!loading" :users="users" />
            <div v-if="loadingMore" class="grid grid-cols-1 lg:grid-cols-4 gap-4 ml-4 my-4">
              <div v-for="n in 4" :key="n" class="flex items-center gap-x-3">
                <Skeleton shape="circle" size="5rem"></Skeleton>
                <div class="flex flex-col gap-y-3">
                  <Skeleton width="9rem" height="1rem"></Skeleton>
                  <Skeleton width="5rem" height="1rem"></Skeleton>
                </div>
              </div>
            </div>
          </div>
          <div v-if="type === 'videos'">
            <div v-if="videos?.length" class="flex justify-between items-center">
              <h1 class="text_subTitle mb-2">Video</h1>
            </div>

            <GirdVideo :videos="videos" :loading="loading" />
            <div
              v-if="loadingMore"
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
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
