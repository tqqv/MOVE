<script setup>
  import { ref, watch } from 'vue';
  import verified from '@icons/verified.vue';
  import { searchInformation } from '@/services/search';

  const props = defineProps({
    categories: {
      type: Array,
      required: true,
      default: () => [],
    },
    videos: {
      type: Array,
      required: true,
      default: () => [],
    },
    users: {
      type: Array,
      required: true,
      default: () => [],
    },
    searchData: String,
  });
</script>

<template>
  <div class="w-full rounded-lg shadow-md absolute bg-white text-black">
    <div v-if="categories.length || videos.length || users.length" class="px-2 py-3 text-sm">
      <!-- CATEGORIES -->
      <div v-if="categories.length > 0" class="pb-3 border-b border-gray-dark">
        <div
          v-for="category in categories"
          :key="category.id"
          class="p-2 flex items-center justify-between rounded-md hover:bg-gray-light cursor-pointer"
        >
          <div class="flex items-center gap-x-2">
            <img :src="category.imgUrl" :alt="category.title" class="h-14 w-10 object-cover" />
            <h1>{{ category.title }}</h1>
          </div>
          <span class="text-xs italic text-footer">categories</span>
        </div>
      </div>
      <!-- VIDEO -->
      <div v-if="videos.length > 0" class="py-2 border-b border-gray-dark mb-3">
        <div
          v-for="video in videos"
          :key="video.id"
          class="p-2 flex items-center justify-between rounded-md hover:bg-gray-light cursor-pointer"
        >
          <div class="flex items-center gap-x-2">
            <img :src="video.thumbnailUrl" :alt="video.title" class="h-10 w-14 object-cover" />
            <h1>{{ video.title }}</h1>
          </div>
          <span class="text-xs italic text-footer">videos</span>
        </div>
      </div>
      <!-- USER -->
      <div v-if="users.length > 0" class="flex flex-col gap-y-2 my-2 pb-4">
        <div
          v-for="user in users"
          :key="user.id"
          class="flex items-center justify-between p-2 mt-2 gap-x-3 cursor-pointer rounded-md hover:bg-gray-light"
        >
          <div class="flex items-center gap-x-2 truncate">
            <img
              :src="user.avatar"
              :alt="user.username"
              class="size-9 object-cover rounded-full flex-shrink-0"
            />
            <h1 class="truncate">{{ user.username }}</h1>
            <verified class="fill-blue scale-90 mr-1" />
          </div>
          <span class="text-xs italic text-footer">Instructor</span>
        </div>
      </div>
      <!-- SEARCH  -->
      <div class="flex gap-x-3 pb-1 pt-1">
        <i class="ml-2 pi pi-search text-lg text-primary font-semibold"></i>
        <h1>
          All results for <span class="font-semibold">{{ searchData }}</span>
        </h1>
      </div>
    </div>
    <div v-else class="px-2 py-3 text-sm">
      <div class="flex gap-x-3 pb-1 pt-1">
        <i class="ml-2 pi pi-search text-lg text-primary font-semibold"></i>
        <h1>
          Not found <span class="font-semibold">{{ searchData }}</span>
        </h1>
      </div>
    </div>
  </div>
</template>
