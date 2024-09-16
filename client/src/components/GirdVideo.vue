<script setup>
  import MMAImage from '../assets/category/MMA.png';
  import HIITImage from '../assets/category/HIIT.png';
  import JustMoveImage from '../assets/category/JustMove.png';
  import verified from './icons/verified.vue';
  import rate from './icons/rate.vue';
  import Card from 'primevue/card';

  const cards = [
    {
      image: MMAImage,
      title: 'Leg days',
      author: 'dianeTV',
      category: 'Just Move',
      date: 'Posted a day ago',
      rating: 4.5,
      views: '1.34k',
      duration: '15:30',
      level: 'Beginner',
      time: '< 30 mins',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      isLive: true,
    },
    {
      image: HIITImage,
      title: 'No sugar & excuses',
      author: 'iamtherock',
      category: 'Strength',
      date: 'Posted a day ago',
      rating: 4.9,
      views: '1.34k',
      duration: '2:15:30',
      level: 'Advanced',
      time: '> 1 hour',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      isLive: false,
    },
    {
      image: JustMoveImage,
      title: 'Rooftop yoga',
      author: 'missyjoe',
      category: 'Yoga',
      date: 'Posted a day ago',
      rating: 3.1,
      views: '1.34k',
      duration: '1:15:30',
      level: 'Beginner',
      time: '> 1 hour',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      isLive: true,
    },
    {
      image: JustMoveImage,
      title: 'Rooftop yoga',
      author: 'missyjoe',
      category: 'Yoga',
      date: 'Posted a day ago',
      rating: 3.1,
      views: '1.34k',
      duration: '1:15:30',
      level: 'Beginner',
      time: '> 1 hour',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      isLive: true,
    },
  ];
</script>

<template>
  <div class="w-full h-screen bg-gray-100 p-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card v-for="(card, index) in cards" :key="index" class="overflow-hidden">
        <template #header>
          <div class="relative">
            <img :src="card.image" class="object-cover w-full h-[171px]" />
            <div
              class="text-xs absolute bottom-2 left-4 flex items-center font-bold text-white bg-black bg-opacity-70 p-1 rounded"
            >
              <i class="pi pi-eye mr-1 text-xs" />
              <span>{{ card.views }}</span>
            </div>
            <div
              class="absolute bottom-2 right-4 text-white text-xs font-bold bg-black bg-opacity-70 p-1 rounded"
            >
              <span>{{ card.duration }}</span>
            </div>
          </div>
        </template>

        <template #title>
          <div class="flex">
            <div
              :class="[
                'relative inline-flex items-center justify-center w-12 h-12 rounded-full p-0.5',
                card.isLive ? 'border-[3px] border-red' : '',
              ]"
            >
              <img
                :src="card.avatar"
                alt="Avatar"
                class="w-full h-full rounded-full object-cover"
              />
            </div>

            <div class="flex flex-col pl-2 w-full">
              <div class="flex items-center justify-between mt-2">
                <h3 class="text-base font-bold whitespace-nowrap">{{ card.title }}</h3>
                <div class="flex items-center">
                  <rate class="mr-1 mb-1" />
                  <span class="text-sm font-bold">{{ card.rating }}</span>
                </div>
              </div>
              <div>
                <div class="flex items-center">
                  <span class="text_secondary whitespace-nowrap">{{ card.author }}</span>
                  <span class="ml-3"><verified fill="fill-blue" /></span>
                </div>
              </div>
              <div class="flex items-center text_secondary mb-2">
                {{ card.category }} <span class="font-bold text-xl pl-1 pr-1">•</span>
                {{ card.date }}
              </div>
              <div class="flex gap-2 items-center text-[10px] font-bold mb-2">
                <span class="bg-[#EEEEEE] rounded-full text-black p-2">{{ card.level }}</span>
                <span class="bg-[#EEEEEE] rounded-full text-black p-2">{{ card.time }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
