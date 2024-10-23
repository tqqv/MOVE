<script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useRouter } from 'vue-router';
  import LiveStream from '@/components/icons/liveStream.vue';
  import TickRight from '@/components/icons/tickRight.vue';
  import AnalyticsIcon from '@icons/analytics.vue';
  import Clock from '@/components/icons/clock.vue';

  const props = defineProps({
    statusLive: String,
    connectOBS: Boolean,
  });

  const router = useRouter();
  const route = useRoute();
  const isShow = ref(true);
  const showGoLivePopup = ref(false);

  const emit = defineEmits(['updateStatusLive']);

  const setUpSteps = [
    { id: 1, name: 'Connect video source', tick: false },
    { id: 2, name: 'Complete post detail', tick: true },
    { id: 3, name: 'Go live', tick: false },
  ];
  const user = {
    avatar:
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channelName: 'Nguyen Phuoc Minh Hieu',
    followers: 1000,
  };

  const menuItems = [
    { name: 'Stream setup', icon: LiveStream, link: '/streaming/stream-setup' },
    { name: 'Dashboard', icon: AnalyticsIcon, link: '/streaming/dashboard-live' },
  ];

  const handleShow = () => {
    isShow.value = !isShow.value;
  };

  const handleGoLive = () => {
    if (props.connectOBS) {
      showGoLivePopup.value = true;
      emit('updateStatusLive', 'inLive');
    }
  };

  const handleEndLive = () => {
    emit('updateStatusLive', 'afterLive');
  };

  const handleGoHome = () => {
    emit('updateStatusLive', 'beforeLive');
    // router.push('/');
  };
