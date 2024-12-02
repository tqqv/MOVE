<script setup>
  import { ref, onMounted } from 'vue';
  import LatestAnalyticsCard from '../analytics/LatestAnalyticsCard.vue';
  import { useAnalyticsStreamerStore, useUserStore } from '@/stores';
  import { formatNumber } from '@/utils';
  import CommentItem from '@/components/comments/CommentItem.vue';
  import { useStreamerStore } from '@/stores';
  import { getAllCommentOfStreamer } from '@/services/comment';
  import { formatDate } from '@/utils/calculatorDate';
  import { toast } from 'vue3-toastify';
  import Skeleton from 'primevue/skeleton';

  const comments = ref([]);
  const streamerStore = useStreamerStore();
  const isResponsed = ref(false);
  const analyticsStreamerStore = useAnalyticsStreamerStore();
  const userStore = useUserStore();
  const fetchAllCommentStreamer = async () => {
    const streamerId = streamerStore?.streamerChannel.id;

    try {
      const response = await getAllCommentOfStreamer(streamerId, 3, 1, isResponsed.value);
      comments.value = response.data.commentsWithVideo.rows.slice(0, 3);
      console.log(comments.value);

      console.log(comments.value);
    } catch (error) {
      console.log(error);
    }
  };
  const handleClickShareFacebook = async () => {
    const shareUrl = encodeURIComponent(window.location.href);
    const fbShareUrl = `https://www.facebook.com/dialog/share?app_id=${
      import.meta.env.VITE_FACEBOOK_APP_ID
    }&href=${shareUrl}&display=popup`;

    const width = 600;
    const height = 400;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(fbShareUrl, '_blank', `width=${width},height=${height},top=${top},left=${left}`);
  };

  const handleClickCopyLink = () => {
    const channelUrl = `${window.location.origin}/user/${streamerStore?.streamerChannel.User?.username}`;
    navigator.clipboard
      .writeText(channelUrl)
      .then(() => {
        toast.success('Link copied successfully!');
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
        toast.error("Couldn't copy the link. Please try again.");
      });
  };

  onMounted(async () => {
    await streamerStore.fetchProfileChannel();
    analyticsStreamerStore.fetchOverviewAnalytic();
    fetchAllCommentStreamer();
  });
</script>

