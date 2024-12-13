<script setup>
  import { watch, ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Verified from '@/components/icons/verified.vue';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import Gift from '@/components/icons/gift.vue';
  import Status from '@/components/Status.vue';
  import Flag from '@/components/icons/flag.vue';
  import VideoReport from './VideoReport.vue';
  import SuspendPopup from './SuspendPopup.vue';
  import { usePopupStore } from '@/stores';
  import AccountReport from './AccountReport.vue';
  import { getReportDetail } from '@/services/report';
  import Skeleton from 'primevue/skeleton';
  import SkeletonVideo from './SkeletonVideo.vue';

  dayjs.extend(relativeTime);
  const route = useRoute();
  const popupStore = usePopupStore();
  const reportId = ref();
  const typeReport = ref();
  const status = ref();
  const detailReport = ref();
  const listReporter = ref({});
  const isLoading = ref(true);
  const timeFromNow = (createdAt) => {
    return dayjs(createdAt, 'YYYY-MM-DD HH:mm:ss').fromNow();
  };

  const fetchDetailReport = async () => {
    const params = {
      type: typeReport.value,
      targetReportId: reportId.value,
    };
    try {
      isLoading.value = true;
      const response = await getReportDetail(params);
      if (typeReport.value == 'comment') {
        detailReport.value = response.data.data.reportCommentDetail;
        listReporter.value = response.data.data.commentReporters;
      } else if (typeReport.value == 'video') {
        detailReport.value = response.data.data.reportVideoDetail;
        listReporter.value = response.data.data.videoReporters;
      } else if (typeReport.value == 'livestream') {
        detailReport.value = response.data.data.reportLivestreamDetail;
        listReporter.value = response.data.data.streamReporters;
      } else if (typeReport.value == 'channel') {
        detailReport.value = response.data.data.reportChannelDetail;
        listReporter.value = response.data.data.channelReporters;
      } else if (typeReport.value == 'account') {
        detailReport.value = response.data.data.reportAccountDetail;
        listReporter.value = response.data.data.accountReporters;
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    reportId.value = route.params.reportId;
    typeReport.value = route.params.reportType;
    fetchDetailReport();
  });
  watch(
    () => route.params.reportId,
    async (newReportId) => {
      reportId.value = newReportId;
    },
  );

  const handleOpenSuspend = () => {
    status.value = 'suspend';
    popupStore.openShowSuspend();
  };

  const handleOpenBan = () => {
    status.value = 'ban';
    popupStore.openShowBan();
  };
  const handleOpenAccept = () => {
    status.value = 'approved';
    popupStore.openShowAccept();
  };
  const handleOpenReject = () => {
    status.value = 'rejected';
    popupStore.openShowReject();
  };
</script>
<template>
  <section class="px-8 pb-12 text-sm">
    <div class="container">
      <div class="flex justify-between">
        <RouterLink to="/report" class="flex items-center gap-x-2 mb-4 cursor-pointer">
          <i class="pi pi-arrow-left text-sm mt-0.5"></i>
          <p class="font-semibold">Go back</p>
        </RouterLink>
      </div>
      <div class="card">
        <div class="flex justify-between items-center">
          <div class="flex gap-x-4">
            <Status :status="detailReport?.status" />
          </div>
          <div v-if="detailReport?.status === 'pending'" class="flex gap-x-4 justify-end mt-4">
            <button class="btn-ban" @click="handleOpenBan">Ban</button>
            <button class="btn-suspend" @click="handleOpenSuspend">Suspend</button>
            <button
              v-if="!detailReport?.Channel && !detailReport?.targetUser"
              class="btn-success"
              @click="handleOpenAccept"
            >
              Approve
            </button>
            <button class="btn-reject" @click="handleOpenReject">Reject</button>
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4 mt-5">
          <!-- LEFT -->
          <div class="col-span-5 bg-white rounded shadow h-fit">
            <h2 class="text-2xl italic uppercase text-center font-bold mb-8 mt-5">Target</h2>
            <div v-if="isLoading" class="flex items-start justify-between my-4 mx-5">
              <div class="flex items-center gap-x-3">
                <Skeleton shape="circle" size="2.8rem"></Skeleton>
                <div class="">
                  <Skeleton width="6rem" class="mb-2"></Skeleton>
                  <Skeleton width="10rem"></Skeleton>
                </div>
              </div>
              <div class="flex flex-col">
                <Skeleton width="6rem" class="mb-2"></Skeleton>
              </div>
            </div>
            <div v-else class="flex items-start justify-between my-4 mx-5 gap-x-2">
              <div class="flex items-center gap-x-3">
                <img
                  :src="
                    detailReport?.Comment?.channelComments?.avatar ||
                    detailReport?.Comment?.userComments?.avatar ||
                    detailReport?.Video?.channel?.avatar ||
                    detailReport?.Livestream?.livestreamChannel?.avatar ||
                    detailReport?.Channel?.avatar ||
                    detailReport?.targetUser?.avatar
                  "
                  class="rounded-full size-10 flex-shrink-0 object-cover"
                />
                <div class="flex flex-col justify-start truncate">
                  <p class="font-semibold truncate">
                    {{
                      detailReport?.Comment?.channelComments?.channelName ||
                      detailReport?.Comment?.userComments?.username ||
                      detailReport?.Video?.channel?.channelName ||
                      detailReport?.Livestream?.livestreamChannel?.channelName ||
                      detailReport?.Channel?.channelName ||
                      detailReport?.targetUser?.username
                    }}
                  </p>

                  <p
                    v-if="
                      detailReport?.Comment?.channelComments ||
                      detailReport?.Video ||
                      detailReport?.Livestream ||
                      detailReport?.Channel
                    "
                    class=""
                  >
                    @{{
                      detailReport?.Comment?.userComments?.username ||
                      detailReport?.Video?.channel?.User?.username ||
                      detailReport?.Livestream?.livestreamChannel?.User?.username ||
                      detailReport?.Channel?.User?.username
                    }}
                  </p>
                  <p v-if="!detailReport?.Comment?.channelComments || detailReport?.targetUser">
                    {{
                      detailReport?.Comment?.userComments?.email || detailReport?.targetUser?.email
                    }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col">
                <p class="font-medium">
                  Role:
                  <span class="opacity-50 capitalize">{{
                    detailReport?.Comment?.userComments?.role ||
                    detailReport?.Video?.channel?.User?.role ||
                    detailReport?.Livestream?.livestreamChannel?.User?.role ||
                    detailReport?.Channel?.User?.role ||
                    detailReport?.targetUser?.role
                  }}</span>
                </p>
              </div>
            </div>
            <!-- FLAG -->
            <div class="flex items-center justify-center mx-5 my-6 bg-custom py-2">
              <Flag fill="#000" class="mx-3" />
            </div>
            <!-- FLAG -->
            <div>
              <h2 class="text-2xl italic uppercase text-center font-bold my-8">REPORT BY</h2>
              <div
                class="max-h-[300px] border border-gray-dark mx-3 py-3 rounded-lg overflow-y-auto scrollbar-custom mb-5"
              >
                <!-- LIST REPORT -->
                <div class="flex flex-col gap-y-3 mx-5 ml-2">
                  <div
                    v-if="isLoading"
                    v-for="n in 2"
                    class="flex items-start justify-between gap-y-3 mx-5 ml-2"
                  >
                    <div class="flex items-center gap-x-3">
                      <Skeleton shape="circle" size="2.2rem"></Skeleton>
                      <div class="">
                        <Skeleton width="6rem" class="mb-2"></Skeleton>
                        <Skeleton width="10rem"></Skeleton>
                      </div>
                    </div>
                    <div class="flex flex-col">
                      <Skeleton width="6rem" class="mb-2"></Skeleton>
                    </div>
                  </div>
                  <div
                    v-else
                    v-for="user in listReporter"
                    :key="user.id"
                    class="flex justify-between gap-x-2 text-sm"
                  >
                    <div class="flex items-center gap-x-3 truncate">
                      <img
                        :src="user?.reporter?.avatar"
                        class="rounded-full size-8 object-cover flex-shrink-0"
                      />
                      <div>
                        <p class="font-semibold truncate">{{ user?.reporter?.username }}</p>
                        <p>{{ user?.reporter?.email }}</p>
                      </div>
                    </div>
                    <span class="text-end">{{ user?.ReportType?.description }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- RIGHT -->
          <div class="col-span-7 bg-white p-5 rounded shadow h-fit">
            <div class="flex justify-center">
              <span class="text-2xl italic uppercase text-center font-bold mb-3">
                reported content
              </span>
            </div>
            <div>
              <p class="mt-3 font-medium">
                Report type:
                <span class="text-body font-normal capitalize">{{ typeReport }}</span>
              </p>
            </div>
            <!-- REPORT COMMENT -->
            <div class="my-3" v-if="typeReport == 'comment'">
              <div class="flex flex-col gap-y-3">
                <div class="flex flex-col gap-y-3">
                  <p class="font-medium">The content of the comment was reported:</p>
                  <div
                    v-if="isLoading"
                    class="flex items-center gap-x-3 text-sm border border-gray-dark rounded-lg p-3"
                  >
                    <div class="flex items-center gap-x-3">
                      <Skeleton shape="circle" size="2.8rem"></Skeleton>
                      <div class="">
                        <Skeleton width="15rem" class="mb-2"></Skeleton>
                        <Skeleton width="8rem"></Skeleton>
                      </div>
                    </div>
                  </div>
                  <div
                    v-else
                    class="flex items-center gap-x-3 text-sm border border-gray-dark rounded-lg p-3"
                  >
                    <div class="flex-shrink-0">
                      <img
                        :src="
                          detailReport?.Comment?.channelComments?.avatar ||
                          detailReport?.Comment?.userComments?.avatar
                        "
                        alt="Avatar"
                        class="size-9 object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <div class="flex justify-between items-center gap-x-2 w-fit">
                        <h1 class="font-bold">
                          {{
                            detailReport?.Comment?.channelComments?.channelName ||
                            detailReport?.Comment?.userComments?.username
                          }}
                        </h1>
                        <span>
                          <Verified
                            v-if="detailReport?.Comment?.channelComments?.popularCheck"
                            width="14px"
                            class="fill-blue"
                          />
                        </span>
                        <div
                          v-if="detailReport?.Comment?.rep"
                          class="flex items-center whitespace-nowrap"
                        >
                          <Gift class="mr-1" />
                          <span class="text-xs mt-1 text-[#FFB564]"
                            >Gifted {{ detailReport?.Comment?.rep }}</span
                          >
                        </div>
                        <p class="whitespace-nowrap text-xs text-[#666666]">
                          {{ timeFromNow('2024-10-26 01:40:18') }}
                        </p>
                      </div>
                      <!-- COMMENT -->
                      <div ref="textElement" class="break-all text-sm text-black">
                        <p>{{ detailReport?.Comment?.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- IN VIDEO/LIVE -->
                <div>
                  <p class="font-medium mb-4">In video:</p>
                  <SkeletonVideo v-if="isLoading" />
                  <VideoReport v-else :detailReport="detailReport?.Comment?.Video" />
                </div>
              </div>
            </div>
            <!-- REPORT VIDEO -->
            <div v-if="typeReport == 'video'">
              <p class="my-3 font-medium">The content of the video was reported:</p>
              <SkeletonVideo v-if="isLoading" />
              <VideoReport v-else :detailReport="detailReport?.Video || detailReport?.Livestream" />
            </div>
            <!-- REPORT ACCOUNT -->
            <div v-if="typeReport == 'channel'">
              <p class="my-3 font-medium">The channel was reported:</p>
              <AccountReport :accountDetail="detailReport" />
            </div>
            <!-- REPORT LIVE -->
            <div v-if="typeReport == 'livestream'">
              <p class="my-3 font-medium">The content of the live stream was reported:</p>
              <SkeletonVideo v-if="isLoading" />
              <VideoReport v-else :detailReport="detailReport?.Livestream" />
            </div>
            <div v-if="typeReport == 'account'">
              <p class="my-3 font-medium">The account was reported:</p>
              <AccountReport :accountDetail="detailReport" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <SuspendPopup
      :typeReport="typeReport"
      :status="status"
      :detailReport="detailReport"
      @fetchDetailReport="fetchDetailReport"
    />
  </section>
</template>
