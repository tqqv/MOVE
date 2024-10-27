<script setup>
  import { onMounted, onUnmounted, ref } from 'vue';
  import logoIcon from '@icons/logoIcon.vue';
  import SmallLoading from '@/components/icons/smallLoading.vue';

  const loading = ref(false);
  const time = ref(3);
  let intervalId;

  onMounted(() => {
    intervalId = setInterval(() => {
      if (time.value > 0) {
        time.value--;
      } else {
        clearInterval(intervalId);
      }
    }, 1000);
  });

  onUnmounted(() => {
    clearInterval(intervalId);
  });
</script>
<template>
  <section class="absolute w-[89%] bottom-[142px] rounded-lg bg-white shadow-md">
    <div class="container">
      <div class="flex justify-start"><logoIcon width="30px" height="30px" /></div>
      <div v-if="time > 0" class="flex flex-col justify-center items-center gap-y-2">
        <h1 class="text_title p-0">Going live in...</h1>
        <p class="text-[62px] text-body">{{ time }}</p>
      </div>
      <div
        v-if="time === 0 && loading"
        class="flex flex-col justify-center items-center gap-y-6 mt-6"
      >
        <h1 class="text_title p-0">Live video is starting</h1>
        <div class="h-[62px]"><SmallLoading width="50px" height="50px" /></div>
      </div>

      <div
        v-if="time === 0 && !loading"
        class="flex flex-col justify-center items-center gap-y-6 mt-6"
      >
        <h1 class="text_title p-0 mb-4">You are now live!</h1>
      </div>
    </div>
  </section>
</template>
