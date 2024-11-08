<script setup>
  import { onMounted, ref, computed, watch } from 'vue';
  import Verified from './icons/verified.vue';
  import Live from './icons/live.vue';
  import share from './icons/share.vue';
  import heart from './icons/heart.vue';
  import { postFollowChannel } from '@/services/user';
  import { toast } from 'vue3-toastify';
  import { usePopupStore, useUserStore, useStreamerStore } from '@/stores';
  import ReportChannel from './ReportChannel.vue';
  import DonateModal from './DonateModal.vue';
  import GetREPS from './getReps/GetREPS.vue';
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
  });

  const emit = defineEmits(['updateFollowers']);
  const isMenuVisible = ref(false);
  const isFilled = ref(false);
  const userStore = useUserStore();
  const popupStore = usePopupStore();
  const username = computed(() => userStore.user?.username);
  const isButtonGiftVisible = ref(false);

  const isGetREPsMenuOpen = ref(false);
  const toggleGetREPsMenu = () => {
    isGetREPsMenuOpen.value = !isGetREPsMenuOpen.value;
  };

  const toggleButtonGiftVisible = () => {
    isButtonGiftVisible.value = !isButtonGiftVisible.value;
  };
  const toggleMenu = () => {
    isMenuVisible.value = !isMenuVisible.value;
  };
  const closeMenu = () => {
    isMenuVisible.value = false;
  };

  const followChannel = async () => {
    try {
      const response = await postFollowChannel({
        channelId: props.channelId,
      });

      if (response.status === 200) {
        toast.success(response.message);
        isFilled.value = !isFilled.value;
        emit('updateFollowers');
        userStore.loadFollowers();
      } else {
        isFilled.value = !isFilled.value;
        toast.success(response.message);
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
  watch(
    () => props.usernameDetails,
    (newVal) => {
      console.log('Channel details changed:', newVal);
    },
  );
  onMounted(() => {
    if (userStore.user) {
      userStore.loadFollowers();
    }
  });
</script>

<template>
  <div class="block lg:flex items-center space-x-4 mb-3 w-full">
    <div class="flex-grow flex items-center space-x-4">
      <div class="relative inline-block">
        <div
          :class="[
            'flex items-center justify-center w-16 h-16 rounded-full',
            channelDetails?.isLive ? 'border-[3px] border-red' : '',
          ]"
        >
          <img
            :src="channelDetails ? channelDetails.avatar : avatarDetails"
            alt="Avatar"
            class="w-full h-full rounded-full object-cover p-[1.5px]"
          />
          <Live
            v-if="channelDetails?.isLive"
            class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
          />
        </div>
      </div>
      <div>
        <p class="text-[20px] flex items-center gap-x-4">
          <span class="">{{ channelDetails ? channelDetails.channelName : usernameDetails }}</span>
          <Verified v-if="channelDetails?.popularCheck" class="fill-blue" />
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
        class="text-primary text-[13px] font-bold flex items-center cursor-pointer uppercase"
        @click="toggleFollow"
      >
        <heart
          :fill="isChannelFollowed ? 'fill-primary' : 'fill-white'"
          stroke="stroke-primary"
          class="mr-1"
        />
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
          v-if="username !== props.usernameDetails"
          class="btn text-[13px] font-bold flex items-center cursor-pointer"
        >
          Gift REPs <i class="pi pi-angle-right" />
        </div>
        <DonateModal
          class="absolute top-full w-[200px] h-auto bg-white shadow rounded-md z-50 right-0 mb-2"
          v-if="isButtonGiftVisible"
          @toggleButtonGiftVisible="toggleButtonGiftVisible"
          @toggleGetREPsMenu="toggleGetREPsMenu"
        />
        <GetREPS
          class="absolute top-full w-[200px] h-auto bg-white shadow rounded-md z-50 right-0 mb-2"
          v-if="isGetREPsMenuOpen"
          @toggleGetREPsMenu="toggleGetREPsMenu"
          @toggleBuyREPs="popupStore.toggleBuyREPs"
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
