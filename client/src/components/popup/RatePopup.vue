<script setup>
  import { ref, watch } from 'vue';
  import Rating from 'primevue/rating';
  import { postRateVideo } from '@/services/rate';
  import { usePopupStore, useUserStore } from '@/stores';
  import { toast } from 'vue3-toastify';

  const userStore = useUserStore();
  const popupStore = usePopupStore();

  const props = defineProps({
    videoId: {
      type: String,
    },
    dataRate: {
      type: Number,
    },
  });

  const value = ref(props.dataRate);
  const emit = defineEmits(['toggleRate', 'fillRate']);

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

      if (!userStore.user) {
        popupStore.openLoginPopup();
        return;
      }

      const result = await postRateVideo(data);
      if (result && result.success) {
        toast.success('Thank you for your ratings!');

        emit('toggleRate');
        emit('fillRate');
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
          Rate the stream
          <i
            class="pi pi-times text-[16px] absolute right-0 top-[15%] cursor-pointer hover:text-primary"
            @click="closePopup"
          ></i>
        </h1>
        <span class="text-sm"> Tell us what you think about this session. </span>
      </div>
      <div class="flex justify-start">
        <Rating v-model="value" />
      </div>
    </div>
  </div>
</template>
