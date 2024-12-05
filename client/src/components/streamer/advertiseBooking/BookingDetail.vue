<script setup>
  import {
    formatDate,
    formatDuration,
    formatDateData,
    formatView,
    genreDuration,
    truncateDescripton,
  } from '@/utils';
  const props = defineProps({
    selectedDate: { type: Object, default: null },
    videos: { type: Array, default: () => [] },
  });
</script>

<template>
  <div class="col-span-3 p-6 bg-white border-primary border-l h-full">
    <h3 class="text-2xl font-semibold">Booking Details</h3>
    <div class="mt-6 space-y-4">
      <!-- Selected Date -->
      <div class="flex items-center justify-between">
        <p class="whitespace-nowrap"><strong>Selected Date:</strong></p>
        <p class="font-medium">
          {{ formatDateData(selectedDate) || 'Not selected' }}
        </p>
      </div>

      <!-- Available for Booking -->
      <div class="flex items-center justify-between">
        <p class="text-gray-600"><strong>Current Bookings:</strong></p>
        <p class="font-medium">4/6</p>
      </div>

      <!-- Selected Videos -->
      <div class="flex items-center justify-between">
        <p class="text-gray-600"><strong>Selected Videos:</strong></p>
        <p class="font-medium">
          {{
            videos
              .filter((video) => video.selected)
              .map((video) => video.name)
              .join(', ') || 'None'
          }}
        </p>
      </div>

      <!-- Price -->
      <div class="flex items-center justify-between">
        <p class="text-gray-600"><strong>Price:</strong></p>
        <p class="font-medium">400 REPs</p>
      </div>
    </div>
  </div>
</template>
