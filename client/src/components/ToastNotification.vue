<script setup>
  import { useNotificationStore } from '@/stores';
  import { computed, onMounted, ref, watch } from 'vue';

  const showNotification = ref(false);
  const isClosing = ref(false);
  const notificationStore = useNotificationStore();
  const newNotification = computed(() => {
    return notificationStore.newNotification;
  });
  const closeNotification = () => {
    isClosing.value = true;
    setTimeout(() => {
      showNotification.value = false;
    }, 400);
  };

  watch(newNotification, (newValue) => {
    if (newValue) {
      console.log(newValue);

      showNotification.value = true;
      isClosing.value = false;
      setTimeout(closeNotification, 4000);
    }
  });
</script>

<template>
  <div
    v-if="showNotification"
    :class="[
      'absolute w-80 border border-gray-light rounded-md z-10 bottom-4 left-11 bg-white shadow-2xl',
      isClosing ? 'fade-out' : 'fade-in',
    ]"
  >
    <div class="p-4">
      <div class="flex flex-col">
        <div class="flex justify-between items-center">
          <h1 class="font-semibold">New notification</h1>
          <div
            class="flex p-1 justify-center items-center hover:bg-gray-light rounded-full"
            @click="closeNotification"
          >
            <i class="pi pi-times text-sm"></i>
          </div>
        </div>
        <div class="flex gap-x-3 pt-3 pb-1">
          <img
            src="https://images.pexels.com/photos/9944859/pexels-photo-9944859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
            class="size-14 object-cover flex-shrink-0 rounded-full"
          />
          <div class="flex flex-col gap-y-1 mr-6">
            <h1 class="text_para">
              <span class="text_para font-semibold mr-1">npmh310</span>
              <span>hello may hello mayhello may</span>
            </h1>
            <p class="text_secondary text-[12px] text-[#ACACAC]">3 time ago</p>
          </div>
          <div class="flex items-center">
            <div class="p-1 rounded-full bg-primary-light"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(100px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(100px);
    }
  }

  .fade-in {
    animation: fadeIn 0.4s ease-out;
  }

  .fade-out {
    animation: fadeOut 0.4s ease-out;
  }
</style>
