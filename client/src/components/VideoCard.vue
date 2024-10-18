<script setup>
  import verified from './icons/verified.vue';
  import rate from './icons/rate.vue';
  import { formatDate, formatDuration, formatRating, formatView, genreDuration } from '@/utils';

  const props = defineProps({
    videos: {
      type: Array,
      required: true,
    },
  });
</script>
<template>
  <router-link
    v-for="video in videos"
    :to="`/video/${video.id}`"
    :key="video.id"
    class="overflow-hidden w-full px-2"
  >
    <div class="cursor-pointer">
      <div class="relative">
        <img
          :src="video.thumbnailUrl"
          class="rounded-md object-cover w-full h-[180px] sm:h-[210px] md:h-[230px] lg:h-[200px]"
        />
        <div
          v-if="video.viewCount > 0"
          class="text-xs absolute bottom-2 left-4 flex items-center font-bold text-white bg-black/80 px-2 py-1 gap-x-1 rounded"
        >
          <i class="pi pi-eye mt-[0.7px] text-xs" />
          <span class="">{{ formatView(video.viewCount) }}</span>
        </div>
        <div
          class="absolute bottom-2 right-4 text-white text-xs font-bold bg-black/80 px-2 py-1 rounded"
        >
          <span>{{ formatDuration(video.duration) }}</span>
        </div>
      </div>

      <div class="flex py-3">
        <div
          :class="[video.channel.isLive ? 'border-[3px] border-red' : '']"
          class="flex items-center justify-center size-10 rounded-full flex-shrink-0"
        >
          <img
            :src="video.channel.avatar"
            alt="Avatar"
            class="w-full h-full rounded-full object-cover p-[1.5px]"
          />
        </div>

        <div class="pl-4 flex-1">
          <div class="flex items-center mb-2 justify-between">
            <h3 class="text-base font-bold whitespace-nowrap text-black">{{ video.title }}</h3>
            <div class="flex items-center">
              <rate class="mr-1 mb-[0.5px]" />
              <span class="text-sm font-bold">{{ formatRating(video.ratings) }}</span>
            </div>
          </div>
          <div class="flex items-center gap-x-3">
            <span class="text_secondary whitespace-nowrap">{{ video.channel.channelName }}</span>
            <span v-if="video.channel.popularCheck" class="mb-1">
              <verified fill="fill-blue" />
            </span>
          </div>
          <div class="flex items-center space-x-1 text_secondary my-2">
            <span v-if="video.category.title" class="flex items-center">
              {{ video.category.title }}
            </span>
            <span class="font-bold text-xl px-1 mb-[0.5px] leading-none">•</span>
            <span>Post {{ formatDate(video.createdAt) }} </span>
          </div>

          <div class="flex gap-2 items-center text-[10px] font-bold mb-2 text-black">
            <span class="bg-[#EEEEEE] rounded-full px-3 py-2">{{
              video.levelWorkout.levelWorkout
            }}</span>
            <span class="bg-[#EEEEEE] rounded-full px-3 py-2">
              {{ genreDuration(video.duration) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>
