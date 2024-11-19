<script setup>
  import verified from './icons/verified.vue';
  import rate from './icons/rate.vue';
  import {
    formatDate,
    formatDuration,
    formatRating,
    formatView,
    genreDuration,
    truncateDescripton,
  } from '@/utils';

  const props = defineProps({
    videos: {
      type: Array,
      required: true,
    },
  });
</script>
<template>
  <div v-for="video in videos" :key="video.id" class="overflow-hidden w-full px-2">
    <div class="relative">
      <router-link
        :to="
          video.livestreamChannel
            ? `/live/${video.livestreamChannel.channelName}`
            : `/video/${video.id}`
        "
      >
        <img
          :src="video.thumbnailUrl"
          class="aspect-[9/16] rounded-md object-cover w-full h-[180px] sm:h-[210px] md:h-[230px] lg:h-[200px]"
      /></router-link>
      <span
        v-if="video.livestreamChannel?.isLive"
        class="absolute top-0 left-0 m-2 bg-red text-white text-xs font-bold px-2 py-1 rounded-md"
        >Live</span
      >

      <div
        class="text-xs absolute bottom-2 left-2 flex items-center font-bold text-white bg-black/80 px-3 py-1 gap-x-2 rounded-md"
      >
        <i class="pi pi-eye mt-[0.7px] text-xs" />
        <span>{{ formatView(video.viewCount || video.currentViews) }}</span>
      </div>
      <div
        v-if="!video.livestreamChannel"
        class="absolute bottom-2 right-4 text-white text-xs font-bold bg-black/80 px-3 py-1 rounded-md"
      >
        <span>{{ formatDuration(video.duration) }}</span>
      </div>
    </div>

    <div class="flex py-3">
      <div
        :class="[
          'flex items-center justify-center size-12 rounded-full p-[2px] flex-shrink-0',
          video.livestreamChannel?.isLive || video.channel?.isLive
            ? 'border-[3px] border-red'
            : 'border-[3px] border-transparent',
        ]"
      >
        <img
          :src="video.channel?.avatar || video.livestreamChannel?.avatar"
          alt="Avatar"
          class="w-full h-full rounded-full object-cover"
        />
      </div>

      <div class="pl-4 flex-1">
        <div class="flex items-center w-full justify-between">
          <!-- Tiêu đề chiếm 2/3 không gian -->
          <h3 class="text-sm md:text-base lg:text-lg font-bold text-black" :title="video.title">
            {{ truncateDescripton(video.title, 28) }}
          </h3>

          <div class="flex items-center">
            <rate class="mr-1 mb-[0.5px]" />
            <span class="text-sm font-bold">{{
              formatRating(video.ratings || video.avgRates || 0)
            }}</span>
          </div>
        </div>

        <!-- Truncate channelName with tooltip -->
        <div class="flex items-center">
          <span
            class="text_secondary whitespace-nowrap"
            :title="video.channel?.channelName || video.livestreamChannel?.channelName"
            >{{
              truncateDescripton(
                video.channel?.channelName || video.livestreamChannel?.channelName,
                12,
              )
            }}</span
          >
          <span
            v-if="video.channel?.popularCheck || video.livestreamChannel?.popularCheck"
            class="mb-1 ml-3"
          >
            <verified fill="fill-blue" />
          </span>
        </div>

        <div class="flex items-center space-x-1 text_secondary my-2">
          <span v-if="video.category?.title" class="flex items-center">
            {{ video.category?.title || video.livestreamChannel?.category.title }}
          </span>
          <div v-if="!video.livestreamChannel?.isLive" class="flex items-center">
            <span class="font-bold text-xl px-1 mb-[0.5px] leading-none">•</span>
          </div>
          <span v-if="!video.livestreamChannel?.isLive" lass="whitespace-nowrap"
            >Post {{ formatDate(video.createdAt) }}</span
          >
        </div>

        <div class="flex gap-2 items-center text-[10px] font-bold mb-2 text-black">
          <span class="bg-[#EEEEEE] rounded-full px-3 py-2">{{
            video.levelWorkout?.levelWorkout || video.livestreamLevelWorkout?.levelWorkout
          }}</span>
          <span v-if="video.duration" class="bg-[#EEEEEE] rounded-full px-3 py-2">{{
            genreDuration(video.duration)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
