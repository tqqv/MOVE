<script setup>
  import { ref } from 'vue';
  import MMAImage from '@/assets/category/MMA.png';
  import heart from '@/components/icons/heart.vue';

  const category = ref({
    name: 'MMA',
    image: MMAImage,
    views: '1.2k',
    followers: 1000,
  });
  const isFilled = ref(false);
  const toggleFill = () => {
    isFilled.value = !isFilled.value;
  };
</script>

<template>
  <div class="w-[145px] flex gap-4 pt-2">
    <img
      :src="category.image"
      :alt="category.name"
      class="rounded-lg w-full h-auto cursor-pointer"
    />
    <div class="whitespace-nowrap">
      <h3 class="text_subTitle">{{ category.name }}</h3>
      <div class="flex gap-2 items-center">
        <p class="text-[13px] text-footer font-bold">{{ category.views }} views</p>
        <span class="inline-block w-1 h-1 bg-footer rounded-full"></span>
        <p class="text-[13px] text-footer font-bold">{{ category.followers }} followers</p>
      </div>
      <div class="text-primary text-[13px] pt-4 font-bold flex items-center uppercase">
        <heart
          @click="toggleFill"
          :fill="isFilled ? 'fill-primary' : 'fill-white'"
          stroke="stroke-primary"
          class="mr-1 cursor-pointer"
        />
        Follow
      </div>
    </div>
  </div>
</template>
