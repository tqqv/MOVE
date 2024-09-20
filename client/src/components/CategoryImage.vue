<script setup>
  import { ref } from 'vue';
  import MMAImage from '../assets/category/MMA.png';
  import HIITImage from '../assets/category/HIIT.png';
  import JustMoveImage from '../assets/category/JustMove.png';
  import StrengthImage from '../assets/category/Strength.png';
  import YogaImage from '../assets/category/Yoga.png';
  import LowImpactImage from '../assets/category/LowImpact.png';

  const categories = ref([
    {
      id: 1,
      name: 'MMA',
      image: MMAImage,
      views: '1.2k',
    },
    {
      id: 2,
      name: 'HIIT',
      image: HIITImage,
      views: '9.2k',
    },
    {
      id: 3,
      name: 'Just Move',
      image: JustMoveImage,
      views: '8k',
    },
    {
      id: 4,
      name: 'Strength',
      image: StrengthImage,
      views: '2.2k',
    },
    {
      id: 5,
      name: 'Yoga',
      image: YogaImage,
      views: '1.2k',
    },
    {
      id: 6,
      name: 'Low Impact',
      image: LowImpactImage,
      views: '1.1k',
    },
  ]);
</script>

<template>
  <div class="flex flex-wrap gap-6 pt-2">
    <div v-for="category in categories" :key="category.id" class="flex flex-col items-start">
      <img
        :src="category.image"
        :alt="category.name"
        class="rounded-lg w-full h-auto cursor-pointer"
      />
      <h3 class="mt-2 text_subTitle">{{ category.name }}</h3>
      <p class="text_secondary">{{ category.views }} views</p>
    </div>
  </div>
</template>
