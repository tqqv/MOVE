<script setup>
  import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
  import { genreDuration, truncateDescripton } from '@/utils';
  import CheckMarkCustom from '@/components/CheckMarkCustom.vue';
  import EmptyPage from '@/pages/EmptyPage.vue';
  import moment from 'moment';
  const props = defineProps({
    videos: Object,
    searchTerm: { type: String, default: '' },
    chooseDate: String,
  });
  const emit = defineEmits([
    'update:searchTerm',
    'update:videosByDate',
    'loadMoreData',
    'debouncedSearch',
    'fetchVideosByChannel',
  ]);
  const scrollContainer = ref(null);
  const searchData = ref('');

  const videosByDate = ref({});

  // Lưu danh sách video cho ngày hiện tại
  const selectedVideos = computed(() => {
    return videosByDate.value[props.chooseDate];
  });

  // Xử lý khi chọn video
  const toggleVideoSelection = (video) => {
    const currentVideos = videosByDate.value[props.chooseDate];
    const index = currentVideos.findIndex((v) => v.id === video.id);

    if (index === -1) {
      // Thêm video nếu chưa có
      videosByDate.value[props.chooseDate] = [...currentVideos, video];
    } else {
      // Bỏ video nếu đã có
      videosByDate.value[props.chooseDate] = currentVideos.filter((v) => v.id !== video.id);
    }
    console.log(videosByDate.value);

    emit('update:videosByDate', videosByDate.value);
  };
  const shouldShowCheckbox = (video) => {
    const currentVideos = videosByDate.value[props.chooseDate];

    return !currentVideos.length || currentVideos.some((v) => v.id === video.id);
  };
  // Theo dõi ngày thay đổi
  watch(
    () => props.chooseDate,
    (newDate) => {
      if (!videosByDate.value[newDate]) {
        videosByDate.value[newDate] = [];
      }
    },
    { immediate: true },
  );

  onMounted(() => {
    if (scrollContainer.value) {
      scrollContainer.value.addEventListener('scroll', onScroll);
    }
  });
  onUnmounted(() => {
    if (scrollContainer.value) {
      scrollContainer.value.removeEventListener('scroll', onScroll);
    }
  });
  const onScroll = (event) => {
    const container = event.target;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
      emit('loadMoreData');
    }
  };

  watch(
    () => searchData.value,
    (newSearchData) => {
      if (!newSearchData) {
        emit('fetchVideosByChannel');
      } else {
        emit('debouncedSearch', newSearchData);
      }
    },
  );
</script>
<template>
  <div class="flex flex-col h-[430px]">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl pl-4 font-bold">Select Alternative Content (Video)</h2>
      <div class="relative max-w-sm w-full">
        <input
          v-model="searchData"
          type="text"
          placeholder="Search videos..."
          class="w-full py-2 pl-10 pr-4 border border-primary rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition duration-300"
        />
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
          <i class="pi pi-search"></i>
        </span>
      </div>
    </div>

    <div ref="scrollContainer" class="mt-2 min-h-[330px] max-h-[300px] overflow-y-auto">
      <EmptyPage
        v-if="!videos.length"
        title="No videos found"
        subTitle="Upload a new video to booking"
        :isSmall="true"
      />
      <div
        v-for="video in videos"
        :key="video.id"
        class="flex gap-4 items-start bg-white p-4 rounded shadow hover:shadow-md"
      >
        <img
          :src="video.thumbnailUrl"
          :alt="video.title"
          class="w-20 h-20 object-cover rounded-md"
        />
        <div class="flex-1">
          <div class="flex justify-between items-center">
            <h4 class="font-semibold text-lg">{{ video.title }}</h4>
            <CheckMarkCustom
              v-if="shouldShowCheckbox(video)"
              groupName="video"
              :checked="selectedVideos.includes(video)"
              @update:modelValue="toggleVideoSelection(video)"
            />
          </div>
          <p class="text-sm">{{ truncateDescripton(video.description, 100) }}</p>

          <div class="flex gap-2 items-center text-[10px] font-bold pt-2 text-black">
            <span class="bg-[#EEEEEE] rounded-full px-3">{{
              video?.levelWorkout?.levelWorkout
            }}</span>
            <span v-if="video.duration" class="bg-[#EEEEEE] rounded-full px-3">{{
              genreDuration(video.duration)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
