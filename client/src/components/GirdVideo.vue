<script setup>
  import { ref, computed, onMounted } from 'vue';
  import verified from './icons/verified.vue';
  import rate from './icons/rate.vue';
  import Paginator from 'primevue/paginator';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { getLevelWorkoutById, getCategoryById } from '@/services/video';

  dayjs.extend(relativeTime);
  const levelWorkout = ref(null);
  const category = ref(null);

  const props = defineProps({
    videos: {
      type: Array,
      required: true,
    },
    channelDetails: {
      type: Object,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  });
  const fetchLevelWorkoutById = async (lvWorkoutId) => {
    try {
      const response = await getLevelWorkoutById(lvWorkoutId);
      levelWorkout.value = response.data.levelWorkout;
      return response.data.levelWorkout;
    } catch (error) {
      console.error('Error fetching level workout:', error);
      return null;
    }
  };
  const fetchCategoryById = async (cateId) => {
    try {
      const response = await getCategoryById(cateId);
      category.value = response.data.title;
      return response.data.title;
    } catch (error) {
      console.error('Error fetching level workout:', error);
      return null;
    }
  };
  const emit = defineEmits(['pageChange']);

  const timeFromNow = (createAt) => {
    return dayjs(createAt, 'YYYY-MM-DD HH:mm:ss').fromNow();
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  };

  const formatViewCount = (count) => {
    if (count >= 1000 && count < 1000000) {
      return (count / 1000).toFixed(2).replace(/\.00$/, '') + 'k';
    } else if (count >= 1000000) {
      return (count / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
    } else {
      return count ?? 0;
    }
  };

  const formatDurationTag = (durationInSeconds) => {
    const durationInMinutes = Math.floor(durationInSeconds / 60);
    if (durationInMinutes < 30) {
      return '< 30 mins';
    } else if (durationInMinutes >= 30 && durationInMinutes < 60) {
      return '< 1 hour';
    } else if (durationInMinutes >= 60) {
      return '> 1 hour';
    }
    return '';
  };

  const onPageChange = (event) => {
    emit('pageChange', event.page + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const videosData = ref([]);

  onMounted(async () => {
    const videosUpdated = await Promise.all(
      props.videos.map(async (video) => {
        const levelWorkout = await fetchLevelWorkoutById(video.levelWorkoutsId);
        const category = await fetchCategoryById(video.categoryId);
        return {
          ...video,
          levelWorkout: levelWorkout,
          category: category,
        };
      }),
    );
    videosData.value = videosUpdated;
  });
</script>

<template>
  <div class="w-full py-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="(video, index) in videosData"
        :key="index"
        class="max-w-sm bg-white overflow-hidden cursor-pointer"
      >
        <div class="relative">
          <img :src="video.thumbnailUrl" class="rounded-lg object-cover w-full h-[200px]" />
          <div
            class="text-xs absolute bottom-2 left-4 flex items-center font-bold text-white bg-black bg-opacity-70 p-1 rounded"
          >
            <i class="pi pi-eye mr-1 text-xs" />
            <span>{{ formatViewCount(video.viewCount ?? 0) }}</span>
          </div>
          <div
            class="absolute bottom-2 right-4 text-white text-xs font-bold bg-black bg-opacity-70 p-1 rounded"
          >
            <span>{{ formatDuration(video.duration) }}</span>
          </div>
        </div>

        <div class="flex py-3">
          <div
            :class="[channelDetails.isLive ? 'border-[3px] border-red' : '']"
            class="flex items-center justify-center size-12 rounded-full flex-shrink-0"
          >
            <img
              :src="channelDetails.avatar"
              alt="Avatar"
              class="w-full h-full rounded-full object-cover p-[1.5px]"
            />
          </div>

          <div class="pl-4 flex-1">
            <div class="flex items-center my-2 justify-between">
              <h3 class="text-base font-bold whitespace-nowrap text-black">{{ video.title }}</h3>
              <div class="flex items-center">
                <rate class="mr-1 mb-1" />
                <span class="text-sm font-bold">{{ video.rating ?? 0 }}</span>
              </div>
            </div>
            <div class="flex items-center gap-x-3">
              <span class="text_secondary whitespace-nowrap">{{ channelDetails.channelName }}</span>
              <span v-if="channelDetails.popularCheck" class="mb-1">
                <verified fill="fill-blue" />
              </span>
            </div>
            <div class="flex items-center space-x-1 text_secondary mb-2">
              <span v-if="video.category" class="flex items-center">
                {{ video.category }}
                <span class="font-bold text-xl px-1 pb-1">•</span>
              </span>
              <span>Post {{ timeFromNow(video.createdAt) }} </span>
            </div>

            <div class="flex gap-2 items-center text-[10px] font-bold mb-2">
              <span class="bg-[#EEEEEE] rounded-full text-black p-2">{{ video.levelWorkout }}</span>
              <span class="bg-[#EEEEEE] rounded-full text-black p-2">
                {{ formatDurationTag(video.duration) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Paginator
      :rows="props.pageSize"
      :first="(props.page - 1) * props.pageSize"
      :totalRecords="props.totalPages * props.pageSize"
      @page="onPageChange"
    />
  </div>
</template>
