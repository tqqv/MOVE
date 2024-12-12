<script setup>
  import { ref, computed, watch, onMounted } from 'vue';

  import Divider from 'primevue/divider';
  import {
    formatDate,
    formatDuration,
    formatDateData,
    formatView,
    genreDuration,
    truncateDescripton,
    formatNumber,
  } from '@/utils';

  const props = defineProps({
    videos: Array,
    databyDate: Object,
    selectedDate: Object,
    selectedVideosCount: Number,
    combinedData: Object,
  });
  const uniqueVideosCount = computed(() => {
    const uniqueVideos = Array.from(new Set(props.combinedData.map((video) => video.id)));
    return uniqueVideos.length;
  });

  const totalPrice = computed(() => {
    const formattedSelectedDates = Array.isArray(props.selectedDate)
      ? props.selectedDate.map((date) => formatDateData(date))
      : [];

    if (formattedSelectedDates.length === 0) {
      return 0;
    }

    return props.databyDate
      .filter((item) => formattedSelectedDates.includes(formatDateData(item.date)))
      .reduce((total, item) => {
        const pricePerDay =
          item.data?.defaultData?.pricePerDay || item.data?.abnormal?.pricePerDay || 0;
        return total + pricePerDay;
      }, 0);
  });
</script>
<template>
  <div v-if="combinedData.length > 0" class="min-h-[305px] max-h-[305px] overflow-y-auto">
    <div v-for="item in combinedData" :key="item.id" class="mb-6">
      <div class="flex gap-6 items-start p-4 rounded-lg">
        <!-- Thumbnail -->
        <div>
          <img
            :src="item.thumbnailUrl"
            :alt="item.title"
            class="size-20 object-cover rounded-lg shadow-md"
          />
        </div>

        <!-- Video Details -->
        <div class="flex-1">
          <div class="flex justify-between items-center mb-2">
            <h4 class="font-bold text-lg">{{ item.title }}</h4>
          </div>
          <p class="text-sm">{{ truncateDescripton(item.description, 150) }}</p>

          <div class="flex gap-2 items-center text-xs font-semibold pt-2">
            <span class="bg-[#EEEEEE] rounded-full px-3 py-1">{{
              item?.levelWorkout.levelWorkout
            }}</span>
            <span v-if="item.duration" class="bg-[#EEEEEE] rounded-full px-3 py-1">{{
              genreDuration(item.duration)
            }}</span>
          </div>
        </div>

        <!-- Price Info -->
        <div class="flex flex-col items-end justify-between">
          <div>
            <div class="font-bold">{{ item.date }}</div>
            <div class="font-bold">{{ item.pricePerDay }} REPs</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Divider />
  <div class="p-4">
    <div class="flex justify-between items-end">
      <div class="text-lg font-medium whitespace-nowrap"><strong>Total Videos:</strong></div>
      <div class="font-bold text-xl">x {{ uniqueVideosCount }}</div>
    </div>
    <div class="flex justify-between items-end">
      <div class="text-lg font-medium whitespace-nowrap"><strong>Total Price:</strong></div>
      <div class="font-bold text-xl">
        {{ formatNumber(totalPrice) }}
        REPs
      </div>
    </div>
  </div>
</template>
