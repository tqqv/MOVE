<script setup>
  import CategoryImage from '@/components/CategoryImage.vue';
  import Divider from '@/components/Divider.vue';
  import GirdVideo from '@/components/GirdVideo.vue';
  import Rate from '@/components/icons/rate.vue';
  import axiosInstance from '@/services/axios';
  import { formatDate, formatRating, formatView, truncateDescripton } from '@/utils';
  import { onMounted, ref } from 'vue';
  import { toast } from 'vue3-toastify';

  const videosFollow = ref([]);
  const catesFollow = ref([]);
  const livesFollow = ref([]);

  const getListFollowing = async () => {
    try {
      const response = await axiosInstance.get('user/getAllInforFollow');
      if (response.status === 200) {
        videosFollow.value = response.data.data.videos;
        catesFollow.value = response.data.data.categories;
        livesFollow.value = response.data.data.livestreams;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  onMounted(async () => {
    await getListFollowing();
  });
</script>
<template>
  <section>
    <div class="container">
      <div class="flex items-center">
        <span class="font-bold text-[26px] pr-8">Following</span>
        <Divider class="flex-grow mt-1" />
      </div>
      <div class="flex justify-between mt-3">
        <span class="font-bold text-[24px]">Live channel</span>
      </div>
      <div class="w-full mt-4 py-4" v-if="livesFollow.length > 0">
        <div
          class="flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8"
        >
          <div
            v-for="live in livesFollow"
            :key="live.streamerId"
            class="overflow-hidden w-full px-2"
          >
            <div class="relative">
              <router-link :to="live.livestreamChannel.channelName">
                <img
                  :src="live.thumbnailUrl"
                  class="aspect-[9/16] rounded-md object-cover w-full h-[180px] sm:h-[210px] md:h-[230px] lg:h-[200px]"
              /></router-link>
              <span
                v-if="live.livestreamChannel.isLive"
                class="absolute top-0 left-0 m-2 bg-red text-white text-xs font-bold px-2 py-1 rounded-md"
                >Live</span
              >
              <div
                class="text-xs absolute bottom-2 left-2 flex items-center font-bold text-white bg-black/80 px-3 py-1 gap-x-2 rounded-md"
              >
                <i class="pi pi-eye mt-[0.7px] text-xs" />
                <span>{{ formatView(live.totalView) }}</span>
              </div>
            </div>

            <div class="flex py-3">
              <div
                class="flex items-center justify-center size-12 rounded-full p-[2px] flex-shrink-0 border-[3px] border-red"
              >
                <img
                  :src="live.livestreamChannel?.avatar"
                  alt="Avatar"
                  class="w-full h-full rounded-full object-cover"
                />
              </div>

              <div class="pl-4 flex-1">
                <div class="flex items-center w-full justify-between">
                  <!-- Tiêu đề chiếm 2/3 không gian -->
                  <h3
                    class="text-sm md:text-base lg:text-lg font-bold text-black"
                    :title="live.title"
                  >
                    {{ truncateDescripton(live.title, 28) }}
                  </h3>

                  <div class="flex items-center">
                    <Rate class="mr-1 mb-[0.5px]" />
                    <span class="text-sm font-bold">{{ formatRating(live.ratings || 0) }}</span>
                  </div>
                </div>

                <!-- Truncate channelName with tooltip -->
                <div class="flex items-center">
                  <span
                    class="text_secondary whitespace-nowrap"
                    :title="live.livestreamChannel?.channelName"
                    >{{ truncateDescripton(live.livestreamChannel?.channelName, 12) }}</span
                  >
                  <span v-if="live.livestreamChannel?.popularCheck" class="mb-1 ml-3">
                    <verified fill="fill-blue" />
                  </span>
                </div>

                <div class="flex items-center space-x-1 text_secondary my-2">
                  <span v-if="live.category?.title" class="flex items-center">
                    {{ live.category?.title }}
                  </span>
                  <div v-if="live.livestreamChannel?.isLive" class="flex items-center">
                    <span class="font-bold text-xl px-1 mb-[0.5px] leading-none">•</span>
                  </div>
                  <span v-if="live.livestreamChannel?.isLive" lass="whitespace-nowrap"
                    >Post {{ formatDate(live.createdAt) }}</span
                  >
                </div>

                <div class="flex gap-2 items-center text-[10px] font-bold mb-2 text-black">
                  <span class="bg-[#EEEEEE] rounded-full px-3 py-2">{{
                    live.livestreamLevelWorkout?.levelWorkout
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3" v-else>
        <span class="italic">There are no active live sessions at the moment.</span>
      </div>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="items-center space-y-4">
        <Divider class="flex-grow mt-1" />
        <div class="flex justify-between">
          <span class="font-bold text-[24px]">Lastest videos</span>
        </div>
      </div>
      <GirdVideo :videos="videosFollow" v-if="videosFollow.length > 0" />
      <div class="mt-3" v-else>
        <span class="italic">There are no active videos at the moment.</span>
      </div>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="items-center space-y-4">
        <Divider class="flex-grow mt-1" />
        <div class="flex justify-between">
          <span class="font-bold text-[24px]">Categories</span>
        </div>
      </div>
      <div
        class="grid gap-x-12 gap-y-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
        v-if="catesFollow.length > 0"
      >
        <CategoryImage :categories="catesFollow" />
      </div>
      <div class="mt-3" v-else>
        <span class="italic">There are no active categories at the moment.</span>
      </div>
    </div>
  </section>
</template>
