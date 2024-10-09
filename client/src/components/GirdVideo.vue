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
    channelDetails: {
      type: Object,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
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
      <VideoCard
        v-for="(video, index) in videos"
        :key="index"
        :video="video"
        :channelDetails="channelDetails"
      />
    </div>

    <Paginator
      :rows="pageSize"
      :first="(page - 1) * pageSize"
      :totalRecords="totalPages * pageSize"
      @page="onPageChange"
    />
  </div>
</template>
