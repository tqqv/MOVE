<script setup>
  import LiveChat from '@/components/LiveChat.vue';
  import ViewLiveStreamContent from '@/components/viewLiveStream/ViewLiveStreamContent.vue';
</script>

<template>
  <div class="flex pt-[72px]">
    <div class="flex-1 overflow-y-auto overflow-x-none mb-4">
      <ViewLiveStreamContent />
    </div>
    <LiveChat />
  </div>
</template>
