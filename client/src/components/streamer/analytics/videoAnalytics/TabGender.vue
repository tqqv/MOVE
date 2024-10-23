<script setup>
  import StatsCard from '@components/streamer/analytics/StatsCard.vue';

  const props = defineProps({
    genderStats: {
      type: Array,
      required: true,
    },
  });
</script>

<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
      <StatsCard
        v-for="(stat, index) in genderStats"
        :key="index"
        :title="stat.title"
        :value="stat.value"
        :percent="stat.percent"
      />
    </div>
  </div>
</template>
