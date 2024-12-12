<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import Stepper from 'primevue/stepper';
  import Step from 'primevue/step';
  import StepList from 'primevue/steplist';
  import StepPanels from 'primevue/steppanels';
  import StepPanel from 'primevue/steppanel';
  import Button from 'primevue/button';
  import { getVideoSearchbyChannel } from '@/services/streamer';
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
  import { formatDateData } from '@/utils';
  import SmallLoading from '@/components/icons/smallLoading.vue';
  import { debounce } from '@/utils';
  import { searchVideo } from '@/services/streamer';

  const streamerStore = useStreamerStore();
  const userStore = useUserStore();

  const currentStep = ref('1');
  const selectedDate = ref(null);
  const videosByDate = ref(null);
  const searchTerm = ref('');
  const selectedVideo = ref();
  const databyDate = ref([]);
  const videos = ref([]);

  const totalPages = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(8);
  const isFetchingMore = ref(false);
  const loadingMore = ref(false);

  const selectedVideosCount = ref();
  const checkDate = ref(false);
  const isBookingSuccess = ref(false);
  const isLoadingPayment = ref(false);
  const chooseDate = ref();

  const loading = ref(true);

  const handleCheckDate = (isBooked) => {
    checkDate.value = isBooked;
  };
  const toggleBackSelectDate = () => {
    isBookingSuccess.value = false;
    currentStep.value = '1';
    // selectedDate.value = '';
    // selectedVideo.value = '';
  };
  const allVideos = computed(() => {
    return Object.values(videosByDate.value || {}).flat();
  });
  const pricesByDate = computed(() => {
    return databyDate.value.map((item) => {
      return {
        date: item.date,
        pricePerDay: item.data?.defaultData?.pricePerDay,
        featuredContentBaseId: item.data?.defaultData?.id || null,
        featuredContentAbnormalId: item.data?.abnormal?.id || null,
      };
    });
  });
  console.log('All Videos:', allVideos.value);
  console.log(databyDate);
  const combinedData = computed(() => {
    return allVideos.value.map((video, index) => {
      const priceInfo = pricesByDate.value[index] || {};
      return {
        ...video,
        ...priceInfo,
      };
    });
  });

  // ------------------post booking thanh toán----------------------//

  const handlePayment = async () => {
    const bookingData = combinedData.value.map((item) => ({
      date: new Date(item.date).toISOString(),
      featuredContentBaseId: item.featuredContentBaseId,
      featuredContentAbnormalId: item.featuredContentAbnormalId,
      videoId: item.id,
    }));
    isLoadingPayment.value = true;
    try {
      const result = await postBookingContent(bookingData);

      if (result.status === 200) {
        userStore.fetchUserProfile();
        // bookingId.value = result.data.data.id;
        isBookingSuccess.value = true;
        currentStep.value = '1';
        selectedDate.value = '';
        selectedVideo.value = '';
        videosByDate.value = null;
      } else {
        isBookingSuccess.value = false;
        toast.error('Booking failed:', result.message);
      }
    } catch (error) {
      console.error('Error during booking:', error.message);
    } finally {
      isLoadingPayment.value = false;
    }
  };

  // ------------------get video by channel----------------------//
  const fetchVideosByChannel = async () => {
    try {
      const result = await getVideoSearchbyChannel(
        streamerStore?.streamerChannel.id,
        1,
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
  // ------------------------LOAD MORE----------------------------------//
  async function loadMoreData() {
    if (videos.value.length === 0 || isFetchingMore.value || currentPage.value >= totalPages.value)
      return;
    isFetchingMore.value = true;
    loadingMore.value = true;
    currentPage.value += 1;

    try {
      const response = await getVideoSearchbyChannel(
        streamerStore?.streamerChannel.id,
        currentPage.value,
        pageSize.value,
      );
      if (response.data?.data?.videos?.rows) {
        videos.value.push(...response.data.data.videos.rows);
        totalPages.value = response.data.data.totalPages;
      } else {
        console.error('Invalid response structure:', response);
      }
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      isFetchingMore.value = false;
      loadingMore.value = false;
    }
  }
  //------------------Search video------------------------/
  const debouncedSearch = debounce(async (newSearchData) => {
    if (newSearchData) {
      loading.value = true;
      try {
        const response = await searchVideo(streamerStore?.streamerChannel.id, newSearchData, 2, 0);
        const data = response.data.data.videos.rows;

        videos.value = data;
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        loading.value = false;
      }
    } else {
      videos.value = [];

      loading.value = false;
    }
  }, 500);
  // -----------------hàm select video----------------------//

  const toggleVideoSelection = (video) => {
    selectedVideo.value = video;
    console.log(video.title);
  };

  // ----------------------------------------------------------//
  const goToNextStep = async () => {
    // ----------check slot step 1----------------//
    console.log(selectedDate.value);

    if (currentStep.value === '1' && selectedDate.value.length === 0) {
      toast.error('Sorry, please select a date to continue.');
      return;
    }

    // ----------check select video step 2----------------//
    console.log(videosByDate.value);
    if (
      currentStep.value === '2' &&
      selectedDate.value.some(
        (date) => !videosByDate.value[date] || videosByDate.value[date].length === 0,
      )
    ) {
      toast.error('Sorry, please select a video for all selected dates to continue.');
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
    if (currentStep.value === '2') {
      currentStep.value = '1';
    } else if (currentStep.value === '3') currentStep.value = '2';
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
  // watch(
  //   () => videosByDate.value,
  //   (newVideos) => {
  //     selectedVideosCount.value = newVideos.filter((video) => video.selected).length;
  //   },
  //   { deep: true },
  // );

  const updateSelectedDate = (newDates) => {
    selectedDate.value = newDates;
  };
  onMounted(async () => {
    streamerStore.fetchProfileChannel();
  });

  const getDateSelected = (data) => {
    chooseDate.value = data;
  };
</script>

<template>
  <section class="container">
    <div class="flex justify-between pb-4">
      <h1 class="text_title">Advertise Booking</h1>
    </div>
    <div class="bg-white text-black">
      <!-- Thành công -->
      <div v-if="isBookingSuccess" class="w-full space-y-4 items-center">
        <div class="flex justify-center items-center">
          <Vue3Lottie :animationData="AstronautJSON" :height="200" :width="200" />
        </div>

        <div class="text-center space-y-4">
          <div class="text-2xl text-primary font-semibold">Successful Payment !</div>
          <div class="text-xl mt-2 font-semibold">
            You have successfully booked the advertisement slot
          </div>
        </div>

        <div class="flex font-bold text-center justify-center pt-4 cursor-pointer">
          <Button @click="toggleBackSelectDate" class="btn"> Back to Select Date </Button>
        </div>
      </div>
      <!---------------->
      <div v-else class="grid grid-cols-12 gap-4">
        <!-- Stepper -->
        <div class="col-span-7">
          <Stepper :value="currentStep" class="w-full">
            <StepList>
              <Step value="1" :disabled="true">Select Date</Step>
              <Step value="2" :disabled="true">Select Videos</Step>
              <Step value="3" :disabled="true">Payment</Step>
            </StepList>

            <StepPanels>
              <!-- Step 1 -->
              <StepPanel value="1">
                <SelectDate
                  v-model:selectedDate="selectedDate"
                  @sendDetailBooking="handleGetDataBookingDetails"
                  @update:checkDate="handleCheckDate"
                  @update:selectedDate="updateSelectedDate"
                />
              </StepPanel>

              <!-- Step 2 -->
              <StepPanel value="2">
                <SelectVideo
                  :videos="videos"
                  @toggleVideoSelection="toggleVideoSelection"
                  :selectedDate="selectedDate"
                  :chooseDate="chooseDate || selectedDate[0]"
                  v-model:videosByDate="videosByDate"
                  @loadMoreData="loadMoreData"
                  @debouncedSearch="debouncedSearch"
                  @fetchVideosByChannel="fetchVideosByChannel"
                />
              </StepPanel>

              <!-- Step 3 -->
              <StepPanel value="3">
                <Payment
                  :videos="videos.filter((video) => video.selected)"
                  :databyDate="databyDate"
                  :selectedDate="selectedDate"
                  :selectedVideosCount="selectedVideosCount"
                  :combinedData="combinedData"
                />
              </StepPanel>
            </StepPanels>
          </Stepper>

          <!-- Common Buttons -->
          <div class="flex justify-between mt-4 ml-3">
            <div v-if="currentStep === '1'" class="flex gap-4">
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-2">
                  <div
                    class="size-8 rounded-full bg-[#ffe6e6] border-[#b32d00] border-solid border-2 flex items-center justify-center text-[#b32d00]"
                  >
                    1
                  </div>
                  <span>- Full slot</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div
                  class="size-8 rounded-full bg-[#e8fdfa] border-[#13d0b4] border-solid border-2 flex items-center justify-center text-[#13d0b4]"
                >
                  1
                </div>
                <span>- Booked</span>
              </div>
              <div class="flex items-center gap-2">
                <div
                  class="size-8 rounded-full bg-[#13d0b4] flex items-center justify-center text-white"
                >
                  1
                </div>
                <span>- Selected</span>
              </div>
            </div>
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
                :disabled="!selectedDate || selectedDate.length === 0"
                @click="goToNextStep"
              />

              <button v-if="isNextDisabled" @click="handlePayment" class="btn">
                <SmallLoading v-if="isLoadingPayment" fill="white" fill_second="#13d0b4" />
                <span v-else>Submit</span>
              </button>
            </div>
          </div>
        </div>
        <!-- Booking Details -->
        <div class="col-span-5">
          <BookingDetail
            v-model:selectedDate="selectedDate"
            :videos="videos"
            :videoSelected="videos.filter((video) => video.selected)"
            :databyDate="databyDate"
            @update:selectedDate="updateSelectedDate"
            :currentStep="currentStep"
            @getDateSelected="getDateSelected"
            :videosByDate="videosByDate"
            :combinedData="combinedData"
          />
        </div>
      </div>
    </div>
  </section>
</template>
