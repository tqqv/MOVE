<script setup>
  import { computed, ref } from 'vue';
  import rate from '@icons/rate.vue';
  import heart from '@icons/heart.vue';
  import share from '@icons/share.vue';
  import { formatRating, formatDuration, formatView } from '@/utils';

  const props = defineProps({
    video: {
      type: Object,
      required: true,
    },
  });

  const isMenuVisible = ref(false);
  const isFilled = ref(false);

  const duration = computed(() => {
    if (formatDuration(props.video?.duration) < 30) return '< 30 mins';
    if (formatDuration(props.video?.duration) < 60) return '< 1 hour';
    return '> 1 hour';
  });

  const toggleMenu = () => {
    isMenuVisible.value = !isMenuVisible.value;
  };

  const closeMenu = () => {
    isMenuVisible.value = false;
  };

  const toggleFill = () => {
    isFilled.value = !isFilled.value;
  };
</script>

<template>
  <div class="flex items-center justify-between">
    <h3 class="text-[20px] whitespace-nowrap text-black">{{ video.title }}</h3>
    <div class="flex items-center">
      <rate class="mr-2 scale-125" />
      <span class="text-[20px] font-bold">{{ formatRating(video.ratings) }}</span>
    </div>
  </div>
  <div class="flex items-center mb-2 text-[13px] mt-2">
    <span class="text-red">{{ formatView(video.viewCount) }} view</span>
    <span class="font-bold text-sm px-2">•</span>
    <span class="text-primary">{{ video.category.title }}</span>
  </div>
  <div class="flex items-center justify-between">
    <div class="flex gap-2 items-center text-[11px] font-bold">
      <span class="bg-[#EEEEEE] rounded-full text-black py-2 px-4">{{
        video.levelWorkout.levelWorkout
      }}</span>
      <span class="bg-[#EEEEEE] rounded-full text-black py-2 px-4">{{ duration }}</span>
    </div>
    <div class="flex items-center gap-9">
      <div
        class="text-primary text-[13px] font-bold flex items-center cursor-pointer uppercase"
        @click="toggleFill"
      >
        <heart
          :fill="isFilled ? 'fill-primary' : 'fill-white'"
          stroke="stroke-primary"
          class="mr-1"
        />
        Follow
      </div>
      <div class="text-primary text-[13px] font-bold flex items-center cursor-pointer uppercase">
        <i class="pi pi-star mr-1"></i> Rate Video
      </div>
      <div class="text-primary text-[13px] font-bold flex items-center cursor-pointer uppercase">
        <share class="mr-1" /> Share
      </div>
      <div class="relative">
        <button
          aria-expanded="false"
          aria-controls="menu"
          class="pi pi-ellipsis-v text-primary text-[20px]"
          @click="toggleMenu"
        />
        <div
          v-if="isMenuVisible"
          class="absolute bottom-full mb-2 w-[115px] h-[40px] bg-white shadow rounded-md z-50"
        >
          <ul class="flex items-center justify-center h-full m-0 p-0">
            <li
              class="flex items-center justify-center text-[13px] cursor-pointer text-center"
              @click="closeMenu"
            >
              Report video
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
