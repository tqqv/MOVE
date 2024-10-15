<script setup>
  import verified from './icons/verified.vue';
  import rate from './icons/rate.vue';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { formatRating, formatView } from '@/utils';

  dayjs.extend(relativeTime);
  const props = defineProps({
    video: {
      type: Object,
      required: true,
    },
  });

  if (props.video.category.title && props.video.levelWorkout.levelWorkout) {
    props.video.category = props.video.category.title;
    props.video.levelWorkout = props.video.levelWorkout.levelWorkout;
  }
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
</script>
<template>
  <div class="max-w-sm bg-white overflow-hidden cursor-pointer">
    <div class="relative">
      <img :src="video.thumbnailUrl" class="rounded-lg object-cover w-full h-[200px]" />
      <div
        class="text-xs absolute bottom-2 left-4 flex items-center font-bold text-white bg-black bg-opacity-70 p-1 rounded"
      >
        <i class="pi pi-eye mr-1 text-xs" />
        <span>{{ formatView(video.viewCount) }}</span>
      </div>
      <div
        class="absolute bottom-2 right-4 text-white text-xs font-bold bg-black bg-opacity-70 p-1 rounded"
      >
        <span>{{ formatDuration(video.duration) }}</span>
      </div>
    </div>

    <div class="flex py-3">
      <div
        :class="[video.channel.isLive ? 'border-[3px] border-red' : '']"
        class="flex items-center justify-center size-12 rounded-full flex-shrink-0"
      >
        <img
          :src="video.channel.avatar"
          alt="Avatar"
          class="w-full h-full rounded-full object-cover p-[1.5px]"
        />
      </div>

      <div class="pl-4 flex-1">
        <div class="flex items-center my-2 justify-between">
          <h3 class="text-base font-bold whitespace-nowrap text-black">{{ video.title }}</h3>
          <div class="flex items-center">
            <rate class="mr-1 mb-1" />
            <span class="text-sm font-bold">{{ formatRating(video.ratings) }}</span>
          </div>
        </div>
        <div class="flex items-center gap-x-3">
          <span class="text_secondary whitespace-nowrap">{{ video.channel.channelName }}</span>
          <span v-if="video.channel.popularCheck" class="mb-1">
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
</template>
