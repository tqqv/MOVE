<script setup>
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
  });
</script>

<template>
  <div class="flex flex-col h-[300px]">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl pl-4 font-bold">Advertising Booking Details</h2>
    </div>
    <Divider class="mb-8" />
    <div v-for="video in videos" :key="video.id" class="mb-6">
      <div class="flex gap-6 items-start p-4 rounded-lg">
        <div>
          <img
            :src="video.thumbnailUrl"
            :alt="video.title"
            class="size-20 object-cover rounded-lg shadow-md"
          />
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-center mb-2">
            <h4 class="font-bold text-lg">{{ video.title }}</h4>
            <CheckMarkCustom
              v-if="video.selected || props.videos.every((v) => !v.selected)"
              groupName="video"
              :checked="video.selected"
              @update:modelValue="toggleVideoSelection(video)"
            />
          </div>
          <p class="text-sm">{{ truncateDescripton(video.description, 150) }}</p>

          <div class="flex gap-2 items-center text-xs font-semibold pt-2">
            <span class="bg-[#EEEEEE] rounded-full px-3 py-1">{{
              video?.levelWorkout.levelWorkout
            }}</span>
            <span v-if="video.duration" class="bg-[#EEEEEE] rounded-full px-3 py-1">{{
              genreDuration(video.duration)
            }}</span>
          </div>
        </div>
        <div class="flex flex-col items-end justify-between">
          <div class="font-bold text-xl">
            {{
              formatNumber(databyDate?.defaultData?.pricePerDay || databyDate?.abnormal.pricePerDay)
            }}
            REPs
          </div>
          <div class="text-md mt-2">
            {{ formatDateData(selectedDate) }}
          </div>
        </div>
      </div>
    </div>

    <Divider />
    <div class="p-4">
      <div class="flex justify-between items-end">
        <div class="text-lg font-medium whitespace-nowrap"><strong>Total Videos:</strong></div>
        <div class="font-bold text-xl">x {{ selectedVideosCount }}</div>
      </div>
      <div class="flex justify-between items-end">
        <div class="text-lg font-medium whitespace-nowrap"><strong>Total Price:</strong></div>
        <div class="font-bold text-xl">
          {{
            formatNumber(
              (databyDate?.defaultData?.pricePerDay || databyDate?.abnormal.pricePerDay) *
                selectedVideosCount,
            )
          }}
          REPs
        </div>
      </div>
    </div>
  </div>
</template>
