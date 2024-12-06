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

  dayjs.extend(relativeTime);
  const route = useRoute();
  const popupStore = usePopupStore();
  const reportId = ref('');
  const typeReport = ref();
  const timeFromNow = (createdAt) => {
    return dayjs(createdAt, 'YYYY-MM-DD HH:mm:ss').fromNow();
  };

  onMounted(() => {
    reportId.value = route.params.reportId;
  });
  watch(
    () => route.params.reportId,
    async (newReportId) => {
      reportId.value = newReportId;
      console.log(newReportId);
    },
  );

  const targetAccount = ref({
    avatar:
      'https://lh3.googleusercontent.com/a/ACg8ocLD0zBeWhE6AogwnEVG6hkW1s1cRVP38V6qv5d0ECCJI9QHsg=s96-c',
    username: 'vietzz711',
    email: 'vietzz711@gmail.com',
    role: 'user',
    reportedDate: '2021/12/06',
    type: 'comment',
    status: 'pending',
    reporterBy: [
      {
        id: 1,
        name: 'vietzz771',
        email: 'ththth@gmail.com',
        avatar:
          'https://lh3.googleusercontent.com/a/ACg8ocJcgDoeNwGt0YBm93RFfjz2245K2BNsHxvbEL3PdiOqnw=s96-c',
        reportReason: 'Nudity or sexual activity',
      },
      {
        id: 2,
        name: 'john_doe123',
        email: 'johndoe@gmail.com',
        avatar:
          'https://lh3.googleusercontent.com/a/ACg8ocJcgDoeNwGt0YBm93RFfjz2245K2BNsHxvbEL3PdiOqnw=s96-c',
        reportReason: 'Hate speech or symbols',
      },
      {
        id: 3,
        name: 'alice_wonder',
        email: 'alicewonder@gmail.com',
        avatar:
          'https://lh3.googleusercontent.com/a/ACg8ocJcgDoeNwGt0YBm93RFfjz2245K2BNsHxvbEL3PdiOqnw=s96-c',
        reportReason: 'Harassment or bullying',
      },
      {
        id: 4,
        name: 'cool_kid_99',
        email: 'coolkid99@gmail.com',
        avatar:
          'https://lh3.googleusercontent.com/a/ACg8ocJcgDoeNwGt0YBm93RFfjz2245K2BNsHxvbEL3PdiOqnw=s96-c',
        reportReason: 'Violence or dangerous acts',
      },
      {
        id: 5,
        name: 'susan_sky',
        email: 'susansky@gmail.com',
        avatar:
          'https://lh3.googleusercontent.com/a/ACg8ocJcgDoeNwGt0YBm93RFfjz2245K2BNsHxvbEL3PdiOqnw=s96-c',
        reportReason: 'Spam or misleading content',
      },
      {
        id: 5,
        name: 'susan_sky',
        email: 'susansky@gmail.com',
        avatar:
          'https://lh3.googleusercontent.com/a/ACg8ocJcgDoeNwGt0YBm93RFfjz2245K2BNsHxvbEL3PdiOqnw=s96-c',
        reportReason: 'Spam or misleading content',
      },
      {
        id: 5,
        name: 'susan_sky',
        email: 'susansky@gmail.com',
        avatar:
          'https://lh3.googleusercontent.com/a/ACg8ocJcgDoeNwGt0YBm93RFfjz2245K2BNsHxvbEL3PdiOqnw=s96-c',
        reportReason: 'Spam or misleading content',
      },
    ],
  });

  const handleOpenSuspend = () => {
    typeReport.value = 'suspend';
    popupStore.openShowSuspend();
  };

  const handleOpenBan = () => {
    typeReport.value = 'ban';
    popupStore.openShowBan();
  };
  const handleOpenAccept = () => {
    typeReport.value = 'accept';
    popupStore.openShowAccept();
  };
  const handleOpenReject = () => {
    typeReport.value = 'reject';
    popupStore.openShowReject();
  };
