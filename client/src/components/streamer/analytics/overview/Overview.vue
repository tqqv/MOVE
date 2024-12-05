<script setup>
  import { ref, onMounted } from 'vue';
  import StatsCard from '@components/streamer/analytics/StatsCard.vue';
  import rate from '@components/icons/rate.vue';
  import { getOverviewAnalytic } from '@services/streamer';
  import { formatNumber, formatRating, formatView, truncateDescripton } from '@/utils';
  import Skeleton from 'primevue/skeleton';

  import LatestAnalyticsCard from '@components/streamer/analytics/LatestAnalyticsCard.vue';
  import { useAnalyticsStreamerStore } from '@/stores';

  const analyticsStreamerStore = useAnalyticsStreamerStore();

  onMounted(() => {
    analyticsStreamerStore.fetchOverviewAnalytic();
  });
</script>

<template>
  <section class="container">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-12 pt-6">
      <div class="space-y-12">
        <!-- Overview Section -->
        <div class="space-y-2">
          <span class="font-bold text-[24px]">Overview</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatsCard
              v-for="(stat, index) in analyticsStreamerStore.overviewStats"
              :key="index"
              :title="stat.title"
              :value="stat.value"
              :isLoading="analyticsStreamerStore.isLoadingOverview"
            />
          </div>
        </div>

        <!-- Live Summary Section -->
        <div class="space-y-2">
          <span class="font-bold text-[24px]">Live summary</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatsCard
              v-for="(stat, index) in analyticsStreamerStore.liveSummaryStats"
              :key="index"
              :title="stat.title"
              :value="stat.value"
              :isLoading="analyticsStreamerStore.isLoadingOverview"
            />
          </div>
        </div>

        <!-- Video Summary Section -->
        <div class="space-y-2">
          <span class="font-bold text-[24px]">Video summary</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatsCard
              v-for="(stat, index) in analyticsStreamerStore.videoSummaryStats"
              :key="index"
              :title="stat.title"
              :value="stat.value"
              :isLoading="analyticsStreamerStore.isLoadingOverview"
            />
          </div>
        </div>
      </div>

      <!-- SKELETON -->
      <div v-if="analyticsStreamerStore.isLoadingOverview" class="space-y-2">
        <div class="font-bold text-[24px]">Latest analytics</div>
        <!-- Latest Live Stream Card -->
        <div class="pb-6">
          <Skeleton width="100%" height="283px" class="rounded-md"></Skeleton>
        </div>
        <!-- Latest Video Card -->
        <Skeleton width="100%" height="315px" class="rounded-md mt-6"></Skeleton>
      </div>

      <!-- Latest analytics -->
      <div v-else class="space-y-2">
        <div class="font-bold text-[24px]">Latest analytics</div>

        <!-- Latest Live Stream Card -->
        <div class="space-y-6 pb-6">
          <LatestAnalyticsCard
            v-if="analyticsStreamerStore.latestStream"
            title="Latest live stream"
            :latestStream="analyticsStreamerStore.latestStream"
          />

          <div v-else class="bg-white shadow-lg p-8 rounded-md space-y-4">
            <div class="text-[18px] font-bold">Latest live stream</div>
            <div>No live stream data available.</div>
          </div>

          <!-- Latest Video Card -->
          <LatestAnalyticsCard
            v-if="analyticsStreamerStore.latestVideo"
            title="Latest video"
            :latestVideo="analyticsStreamerStore.latestVideo"
          />
          <div v-else class="bg-white shadow-lg p-8 rounded-md space-y-4">
            <div class="text-[18px] font-bold">Latest video</div>
            <div>No video data available.</div>
          </div>
          <!-- ---------- -->
        </div>
      </div>
    </div>
  </section>
</template>
