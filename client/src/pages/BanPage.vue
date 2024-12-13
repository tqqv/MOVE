<script setup>
  import Banned from '@/components/icons/banned.vue';
  import Mail from '@/components/icons/mail.vue';
  import Navbar from '@/components/Navbar.vue';
  import { computed, ref, onMounted, onUnmounted } from 'vue';
  import dayjs from 'dayjs';
  import duration from 'dayjs/plugin/duration';

  dayjs.extend(duration);

  const props = defineProps({
    banned: {
      type: Object,
    },
    suspend: {
      type: Object,
    },
  });

  const suspendDemo = ref({
    createdAt: '2024-12-14T15:48:54',
    expiresAt: '2024-12-16T15:48:54',
    reason: 'engaging in inappropriate behavior in the community',
  });

  const countdown = ref('');
  let intervalId;

  onMounted(() => {
    intervalId = setInterval(() => {
      const now = dayjs();
      const suspendEndDate = dayjs(suspendDemo.value.createdAt);

      if (now.isAfter(suspendEndDate)) {
        countdown.value = 'Ban expired';
        clearInterval(intervalId);
      } else {
        const remainingTime = dayjs.duration(suspendEndDate.diff(now));

        countdown.value = `${remainingTime.days()}d ${remainingTime.hours()}h ${remainingTime.minutes()}m ${remainingTime.seconds()}s`;
      }
    }, 1000);
  });

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
</script>

<template>
  <Navbar />
  <div class="h-screen flex relative z-50 pt-[64px]">
    <div class="flex flex-col items-center justify-center gap-y w-1/3 ml-32">
      <div class="flex justify-start w-full">
        <span class="text-[30px] font-semibold">{{ countdown }}</span>
      </div>
      <div class="flex flex-col py-20">
        <h1 class="text-[70px] text-body font-bold leading-[1]">
          <span class="block">Banned</span> <span class="block">Account</span>
        </h1>

        <p class="text-sm text-start mt-7">
          Your account has been banned due to violating our terms of service.The reason for this
          action is:
          <strong class="text-primary italic">
            "engaging in inappropriate behavior in the community.</strong
          >
          If you believe this is a mistake, please contact support for further assistance."
        </p>
      </div>
      <div class="flex items-center gap-x-3 w-full">
        <Mail />
        <span class="mb-0.5">movesport.madison@gmail.com</span>
      </div>
    </div>
    <div class="flex justify-center items-center w-2/3">
      <Banned />
    </div>
  </div>
</template>
