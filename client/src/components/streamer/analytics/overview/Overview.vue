<script setup>
  import { ref, onMounted } from 'vue';
  import StatsCard from '@components/streamer/analytics/StatsCard.vue';
  import rate from '@components/icons/rate.vue';
  import { getOverviewAnalytic } from '@services/streamer';
  import { formatNumber, formatRating, formatView, truncateDescripton } from '@/utils';
  const overviewStats = [{ title: 'Total followers' }, { title: 'Total REPs earned' }];

  const liveSummaryStats = [{ title: 'Total live views' }, { title: 'Average view time' }];

  const videoSummaryStats = [{ title: 'Total video views' }, { title: 'Average view time' }];

  const latestStream = ref(null);
  const latestVideo = ref(null);

  const fetchOverviewAnalytic = async () => {
    try {
      const response = await getOverviewAnalytic();
      if (response.status === 200) {
        overviewStats[0].value = response.data.data.overview.followerCount;
        overviewStats[1].value = response.data.data.overview.totalRepEarn;

        liveSummaryStats[0].value = response.data.data.streamSummary.totalStreamView;
        liveSummaryStats[1].value = response.data.data.streamSummary.avgView;

        videoSummaryStats[0].value = response.data.data.videoSummary.totalVideoView;

        videoSummaryStats[1].value = response.data.data.videoSummary.avgView;

        latestVideo.value = response.data.data.latestVideos[0];

        latestStream.value = response.data.data.latestStream[0];
      } else {
        console.error('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  onMounted(() => {
    fetchOverviewAnalytic();
  });
</script>

<template>
  <div class="container">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-12 pt-6">
      <div class="space-y-12">
        <!-- Overview Section -->
        <div>
          <span class="text-[22px] font-bold">Overview</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatsCard
              v-for="(stat, index) in overviewStats"
              :key="index"
              :title="stat.title"
              :value="stat.value"
            />
          </div>
        </div>

        <!-- Live Summary Section -->
        <div>
          <span class="text-[22px] font-bold">Live summary</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatsCard
              v-for="(stat, index) in liveSummaryStats"
              :key="index"
              :title="stat.title"
              :value="stat.value"
            />
          </div>
        </div>

        <!-- Video Summary Section -->
        <div>
          <span class="text-[22px] font-bold">Video summary</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatsCard
              v-for="(stat, index) in videoSummaryStats"
              :key="index"
              :title="stat.title"
              :value="stat.value"
            />
          </div>
        </div>
      </div>

      <!-- Latest Analytics Section -->
      <div>
        <div class="text-[22px] font-bold">Latest analytics</div>

        <!-- Latest Live Stream Card -->
        <div class="bg-white shadow-lg p-8 rounded-md space-y-4">
          <div class="text-[18px] font-bold">Latest live stream</div>
          <div>
            <div class="text-xs text-[#666666] uppercase">Title of live stream</div>
            <span class="text-[16px] font-bold">{{
              truncateDescripton(latestStream?.title, 55)
            }}</span>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-base">Total views</span>
              <span class="text-base font-bold">{{ formatView(latestStream?.totalView) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-base">Total REPs received</span>
              <span class="text-base font-bold"
                >{{ formatNumber(latestStream?.totalReps) }} REPs</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-base">Ratings</span>
              <div class="flex items-center">
                <span class="text-base font-bold">{{ formatRating(latestStream?.ratings) }}</span>
                <rate class="ml-1 mb-1" />
              </div>
            </div>
          </div>
          <RouterLink :to="'/dashboard-streamer/live-stream-analytics'">
            <div class="text-base text-primary pt-2">Go to live analytics</div></RouterLink
          >
        </div>

        <!-- Latest Video Card -->
        <div class="bg-white shadow-lg p-8 rounded-md mt-6 space-y-4 mb-8">
          <span class="text-[18px] font-bold">Latest video</span>
          <RouterLink :to="`/video/${latestVideo?.id}`">
            <div class="relative overflow-hidden rounded-lg">
              <img :src="latestVideo?.thumbnailUrl" class="object-cover w-full h-[300px]" /></div
          ></RouterLink>
          <div class="text-base font-bold">{{ truncateDescripton(latestVideo?.title, 28) }}</div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-base">Total views</span>
              <span class="text-base font-bold">{{ formatView(latestVideo?.viewCount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-base">Total REPs received</span>
              <span class="text-base font-bold"
                >{{ formatNumber(latestVideo?.totalReps) }} REPs</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-base">Ratings</span>
              <div class="flex items-center">
                <span class="text-base font-bold">{{ formatRating(latestVideo?.ratings) }}</span>
                <rate class="ml-1 mb-1" />
              </div>
            </div>
          </div>
          <RouterLink :to="`/dashboard-streamer/video-analytics/${latestVideo?.id}`">
            <div class="text-base text-primary pt-2">Go to video analytics</div></RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>
