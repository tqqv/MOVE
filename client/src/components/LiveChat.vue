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
  import ReportChat from './chatOnLiveStream/ReportChat.vue';
  import Reply from './icons/reply.vue';
  import Chat from './icons/chat.vue';

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
  // open report chat
  const hoveredIndex = ref(false);
  const selectedIndex = ref(null);
  const replyIndex = ref(null);
  const chatInputRef = ref(null);
  // handle reply
  const replyTo = ref(null);
  const handleOpenLiveChat = () => {
    openLiveChat.value = !openLiveChat.value;
  };

  const fetchChat = () => {
    listenChatHistory((chatHistory) => {
      console.log('Received chat history:', chatHistory);
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
      if (!isChannelFollowed.value) {
        showFollowPopup.value = true;
        return;
      }
      if (!inputMessage.value.trim()) return;
      console.log('123');

      const messageData = {
        userId: userStore.user.id,
        username: userStore.user.username,
        avatar: userStore.user?.Channel?.avatar || userStore.user.avatar,
        channelName: userStore.user?.Channel?.channelName || null,
        message: inputMessage.value,
        timestamp: Date.now(),
        replyTo: replyTo.value || null,
      };
      sendMessage(props.liveStreamData, messageData);
      inputMessage.value = '';
      replyTo.value = null;
      replyIndex.value = null;
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
    if (!userStore.followers || !props.liveStreamData) return false;
    if (props.liveStreamData === userStore.user?.Channel?.id) return true;
    return userStore.followers.some((channel) => channel.channelId === props.liveStreamData);
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
  // REPORT CHAT
  const handleOpenOptionChat = (index) => {
    if (selectedIndex.value === index) {
      selectedIndex.value = null;
    } else {
      selectedIndex.value = index;
    }
  };
  // REPLY CHAT
  const replyChat = (index, username, channelName, message) => {
    if (replyIndex.value === index) {
      replyIndex.value = null;
      replyTo.value = null;
    } else {
      chatInputRef.value?.focus();
      replyIndex.value = index;
      replyTo.value = channelName ? { channelName, username, message } : { username, message };
    }
  };

  const closeReply = () => {
    replyIndex.value = null;
    replyTo.value = null;
  };

  onMounted(async () => {
    await fetchChat();
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
        class="max-h-full h-[30px] flex-grow pb-1 relative"
        :class="{ 'max-h-[440px]  h-[70px]': isStreamer }"
      >
        <div
          class="flex flex-col-reverse px-2 py-3 h-full relative overflow-y-auto overflow-x-hidden scrollbar-custom"
          ref="chatContainerRef"
          @scroll="handleScroll"
        >
          <div class="flex flex-col gap-y-3">
            <div
              v-for="(userChat, index) in chatMessages"
              :key="index"
              class="text-[13px] p-1 rounded hover:bg-gray-light relative"
              :class="{
                'bg-primary/20 hover:bg-primary/20':
                  userStore.user?.username === userChat.replyTo?.username,
              }"
              @mouseenter="hoveredIndex = index"
              @mouseleave="hoveredIndex = null"
            >
              <ReportChat
                v-if="selectedIndex === index"
                :userChat="userChat"
                :userReportId="userStore.user?.id"
                :isChannelFollowed="isChannelFollowed"
                @handleOpenOptionChat="handleOpenOptionChat"
                @handleReplyChat="replyChat"
              />
              <div v-if="userChat.replyTo" class="flex gap-x-1 items-center mb-1.5 text-xs px-0.5">
                <div class="flex-shrink-0">
                  <Chat />
                </div>
                <p class="ml-1 whitespace-nowrap">Replying to</p>
                <RouterLink :to="`/user/${userChat.replyTo?.username}`" target="_blank" class="">
                  @{{ userChat.replyTo.channelName || userChat.replyTo.username }}
                </RouterLink>
                <p class="truncate">: {{ userChat.replyTo.message }}</p>
              </div>
              <div
                v-if="hoveredIndex === index"
                :class="[
                  'absolute right-[-5px] top-[-8px] p-1 flex justify-center items-center border border-gray-dark rounded-md bg-white cursor-pointer z-20',
                  { 'opacity-50 ': !isChannelFollowed },
                ]"
                v-tooltip="isChannelFollowed ? 'Reply' : 'You need to follow to reply'"
                @click="
                  isChannelFollowed
                    ? replyChat(index, userChat.username, userChat.channelName, userChat.message)
                    : null
                "
              >
                <Reply />
              </div>
              <div class="inline-block mr-1">
                <div class="flex gap-x-1.5 truncate">
                  <h1 class="text-body">{{ formatTimeChatInLive(userChat.timestamp) }}</h1>
                  <img
                    class="size-5 object-cover rounded-full flex-shrink-0"
                    :src="userChat.avatar"
                    alt=""
                  />
                  <div class="flex gap-x-0.5 max-w-[100px]">
                    <h2
                      class="font-bold truncate cursor-pointer"
                      @click="handleOpenOptionChat(index)"
                    >
                      {{ userChat.channelName || userChat.username }}
                    </h2>
                    <p class="text-black">:</p>
                  </div>
                </div>
              </div>
              <span class="text-black break-words leading-relaxed">{{ userChat.message }}</span>
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
          <i class="pi pi-question-circle text-[0.8rem] mt-0.5"></i>
        </div>
        <form class="flex flex-col mt-3 relative group" @submit.prevent="handleSendMessage">
          <!-- NON FOLLOW CHANNEL -->
          <FollowToChat
            :showFollowPopup="showFollowPopup"
            :liveStreamData="props.liveStreamData"
            @closeLiveToChatPopUp="closeLiveToChatPopUp"
            v-if="showFollowPopup"
          />
          <!-- REPLY -->
          <div
            class="absolute h-20 w-full p-2 rounded-t-md top-[-74px] bg-white border-gray-dark border border-b-0 z-10"
            v-if="replyIndex !== null"
          >
            <div class="flex flex-col text-black font-semibold">
              <div class="flex text-sm justify-between">
                <div class="flex items-center gap-x-2">
                  <Reply />
                  <div class="flex gap-x-1">
                    <p>Replying to</p>
                    <p>@{{ replyTo.channelName || replyTo.username }}</p>
                  </div>
                </div>
                <div
                  class="flex justify-center items-end text-black p-1 hover:bg-gray-light rounded-full cursor-pointer"
                  @click="closeReply"
                >
                  <i class="pi pi-times text-sm"></i>
                </div>
              </div>
              <div class="flex text-body text-[11px] px-2 mt-0.5">
                <div class="text-xs p-1 rounded relative">
                  <span class="line-clamp-2">{{ replyTo.message }}</span>
                </div>
              </div>
            </div>
          </div>
          <!--  ERROR -->
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
                showFollowPopup || errorMessage || replyIndex !== null,
            }"
          >
            <textarea
              ref="chatInputRef"
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
