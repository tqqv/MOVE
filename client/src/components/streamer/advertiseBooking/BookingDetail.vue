<script setup>
  import { ref, computed, watch } from 'vue';
  import { formatDateData, truncateDescripton, formatNumber } from '@/utils';
  import Divider from 'primevue/divider';

  const emit = defineEmits(['update:selectedDate', 'getDateSelected']);
  const props = defineProps({
    selectedDate: Array,
    videos: Array,
    databyDate: Array,
    currentStep: Number,
    videosByDate: Array,
    combinedData: Array,
  });
  console.log(props.selectedDate);

  const activeDate = ref(props.selectedDate?.[0] || null);

  watch(
    () => props.selectedDate,
    (newSelectedDate) => {
      if (!activeDate.value && Array.isArray(newSelectedDate) && newSelectedDate.length > 0) {
        activeDate.value = newSelectedDate[0];
      }
    },
    { immediate: true },
  );

  const isTextVisible = ref(true);
  const selectVideoForDate = (date) => {
    if (props.currentStep === '2') {
      isTextVisible.value = false;
      activeDate.value = date;

      emit('getDateSelected', date);
    }
  };

  // Lấy video cho ngày hiện tại
  // Lọc video theo ngày đã chọn (activeDate)
  const videosForActiveDate = computed(() => {
    if (!activeDate.value) return [];
    const formattedActiveDate = formatDateData(activeDate.value);
    // Lọc các video có ngày trùng với activeDate
    return props.combinedData.filter((video) => formatDateData(video.date) === formattedActiveDate);
  });

  // Tính tổng giá
  const totalPrice = computed(() => {
    const formattedSelectedDates = Array.isArray(props.selectedDate)
      ? props.selectedDate.map((date) => formatDateData(date))
      : [];

    if (formattedSelectedDates.length === 0) {
      return 0;
    }

    return props.databyDate
      .filter((item) => formattedSelectedDates.includes(formatDateData(item.date)))
      .reduce((total, item) => {
        const pricePerDay =
          item.data?.defaultData?.pricePerDay || item.data?.abnormal?.pricePerDay || 0;
        return total + pricePerDay;
      }, 0);
  });
</script>

<template>
  <div class="col-span-3 p-6 bg-white border-2 border-[#e5e7eb] rounded-md h-[560px]">
    <h3 class="text-2xl font-semibold mb-8">Booking Date Details</h3>
    <div class="space-y-8">
      <Divider />

      <!-- Selected Date -->
      <p class="text-lg font-medium"><strong>Selected date:</strong></p>
      <p v-if="isTextVisible && currentStep === '2'" class="text-sm text-red">
        Click on each day to select a video for that day.
      </p>
      <div class="flex items-center justify-between">
        <div class="grid grid-cols-4 gap-4 max-h-[130px] overflow-y-auto w-full grid-rows-auto">
          <div
            v-for="(date, index) in selectedDate"
            :key="index"
            class="px-2 py-1 h-[30px] bg-primary text-white font-bold rounded-lg flex items-center justify-center mr-4 cursor-pointer"
            :class="{
              'opacity-50':
                currentStep === '2' && formatDateData(activeDate) !== formatDateData(date),
            }"
            @click="selectVideoForDate(formatDateData(date))"
          >
            <span>{{ formatDateData(date) }}</span>
          </div>
        </div>
      </div>

      <Divider />
      <!-- Video cho ngày hiện tại -->
      <div class="flex justify-between">
        <div class="text-lg font-medium whitespace-nowrap">
          <strong
            >Selected video for
            <span v-if="currentStep !== '1'">{{ formatDateData(activeDate) }}</span
            >:</strong
          >
        </div>
        <div class="font-medium">
          <p v-if="videosForActiveDate.length === 0">None</p>
          <p
            v-if="currentStep !== '1'"
            v-for="(video, index) in videosForActiveDate"
            :key="index"
            class="font-medium"
            :title="video.title"
          >
            {{ truncateDescripton(video.title, 30) }}
          </p>
        </div>
      </div>
      <Divider />

      <!-- Button to add video to the selected date -->

      <!-- Price -->
      <div class="flex items-center justify-between">
        <p class="text-lg font-medium"><strong>Total prices for booking:</strong></p>
        <p class="font-medium">{{ formatNumber(totalPrice) }} REPs</p>
      </div>
      <Divider />
    </div>
  </div>
</template>
