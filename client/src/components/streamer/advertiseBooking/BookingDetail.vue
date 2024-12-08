<script setup>
  import { ref, computed } from 'vue';
  import {
    formatDate,
    formatDuration,
    formatDateData,
    formatView,
    genreDuration,
    truncateDescripton,
    formatNumber,
  } from '@/utils';
  import Divider from 'primevue/divider';

  const props = defineProps({
    selectedDate: Object,
    videos: Array,
    databyDate: Object,
  });

  const selectedVideosTitles = computed(() => {
    return props.videos.map((video) => video.title);
  });
</script>

<template>
  <div class="col-span-3 p-6 bg-white border-2 border-[#e5e7eb] rounded-md h-[480px]">
    <h3 class="text-2xl font-semibold mb-8">Booking Date Details</h3>
    <div class="space-y-6">
      <div v-if="databyDate?.bookInfor?.count > 0" class="italic text-red font-bold">
        You have a booking for today!
      </div>

      <div v-else class="italic text-primary font-bold">Booking now!</div>

      <Divider />

      <!-- Selected Date -->
      <div class="flex items-center justify-between">
        <p class="text-lg font-medium"><strong>Selected date:</strong></p>
        <p class="font-medium">
          {{ formatDateData(selectedDate) || 'Not selected' }}
        </p>
      </div>
      <Divider />
      <!-- Available for Booking -->
      <div class="flex items-center justify-between">
        <p class="text-lg font-medium"><strong>Current bookings:</strong></p>
        <p class="font-medium">
          {{ databyDate?.bookInfor.count }} /
          {{ databyDate?.defaultData?.maxBookings || databyDate?.abnormal?.maxBookings }}
        </p>
      </div>
      <Divider />

      <!-- Price -->
      <div class="flex items-center justify-between">
        <p class="text-lg font-medium"><strong>Price for booking:</strong></p>
        <p class="font-medium">
          {{
            formatNumber(databyDate?.defaultData?.pricePerDay || databyDate?.abnormal.pricePerDay)
          }}
          REPs
        </p>
      </div>
      <Divider />

      <!-- Selected Videos -->
      <div class="flex items-center justify-between">
        <p class="text-lg font-medium whitespace-nowrap"><strong>Selected videos:</strong></p>
        <div class="font-medium">
          <p v-if="selectedVideosTitles.length === 0" class="font-medium">None</p>
          <p
            v-for="(title, index) in selectedVideosTitles"
            :key="index"
            class="font-medium"
            :title="title"
          >
            {{ truncateDescripton(title, 30) }}
          </p>
        </div>
      </div>

      <Divider />
    </div>
  </div>
</template>

<style scoped></style>
