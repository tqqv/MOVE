<script setup>
  import sendChat from '@icons/sendChat.vue';
  import '@/custom.css'
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
</script>

<template>
  <div class="h-[704px] w-[323px] bg-gray-light flex justify-between flex-col text-[#777777]">
    <!-- TOPBAR -->
    <div class="flex justify-between items-center bg-black text-white px-4 py-4">
      <i class="pi pi-arrow-right text-[1.1rem] cursor-pointer"></i>
      <h2 class="uppercase text_subTitle text-white text-[13px]">live chat</h2>
      <i class="pi pi-user text-[1.1rem] cursor-pointer"></i>
    </div>
    <div class="flex flex-col flex-grow justify-between border-l-2 border-gray-dark">
      <!-- CONTENT -->
      <div class="h-[539px]">
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
      <div class="py-3 px-3 border-t-2 border-gray-dark">
        <!-- HIDDEN AFTER FOLLOW -->
        <div class="flex justify-start items-center gap-x-3">
          <p class="font-bold text-[13px]">Follow to chat</p>
          <i class="pi pi-question-circle text-[1.1rem]"></i>
        </div>
        <form class="flex mt-3 relative group">
          <input
            type="text"
            placeholder="Send a message"
            class="w-full text-white bg-black py-[14px] pr-11 px-4 rounded-[28px] text-[13px] placeholder:text-[13px] placeholder:text-footer focus:caret-primary"
          />
          <div class="flex items-center absolute px-3 rounded-r-[28px] right-0 top-0 bottom-0">
            <sendChat class="mb-1 fill-footer cursor-pointer group-focus-within:fill-white" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


