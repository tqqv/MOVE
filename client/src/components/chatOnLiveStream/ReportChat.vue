<script setup>
  import { getAllReportLiveStream, reportChatMessage } from '@/services/report';
  import Heart from '../icons/heart.vue';
  import Verified from '../icons/verified.vue';
  import { usePopupStore } from '@/stores';
  import { onMounted, ref, watch } from 'vue';
  import ReportDialog from '../ReportDialog.vue';
  import { getProfilebyUsername } from '@/services/user';
  import { toast } from 'vue3-toastify';
  import Skeleton from 'primevue/skeleton';

  const props = defineProps({
    userChat: Object,
    userReportId: String,
    isChannelFollowed: Boolean,
  });

  const popupStore = usePopupStore();
  const listReportChat = ref([]);
  const selectReportChat = ref(null);
  const userInformation = ref({});
  const loading = ref(true);

  const emit = defineEmits(['handleOpenOptionChat', 'handleReplyChat']);

  const handleOpenReportChat = async () => {
    try {
      await fetchListReportLiveStream();
    } catch (error) {
      console.log('Failed to fetch report live stream:', error);
    }
  };
  // GET ALL REPORT
  const fetchListReportLiveStream = async () => {
    try {
      const response = await getAllReportLiveStream();
      if (response.error) {
        popupStore.openLoginPopup();
      } else {
        listReportChat.value = response.data;
        popupStore.openReportChannel();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitReportChat = async () => {
    if (selectReportChat.value.id) {
      try {
        const response = await reportChatMessage(
          props.userReportId,
          selectReportChat.value.id,
          props.userChat.message,
          props.userChat.userId,
        );
        toast.success('Report channel sent successfully');
        popupStore.closeReportChannel();
        popupStore.openReportSuccess();
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  };

  // GET PROFILE
  const fetchChannelData = async () => {
    try {
      const response = await getProfilebyUsername(props.userChat.username);
      userInformation.value = response.data;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };
  const closePopup = () => {
    emit('handleOpenOptionChat');
  };

  // REPLY
  const handleReply = () => {
    emit(
      'handleReplyChat',
      props.userChat.index,
      props.userChat.username,
      props.userChat.channelName,
      props.userChat.message,
    );
    emit('handleOpenOptionChat', null);
  };

  onMounted(async () => {
    await fetchChannelData();
  });

  watch(
    selectReportChat,
    (newVal) => {
      selectReportChat.value = newVal;
    },
    { deep: true },
  );
</script>
<template>
  <div
    class="absolute shadow-md rounded-xl w-[92%] left-1/2 top-1/2 transform -translate-x-1/2 bg-white border border-gray-light z-[100]"
  >
    <div class="relative">
      <div
        class="flex justify-center items-center absolute top-[-30px] left-1/2 transform -translate-x-1/2 border border-gray-dark bg-white rounded-full"
      >
        <Skeleton v-if="loading" size="4rem" class="rounded-full" />
        <img
          v-else
          :src="userInformation?.Channel?.avatar || userInformation?.avatar"
          alt=""
          class="rounded-full object-cover size-16"
        />
      </div>
      <div class="absolute top-2 right-2">
        <div
          class="flex justify-center items-end text-black p-1 hover:bg-gray-light rounded-full cursor-pointer"
          @click="closePopup"
        >
          <i class="pi pi-times text-sm"></i>
        </div>
      </div>
      <div class="flex flex-col justify-center items-center pb-3 border-b border-gray-dark">
        <div class="flex justify-center items-center flex-col gap-y-1 pt-11">
          <div class="flex justify-center items-center gap-x-2">
            <Skeleton v-if="loading" width="10rem" height="1.2rem" borderRadius="16px" />
            <h2 v-else class="text-lg text-black font-semibold">
              {{ userInformation?.Channel?.channelName || userInformation.username }}
            </h2>
            <Skeleton v-if="loading" size="1.5rem" class="rounded-full" />
            <Verified v-if="!loading && userInformation?.Channel?.popularCheck" class="fill-blue" />
          </div>
          <div class="flex flex-col justify-center gap-y-2">
            <template v-if="loading">
              <Skeleton height="1rem" width="5rem" class="mx-auto" />
              <div class="flex items-center gap-x-2 mt-1">
                <Skeleton height="1rem" width="8rem" />
              </div>
            </template>

            <template v-else>
              <p v-if="userInformation?.Channel" class="text-xs text-center">
                {{ userInformation?.Channel?.followCount }} followers
              </p>
              <div class="flex items-center gap-x-2 text-black mt-1">
                <Heart fill="fill-primary" />
                <span class="text-xs">following since July 9, 2021</span>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="flex justify-between gap-x-2 m-2">
        <RouterLink
          class="flex flex-grow justify-center items-center rounded-md py-2 bg-primary cursor-pointer hover:bg-primary-light"
          :to="`/user/${userInformation?.username}`"
          target="_blank"
        >
          <span class="text-white text-sm font-semibold">PROFILE</span>
        </RouterLink>
        <div
          class="flex justify-center size-9 items-center p-2 rounded-md border border-gray-dark cursor-pointer hover:bg-gray-light text-black"
          v-tooltip.top="isChannelFollowed ? 'Reply' : 'You need to follow to reply'"
          @click="props.isChannelFollowed ? handleReply() : null"
        >
          <span>@</span>
        </div>
        <div
          class="flex justify-center size-9 items-center p-2 rounded-md border border-gray-dark cursor-pointer hover:bg-gray-light"
          v-tooltip.top="'Report'"
          @click="handleOpenReportChat"
        >
          <i class="pi pi-flag text-sm font-bold text-black"></i>
        </div>
      </div>
    </div>
    <ReportDialog
      title="chat"
      groupName="reportTypeChat"
      :reportType="listReportChat"
      :titleReport="`Report chat message`"
      :selectedReport="selectReportChat"
      :isReportVisible="popupStore.showReportChannel"
      :isReportSuccessVisible="popupStore.showReportSuccess"
      @update:selectedReport="selectReportChat = $event"
      @hide="popupStore.closeReportChannel"
      @submit="handleSubmitReportChat"
      @close="popupStore.closeReportSuccess"
      @hideSuccess="popupStore.closeReportSuccess"
    />
  </div>
</template>
