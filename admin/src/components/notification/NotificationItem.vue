<script setup>
  const props = defineProps({
    noti: {
      type: Object,
      required: true,
    },
  });
</script>
<template>
  <div
    class="flex gap-x-3 items-start pb-3 p-3 mb-1 min-h-20 rounded-md hover:bg-gray-light relative"
    :class="{ 'bg-primary/10 hover:bg-primary/10': noti.read }"
  >
    <img :src="noti.avatar" alt="avatar people" class="rounded-full object-cover size-12 flex-shrink-0" />
    <div class="flex flex-col gap-y-1 mr-5">
      <h1 class="text_para">
        <span class="text_para font-semibold mr-1">{{ noti.username }}</span>
        <span :class="{ 'font-semibold': noti.read }">{{ noti.contentNoti }}</span>
      </h1>
      <p class="text_secondary text-[12px] text-[#ACACAC]">1 second ago</p>
    </div>
    <div v-if="noti.read" class="absolute top-1/2 right-3 transform -translate-y-1/2">
      <div class="p-1 rounded-full bg-primary-light"></div>
    </div>
  </div>
</template>
