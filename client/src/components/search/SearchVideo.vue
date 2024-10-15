<script setup>
  import { ref, computed } from 'vue';
  import verified from '@icons/verified.vue';
  import rate from '@icons/rate.vue';
  import { formatDate, genreDuration } from '@/utils/calculatorDate';

  const props = defineProps({
    videos: {
      type: Array,
      required: true,
    },
  });
</script>
<template>
  <div class="w-full py-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="video in videos"
        :key="video.id"
        class="max-w-sm bg-white overflow-hidden cursor-pointer"
      >
        <div class="relative">
          <img :src="video.thumbnailUrl" class="rounded-lg object-cover w-full h-[200px]" />
          <div
            class="text-xs absolute min-w-14 bottom-2 left-4 flex items-center justify-center font-bold text-white bg-black bg-opacity-70 py-1 px-2 rounded"
          >
            <i class="pi pi-eye mr-1 text-xs" />
            <span>{{ video.views || 100 }}</span>
          </div>
          <div
            class="absolute min-w-10 text-center bottom-2 right-4 text-white text-xs font-bold bg-black bg-opacity-70 px-2 py-1 rounded"
          >
            <span>{{ video.duration }}</span>
          </div>
        </div>

        <div class="flex py-3">
          <div
            :class="[video.channel.isLive ? 'border-[3px] border-red' : '']"
            class="flex items-center justify-center size-12 rounded-full"
          >
            <img
              :src="video.channel.avatar"
              :alt="video.channel.channelName"
              class="w-full h-full rounded-full object-cover p-[1.5px]"
            />
          </div>

          <div class="pl-4 flex-1">
            <div class="flex items-center my-2 justify-between">
              <h3 class="text-base font-bold whitespace-nowrap text-black">{{ video.title }}</h3>
              <div class="flex items-center">
                <rate class="mr-1 mb-1" />
                <span class="text-sm font-bold">{{ video.rating || 4.5 }}</span>
              </div>
            </div>
            <div class="flex items-center gap-x-3">
              <span class="text_secondary whitespace-nowrap">{{ video.channel.channelName }}</span>
              <span class="mb-1"
                ><verified v-if="video.channel && video.channel.popularCheck" fill="fill-blue"
              /></span>
            </div>
            <div class="flex items-center text_secondary mb-2 gap-x-2">
              {{ video.category.ttile || 'Strength' }}
              <span class="font-bold text-xl pl-1 pr-1">•</span>Posted
              {{ formatDate(video.createdAt) }}
            </div>
            <div class="flex gap-2 items-center text-[10px] font-bold mb-2">
              <span class="bg-[#EEEEEE] rounded-full text-black py-2 px-4">{{
                video.levelWorkout.levelWorkout || 'hard'
              }}</span>
              <span class="bg-[#EEEEEE] rounded-full text-black py-2 px-4">{{
                genreDuration(video.duration)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
