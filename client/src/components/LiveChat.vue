<script setup>
  import sendChat from '@icons/sendChat.vue';
  import '@/custom.css';
  import { ref } from 'vue';
  import TopDonates from './streamer/liveStream/TopDonates.vue';
  import DonationUser from './chatOnLiveStream/DonationUser.vue';
  const chatMessages = [
    {
      id: 1,
      name: 'iamafriedegg',
      message: 'Love your stream!',
      createdAt: '2024-08-30T00:00:00Z',
    },
    {
      id: 2,
      name: 'iammike',
      message: 'When will you stream on abs?',
      createdAt: '2024-08-30T00:01:00Z',
    },
    {
      id: 3,
      name: 'mandy829',
      message: 'Your workout is the best!',
      createdAt: '2024-08-30T00:02:00Z',
    },
    {
      id: 4,
      name: 'prabhu777',
      message: 'Keep it up.',
      createdAt: '2024-08-30T00:03:00Z',
    },
    {
      id: 5,
      name: 'amy5012',
      message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      createdAt: '2024-08-30T00:04:00Z',
    },
    {
      id: 6,
      name: 'stranger222',
      message: 'How to do pushups?',
      createdAt: '2024-08-30T00:05:00Z',
    },
    {
      id: 7,
      name: 'workoutguru',
      message: 'Squats are essential for leg day!',
      createdAt: '2024-08-30T00:06:00Z',
    },
    {
      id: 8,
      name: 'jane_doe',
      message: 'Can you recommend any good yoga routines?',
      createdAt: '2024-08-30T00:07:00Z',
    },
    {
      id: 9,
      name: 'gymrat89',
      message: 'I love your HIIT sessions, they are intense!',
      createdAt: '2024-08-30T00:08:00Z',
    },
    {
      id: 10,
      name: 'muscleman',
      message: 'How much protein should I consume daily?',
      createdAt: '2024-08-30T00:09:00Z',
    },
    {
      id: 11,
      name: 'fitgirl21',
      message: 'What are the best exercises for glutes?',
      createdAt: '2024-08-30T00:10:00Z',
    },
    {
      id: 12,
      name: 'healthyguru',
      message: 'Remember to stretch after every workout!',
      createdAt: '2024-08-30T00:11:00Z',
    },
    {
      id: 13,
      name: 'fitnessfanatic',
      message: 'Can you do a session on proper deadlift form?',
      createdAt: '2024-08-30T00:12:00Z',
    },
    {
      id: 14,
      name: 'workoutwarrior',
      message: 'How do you stay motivated to work out every day?',
      createdAt: '2024-08-30T00:13:00Z',
    },
    {
      id: 15,
      name: 'cardioqueen',
      message: 'What’s the best way to improve endurance?',
      createdAt: '2024-08-30T00:14:00Z',
    },
  ];

  const props = defineProps({
    isStreamer: Boolean,
  });

  const openLiveChat = ref(true);
  const handleOpenLiveChat = () => {
    openLiveChat.value = !openLiveChat.value;
  };
</script>

<template>
  <div
    v-if="openLiveChat"
    class="max-w-[333px]  min-w-[323px] bg-white hidden justify-between flex-col text-[#777777] md:flex"
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
      class="flex flex-col flex-grow justify-between border-l-2 border-gray-dark "
      :class="{ 'border-none shadow-md rounded-md border-l-0': isStreamer }"
    >
      <!-- CONTENT -->
      <div
        class="max-h-full h-[109px] flex-grow pb-2"
        :class="{ 'max-h-[440px]  h-[70px]': isStreamer }"
      >
        <div
          class="flex flex-col-reverse px-3 py-3 h-full overflow-y-auto overflow-x-hidden scrollbar-custom"
        >
          <div class="flex flex-col gap-y-5">
            <div
              v-for="userChat in chatMessages"
              :key="userChat.id"
              class="flex gap-x-3 text-[13px]"
            >
              <h2 class="font-bold">{{ userChat.name }}:</h2>
              <p class="text-black break-all">{{ userChat.message }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- INPUT -->
      <div class="py-3 px-3 border-t-2 border-gray-dark" :class="{ 'rounded-b-md': isStreamer }">
        <!-- HIDDEN AFTER FOLLOW -->
        <div v-if="!isStreamer" class="flex justify-start items-center gap-x-3">
          <p class="font-bold text-[13px]">Follow to chat</p>
          <i class="pi pi-question-circle text-[0.8rem]"></i>
        </div>
        <form class="flex mt-3 relative group">
          <input
            type="text"
            placeholder="Send a message"
            class="w-full text-black bg-gray-light py-[14px] pr-11 px-4 rounded-[28px] text-[13px] placeholder:text-[13px] placeholder:text-footer"
          />
          <div class="flex items-center absolute px-3 rounded-r-[28px] right-0 top-0 bottom-0">
            <sendChat class="mb-1 fill-footer cursor-pointer group-focus-within:fill-body" />
          </div>
        </form>
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
