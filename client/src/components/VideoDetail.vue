<script setup>
  import { onMounted, ref, computed, watch } from 'vue';
  import Verified from './icons/verified.vue';
  import Live from './icons/live.vue';
  import share from './icons/share.vue';
  import heart from './icons/heart.vue';
  import { postFollowChannel } from '@/services/user';
  import { donateInLivestream, getAllDonationItems } from '@/services/donate';

  import { toast } from 'vue3-toastify';
  import { usePopupStore, useUserStore, useStreamerStore } from '@/stores';
  import ReportChannel from './ReportChannel.vue';
  import DonateModal from './DonateModal.vue';
  import GetREPS from './getReps/GetREPS.vue';
  import Skeleton from 'primevue/skeleton';
  const props = defineProps({
    isUserAction: {
      type: Boolean,
      default: false,
    },
    channelDetails: {
      type: Object,
      required: true,
    },
    channelId: {
      type: String,
      required: true,
    },
    usernameDetails: {
      type: String,
    },
    avatarDetails: {
      type: String,
    },
    username: {
      type: String,
    },
    hiddenReport: {
      type: Boolean,
      default: false,
    },
    isGiftVisible: Boolean,
    loading: {
      type: Boolean,
      required: true,
    },
    liveStreamData: Object,
    listDonation: Array,
    isCommentable: Boolean,
  });

  const emit = defineEmits(['updateFollowers']);
  const isMenuVisible = ref(false);
  const isFilled = ref(false);
  const userStore = useUserStore();
  const popupStore = usePopupStore();
  const username = computed(() => userStore.user?.username);
  const isButtonGiftVisible = ref(false);
  const donationItems = ref({});
  const isGetREPsMenuOpen = ref(false);
  const loadingItem = ref(true);

  const toggleGetREPsMenu = () => {
    isGetREPsMenuOpen.value = !isGetREPsMenuOpen.value;
  };

  const toggleButtonGiftVisible = () => {
    console.log('isButtonGiftVisible', isButtonGiftVisible.value);
    console.log('isGetREPsMenuOpen', isGetREPsMenuOpen.value);
    console.log('isGiftVisible', props.isGiftVisible);

    if (!userStore.user) {
      popupStore.openLoginPopup();
      return;
    }
    if (isGetREPsMenuOpen.value === true && isButtonGiftVisible.value === false) {
      isGetREPsMenuOpen.value = false;
      return;
    } else {
      isButtonGiftVisible.value = !isButtonGiftVisible.value;
    }

    fetchAllDonationItems();
  };
  const toggleMenu = () => {
    isMenuVisible.value = !isMenuVisible.value;
  };
  const closeMenu = () => {
    isMenuVisible.value = false;
  };

  const fetchAllDonationItems = async () => {
    try {
      loadingItem.value = true;
      const response = await getAllDonationItems();

      if (response.status === 200) {
        donationItems.value = response.data.data;
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching donation items:', error);
    } finally {
      loadingItem.value = false;
    }
  };

  const followChannel = async () => {
    try {
      const response = await postFollowChannel({
        channelId: props.channelId,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        isFilled.value = !isFilled.value;
        emit('updateFollowers');
        userStore.loadFollowers();
      } else {
        isFilled.value = !isFilled.value;
        toast.success(response.data.message);
        emit('updateFollowers');
        userStore.loadFollowers();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleFollow = () => {
    if (!userStore.user) {
      popupStore.openLoginPopup();
      return;
    }
    followChannel();
  };
  const isChannelFollowed = computed(() => {
    return userStore.followers.some((channel) =>
      channel.channelId === props.channelId ? props.channelId.toString() : null,
    );
  });

  onMounted(() => {
    if (userStore.user) {
      userStore.loadFollowers();
    }
  });
</script>

<template>
  <div v-if="props.loading" class="flex justify-between items-center">
    <div class="flex items-center gap-x-4 px-3">
      <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
      <div class="flex flex-col gap-y-2">
        <Skeleton width="20rem" class="mb-2"></Skeleton>
        <Skeleton width="6rem" class="mb-2"></Skeleton>
      </div>
    </div>
    <Skeleton width="12rem" height="1.4rem"></Skeleton>
  </div>
  <div v-else class="block lg:flex items-center space-x-4 mb-3 w-full">
    <div class="flex-grow flex items-center space-x-4">
      <RouterLink :to="`/user/${usernameDetails}`">
        <div class="relative inline-block">
          <div
            :class="[
              'flex items-center justify-center size-16 rounded-full p-[2px] flex-shrink-0',
              channelDetails?.isLive
                ? 'border-[3px] border-red'
                : 'border-[3px] border-transparent',
            ]"
          >
            <img
              :src="channelDetails ? channelDetails.avatar : avatarDetails"
              alt="Avatar"
              class="w-full h-full rounded-full object-cover"
            />
            <Live
              v-if="channelDetails?.isLive"
              class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
            />
          </div>

          <RouterLink
            v-if="channelDetails?.isLive"
            :to="`/live/${usernameDetails}`"
            class="size-16 bg-transparent rounded-full absolute top-0"
          ></RouterLink>
        </div>
      </RouterLink>
      <div>
        <p class="text-[20px] flex items-center gap-x-4">
          <RouterLink :to="`/user/${usernameDetails}`" class="">{{
            channelDetails ? channelDetails.channelName : usernameDetails
          }}</RouterLink>
          <Verified v-if="channelDetails?.popularCheck" class="fill-blue mt-0.5" />
          <span v-if="channelDetails" class="whitespace-nowrap">
            {{ channelDetails.isLive ? 'is now online' : 'is now offline' }}
          </span>
        </p>

        <p v-if="channelDetails" class="text-[14px] text-body">
          {{ channelDetails.followCount ?? 0 }} followers
        </p>
      </div>
    </div>
    <!-- User Action -->

    <div v-if="channelDetails" class="flex gap-x-9 items-center pt-2">
      <div
        v-if="username !== props.usernameDetails"
        class="text-primary text-[13px] font-bold flex items-center gap-x-1 cursor-pointer uppercase"
        @click="toggleFollow"
      >
        <heart :fill="isChannelFollowed ? 'fill-primary' : 'fill-white'" stroke="stroke-primary" />
        Follow
      </div>
      <div
        v-if="isUserAction"
        class="text-primary text-[13px] font-bold flex items-center cursor-pointer uppercase"
      >
        <share class="mr-1" /> Share
      </div>
      <div class="relative">
        <div
          @click="toggleButtonGiftVisible"
          v-if="isGiftVisible && username !== props.usernameDetails"
          class="btn text-[13px] font-bold flex items-center cursor-pointer"
        >
          Gift REPs <i class="pi pi-angle-right" />
        </div>
        <DonateModal
          class="absolute bottom-full w-[200px] h-auto bg-white shadow rounded-md z-50 right-0 mb-2"
          v-if="isButtonGiftVisible"
          @toggleButtonGiftVisible="toggleButtonGiftVisible"
          @toggleGetREPsMenu="toggleGetREPsMenu"
          :donationItems="donationItems"
          :loadingItem="loadingItem"
          :liveStreamData="props.liveStreamData"
          :channelId="props.channelId"
          :listDonation="props.listDonation"
          @closeDonateModal="isButtonGiftVisible = false"
        />
        <GetREPS
          class="absolute bottom-full w-[200px] h-auto bg-white shadow rounded-md z-50 right-0 mb-2"
          v-if="isGetREPsMenuOpen"
          @toggleGetREPsMenu="toggleGetREPsMenu"
          @toggleBuyREPs="popupStore.toggleBuyREPs()"
          @toggleButtonGiftVisible="toggleButtonGiftVisible"
          :isBackVisible="true"
        />
      </div>
      <ReportChannel
        v-if="hiddenReport"
        :channelId="channelDetails.id"
        :channelName="channelDetails.channelName"
      />
    </div>
  </div>
</template>
