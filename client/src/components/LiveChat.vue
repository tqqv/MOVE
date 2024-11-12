<script setup>
  import sendChat from '@icons/sendChat.vue';
  import '@/custom.css';
  import { computed, onMounted, ref, watch } from 'vue';
  import TopDonates from './streamer/liveStream/TopDonates.vue';
  import DonationUser from './chatOnLiveStream/DonationUser.vue';
  import { formatTimeChatInLive } from '@/utils';
  import { usePopupStore, useUserStore } from '@/stores';
  import { listenChatHistory, listenNewMessage, sendMessage } from '@/services/socketService';
  import Warning from './icons/warning.vue';
  import FollowToChat from './chatOnLiveStream/FollowToChat.vue';

  const props = defineProps({
    isStreamer: Boolean,
    liveStreamData: String,
  });

  const userStore = useUserStore();
  const popupStore = usePopupStore();

  const openLiveChat = ref(true);
  const chatMessages = ref([]);
  const inputMessage = ref('');
  //  Hadnle scroll
  const chatContainerRef = ref(null);
  const showScrollButton = ref(false);
  const qualityNewMessage = ref(0);
  // follower can chat
  const showFollowPopup = ref(false);
  const errorMessage = ref('');

  const handleOpenLiveChat = () => {
    openLiveChat.value = !openLiveChat.value;
  };

  const fetchChat = () => {
    listenChatHistory((chatHistory) => {
      chatMessages.value = chatHistory;
    });
  };

  const fetchNewChat = () => {
    listenNewMessage((newMessage) => {
      if (showScrollButton.value) {
        qualityNewMessage.value++;
      }
      chatMessages.value.push(newMessage);
    });
  };

  const handleSendMessage = () => {
    try {
      if (!isChannelFollowed.value && props.liveStreamData != userStore.user?.Channel?.id) {
        showFollowPopup.value = true;
        return;
      }
      if (!inputMessage.value.trim()) return;
      const messageData = {
        userId: userStore.user.id,
        username: userStore.user.username,
        avatar: userStore.user.avatar,
        message: inputMessage.value,
        timestamp: Date.now(),
      };
      sendMessage(props.liveStreamData, messageData);
      inputMessage.value = '';
      const textarea = document.querySelector('textarea');
      textarea.style.height = 'auto';
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    }
  };

  // handle scroll
  const handleScroll = () => {
    const container = chatContainerRef.value;
    if (!container) return;
    if (container.scrollTop > 0) {
      container.scrollTop = 0;
    }
    const isAtBottom = container.scrollTop >= 0;
    showScrollButton.value = !isAtBottom;
    if (!showScrollButton.value) {
      qualityNewMessage.value = 0;
    }
  };

  const scrollToBottom = () => {
    const container = chatContainerRef.value;
    if (container) {
      container.scrollTop = container.scrollHeight;
      showScrollButton.value = false;
    }
  };

  // check follow user
  const isChannelFollowed = computed(() => {
    return userStore.followers.some((channel) =>
      channel.channelId === props.liveStreamData ? props.liveStreamData.toString() : null,
    );
  });

  const closeLiveToChatPopUp = () => {
    showFollowPopup.value = false;
  };

  const autoResize = (event) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // validation
  watch(inputMessage, async (newValue) => {
    if (newValue.length === 250) {
      errorMessage.value = 'Message cannot exceed 250 characters';
    } else if (newValue.length < 250) {
      errorMessage.value = '';
    }
  });

  watch(() => {
    console.log(isChannelFollowed.value);
  });

  onMounted(() => {
    fetchChat();
    fetchNewChat();
  });
</script>

