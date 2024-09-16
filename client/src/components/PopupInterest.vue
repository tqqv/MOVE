<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
      <div class="flex justify-between">
        <h2 class="text-base font-bold text-center w-full">What are your interests?</h2>
        <button @click="close" class="pi pi-times" />
      </div>
      <p class="text-sm mb-6 text-center">
        Choose 1 or more categories below. This will help us provide you with the most relevant
        contents on MOVE.
      </p>
      <div class="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <div
          v-for="(category, index) in categories"
          :key="category.name"
          @click="toggleCategory(index)"
          class="relative flex flex-col"
        >
          <div class="relative">
            <img
              :src="category.image"
              :alt="category.name"
              class="rounded-md w-[121px] h-[175px] object-cover cursor-pointer transition-opacity duration-300"
              :class="{ 'opacity-50': category.selected }"
            />
            <div
              v-if="category.selected"
              class="absolute inset-0 bg-primary bg-opacity-50 rounded-md z-10"
            ></div>
            <div
              v-if="category.selected"
              class="absolute inset-0 flex justify-center items-center z-30"
            >
              <i class="pi pi-heart-fill text-white text-2xl"></i>
            </div>
          </div>
          <h3 class="mt-2 font-bold text-[18px] whitespace-nowrap">{{ category.name }}</h3>
        </div>
      </div>
      <div class="flex justify-center">
        <button
          :class="{
            'btn py-2 transition mt-6 w-[200px]': true,
            'bg-teal-600 hover:bg-teal-700': selectedCount >= 1,
            'bg-[#707070] text-white hover:bg-[#707070]': selectedCount < 1,
            'disabled:opacity-50': true,
          }"
          :disabled="selectedCount < 1"
        >
          {{ selectedCount < 1 ? 'Choose 1 more' : 'Continue' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import MMAImage from '../assets/category/MMA.png';
  import HIITImage from '../assets/category/HIIT.png';
  import JustMoveImage from '../assets/category/JustMove.png';
  import StrengthImage from '../assets/category/Strength.png';
  import YogaImage from '../assets/category/Yoga.png';
  import LowImpactImage from '../assets/category/LowImpact.png';

  const categories = ref([
    { name: 'MMA', image: MMAImage, selected: false },
    { name: 'HIIT', image: HIITImage, selected: false },
    { name: 'Just Move', image: JustMoveImage, selected: false },
    { name: 'Strength', image: StrengthImage, selected: false },
    { name: 'Yoga', image: YogaImage, selected: false },
    { name: 'Low Impact', image: LowImpactImage, selected: false },
  ]);

  const selectedCount = ref(0);

  const toggleCategory = (index) => {
    const category = categories.value[index];
    category.selected = !category.selected;
    selectedCount.value = categories.value.filter((cat) => cat.selected).length;
  };

  const close = () => {};
</script>
