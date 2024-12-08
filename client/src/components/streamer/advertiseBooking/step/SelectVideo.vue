<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { genreDuration, truncateDescripton } from '@/utils';
  import CheckMarkCustom from '@/components/CheckMarkCustom.vue';

  const props = defineProps({
    videos: Object,
    searchTerm: { type: String, default: '' },
  });
  const emit = defineEmits(['update:searchTerm', 'toggleVideoSelection']);

  const localSearchTerm = ref(props.searchTerm);

  watch(localSearchTerm, (newValue) => {
    emit('update:searchTerm', newValue);
  });
  const toggleVideoSelection = (video) => {
    props.videos.forEach((v) => {
      v.selected = v.id === video.id ? !v.selected : false;
    });
    emit('toggleVideoSelection', video);
  };
</script>

<template>
  <div class="flex flex-col h-[300px]">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl pl-4 font-bold">Select Alternative Content (Video)</h2>
      <div class="relative max-w-sm w-full">
        <input
          v-model="localSearchTerm"
          type="text"
          placeholder="Search videos..."
          class="w-full py-2 pl-10 pr-4 border border-primary rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition duration-300"
        />
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
          <i class="pi pi-search"></i>
        </span>
      </div>
    </div>
    <div class="mt-2 h-[300px] overflow-y-auto">
      <div
        v-for="video in videos"
        :key="video.id"
        class="flex gap-4 items-start bg-white p-4 rounded shadow hover:shadow-md"
      >
        <img
          :src="video.thumbnailUrl"
          :alt="video.title"
          class="w-20 h-20 object-cover rounded-md"
        />
        <div class="flex-1">
          <div class="flex justify-between items-center">
            <h4 class="font-semibold text-lg">{{ video.title }}</h4>
            <CheckMarkCustom
              v-if="video.selected || props.videos.every((v) => !v.selected)"
              groupName="video"
              :checked="video.selected"
              @update:modelValue="toggleVideoSelection(video)"
            />
          </div>
          <p class="text-sm">{{ truncateDescripton(video.description, 150) }}</p>

          <div class="flex gap-2 items-center text-[10px] font-bold pt-2 text-black">
            <span class="bg-[#EEEEEE] rounded-full px-3">{{
              video?.levelWorkout.levelWorkout
            }}</span>
            <span v-if="video.duration" class="bg-[#EEEEEE] rounded-full px-3">{{
              genreDuration(video.duration)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
