<script setup>
  import { searchUser, searchVideo, searchCate } from '@/services/search';
  import { useRoute } from 'vue-router';
  import Divider from '../Divider.vue';
  import ChannelList from '../ChannelList.vue';
  import CategoryImage from '../CategoryImage.vue';
  import { onMounted, onUnmounted, ref } from 'vue';
  import VideoCard from '../VideoCard.vue';
  import Skeleton from 'primevue/skeleton';

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

  async function loadMoreData() {
    console.log(totalPage);

    if (!isFetchingMore.value && query.value && page.value < totalPage.value) {
      isFetchingMore.value = true;
      page.value += 1;
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
      }
    }
  }

  function handleScroll() {
    const bottomOfPage =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
    if (bottomOfPage) {
      loadMoreData();
    }
  }

  onMounted(async () => {
    loading.value = true;
    if (query.value) {
      try {
        if (type.value === 'categories') {
          const response = await searchCate(query.value, 8, 1);
          categories.value = response.data.data.categories.rows;
          totalCate.value = response.data.data.categories.count;
          totalPage.value = response.data.data.totalPages;
        } else if (type.value === 'users') {
          const response = await searchUser(query.value, 32, 1);
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
      window.addEventListener('scroll', handleScroll);
    } else {
      loading.value = false;
    }
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<template>
  <section
    v-if="query && (categories.length || users.length || videos.length) && !loading"
    class="flex-grow"
  >
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
          <div v-if="type === 'categories' && categories.length">
            <div class="flex justify-between items-center">
              <h1 class="text_subTitle mb-2">Categories</h1>
            </div>
            <div
              class="grid gap-x-12 gap-y-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              <CategoryImage :categories="categories" />
            </div>
          </div>
          <!-- CHANNELS -->
          <!-- Users Skeleton -->
          <div v-if="loading && type === 'users'">
            <div class="flex flex-wrap gap-4">
              <Skeleton v-for="n in 8" :key="n" size="3rem" class="mr-2" />
            </div>
          </div>
          <div v-if="type === 'users' && users.length && !loading">
            <div class="flex justify-between items-center">
              <h1 class="text_subTitle mb-2">User</h1>
            </div>
            <ChannelList :users="users" />
          </div>
          <div v-if="type === 'videos' && videos?.length">
            <div class="flex justify-between items-center">
              <h1 class="text_subTitle mb-2">Video</h1>
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
  </section>
</template>
