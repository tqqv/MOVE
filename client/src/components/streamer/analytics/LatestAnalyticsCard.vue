<script setup>
  import { ref, onMounted } from 'vue';
  import { formatNumber, formatRating, formatView, truncateDescripton } from '@/utils';
  import rate from '@components/icons/rate.vue';

  const props = defineProps({
    title: String,
    latestVideo: Object,
    latestStream: Object,
  });
</script>
<template>
  <div class="bg-white shadow-lg p-8 rounded-md space-y-4 mb-8">
    <div class="text-[18px] font-bold pb-2">{{ title }}</div>
    <RouterLink v-if="latestVideo" :to="`/video/${latestVideo?.id}`">
      <div class="relative overflow-hidden rounded-lg">
        <img :src="latestVideo?.thumbnailUrl" class="object-cover w-full h-[300px]" /></div
    ></RouterLink>
    <div>
      <div v-if="latestStream" class="text-xs text-[#666666] uppercase pb-2">
        Title of live stream
      </div>
      <span class="text-[16px] font-bold">{{
        truncateDescripton(latestVideo?.title || latestStream?.title, 28)
      }}</span>
    </div>
    <div class="space-y-2">
      <div class="flex justify-between">
        <span class="text-base">Total views</span>
        <span class="text-base font-bold">{{
          formatView(latestVideo?.viewCount || latestStream?.totalView || 0)
        }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-base">Total REPs received</span>
        <span class="text-base font-bold"
          >{{ formatNumber(latestVideo?.totalReps || latestStream?.totalReps || 0) }} REPs</span
        >
      </div>
      <div class="flex justify-between">
        <span class="text-base">Ratings</span>
        <div class="flex items-center">
          <span class="text-base font-bold">{{
            formatRating(latestVideo?.ratings || latestStream?.ratings)
          }}</span>
          <rate class="ml-1 mb-1" />
        </div>
      </div>
    </div>
    <RouterLink v-if="latestVideo" :to="`/dashboard-streamer/video-analytics/${latestVideo?.id}`">
      <div class="text-base text-primary pt-2">Go to video analytics</div></RouterLink
    >

    <RouterLink v-if="latestStream" :to="'/dashboard-streamer/live-stream-analytics'">
      <div class="text-base text-primary pt-2">Go to live analytics</div></RouterLink
    >
  </div>
</template>
