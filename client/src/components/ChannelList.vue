<script setup>
  import Verified from './icons/verified.vue';
  const props = defineProps({
    users: {
      type: Array,
      required: true,
      default: () => [],
    },})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div
      v-for="user in users"
      :key="user.id"
      class="flex items-center gap-x-4 mb-4 p-3 cursor-pointer hover:bg-gray-light/30 rounded-lg"
    >
      <div class="relative">
        <div
          :class="[user.isStreaming ? 'border-[3px] border-red' : '']"
          class="flex items-center justify-center rounded-full"
        >
          <img
            :src="user.avatar"
            alt=""
            class="size-[88px] object-cover rounded-full flex-shrink-0 p-[1.5px]"
          />
        </div>
        <div
          v-if="user.isStreaming"
          class="absolute px-2 py-1 bg-[#ff647a] rounded-sm text-white uppercase text-xs font-semibold top-[83%] right-[27%]"
        >
          Live
        </div>
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-x-4 mb-1 flex-1">
          <h1 class="text-[18px] truncate">{{ user.username }}</h1>
          <Verified v-if="user.isVerified" class="fill-blue mb-1" />
        </div>
        <p class="text_secondary text-xs">{{ user.followers }} followers</p>
      </div>
    </div>
  </div>
</template>