</script>
<template>
  <section class="px-8 pb-12">
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
            <Status :status="targetAccount.status" />
          </div>
          <div v-if="targetAccount.status === 'pending'" class="flex gap-x-4 justify-end mt-4">
            <button class="btn-ban" @click="handleOpenBan">Ban</button>
            <button class="btn-suspend" @click="handleOpenSuspend">Suspend</button>
            <button class="btn-success" @click="handleOpenAccept">Accept</button>
            <button class="btn-reject" @click="handleOpenReject">Reject</button>
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4 mt-5">
          <!-- LEFT -->
          <div class="col-span-5 bg-white rounded shadow h-fit">
            <h2 class="text-2xl italic uppercase text-center font-bold mb-8 mt-5">Target</h2>
            <div class="flex items-center justify-between my-4 mx-5">
              <div class="flex items-center gap-x-3">
                <img :src="targetAccount.avatar" class="rounded-full size-10" />
                <div class="">
                  <p class="font-semibold">{{ targetAccount.username }}</p>
                  <p>{{ targetAccount.email }}</p>
                </div>
              </div>
              <div class="flex flex-col">
                <p class="font-medium">
                  Role: <span class="opacity-50">{{ targetAccount.role }}</span>
                </p>
                <p class="font-medium">
                  Reported as: <span class="opacity-50">{{ targetAccount.reportedDate }}</span>
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
                <div class="flex flex-col gap-y-3 mx-5 ml-2">
                  <div
                    v-for="user in targetAccount.reporterBy"
                    :key="user.id"
                    class="flex justify-between text-sm"
                  >
                    <div class="flex items-center gap-x-3">
                      <img :src="user.avatar" class="rounded-full size-8" />
                      <div>
                        <p class="font-semibold">{{ user.name }}</p>
                        <p>{{ user.email }}</p>
                      </div>
                    </div>
                    <span class="text-end">{{ user.reportReason }}</span>
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
                <span class="text-body font-normal capitalize">{{ targetAccount.type }}</span>
              </p>
            </div>
            <!-- REPORT COMMENT -->
            <div class="my-3" v-if="reportId === '1'">
              <div class="flex flex-col gap-y-3">
                <div class="flex flex-col gap-y-3">
                  <p class="font-medium">The content of the comment was reported:</p>
                  <div
                    class="flex items-center gap-x-3 text-sm border border-gray-dark rounded-lg p-3"
                  >
                    <div class="flex-shrink-0">
                      <img
                        src="https://img.upanh.tv/2024/06/18/user-avatar.png"
                        alt="Avatar"
                        class="size-9 object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <div class="flex justify-between items-center gap-x-2 w-fit">
                        <h1 class="font-bold">vietzz771</h1>
                        <span>
                          <Verified width="14px" class="fill-blue" />
                        </span>
                        <div class="flex items-center whitespace-nowrap">
                          <Gift class="mr-1" />
                          <span class="text-xs mt-1 text-[#FFB564]">Gifted 123 REPs</span>
                        </div>
                        <p class="pt-0.5 whitespace-nowrap text-xs text-[#666666]">
                          {{ timeFromNow('2024-10-26 01:40:18') }}
                        </p>
                      </div>
                      <!-- COMMENT -->
                      <div ref="textElement" class="break-all text-sm text-black">
                        <p>toi bi ngu</p>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- IN VIDEO/LIVE -->
                <div>
                  <p class="font-medium mb-4">In video:</p>
                  <VideoReport />
                </div>
              </div>
            </div>
            <!-- REPORT VIDEO -->
            <div v-if="reportId === '2'">
              <p class="my-3 font-medium">The content of the video was reported:</p>
              <VideoReport />
            </div>
            <!-- REPORT ACCOUNT -->
            <div v-if="reportId === '3'">
              <p class="my-3 font-medium">The account was reported:</p>
              <AccountReport />
            </div>
            <!-- REPORT LIVE -->
            <div v-if="reportId === '4'">
              <p class="my-3 font-medium">The content of the live stream was reported:</p>
              <VideoReport />
            </div>
          </div>
        </div>
      </div>
    </div>
    <SuspendPopup :typeReport="typeReport" :targetAccount="targetAccount" />
  </section>
</template>
