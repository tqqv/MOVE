<script setup>
  import { ref, onMounted } from 'vue';

  import Filter from '@components/Filter.vue';
  import facebook from '@/components/icons/facebookLogin.vue';
  import GirdVideo from '@/components/GirdVideo.vue';

  import { getVideobyChannel } from '@/services/video';

  const levelOptions = [
    { id: 1, name: 'Beginner' },
    { id: 2, name: 'Intermediate' },
    { id: 3, name: 'Advanced' },
  ];
  const categoryOptions = [
    { id: 1, name: 'All categories' },
    { id: 2, name: 'Entertainment' },
    { id: 3, name: 'Technology' },
    { id: 4, name: 'Lifestyle' },
  ];
  const sortByOptions = [
    { id: 1, name: 'Views (High to Low)', icon: facebook },
    { id: 2, name: 'Views (Low to High)', icon: facebook },
    { id: 3, name: 'Duration (Long to Short)', icon: facebook },
    { id: 4, name: 'Duration (Short to Long)', icon: facebook },
    { id: 5, name: 'Ratings (High to Low)', icon: facebook },
    { id: 6, name: 'Ratings (Low to High)', icon: facebook },
  ];
  const videos = ref([]);

  const props = defineProps({
    channelDetails: {
      type: Object,
      required: true,
    },
    channelId: {
      type: Number,
      required: true,
    },
  });
  const getVideo = async (channelId) => {
    try {
      const result = await getVideobyChannel(channelId);
      videos.value = result.data.data;
      console.log(videos);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  onMounted(() => {
    getVideo(props.channelId);
  });
</script>

<template>
  <div v-if="videos.length > 0" class="pt-2">
    <div class="flex flex-grow items-center justify-between">
      <div class="whitespace-nowrap text-2xl font-bold text-black">All videos</div>
      <div class="flex gap-x-6">
        <Filter :title="'LEVEL'" :options="levelOptions" />
        <Filter :title="'CATEGORY'" :options="categoryOptions" />
        <Filter :title="'SORT BY'" :options="sortByOptions" />
      </div>
    </div>
    <GirdVideo :videos="videos" :channelDetails="props.channelDetails" />
  </div>
  <div v-else class="text-base text-black italic">
    {{ channelDetails.channelName }} has not uploaded any videos yet.
  </div>
</template>
