<script setup>
  import Filter from '@components/Filter.vue';
  import facebook from '@/components/icons/facebookLogin.vue';
  import GirdVideo from '@/components/GirdVideo.vue';
  import MMAImage from '@/assets/category/MMA.png';
  import HIITImage from '@/assets/category/HIIT.png';
  import JustMoveImage from '@/assets/category/JustMove.png';
  const levelOptions = [
    { id: 1, name: 'Beginner' },
    { id: 2, name: 'Intermediate' },
    { id: 3, name: 'Advanced' },
  ];
  const categoryOptions = [
    { id: 1, name: 'All categories' },
    { id: 2, name: 'Entertainment' },
    { id: 3, name: 'Technology' },
    { id: 4, name: 'Lifestyle' },
  ];
  const sortByOptions = [
    { id: 1, name: 'Views (High to Low)', icon: facebook },
    { id: 2, name: 'Views (Low to High)', icon: facebook },
    { id: 3, name: 'Duration (Long to Short)', icon: facebook },
    { id: 4, name: 'Duration (Short to Long)', icon: facebook },
    { id: 5, name: 'Ratings (High to Low)', icon: facebook },
    { id: 6, name: 'Ratings (Low to High)', icon: facebook },
  ];
  const props = defineProps({
    videoDetails: {
      type: Object,
      required: true,
    },
  });
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
      isStreaming: true,
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
      isStreaming: true,
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
      isStreaming: true,
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
      isStreaming: true,
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
      isStreaming: true,
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
      isStreaming: true,
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
      isStreaming: true,
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
      isStreaming: true,
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
      isStreaming: true,
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
      isStreaming: true,
    },
    // Add more cards as needed
  ];

  //Check null
  // const cards = [];
</script>

<template>
  <div v-if="cards.length > 0" class="pt-2">
    <div class="flex flex-grow items-center justify-between">
      <div class="text-2xl font-bold text-black">All videos</div>
      <div class="flex gap-x-6">
        <Filter :title="'LEVEL'" :options="levelOptions" />
        <Filter :title="'CATEGORY'" :options="categoryOptions" />
        <Filter :title="'SORT BY'" :options="sortByOptions" />
      </div>
    </div>
    <GirdVideo :cards="cards" />
  </div>
  <div v-else class="text-base text-black italic">
    {{ videoDetails.name }} has not uploaded any videos yet.
  </div>
</template>
