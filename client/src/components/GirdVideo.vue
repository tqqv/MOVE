<script setup>
  import VideoCard from './VideoCard.vue';
  import Paginator from 'primevue/paginator';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';

  dayjs.extend(relativeTime);

  const props = defineProps({
    videos: {
      type: Array,
      required: true,
    },

    page: {
      type: Number,
    },
    pageSize: {
      type: Number,
    },
    totalPages: {
      type: Number,
    },
  });
  console.log(props.videos);

  const emit = defineEmits(['pageChange']);

  const onPageChange = (event) => {
    emit('pageChange', event.page + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
</script>
<template>
  <div class="w-full py-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <VideoCard v-for="(video, index) in videos" :key="index" :video="video" />
    </div>

    <div v-if="page !== undefined && pageSize !== undefined && totalPages > 0">
      <Paginator
        :rows="pageSize"
        :first="(page - 1) * pageSize"
        :totalRecords="totalPages * pageSize"
        @page="onPageChange"
      />
    </div>
  </div>
</template>
