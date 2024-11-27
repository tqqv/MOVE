<script setup>
  import { ref, computed } from 'vue';
  import Button from 'primevue/button';
  import { useGetRepsStore } from '@/stores/getReps.store';
  import { useRoute } from 'vue-router';

  import { useUserStore } from '@/stores';
  import Skeleton from 'primevue/skeleton';
  import { donateInLivestream } from '@/services/donate';
  import SmallLoading from './icons/smallLoading.vue';
  import Firework from './animation/firework.vue';
  import { sendMessage } from '@/services/socketService';
  import { postComments, getAllComments } from '@/services/comment';

  const userStore = useUserStore();
  const getRepsStore = useGetRepsStore();
  const route = useRoute();

  const props = defineProps({
    donationItems: {
      type: Object,
    },
    loadingItem: {
      type: Boolean,
      default: true,
    },
    liveStreamData: Object,
    channelId: String,
    listDonation: Array,
  });
  const emit = defineEmits(['toggleButtonGiftVisible', 'toggleGetREPsMenu', 'donateInLive']);

  const presentMessages = [
    { id: 1, message: 'Best workout yet!' },
    { id: 2, message: 'Well done!' },
    { id: 3, message: 'You have done the unthinkable!' },
    { id: 4, message: 'You are awesome!' },
  ];

  const messageDonate = ref();
  const loading = ref(false);
  const videoId = computed(() => route.params.videoId);

  const toggleClose = () => {
    emit('toggleButtonGiftVisible');
  };
  const toggleGetREPsMenu = () => {
    emit('toggleButtonGiftVisible');

    emit('toggleGetREPsMenu');
    if (!getRepsStore.purchaseOptions.length > 0) {
      getRepsStore.getRepPackages();
    }
  };

  const selectedValue = ref(null);
  const handleSelectValue = (value) => {
    selectedValue.value = selectedValue.value === value ? null : value;
  };

  const inputMessage = ref(true);
  const handleOpenInputMessage = () => {
    inputMessage.value = !inputMessage.value;
  };

  const selectPresentMessage = ref(presentMessages[0].id);
  const handleSelectPresentMessage = (message) => {
    selectPresentMessage.value = selectPresentMessage.value === message ? null : message;
  };
  // =========== DONATE COMMENT===============
  const donateInComment = async (donationItemId, content) => {
    if (!userStore.user) {
      openLoginPopup();

      return;
    }
    const data = { donationItemId, content };
    console.log(videoId.value);

    try {
      const response = await postComments(videoId.value, data);

      if (response.status === 200) {
      } else {
        console.error('Failed to create comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  // ==========================

  // ======= DONATE STREAM ===========
  const donateInLive = async (donationItemId, content) => {
    try {
      loading.value = true;
      const data = {
        userId: userStore.user?.id,
        livestreamId: props.liveStreamData?.livestream?.id,
        donationItemId,
        content,
      };
      const response = await donateInLivestream(data);
      return response.data;
    } catch (error) {
      console.error('Error in donation:', error);
      throw error;
    } finally {
      loading.value = false;
      toggleClose();
      userStore.fetchUserProfile();
    }
  };

  // CHAT
  const handleSendMessage = () => {
    try {
      const messageData = {
        userId: userStore.user.id,
        username: userStore.user.username,
        avatar: userStore.user?.Channel?.avatar || userStore.user.avatar,
        channelName: userStore.user?.Channel?.channelName || null,
        message: inputMessage?.value
          ? (messageDonate?.value || '').trim() || ' '
          : selectPresentMessage?.value?.message || ' ',
        timestamp: Date.now(),
        donation: selectedValue.value?.REPs,
      };
      sendMessage(props.channelId, messageData);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    }
  };

  const handleDonation = () => {
    if (inputMessage.value) {
      // donateInLive(selectedValue.value?.id, messageDonate.value);
      donateInComment(selectedValue.value?.id, messageDonate.value);
    } else {
      // donateInLive(selectedValue.value?.id, selectPresentMessage.value?.message);
      donateInComment(selectedValue.value?.id, selectPresentMessage.value?.message);
    }
    handleSendMessage();
    messageDonate.value = '';
  };
</script>

<template>
  <div class="w-[441px] shadow-xl rounded-lg">
    <div class="flex flex-col">
      <!-- HEADER MODAL -->
      <div class="flex flex-col gap-y-1 mx-3 py-2">
        <div class="flex items-center justify-between">
          <h1 class="text_subTitle text-[12px] md:text-[16px]">
            Support your instructor with REPs!
          </h1>
          <div
            class="flex justify-center items-center p-2 rounded-full cursor-pointer hover:bg-gray-dark"
            @click="toggleClose"
          >
            <i class="pi pi-times !font-bold text-lg"></i>
          </div>
        </div>
        <h2 class="text-[11px] md:text-[13px]">Select amount of REPs to send to the instructor</h2>
        <h2 class="text_link cursor-pointer">How do I support instructor?</h2>
      </div>
      <hr class="h-[2px] bg-gray-dark border-0" />
      <Firework />
      <!-- BUTTON MODAL -->
      <div v-if="props.loadingItem" class="flex gap-x-10 mx-5 py-3">
        <div v-for="n in 5" :key="n" class="flex flex-col items-center gap-y-3">
          <Skeleton shape="circle" size="3rem"></Skeleton>
          <Skeleton width="3rem" height="1rem"></Skeleton>
        </div>
      </div>
      <div v-if="!props.loadingItem" class="flex justify-center gap-x-12 mx-3 py-3">
        <div
          v-for="donateValue in donationItems"
          :key="donateValue.id"
          class="flex flex-col justify-center items-center gap-y-1"
        >
          <div class="flex-shrink-0 hover:scale-110">
            <img
              :src="donateValue.image"
              alt="REPs"
              class="w-full h-full rounded-full object-cover cursor-pointer"
              @click="handleSelectValue(donateValue)"
            />
          </div>
          <span
            class="font-bold"
            :class="{
              'text-primary': selectedValue?.id === donateValue.id,
              'text-black': selectedValue?.id !== donateValue.id,
            }"
            >{{ donateValue.REPs }}</span
          >
        </div>
      </div>

      <!-- INPUT MODAL -->
      <hr v-if="selectedValue" class="h-[2px] bg-gray-dark border-0" />
      <form
        v-if="selectedValue"
        class="flex flex-col gap-y-4 mx-5 py-4"
        @submit.prevent="handleDonation"
      >
        <input
          v-model="messageDonate"
          v-if="inputMessage"
          type="text"
          placeholder="Send a message (optional)"
          class="w-full px-3 py-3 rounded-lg text-sm border-2 border-gray-dark focus:outline-primary focus:caret-primary"
        />
        <div v-if="!inputMessage" class="flex flex-col gap-y-2">
          <div
            v-for="message in presentMessages"
            :key="message.id"
            class="p-3 border-2 text-[12px] rounded-xl cursor-pointer md:text-[15px]"
            :class="{
              'border-primary bg-primary-light/20': selectPresentMessage.id === message.id,
              'border-gray-dark bg-white': selectPresentMessage.id !== message.id,
            }"
            @click="handleSelectPresentMessage(message)"
          >
            {{ message.message }}
          </div>
        </div>
        <div class="flex justify-between">
          <h2 class="text_link cursor-pointer" @click="handleOpenInputMessage">
            {{ inputMessage ? 'or select from preset message' : 'or enter custom message' }}
          </h2>
          <Button
            class="btn px-4 text-nowrap text-[12px] md:text-[15px] w-36"
            :class="{ 'bg-body': userStore.user.REPs < selectedValue }"
            :disabled="userStore.user.REPs < selectedValue?.REPs"
            @click="handleDonation"
          >
            <template v-if="loading">
              <SmallLoading fill="white" fill_second="#13d0b4" />
            </template>
            <template v-else> Send {{ selectedValue?.REPs || 0 }} REPs </template>
          </Button>
        </div>
      </form>

      <!-- FOOTER MODAL -->
      <div class="py-4 bg-[#008370] rounded-b-lg">
        <div class="flex justify-between px-5 items-center text-white">
          <h1 class="text-[12px] md:text-[16px]">
            You have <span class="font-bold">{{ userStore.user.REPs }} REPs</span>
          </h1>
          <Button @click="toggleGetREPsMenu" class="btn px-4 text-nowrap text-[12px] md:text-[15px]"
            >Get REPs</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>
