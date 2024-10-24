<script setup>
  import { onMounted, ref, computed, watch } from 'vue';
  import Verified from './icons/verified.vue';
  import Live from './icons/live.vue';
  import share from './icons/share.vue';
  import heart from './icons/heart.vue';
  import { postFollowChannel, getListFollowOfUser } from '@/services/user';
  import { toast } from 'vue3-toastify';
  import { useUserStore } from '@/stores';
  const props = defineProps({
    isButtonGiftREPsVisible: {
      type: Boolean,
      default: false,
    },
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
      required: true,
    },
    avatarDetails: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
  });

  const followedChannels = ref([]);
  const emit = defineEmits(['updateFollowers']);
  const isMenuVisible = ref(false);
  const isFilled = ref(false);
  const userStore = useUserStore();

  const toggleMenu = () => {
    isMenuVisible.value = !isMenuVisible.value;
  };

  const closeMenu = () => {
    isMenuVisible.value = false;
  };

  const fetchListFollowOfUser = async () => {
    const result = await getListFollowOfUser();
    if (result.success) {
      followedChannels.value = result.data;
    } else {
      toast.error(result.message);
    }
  };
  const followChannel = async () => {
    try {
      const response = await postFollowChannel({
        channelId: props.channelId,
      });

      if (response.success) {
        toast.success(response.message);
        isFilled.value = !isFilled.value;
        emit('updateFollowers');
        fetchListFollowOfUser();
      } else {
        isFilled.value = !isFilled.value;
        toast.success(response.message);
        emit('updateFollowers');
        fetchListFollowOfUser();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleFollow = () => {
    followChannel();
  };
  const isChannelFollowed = computed(() => {
    return followedChannels.value.some((channel) =>
      channel.channelId === props.channelId ? props.channelId.toString() : null,
    );
  });
  onMounted(() => {
    if (userStore.user) {
      fetchListFollowOfUser();
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
        <p class="text-[20px] flex items-center">
          <span class="mr-2">{{
            channelDetails ? channelDetails.channelName : usernameDetails
          }}</span>
          <Verified v-if="channelDetails?.popularCheck" class="ml-1 mb-1 mr-2 fill-blue" />
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
        v-if="userStore.user?.username !== username"
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
      <button v-if="userStore.user?.username !== username" class="btn whitespace-nowrap">
        Gift REPs <i class="pi pi-angle-right text-white" />
      </button>
      <div class="relative">
        <button
          v-if="isUserAction"
          aria-expanded="false"
          aria-controls="menu"
          class="pi pi-ellipsis-v text-primary text-[20px]"
          @click="toggleMenu"
        />
        <div
          v-if="isMenuVisible"
          class="absolute bottom-full mb-2 w-[115px] h-[40px] bg-white shadow rounded-md z-50"
        >
          <ul class="flex items-center justify-center h-full m-0 p-0">
            <li
              class="flex items-center justify-center text-[13px] cursor-pointer text-center"
              @click="closeMenu"
            >
              Report video
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
