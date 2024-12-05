import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getOverviewAnalytic } from '@services/streamer';

export const useAnalyticsStreamerStore = defineStore('analytics', () => {
  const overviewStats = [{ title: 'Total followers' }, { title: 'Total REPs earned' }];

  const liveSummaryStats = [{ title: 'Total live views' }, { title: 'Average view time' }];

  const videoSummaryStats = [{ title: 'Total video views' }, { title: 'Average view time' }];
  const followerCount = ref(null);
  const totalRepEarn = ref(null);

  const latestStream = ref(null);
  const latestVideo = ref(null);
  const isLoadingOverview = ref(true);

  const fetchOverviewAnalytic = async () => {
    try {
      const response = await getOverviewAnalytic();
      if (response.status === 200) {
        overviewStats[0].value = response.data.data.overview.followerCount;
        overviewStats[1].value = response.data.data.overview.totalRepEarn;
        followerCount.value = response.data.data.overview.followerCount;
        totalRepEarn.value = response.data.data.overview.totalRepEarn;
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
    } finally {
      isLoadingOverview.value = false;
    }
  };

  return {
    fetchOverviewAnalytic,
    latestStream,
    latestVideo,
    isLoadingOverview,
    overviewStats,
    liveSummaryStats,
    videoSummaryStats,
    followerCount,
    totalRepEarn,
  };
});
