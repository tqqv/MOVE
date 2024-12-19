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
  import { RouterLink } from 'vue-router';

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
            ? `/live/${video?.livestreamChannel?.User.username}`
            : `/video/${video.id}`
        "
      >
        <img :src="video.thumbnailUrl" class="aspect-[16/9] rounded-md object-cover w-full h-full"
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
      <RouterLink
        :class="[
          'flex items-center justify-center size-12 rounded-full p-[2px] flex-shrink-0 cursor-pointer',
          video.livestreamChannel?.isLive || video.channel?.isLive
            ? 'border-[3px] border-red'
            : 'border-[3px] border-transparent',
        ]"
        :to="
          video.channel?.isLive || video?.livestreamChannel?.isLive
            ? `/live/${video.channel?.User?.username || video?.livestreamChannel?.User?.username}`
            : `/user/${video.channel?.User?.username || video?.livestreamChannel?.User?.username}`
        "
      >
        <img
          :src="video.channel?.avatar || video.livestreamChannel?.avatar"
          alt="Avatar"
          class="w-full h-full rounded-full object-cover"
        />
      </RouterLink>

      <div class="pl-3 flex-1 w-full truncate">
        <div class="flex items-center w-full justify-between">
          <!-- Tiêu đề chiếm 2/3 không gian -->
          <RouterLink
            :to="
              video.livestreamChannel
                ? `/live/${video.livestreamChannel.User.username}`
                : `/video/${video.id}`
            "
            class="text-sm md:text-base lg:text-lg font-bold text-black truncate"
            :title="video.title"
          >
            {{ truncateDescripton(video.title, 28) }}
          </RouterLink>

          <div class="flex items-center flex-shrink-0">
            <rate class="mr-1 mb-[0.5px] flex-shrink-0" />
            <span class="text-sm font-bold flex-shrink-0">{{
              formatRating(video.ratings || video.avgRates || 0)
            }}</span>
          </div>
        </div>

        <!-- Truncate channelName with tooltip -->
        <div class="flex items-center">
          <RouterLink
            :to="
              video.channel
                ? `/user/${video?.channel?.User?.username}`
                : `/user/${video?.livestreamChannel?.User?.username}`
            "
            class="text_secondary truncate w-[90px]"
            :title="video.channel?.channelName || video.livestreamChannel?.channelName"
            >{{ video.channel?.channelName || video.livestreamChannel?.channelName }}</RouterLink
          >
          <span
            v-if="video.channel?.popularCheck || video.livestreamChannel?.popularCheck"
            class="ml-3"
          >
            <verified fill="fill-blue flex-shrink-0" width="14px" />
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