</script>
<template>
  <section
    v-if="isShow"
    class="sticky top-[72px] h-[calc(100vh-72px)] w-[300px] shadow-lg bg-white transition-all duration-300 ease-in-out"
  >
    <div class="px-4 flex flex-col h-full">
      <!-- HEADER -->
      <div class="flex justify-between items-center">
        <p class="text_subTitle text-2xl">
          {{
            statusLive === 'beforeLive'
              ? 'Create live video'
              : statusLive === 'inLive'
              ? 'Live dashboard'
              : 'End of live stream'
          }}
        </p>
        <button
          @click="handleShow"
          class="flex justify-center items-center p-2 hover:bg-primary-light rounded-full"
        >
          <i class="pi pi-align-right text-xl"></i>
        </button>
      </div>
      <!-- MAIN -->
      <div class="my-6 pr-1 flex-1 overflow-auto scrollbar-custom">
        <!-- SET UP STEP-->
        <div :class="{ hidden: statusLive !== 'beforeLive' }" class="flex flex-col gap-y-4">
          <div class="flex items-center gap-x-3">
            <div class="w-full bg-gray-dark rounded-full h-2.5">
              <div class="bg-primary h-2.5 rounded-full" style="width: 30%"></div>
            </div>
            <span class="whitespace-nowrap text-sm text-primary font-medium">1 / 3</span>
          </div>
          <div class="flex flex-col mt-3 gap-y-5">
            <div v-for="step in setUpSteps" class="flex gap-x-4 items-center">
              <div class="flex justify-center items-center w-8">
                <TickRight v-if="step.tick" fill="#13d0b4" />
                <div v-else class="p-[10px] rounded-full border-2 border-[#5b626a]"></div>
              </div>
              <p class="font-medium text-sm">{{ step.name }}</p>
            </div>
          </div>
        </div>
        <div :class="{ hidden: statusLive === 'beforeLive' }" class="flex flex-col gap-y-4">
          <span class="text-body text-sm">
            {{
              statusLive === 'inLive'
                ? 'Now that you are live, you can see your real-time insights or add tools to increase distribution or engagement.'
                : statusLive === 'afterLive'
                ? 'Your live stream has ended. Review your performance metrics and plan your next steps for future broadcasts.'
                : ''
            }}</span
          >
        </div>
        <!-- SET UP USER -->
        <hr class="h-px my-8 bg-gray-dark border-0" />
        <div class="flex flex-col gap-y-7">
          <div class="flex items-center gap-x-4">
            <img class="size-12 object-cover rounded-full" :src="user.avatar" alt="" />
            <div class="flex flex-col gap-y-1">
              <h1 class="font-semibold">{{ user.channelName }}</h1>
              <span class="text-sm text-body">Host - Your profile</span>
            </div>
          </div>
          <div class="flex flex-col gap-y-2">
            <router-link
              v-for="item in menuItems"
              :key="item.name"
              :to="item.link"
              class="flex items-center gap-x-3 py-2 px-2 rounded-lg cursor-pointer hover:bg-gray-light"
              :class="{ 'bg-primary/20 hover:bg-primary/20': route.path === item.link }"
            >
              <div
                class="flex p-2 justify-center items-center rounded-full"
                :class="route.path === item.link ? 'bg-primary' : 'bg-gray-dark'"
              >
                <component :is="item.icon" :fill="route.path === item.link ? '#fff' : '#000'" />
              </div>
              <p class="font-medium">{{ item.name }}</p>
            </router-link>
          </div>
        </div>
      </div>
      <hr class="h-px mb-4 bg-gray-dark border-0" />
      <!-- BOTTOM BUTTON -->
       <!-- WAIT START LIVE -->
      <div :class="{ hidden: statusLive !== 'beforeLive' }" class="flex gap-x-3 font-semibold">
        <div class="px-4 py-2 rounded-md bg-gray-dark/80 hover:bg-gray-dark cursor-pointer">
          Back
        </div>
        <!-- START LIVE -->
        <div
          class="flex items-center justify-center gap-x-2 px-3 py-2 rounded-md bg-primary/90 hover:bg-primary text-white text-center w-full cursor-pointer"
          :class="{ '!cursor-not-allowed opacity-50': !props.connectOBS }"
          :disabled="!connectOBS"
          @click="handleGoLive"
        >
          <LiveStream />
          <p>Go live</p>
        </div>
      </div>
      <!-- IN LIVE -->
      <div :class="{ hidden: statusLive !== 'inLive' }" class="flex flex-col gap-y-3 font-semibold">
        <!-- TIME -->
        <div class="flex gap-x-2 items-center">
          <Clock />
          <span class="text-xl text-body mr-3">00:00:00</span>
          <div class="relative size-4 border border-red rounded-full">
            <div
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-3 bg-red rounded-full"
            ></div>
          </div>
        </div>
        <div
          class="flex items-center justify-center gap-x-2 px-3 py-2 rounded-md bg-red/90 hover:bg-red text-white text-center w-full cursor-pointer"
          @click="handleEndLive"
        >
          <p>End live stream</p>
        </div>
      </div>
      <!-- END LIVE -->
      <div
        :class="{ hidden: statusLive !== 'afterLive' }"
        class="flex flex-col gap-y-3 font-semibold"
      >
        <span class="text-xl text-body mr-3">00:00:00</span>
        <div
          class="flex items-center justify-center gap-x-2 px-3 py-2 rounded-md bg-primary-light/20 hover:bg-primary-light/30 text-primary text-center w-full cursor-pointer"
          @click="handleGoHome"
        >
          <p>Return home</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CLOSE -->
  <section
    v-else
    class="sticky top-[72px] h-[calc(100vh-72px)] w-[100px] shadow-lg bg-white transition-all duration-300 ease-in-out"
  >
    <div class="flex px-2 flex-col h-full">
      <!-- HEADER -->
      <div class="flex justify-center items-center">
        <button
          v-tooltip="'Expand sidebar '"
          @click="handleShow"
          class="flex justify-center items-center w-full py-5 px-3 hover:bg-gray-light rounded-md"
        >
          <i class="pi pi-align-left text-xl"></i>
        </button>
      </div>
      <hr class="h-px my-3 bg-gray-dark border-0" />
      <!-- MAIN -->
      <div class="flex flex-col gap-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.link"
          class="flex justify-center items-center gap-x-3 py-3 px-3 rounded-lg cursor-pointer hover:bg-gray-light"
          :class="{ 'bg-primary/20 hover:bg-primary/20': route.path === item.link }"
          v-tooltip="item.name"
        >
          <div
            class="flex p-2 justify-center items-center rounded-full"
            :class="route.path === item.link ? 'bg-primary' : 'bg-gray-dark'"
          >
            <component :is="item.icon" :fill="route.path === item.link ? '#fff' : '#000'" />
          </div>
        </router-link>
      </div>
      <!-- GO LIVE -->
      <hr class="h-px my-4 bg-gray-dark border-0" />
      <div class="flex justify-center gap-x-3 font-semibold">
        <div
          v-tooltip="'Start live'"
          class="flex items-center justify-center size-10 rounded-full bg-primary/90 hover:bg-primary text-white text-center cursor-pointer"
          :class="{ 'cursor-not-allowed opacity-50': !props.LiveStream }"
        >
          <LiveStream />
        </div>
      </div>
    </div>
  </section>
</template>
