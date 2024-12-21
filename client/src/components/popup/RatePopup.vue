<script setup>
  import { ref, watch } from 'vue';
  import Rating from 'primevue/rating';
  import { postRateVideo, postRateStream } from '@/services/rate';
  import { usePopupStore, useUserStore } from '@/stores';
  import { toast } from 'vue3-toastify';

  const userStore = useUserStore();
  const popupStore = usePopupStore();

  const props = defineProps({
    videoId: {
      type: String,
    },
    livestreamId: {
      type: String,
    },
    dataRate: {
      type: Number,
    },
    titleRatePopup: {
      type: String,
    },
  });

  const value = ref(props.dataRate);
  const emit = defineEmits(['toggleRate', 'fillRate', 'updateRate']);

  const closePopup = () => {
    emit('closePopup');
  };

  const previousValue = ref(value.value);

  watch(
    () => props.dataRate,
    (newValue) => {
      value.value = newValue;
      previousValue.value = newValue;
    },
  );

  const handleRatingChange = async (newValue) => {
    if (newValue !== null && newValue !== previousValue.value) {
      const data = { rating: newValue, videoId: props.videoId };
      if (props.videoId) {
        data.videoId = props.videoId;
      } else if (props.livestreamId) {
        data.livestreamId = props.livestreamId;
      }
      if (!userStore.user) {
        value.value = null;
        popupStore.openLoginPopup();
        return;
      }

      const result = props.videoId ? await postRateVideo(data) : await postRateStream(data);
      if (result.status === 200) {
        toast.success('Thank you for your ratings!');

        //đóng mở popup và fetch data đã rate
        emit('toggleRate');

        // fill star
        emit('fillRate');

        //fetch lại avg rate
        emit('updateRate');
        closePopup();
      } else {
        console.error(result);
      }

      previousValue.value = newValue;
    }
  };

  watch(value, handleRatingChange);
</script>

<template>
  <div class="shadow-lg rounded-lg w-[310px]">
    <div class="space-y-4 p-4 text-left">
      <div>
        <h1 class="text-base relative font-bold">
          {{ titleRatePopup }}
          <i
            class="pi pi-times text-[16px] absolute right-0 top-[15%] cursor-pointer hover:text-primary"
            @click="closePopup"
          ></i>
        </h1>

        <span class="text-sm"> Tell us what you think about this session. </span>
      </div>
      <div class="flex justify-start">
        <Rating v-model="value" :max="5" />
      </div>
    </div>
  </div>
</template>
