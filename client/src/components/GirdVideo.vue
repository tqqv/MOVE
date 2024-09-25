<script setup>
  import { ref, computed } from 'vue';
  import MMAImage from '../assets/category/MMA.png';
  import HIITImage from '../assets/category/HIIT.png';
  import JustMoveImage from '../assets/category/JustMove.png';
  import verified from './icons/verified.vue';
  import rate from './icons/rate.vue';
  import Paginator from 'primevue/paginator';

  const props = defineProps({
    cards: {
      type: Array,
      required: true,
    },
  });
  const totalRecords = computed(() => props.cards.length);
  const rowsPerPage = 9;
  const first = ref(0);

  const paginatedCards = computed(() => {
    return props.cards.slice(first.value, first.value + rowsPerPage);
  });

  const onPageChange = (event) => {
    first.value = event.first;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
</script>
<template>
  <div class="w-full py-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="(card, index) in paginatedCards"
        :key="index"
        class="max-w-sm bg-white overflow-hidden cursor-pointer"
      >
        <div class="relative">
          <img :src="card.image" class="rounded-lg object-cover w-full h-[200px]" />
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

        <div class="flex py-3">
          <div
            :class="[card.isStreaming ? 'border-[3px] border-red' : '']"
            class="flex items-center justify-center size-12 rounded-full"
          >
            <img
              :src="card.avatar"
              alt="Avatar"
              class="w-full h-full rounded-full object-cover p-[1.5px]"
            />
          </div>

          <div class="pl-4 flex-1">
            <div class="flex items-center my-2 justify-between">
              <h3 class="text-base font-bold whitespace-nowrap text-black">{{ card.title }}</h3>
              <div class="flex items-center">
                <rate class="mr-1 mb-1" />
                <span class="text-sm font-bold">{{ card.rating }}</span>
              </div>
            </div>
            <div class="flex items-center gap-x-3">
              <span class="text_secondary whitespace-nowrap">{{ card.author }}</span>
              <span class="mb-1"><verified fill="fill-blue" /></span>
            </div>
            <div class="flex items-center text_secondary mb-2">
              {{ card.category }} <span class="font-bold text-xl pl-1 pr-1">•</span> {{ card.date }}
            </div>
            <div class="flex gap-2 items-center text-[10px] font-bold mb-2">
              <span class="bg-[#EEEEEE] rounded-full text-black p-2">{{ card.level }}</span>
              <span class="bg-[#EEEEEE] rounded-full text-black p-2">{{ card.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Paginator
      :rows="rowsPerPage"
      :totalRecords="totalRecords"
      :first="first"
      @page="onPageChange"
      class="mt-4"
    />
  </div>
</template>
