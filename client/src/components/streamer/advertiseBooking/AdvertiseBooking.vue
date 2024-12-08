<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import Stepper from 'primevue/stepper';
  import Step from 'primevue/step';
  import StepList from 'primevue/steplist';
  import StepPanels from 'primevue/steppanels';
  import StepPanel from 'primevue/steppanel';
  import Button from 'primevue/button';
  import { getVideobyChannel } from '@/services/video';
  import { useStreamerStore } from '@/stores/streamer.store';
  import { useUserStore } from '@/stores/user.store';

  import SelectDate from './step/SelectDate.vue';
  import SelectVideo from './step/SelectVideo.vue';
  import Payment from './step/Payment.vue';
  import BookingDetail from './BookingDetail.vue';
  import { postBookingContent } from '@/services/bookingFeaturedContent';
  import { toast } from 'vue3-toastify';
  import { Vue3Lottie } from 'vue3-lottie';
  import AstronautJSON from '@components/animation/success.json';
  const streamerStore = useStreamerStore();
  const userStore = useUserStore();

  const currentStep = ref('1');
  const selectedDate = ref(new Date());

  const searchTerm = ref('');
  const selectedVideo = ref();
  const databyDate = ref();
  const videos = ref([]);
  const totalPages = ref(0);
  const page = ref(1);
  const pageSize = ref(12);
  const selectedVideosCount = ref();
  const checkDate = ref(false);
  const isBookingSuccess = ref(false);
  const bookingId = ref();
  const handleCheckDate = (isBooked) => {
    checkDate.value = isBooked;
    console.log(checkDate.value);
  };
  // ------------------post booking thanh toán----------------------//

  const handlePayment = async () => {
    if (!selectedVideo.value || !databyDate.value) {
      console.error('Missing data for booking:', {
        selectedVideo: selectedVideo.value,
        databyDate: databyDate.value,
      });
      return;
    }

    const date = selectedDate.value;
    const selectedDateUTC = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
      ),
    );

    const bookingData = {
      date: selectedDateUTC.toISOString(), // Sử dụng giờ UTC đã được điều chỉnh
      featuredContentBaseId: databyDate?.value?.defaultData?.id || null,
      featuredContentAbnormalId: databyDate?.value?.abnormal?.id || null,
      videoId: selectedVideo.value.id,
    };

    console.log(bookingData.date);

    try {
      const result = await postBookingContent(
        bookingData.date,
        bookingData.featuredContentBaseId,
        bookingData.featuredContentAbnormalId,
        bookingData.videoId,
      );
      console.log(result);

      if (result.status === 200) {
        console.log('Booking successful:', result.data);
        userStore.fetchUserProfile();
        bookingId.value = result.data.data.id;
        isBookingSuccess.value = true;
        currentStep.value = '1';
        selectedDate.value = new Date();
        selectedVideo.value = '';
      } else {
        isBookingSuccess.value = false;
        toast.error('Booking failed:', result.message);
      }
    } catch (error) {
      console.error('Error during booking:', error.message);
    }
  };

  // ------------------get video by channel----------------------//
  const fetchVideosByChannel = async () => {
    try {
      const result = await getVideobyChannel(
        streamerStore?.streamerChannel.id,
        page.value,
        pageSize.value,
      );
      const fetchedVideos = result.data.data.videos.rows;
      videos.value = fetchedVideos;
      videos.value = fetchedVideos.map((video) => ({
        ...video,
        selected: false,
      }));

      totalPages.value = result.data.data.totalPages;
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };
  // ----------------------------------------------------------//
  // -----------------hàm select video----------------------//

  const toggleVideoSelection = (video) => {
    if (video.selected) {
      selectedVideo.value = video;
    } else {
      if (selectedVideo.value && selectedVideo.value.id === video.id) {
        selectedVideo.value = null;
      }
    }
  };
  // ----------------------------------------------------------//
  const goToNextStep = async () => {
    console.log(databyDate.value.bookInfor.count);
    console.log(databyDate.value.abnormal?.maxBookings);
    console.log(databyDate.value.defaultData?.maxBookings);

    // ----------check slot step 1----------------//
    if (currentStep.value === '1' && !selectedVideo.value) {
      let maxBookings;
      if (databyDate.value.defaultData?.maxBookings !== undefined) {
        maxBookings = databyDate.value.defaultData.maxBookings;
      } else if (databyDate.value.abnormal?.maxBookings !== undefined) {
        maxBookings = databyDate.value.abnormal.maxBookings;
      }

      if (maxBookings !== undefined && databyDate.value.bookInfor.count >= maxBookings) {
        toast.error('Sorry, all booking slots are full.');
        return;
      }
    }

    // ----------check select video step 2----------------//

    if (currentStep.value === '2' && !selectedVideo.value) {
      return;
    }
    // ----------next step----------------//

    if (currentStep.value === '1') {
      currentStep.value = '2';
      await streamerStore.fetchProfileChannel();
      if (streamerStore?.streamerChannel.id) {
        await fetchVideosByChannel();
      }
    } else if (currentStep.value === '2') currentStep.value = '3';
  };
  // ----------------------------------------------------------//

  const goToPreviousStep = () => {
    if (currentStep.value === '2') currentStep.value = '1';
    else if (currentStep.value === '3') currentStep.value = '2';
  };

  const isBackDisabled = computed(() => currentStep.value === '1');
  const isNextDisabled = computed(() => currentStep.value === '3');

  const handleGetDataBookingDetails = (data) => {
    databyDate.value = data;
  };

  watch(
    () => selectedDate.value,
    (newDate, oldDate) => {
      selectedDate.value = newDate;
    },
  );
  watch(
    () => databyDate.value,
    (newData) => {
      databyDate.value = newData;
    },
    { immediate: true },
  );
  watch(
    () => videos.value,
    (newVideos) => {
      selectedVideosCount.value = newVideos.filter((video) => video.selected).length;
    },
    { deep: true },
  );

  onMounted(async () => {});
</script>

<template>
  <section class="container">
    <div class="flex justify-between pb-4">
      <h1 class="text_title">Advertise Booking</h1>
    </div>
    <div class="bg-white shadow-lg p-6 rounded-md text-black">
      <!-- Thành công -->
      <div v-if="isBookingSuccess" class="w-full space-y-4">
        <div class="flex justify-center items-center">
          <Vue3Lottie :animationData="AstronautJSON" :height="200" :width="200" />
        </div>

        <div class="text-center space-y-4">
          <div class="text-2xl text-primary font-semibold">Amazing!</div>
          <div class="text-xl mt-2 font-semibold">
            You have successfully booked the advertisement slot
          </div>
        </div>

        <div class="flex gap-x-2 text-center justify-center text-sm mt-6 whitespace-nowrap">
          <p class="uppercase">Booking Id:</p>
          <p class="text-gray-800 font-semibold">#{{ bookingId }}</p>
        </div>

        <div
          @click="isBookingSuccess = false"
          class="text-primary flex font-bold text-center justify-center pt-8"
        >
          Back to Select Date
        </div>
      </div>
      <!---------------->
      <div v-else class="grid grid-cols-12 gap-4">
        <!-- Stepper -->
        <div class="col-span-8">
          <Stepper :value="currentStep" class="w-full">
            <StepList>
              <Step value="1" :disabled="true">Select Date</Step>
              <Step value="2" :disabled="true">Select Option</Step>
              <Step value="3" :disabled="true">Payment</Step>
            </StepList>

            <StepPanels>
              <!-- Step 1 -->
              <StepPanel value="1">
                <SelectDate
                  v-model:selectedDate="selectedDate"
                  @sendDetailBooking="handleGetDataBookingDetails"
                  @update:checkDate="handleCheckDate"
                />
              </StepPanel>

              <!-- Step 2 -->
              <StepPanel value="2">
                <SelectVideo
                  :videos="videos"
                  v-model:searchTerm="searchTerm"
                  @toggleVideoSelection="toggleVideoSelection"
                />
              </StepPanel>

              <!-- Step 3 -->
              <StepPanel value="3">
                <Payment
                  :videos="videos.filter((video) => video.selected)"
                  :databyDate="databyDate"
                  :selectedDate="selectedDate"
                  :selectedVideosCount="selectedVideosCount"
                />
              </StepPanel>
            </StepPanels>
          </Stepper>

          <!-- Common Buttons -->
          <div class="flex justify-between mt-16">
            <div class="flex-1">
              <Button
                v-if="!isBackDisabled"
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="goToPreviousStep"
              />
            </div>
            <div class="flex-1 text-right">
              <Button
                v-if="!isNextDisabled"
                class="btn"
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                @click="goToNextStep"
                :disabled="
                  (currentStep === '2' && !selectedVideo) || (currentStep === '1' && checkDate)
                "
              />

              <Button v-if="isNextDisabled" class="btn" label="Submit" @click="handlePayment" />
            </div>
          </div>
        </div>

        <!-- Booking Details -->
        <div class="col-span-4">
          <BookingDetail
            :selectedDate="selectedDate"
            :videos="videos.filter((video) => video.selected)"
            :databyDate="databyDate"
          />
        </div>
      </div>
    </div>
  </section>
</template>
