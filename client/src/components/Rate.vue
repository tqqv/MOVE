<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import RatePopup from './popup/RatePopup.vue';
  import { getRateOfUser } from '@/services/rate';
  import { useUserStore } from '@/stores';

  const userStore = useUserStore();

  const props = defineProps({
    title: {
      type: String,
    },
    videoId: {
      type: String,
      required: true,
    },
  });
  const dataRate = ref(null);
  const emit = defineEmits(['rate', 'updateRate']);
  const isRated = ref(false);
  const isRatePopupOpen = ref(false);
  //fetch data đã rate
  const fetchUserRating = async () => {
    const result = await getRateOfUser(props.videoId);

    if (result && result.data) {
      dataRate.value = result.data.rating;
      console.log('data Rate neeee', dataRate.value);
      isRated.value = dataRate.value > 0;
    } else {
      isRated.value = false;
    }
  };

  // đóng mở popup và fetch data đã rate
  const handleRate = () => {
    if (!isRatePopupOpen.value) {
      isRatePopupOpen.value = true;

      if (userStore.user) {
        fetchUserRating(props.videoId);
      }
    } else {
      isRatePopupOpen.value = false;
    }
    emit('rate');
  };
  //close popup
  const closePopup = () => {
    isRatePopupOpen.value = false;
  };
  //fill màu
  const fillRate = () => {
    isRated.value = true;
  };
  //fetch lại video lấy avg rate
  const updateRate = () => {
    emit('updateRate');
  };

  const iconClass = computed(() => {
    return isRated.value ? 'pi pi-star-fill' : 'pi pi-star';
  });
  watch(
    () => props.videoId,
    (newVideoId, oldVideoId) => {
      if (newVideoId !== oldVideoId) {
        fetchUserRating();
      }
    },
  );

  onMounted(() => {
    if (props.videoId && userStore.user) {
      fetchUserRating(props.videoId);
    }
  });
</script>

<template>
  <div class="relative">
    <div>
      <button
        class="text-primary text-[13px] font-bold flex items-center cursor-pointer uppercase"
        @click="handleRate"
        id="rate-menu-button"
      >
        <i :class="iconClass" class="mr-1"></i> {{ title }}
      </button>
    </div>

    <div
      v-if="isRatePopupOpen"
      id="rate-menu"
      class="absolute right-0 z-10 mt-5 bottom-5 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-black"
    >
      <RatePopup
        :videoId="videoId"
        :dataRate="dataRate"
        @toogleRate="handleRate"
        @fillRate="fillRate"
        @closePopup="closePopup"
        @updateRate="updateRate"
      />
    </div>
  </div>
</template>
