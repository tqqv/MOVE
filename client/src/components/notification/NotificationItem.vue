<script setup>
  const props = defineProps({
    noti: {
      type: Object,
      required: true,
    },
  });
</script>
<template>
  <div class="flex gap-x-3 items-center pb-3">
    <img :src="noti.avatar" alt="avatar people" class="rounded-full object-cover size-12" />
    <div>
      <h1 class="text_para text-white">
        <span class="text_para font-bold text-white">{{ noti.username }}</span>
        has replied to your comment.
      </h1>
      <p class="text_secondary text-[12px] mt-2 text-[#ACACAC]">1 second ago</p>
    </div>
  </div>
</template>
