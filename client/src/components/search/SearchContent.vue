<script setup>
  import Divider from '../Divider.vue';
  import GirdVideo from '../GirdVideo.vue';
  import CategoryImage from '../CategoryImage.vue';
  import ChannelList from '../ChannelList.vue';
  import { useRoute } from 'vue-router';
  import { searchInformation } from '@/services/search';
  import { onMounted, ref } from 'vue';
  import notFound from '../icons/not-found.vue';
  import SearchVideo from './SearchVideo.vue';
  import VideoCard from '../VideoCard.vue';
  import NotFoundPage from '@/pages/NotFoundPage.vue';

  const route = useRoute();
  const query = ref(route.query.q || '');
  const categories = ref([]);
  const users = ref([]);
  const videos = ref([]);
  const loading = ref(true);

  onMounted(async () => {
    if (query.value) {
      try {
        const response = await searchInformation(query.value);
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
      loading.value = false;
    }
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
          <h1 class="text_title flex-shrink-0">Search results for {{ query }}</h1>
          <Divider />
        </div>
        <div class="my-2">
          <!-- CATEGORIES -->
          <div v-if="categories.length" class="">
            <h1 class="text_subTitle mb-2">Categories</h1>
            <div
              class="grid gap-x-12 gap-y-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              <CategoryImage :categories="categories" />
            </div>
          </div>
          <hr v-if="categories.length" class="h-px my-10 bg-gray-dark border-0" />
          <!-- CHANNELS -->
          <div v-if="users.length">
            <h1 class="text_subTitle mb-4">Channels</h1>
            <ChannelList :users="users" />
          </div>
          <hr v-if="users.length" class="h-px my-10 bg-gray-dark border-0" />
          <!-- VIDEOS -->
          <div v-if="videos.length">
            <h1 class="text_subTitle mb-4">Videos</h1>
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
  <div
    v-if="!query || (query && !categories.length && !videos.length && !users.length && !loading)"
    class="h-full flex justify-center items-center"
  >
    <NotFoundPage
      title="No results found"
      subTitle="Try different keywords or remove search filters"
    />
  </div>
</template>
