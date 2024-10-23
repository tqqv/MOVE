<script setup>
  import StatsCard from '@components/streamer/analytics/StatsCard.vue';

  const props = defineProps({
    genderStats: {
      type: Array,
      required: true,
    },
    totalViewer: {
      type: Number,
      required: true,
    },
  });
  console.log(props.genderStats);
</script>

<template>
  <div>
    <div v-if="genderStats.value.length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
      <StatsCard
        v-for="(stat, index) in genderStats?.value"
        :key="index"
        :title="stat.genderGroup"
        :value="stat.viewerCount"
        :percent="(stat.viewerCount / totalViewer) * 100"
      />
    </div>
    <div v-else>
      <p>No data available</p>
    </div>
  </div>
</template>
