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
  import NewDonation from './chatOnLiveStream/NewDonation.vue';
  import Donate from './icons/donate.vue';
  import REPs1 from './icons/REPsItems/REPs1.vue';
  import REPs2 from './icons/REPsItems/REPs2.vue';
  import REPs3 from './icons/REPsItems/REPs3.vue';
  import REPs4 from './icons/REPsItems/REPs4.vue';
  import REPs5 from './icons/REPsItems/REPs5.vue';
  import { giftBox } from './animation/gif';

  const props = defineProps({
    isStreamer: Boolean,
    liveStreamData: String,
    listDonation: Array,
    topDonators: Array,
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
      // console.log('Received chat history:', chatHistory);
      chatMessages.value = chatHistory;
      // console.log(chatMessages.value);
    });
  };

  const fetchNewChat = () => {
    listenNewMessage((newMessage) => {
      if (showScrollButton.value) {
        qualityNewMessage.value++;
      }
      if (newMessage.donation) {
        props.listDonation.push(newMessage);
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
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
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
    v-show="openLiveChat"
    class="md:max-w-[333px] md:min-w-[333px] bg-white justify-between flex-col text-black md:flex"
    :class="isStreamer ? 'rounded-md sticky' : 'sticky top-[64px] h-full md:h-[calc(100vh-64px)]'"
  >
    <!-- TOPBAR -->
    <div
      class="flex justify-between items-center text-black px-4 py-3 border-y-2 border-gray-dark"
      :class="{ ' rounded-t-md border-x-0 border-t-0 border-b': isStreamer }"
    >
      <div
        v-if="!isStreamer"
        class=" cursor-pointer p-2 justify-center items-center hover:bg-[#ADADB859] rounded-md"
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
    <DonationUser
      v-show="(props.topDonators || []).length > 0"
      :topDonators="props.topDonators"
      :isStreamer="isStreamer"
    />
    <div
      class="flex flex-col h-full flex-grow justify-between border-l-2 border-gray-dark"
      :class="{ 'border-none shadow-md rounded-md border-l-0': isStreamer }"
    >
      <!-- CONTENT -->
      <div
        class="md:max-h-full h-32 md:h-[30px] flex-grow pb-1 relative"
        :class="{ 'max-h-[440px]  h-[70px]': isStreamer }"
      >
        <NewDonation :listDonation="props.listDonation" />
        <div
          class="flex flex-col-reverse px-2 py-3 h-full relative overflow-y-auto overflow-x-hidden scrollbar-custom"
          ref="chatContainerRef"
          @scroll="handleScroll"
        >
          <div class="flex flex-col gap-y-3">
            <div
              v-for="(userChat, index) in chatMessages"
              :key="index"
              class="text-[13px] rounded hover:bg-gray-light relative p-1"
              :class="{
                'bg-primary/20 hover:bg-primary/20':
                  userStore.user?.username &&
                  userChat.replyTo?.username &&
                  userStore.user?.username === userChat.replyTo?.username &&
                  !userChat.donation,
                '!p-0': userChat.donation,
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
              <div
                v-if="userChat.replyTo"
                class="flex gap-x-1 items-center mb-1.5 text-xs px-0.5 text-body"
              >
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
                v-tooltip.left="isChannelFollowed ? 'Reply' : 'You need to follow to reply'"
                @click="
                  isChannelFollowed
                    ? replyChat(index, userChat.username, userChat.channelName, userChat.message)
                    : null
                "
              >
                <Reply />
              </div>
              <!-- NORMAL CHAT -->
              <div v-if="!userChat.donation" class="inline-block mr-1">
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
              <span v-if="!userChat.donation" class="text-black break-words leading-relaxed">{{
                userChat.message
              }}</span>
              <!-- DONATE CHAT -->
              <div v-if="userChat.donation" class="w-full text-black">
                <div
                  class="flex justify-between gap-x-3 px-1 py-1.5 rounded-t"
                  :class="{
                    'bg-body/20': userChat.donation === 100,
                    'bg-primary/20': userChat.donation === 1000,
                    'bg-purple/20': userChat.donation === 5000,
                    'bg-blue/15': userChat.donation === 10000,
                    'bg-yellow-dark/20': userChat.donation === 25000,
                  }"
                >
                  <div class="flex gap-x-2">
                    <span class="text-body">{{ formatTimeChatInLive(userChat.timestamp) }}</span>
                    <div class="flex items-center gap-x-2">
                      <img
                        class="size-7 object-cover rounded-full flex-shrink-0"
                        :src="userChat.avatar"
                        alt=""
                      />
                      <div class="flex flex-col">
                        <h2
                          class="font-bold truncate cursor-pointer"
                          @click="handleOpenOptionChat(index)"
                        >
                          {{ userChat.channelName || userChat.username }}
                        </h2>
                        <div class="flex items-center">
                          <template v-if="userChat.donation === 100"><REPs1 /></template>
                          <template v-else-if="userChat.donation === 1000"><REPs2 /></template>
                          <template v-else-if="userChat.donation === 5000"><REPs3 /></template>
                          <template v-else-if="userChat.donation === 10000"><REPs4 /></template>
                          <template v-else-if="userChat.donation === 25000"><REPs5 /></template>
                          <span class="text-xs mb-1 font-medium">{{ userChat.donation }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mx-1">
                    <div class="flex items-center gap-x-1 text-xs">
                      <img :src="giftBox" alt="" class="size-8" />
                    </div>
                  </div>
                </div>
                <div
                  class="font-medium bg-opacity-30 px-3 py-1.5 rounded-b"
                  :class="{
                    'bg-body/30': userChat.donation === 100,
                    'bg-primary/30': userChat.donation === 1000,
                    'bg-purple/30': userChat.donation === 5000,
                    'bg-blue/25': userChat.donation === 10000,
                    'bg-yellow-dark/30': userChat.donation === 25000,
                  }"
                >
                  {{ userChat.message }}
                </div>
              </div>
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
        class="h-[190px] md:h-[130px] pt-3 pb-2 px-2 border-t-2 border-gray-dark"
        :class="{ 'rounded-b-md': isStreamer }"
      >
        <!-- HIDDEN AFTER FOLLOW -->

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
              class="w-full resize-none text-black bg-gray-light py-[14px] pr-4 px-4 rounded-md text-[13px] placeholder:text-[13px] placeholder:text-footer focus-visible:outline-none max-h-[calc(1.5em*5)] min-h-[48px]"
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
    v-show="!openLiveChat"
    class="fixed top-20 right-0 m-3 p-3 bg-transparent rounded-md flex justify-center items-center cursor-pointer hover:bg-[#FFFFFF21]"
    v-tooltip="'Expand'"
    @click="handleOpenLiveChat"
  >
    <i class="pi pi-arrow-left text-white text-[0.9rem]"></i>
  </div>
</template>
