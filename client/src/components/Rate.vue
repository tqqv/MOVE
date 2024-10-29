<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
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
  const emit = defineEmits(['rate']);
  const isRated = ref(false);
  const isRatePopupOpen = ref(false);

  const fetchUserRating = async () => {
    const result = await getRateOfUser(props.videoId);

    if (result && result.data) {
      dataRate.value = result.data.rating;
      console.log(dataRate.value);

      isRated.value = dataRate.value > 0;
    }
  };
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

  const closePopup = () => {
    isRatePopupOpen.value = false;
  };
  const fillRate = () => {
    isRated.value = true;
  };
  const updateRate = () => {
    emit('updateRate');
  };
  const iconClass = computed(() => {
    return isRated.value ? 'pi pi-star-fill' : 'pi pi-star';
  });

  const isElementOutside = (element, target) => {
    return element && !element.contains(target);
  };
  const handleClickOutside = (event) => {
    const rateMenu = document.getElementById('rate-menu');
    const rateMenuButton = document.getElementById('rate-menu-button');

    const clickOutsideRateMenu =
      isElementOutside(rateMenu, event.target) && isElementOutside(rateMenuButton, event.target);

    if (clickOutsideRateMenu) {
      isRatePopupOpen.value = false;
    }
  };
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
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
