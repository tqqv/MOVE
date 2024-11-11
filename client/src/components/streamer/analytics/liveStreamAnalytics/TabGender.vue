<script setup>
  import { computed } from 'vue';
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

  const defaultStats = [
    { genderGroup: 'Male' },
    { genderGroup: 'Female' },
    { genderGroup: 'Other' },
  ];

  const mergedStats = computed(() => {
    return defaultStats.map((defaultStat) => {
      const foundStat = props.genderStats.find((stat) => {
        return stat.genderGroup === defaultStat.genderGroup;
      });

      const viewerCount = foundStat ? foundStat.viewerCount : 0;

      return {
        ...defaultStat,
        viewerCount,
        percent: props.totalViewer > 0 ? (viewerCount / props.totalViewer) * 100 : 0,
      };
    });
  });
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 w-full">
    <StatsCard
      v-for="(stat, index) in mergedStats"
      :key="index"
      :title="stat.genderGroup"
      :value="stat.viewerCount"
      :percent="stat.percent"
    />
  </div>
</template>
