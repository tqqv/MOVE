<script setup>
  import { ref, computed, watch } from 'vue';
  import {
    formatDate,
    formatDuration,
    formatDateData,
    formatView,
    genreDuration,
    truncateDescripton,
  } from '@/utils';
  const props = defineProps({
    videos: { type: Array, default: () => [] },
    searchTerm: { type: String, default: '' },
  });
  const emit = defineEmits(['update:searchTerm', 'toggleVideoSelection']);

  const localSearchTerm = ref(props.searchTerm);

  watch(localSearchTerm, (newValue) => {
    emit('update:searchTerm', newValue);
  });

  const filteredVideos = computed(() => {
    return props.videos.filter((video) =>
      video.name.toLowerCase().includes(localSearchTerm.value.toLowerCase()),
    );
  });
</script>

<template>
  <div class="flex flex-col h-[300px]">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Select Alternative Content (Video)</h2>
      <div class="relative max-w-sm w-full">
        <input
          v-model="localSearchTerm"
          type="text"
          placeholder="Search videos..."
          class="w-full py-2 pl-10 pr-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300"
        />
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <i class="pi pi-search"></i>
        </span>
      </div>
    </div>
    <div class="mt-2 h-[300px] overflow-y-auto">
      <div
        v-for="video in filteredVideos"
        :key="video.id"
        class="flex gap-4 items-start bg-white p-4 rounded shadow hover:shadow-md"
      >
        <img
          :src="video.image"
          :alt="video.name"
          class="w-20 h-20 object-cover rounded-md border"
        />
        <div class="flex-1">
          <div class="flex justify-between items-center">
            <h4 class="font-semibold text-lg">{{ video.name }}</h4>
            <input
              v-if="!selectedVideo || selectedVideo.id === video.id"
              type="checkbox"
              v-model="video.selected"
              class="h-5 w-5 cursor-pointer"
              @change="toggleVideoSelection(video)"
            />
          </div>
          <p class="text-sm">{{ video.description }}</p>

          <div class="flex gap-2 items-center text-[10px] font-bold pt-2 text-black">
            <span class="bg-[#EEEEEE] rounded-full px-3">{{ video.levelWorkout }}</span>
            <span v-if="video.duration" class="bg-[#EEEEEE] rounded-full px-3">{{
              genreDuration(video.duration)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
