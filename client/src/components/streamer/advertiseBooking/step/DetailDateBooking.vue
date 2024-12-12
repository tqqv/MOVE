<script setup>
  import { computed, ref } from 'vue';
  import Dialog from 'primevue/dialog';
  import { formatDateData, genreDuration, truncateDescripton } from '@/utils';
  import { useStreamerStore } from '@/stores/streamer.store';
  import { postCancelBooking } from '@/services/bookingFeaturedContent';
  import { useUserStore } from '@/stores/user.store';
  import { toast } from 'vue3-toastify';
  import SmallLoading from '@/components/icons/smallLoading.vue';
  import Divider from 'primevue/divider';

  // Nhận các props để hiển thị thông tin trong Dialog
  const props = defineProps({
    title: String,
    groupName: String,
    titleReport: String,
    isDetailVisible: Boolean,
    localSelectedDate: Object,
    dataChooseDate: Object,
    isBookedByUser: Boolean,
    checkFullBookingDate: Array,
  });
  const streamerStore = useStreamerStore();
  const userStore = useUserStore();
  const isLoadingCancel = ref(false);
  const personalData = computed(() => {
    const channelId = streamerStore?.streamerChannel?.id;
    return props.dataChooseDate?.bookInfor.rows.filter((row) => row.channelId === channelId);
  });
  const isFull = (date) => {
    const formattedDate = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(
      date.day,
    ).padStart(2, '0')}`;
    return props.checkFullBookingDate.includes(formattedDate);
  };
  const emit = defineEmits([
    'toggleDetailVisible',
    'updateSelectDate',
    'handleSelectedDateUpdate',
    'featchBookedDated',
  ]);

  const toggleDetailVisible = () => {
    emit('toggleDetailVisible');
  };
  const handleSelectDate = () => {
    emit('updateSelectDate');
    toggleDetailVisible();
  };
  const clearSelectedDate = () => {
    const newSelectedDates = [...props.localSelectedDate];
    newSelectedDates.pop();
    emit('handleSelectedDateUpdate', newSelectedDates);
    emit('updateSelectDate', null);
    toggleDetailVisible();
  };

  const handleCancelBooking = async () => {
    const pickedDate = [new Date(props.dataChooseDate.datetime).toISOString()];
    isLoadingCancel.value = true;
    try {
      const result = await postCancelBooking(pickedDate);

      if (result.status === 200) {
        userStore.fetchUserProfile();
        // bookingId.value = result.data.data.id;
        // isBookingSuccess.value = true;
        // currentStep.value = '1';
        // selectedDate.value = new Date();
        // selectedVideo.value = '';
        clearSelectedDate();
        emit('featchBookedDated');
        if (result.data.data.successCancellations.length) {
          toast.success(result.data.data.successCancellations[0].message);
        } else {
          toast.error(result.data.data.errorCancellations[0].message);
        }
      } else {
        isBookingSuccess.value = false;
        toast.error('Cancel booking failed:', result?.data.message);
      }
    } catch (error) {
      console.error('Error during booking:', error);
    } finally {
      isLoadingCancel.value = false;
    }
  };
</script>

<template>
  <Dialog
    :visible="isDetailVisible"
    :modal="true"
    :draggable="false"
    :header="title"
    :style="{ width: '30rem' }"
    @update:visible="clearSelectedDate"
  >
    <div class="space-y-8 mt-4 text-lg">
      <div v-if="isBookedByUser" class="italic text-red font-bold">
        You have a booking for today!
      </div>
      <div v-else-if="isFull(localSelectedDate[0])" class="italic text-red font-bold">
        All booking slots for today are fully reserved!.
      </div>
      <div v-else class="italic text-primary font-bold">Select date now!</div>
      <div v-for="data in personalData" :key="data.id" class="flex gap-4 items-start">
        <img
          :src="data.video.thumbnailUrl"
          :alt="data.video.title"
          class="w-20 h-20 object-cover rounded-md"
        />
        <div class="flex-1">
          <div class="flex justify-between items-center">
            <h4 class="font-semibold text-lg">{{ data.video.title }}</h4>
          </div>
          <p class="text-sm">{{ truncateDescripton(data.video.description, 150) }}</p>

          <div class="flex gap-2 items-center text-[10px] font-bold pt-2 text-black">
            <span class="bg-[#EEEEEE] rounded-full px-3">{{
              data.video?.levelWorkout.levelWorkout
            }}</span>
            <span v-if="data.video.duration" class="bg-[#EEEEEE] rounded-full px-3">{{
              genreDuration(data.video.duration)
            }}</span>
          </div>
        </div>
      </div>
      <div>
        <strong>Date: </strong>
        <span class="font-semibold">{{ dataChooseDate.datetime }}</span>
      </div>
      <!-- Booking Information -->
      <div>
        <strong>Current Booking: </strong>
        <span class="font-semibold">
          {{ dataChooseDate?.bookInfor?.count }} /
          {{ dataChooseDate?.defaultData?.maxBookings || dataChooseDate?.abnormal?.maxBookings }}
        </span>
      </div>

      <Divider />

      <!-- Button to add video to the selected date -->

      <!-- Price -->

      <!-- Price Information -->
      <div>
        <strong>Price: </strong>
        <span class="font-semibold"
          >{{
            dataChooseDate?.defaultData?.pricePerDay || dataChooseDate?.abnormal?.pricePerDay
          }}
          REPs</span
        >
      </div>

      <div class="flex justify-end mt-2 gap-x-8">
        <button v-if="isBookedByUser" @click="handleCancelBooking" class="btn bg-red">
          <SmallLoading v-if="isLoadingCancel" fill="white" fill_second="#13d0b4" />
          <span v-else> Cancel Booking</span>
        </button>

        <button v-if="!isBookedByUser" @click="clearSelectedDate" class="font-bold text-primary">
          Cancel
        </button>
        <button
          v-if="!isBookedByUser"
          @click="handleSelectDate"
          class="btn"
          :disabled="isFull(localSelectedDate[0])"
        >
          Select Date
        </button>
      </div>
    </div>
  </Dialog>
</template>