<template>
  <section class="container">
    <div class="flex justify-between px-2">
      <h1 class="text_title">Channel dashboard</h1>
    </div>
    <div>
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 pt-6">
          <!-- Cột 1: Live và Video -->
          <div v-if="analyticsStreamerStore.isLoadingOverview" class="space-y-6">
            <Skeleton width="100%" height="283px" class="rounded-md"></Skeleton>
            <Skeleton width="100%" height="315px" class="rounded-md mt-6"></Skeleton>
          </div>
          <div v-else class="space-y-6">
            <LatestAnalyticsCard
              v-if="analyticsStreamerStore.latestStream"
              title="Latest live stream summary"
              :latestStream="analyticsStreamerStore.latestStream"
            />
            <div v-else class="bg-white shadow-lg p-8 rounded-md space-y-4">
              <div class="text-[18px] font-bold">Latest live stream summary</div>
              <div>No live stream data available.</div>
            </div>

            <LatestAnalyticsCard
              v-if="analyticsStreamerStore.latestVideo"
              title="Latest video summary"
              :latestVideo="analyticsStreamerStore.latestVideo"
            />
            <div v-else class="bg-white shadow-lg p-8 rounded-md space-y-4">
              <div class="text-[18px] font-bold">Latest video summary</div>
              <div>No video data available.</div>
            </div>
          </div>

          <!-- Cột 2: Analytics và Comments -->
          <div v-if="analyticsStreamerStore.isLoadingOverview" class="space-y-6">
            <Skeleton width="100%" height="187px" class="rounded-md"></Skeleton>
            <Skeleton width="100%" height="355px" class="rounded-md mt-6"></Skeleton>
          </div>
          <div v-else class="space-y-6">
            <div class="w-full shadow-lg p-8 rounded-md space-y-2">
              <div class="text-[18px] font-bold">Channel analytics</div>
              <div class="flex justify-between">
                <span class="text-base">Followers</span>
                <span class="text-[16px] font-bold">{{
                  analyticsStreamerStore.followerCount
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-base">Total REPs earned</span>
                <span class="text-[16px] font-bold"
                  >{{ formatNumber(analyticsStreamerStore.totalRepEarn || 0) }} REPs</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-base">REPs</span>
                <span class="text-[16px] font-bold"
                  >{{ formatNumber(userStore.user?.Channel?.rep || 0) }} REPs</span
                >
              </div>
            </div>

            <!--   Latest Comments -->
            <div class="w-full shadow-lg p-8 rounded-md space-y-4">
              <div class="text-[18px] font-bold pb-4">
                Latest comments
                <div class="text-[12px] text-[#666666] pt-2">
                  Comments I have not responded to on the channel
                </div>
              </div>
              <div v-for="reply in comments" :key="reply.id" class="flex gap-x-2">
                <div class="w-[15%] flex-shrink-0 flex justify-center">
                  <img
                    :src="reply.channelComments?.avatar || reply.userComments?.avatar"
                    alt="Avatar"
                    class="size-10 rounded-full object-cover"
                  />
                </div>
                <div class="w-[50%] flex flex-col">
                  <div class="flex gap-x-2">
                    <div class="text-sm font-bold w-full truncate">
                      {{ reply.channelComments?.channelName || reply.userComments?.username }}
                      <span v-if="reply.channelComments?.popularCheck" class="inline-block">
                        <verified class="scale-95" fill="fill-blue" />
                      </span>
                    </div>
                    <div class="text-footer text-xs whitespace-nowrap">
                      {{ formatDate(reply.updatedAt) }}
                    </div>
                  </div>
                  <div :title="reply.content" class="text-sm w-full truncate">
                    {{ reply.content }}
                  </div>
                </div>
                <div class="w-[30%] pl-5">
                  <RouterLink :to="`/video/${reply?.videoId}`">
                    <img
                      :src="reply.Video.thumbnailUrl"
                      alt="video thumbnail"
                      class="object-cover w-full h-full rounded-lg"
                    />
                  </RouterLink>
                </div>
              </div>
              <RouterLink :to="'/dashboard-streamer/comments'">
                <div class="text-base text-primary pt-3">Go to comments analytics</div>
              </RouterLink>
            </div>
          </div>

          <!-- Cột 3: Share -->
          <div v-if="analyticsStreamerStore.isLoadingOverview" class="space-y-6">
            <Skeleton width="100%" height="187px" class="rounded-md"></Skeleton>
            <Skeleton width="100%" height="355px" class="rounded-md mt-6"></Skeleton>
          </div>
          <div v-else class="space-y-6">
            <div class="w-full bg-primary shadow-lg p-4 h-[187px] rounded-md space-y-4">
              <div class="text-[18px] text-white font-bold flex justify-center">
                Share your channel!
              </div>
              <div class="text-sm text-justify mx-auto">
                Gain more followers & viewers by sharing your channel to your friends!
              </div>
              <div class="flex justify-center">
                <ul class="flex justify-center gap-8 text-white">
                  <li
                    class="flex flex-col items-center text-[13px] cursor-pointer gap-2 group"
                    @click="handleClickShareFacebook"
                  >
                    <i class="pi pi-facebook text-[40px]"></i>
                    <h4 class="font-bold">Facebook</h4>
                  </li>
                  <li
                    class="flex flex-col items-center text-[13px] cursor-pointer gap-2 group"
                    @click="handleClickCopyLink"
                  >
                    <div
                      class="w-[40px] h-[40px] rounded-full border-white bg-white border-2 flex items-center justify-center"
                    >
                      <i class="pi pi-link text-primary text-[25px]"></i>
                    </div>
                    <h4 class="font-bold">Copy link</h4>
                  </li>
                </ul>
              </div>
            </div>
            <div class="w-full bg-white shadow-lg p-6 rounded-lg space-y-4">
              <div>
                <h3 class="text-lg font-bold pb-2">Tips for Instructor</h3>
              </div>

              <div class="w-full">
                <img
                  src="https://res.cloudinary.com/dg9imqwrd/image/upload/v1733125065/qbwplnlnizxdmekm8haa.png"
                  alt="Tips for Instructor"
                  class="rounded-lg w-full object-cover"
                />
              </div>

              <div>
                <h4 class="text-base font-semibold pt-1">How to set up stream?</h4>
                <p class="text-sm text-gray-600">
                  Discover useful tips to set up your live streams effectively and engage with your
                  audience more efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
  .text-justify {
    text-align: center;
  }
</style>
