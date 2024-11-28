<script setup>
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import LogoIcon from '../icons/logoIcon.vue';
  import Congratulation from '../animation/congratulation.vue';
  import { animationRunInDonation } from '../animation/gif';

  const props = defineProps({
    listDonation: Array,
  });

  const currentDonation = ref(null);
  const queue = ref([]);

  watch(
    () => props.listDonation,
    (newVal) => {
      if (newVal && newVal.length) {
        const newDonation = newVal[newVal.length - 1];
        queue.value.push(newDonation);
        processQueue();
      }
    },
    { deep: true },
  );

  const processQueue = () => {
    if (currentDonation.value || !queue.value.length) return;
    currentDonation.value = queue.value.shift();
    setTimeout(() => {
      currentDonation.value = null;
      processQueue();
    }, 5000);
  };
</script>

<template>
  <div
    class="w-screen h-screen justify-center items-center flex flex-col bg-transparent animate-scale"
    v-if="currentDonation"
  >
    <Congratulation />
    <img :src="animationRunInDonation" alt="" class="size-52" />
    <div class="flex flex-col gap-y-3 py-6 text-white border-stroke font-extrabold">
      <div class="flex gap-x-1.5 text-[42px]">
        <h1 class="text-primary">{{ currentDonation.username }}</h1>
        <span>donated</span>
        <span class="text-primary">{{ currentDonation.donation }}</span>
        <span>REPs</span>
      </div>
      <div class="text-center text-white text-4xl">
        {{ currentDonation.message }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .border-stroke {
    -webkit-text-stroke: 2px #000;
  }

  @keyframes scaleEffect {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.5);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .animate-scale {
    animation: scaleEffect 0.8s ease-in-out;
  }
</style>