<template>
  <div
    v-if="openLiveChat"
    class="max-w-[333px] min-w-[323px] bg-white hidden justify-between flex-col text-[#777777] md:flex"
    :class="isStreamer ? 'h-[650px] rounded-md sticky' : 'sticky  top-[72px] h-[calc(100vh-72px)]'"
  >
    <!-- TOPBAR -->
    <div
      class="flex justify-between items-center text-black px-4 py-3 border-y-2 border-gray-dark"
      :class="{ ' rounded-t-md border-x-0 border-t-0 border-b': isStreamer }"
    >
      <div
        v-if="!isStreamer"
        class="flex cursor-pointer p-2 justify-center items-center hover:bg-[#ADADB859] rounded-md"
        @click="handleOpenLiveChat"
        v-tooltip="'Collapse'"
      >
        <i class="pi pi-arrow-right text-[0.9rem]"></i>
      </div>
      <h2 class="uppercase text_subTitle text-[13px]">live chat</h2>
      <div class="flex justify-center items-center p-2">
        <i class="pi pi-user text-[0.8rem] cursor-pointer"></i>
      </div>
    </div>
    <DonationUser :isStreamer="isStreamer" />
    <div
      class="flex flex-col flex-grow justify-between border-l-2 border-gray-dark"
      :class="{ 'border-none shadow-md rounded-md border-l-0': isStreamer }"
    >
      <!-- CONTENT -->
      <div
        class="max-h-full h-[109px] flex-grow pb-1 relative"
        :class="{ 'max-h-[440px]  h-[70px]': isStreamer }"
      >
        <div
          class="flex flex-col-reverse px-3 py-3 h-full overflow-y-auto overflow-x-hidden scrollbar-custom"
          ref="chatContainerRef"
          @scroll="handleScroll"
        >
          <div class="flex flex-col gap-y-5">
            <div v-for="userChat in chatMessages" :key="userChat.userId" class="text-[13px]">
              <div class="inline-block mr-1">
                <div class="flex gap-x-1.5 truncate">
                  <h1 class="text-body">{{ formatTimeChatInLive(userChat.timestamp) }}</h1>
                  <img
                    class="size-5 object-cover rounded-full flex-shrink-0"
                    :src="userChat.avatar"
                    alt=""
                  />
                  <div class="flex gap-x-0.5 max-w-[100px]">
                    <h2 class="font-bold truncate">{{ userChat.username }}</h2>
                    <p class="text-black">:</p>
                  </div>
                </div>
              </div>
              <span class="text-black break-words">{{ userChat.message }}</span>
            </div>
          </div>
        </div>
        <!-- BUTTON WHEN SCROLL -->
        <div
          class="absolute w-44 bottom-4 left-1/2 transform -translate-x-1/2 px-1 py-2 bg-black/60 text-white text-xs rounded-md cursor-pointer group"
          v-if="showScrollButton"
          @click="scrollToBottom"
        >
          <!-- Default content -->
          <div class="flex justify-center items-center gap-x-2 group-hover:hidden">
            <i class="pi pi-pause text-xs mt-0.5"></i>
            <span class="whitespace-nowrap font-semibold">Chat pause due to scroll</span>
          </div>

          <!-- Hover content -->
          <div class="hidden group-hover:flex justify-center items-center gap-x-5">
            <i class="pi pi-arrow-down text-[10px] mt-0.5"></i>
            <div class="flex gap-x-1 whitespace-nowrap font-semibold">
              <span>
                {{
                  qualityNewMessage <= 0
                    ? 'See new message'
                    : qualityNewMessage > 10
                    ? '+10 new messages'
                    : qualityNewMessage + ' new messages'
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- INPUT -->
      <div
        v-if="userStore.user"
        class="pt-3 pb-2 px-2 border-t-2 border-gray-dark"
        :class="{ 'rounded-b-md': isStreamer }"
      >
        <!-- HIDDEN AFTER FOLLOW -->
        <div v-if="!isStreamer" class="flex justify-start items-center gap-x-3 ml-3">
          <p class="font-bold text-[13px]">Follow to chat</p>
          <i class="pi pi-question-circle text-[0.8rem]"></i>
        </div>
        <form class="flex flex-col mt-3 relative group" @submit.prevent="handleSendMessage">
          <!-- NON FOLLOW CHANNEL -->
          <FollowToChat
            :showFollowPopup="showFollowPopup"
            :liveStreamData="props.liveStreamData"
            @closeLiveToChatPopUp="closeLiveToChatPopUp"
            v-if="showFollowPopup && props.liveStreamData != userStore.user?.Channel?.id"
          />
          <div
            class="absolute h-12 w-full rounded-t-md top-[-42px] bg-white border-gray-dark border border-b-0 z-10"
            v-if="errorMessage"
          >
            <div class="flex items-center px-2 pt-3 gap-x-3">
              <Warning fill="#ea9b00" />
              <p class="text-black text-sm font-semibold">{{ errorMessage }}</p>
            </div>
          </div>
          <div
            class="relative px-2 w-full"
            :class="{
              'px-2 py-1 shadow-md z-20 border border-t-0 border-gray-dark rounded-b-md':
                (showFollowPopup && props.liveStreamData != userStore.user?.Channel?.id) ||
                errorMessage,
            }"
          >
            <textarea
              v-model="inputMessage"
              @keydown.enter.exact.prevent="handleSendMessage"
              @keydown.shift.enter.stop
              placeholder="Send a message"
              rows="1"
              class="w-full resize-none text-black bg-gray-light py-[14px] pr-4 px-4 rounded-md text-[13px] placeholder:text-[13px] placeholder:text-footer focus-visible:outline-none max-h-[calc(1.5em*5)]"
              @input="autoResize"
              maxlength="250"
            />
          </div>
          <div class="flex justify-end w-full">
            <div
              class="flex justify-center items-center px-4 py-2 rounded-md bg-primary text-white text-xs mt-1 mr-1.5 font-semibold hover:bg-primary-light cursor-pointer"
              @click="handleSendMessage"
            >
              Send
            </div>
          </div>
        </form>
      </div>

      <!-- UN LOGIN -->
      <div
        v-if="!userStore.user"
        class="py-3 px-3 border-t-2 border-gray-dark"
        :class="{ 'rounded-b-md': isStreamer }"
      >
        <!-- HIDDEN AFTER FOLLOW -->
        <div class="flex flex-col items-center gap-y-2 text-sm">
          <h1 class="text-black font-semibold">Talk to other viewers</h1>
          <p class="text-xs">Login and join real-time chat</p>
          <button @click="popupStore.openLoginPopup()" class="btn w-full mt-1">Login</button>
        </div>
      </div>
    </div>
  </div>
  <div
    v-else
    class="fixed top-20 right-0 m-3 p-3 bg-transparent rounded-md flex justify-center items-center cursor-pointer hover:bg-[#FFFFFF21]"
    v-tooltip="'Expand'"
    @click="handleOpenLiveChat"
  >
    <i class="pi pi-arrow-left text-white text-[0.9rem]"></i>
  </div>
</template>
