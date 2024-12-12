<script setup>
  import Dialog from 'primevue/dialog';
  import { ref } from 'vue';

  const props = defineProps({
    title: String,
    groupName: String,
    isDateDetailVisible: Boolean,
    bookingData: Object, // Dữ liệu booking chứa các thông tin cần thiết
  });

  const emit = defineEmits(['toggleDateDetailVisible']);

  const toggleDateDetailVisible = () => {
    emit('toggleDateDetailVisible');
  };

  // Dữ liệu demo nếu chưa có API thực tế
  const videoData = ref({
    reps: 120,
    views: 5000,
    newFollowers: 300,
  });
</script>

<template>
  <Dialog
    :visible="isDateDetailVisible"
    :modal="true"
    :draggable="false"
    :header="title"
    :style="{ width: '40rem' }"
    @update:visible="toggleDateDetailVisible"
  >
    <div class="space-y-4 mt-4 text-lg">
      <div class="grid grid-cols-2 gap-6">
        <!-- Column 1: Video Stats -->
        <div class="space-y-2 bg-whhite shadow-md rounded-md p-6">
          <h2 class="text-xl font-bold">Video Details</h2>

          <div class="flex justify-between">
            <span class="font-semibold">Total REPs Earned:</span>
            <span>{{ bookingData?.reps || videoData.reps }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">Views Increased:</span>
            <span>{{ bookingData?.views || videoData.views }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">New followers:</span>
            <span>{{ bookingData?.newFollowers || videoData.newFollowers }}</span>
          </div>
        </div>

        <!-- Column 2:  Stream -->

        <div class="space-y-2 bg-whhite shadow-md rounded-md p-6">
          <h2 class="text-xl font-bold">Live Stream Details</h2>

          <div class="flex justify-between">
            <span class="font-semibold">Total REPs Earned:</span>
            <span>{{ bookingData?.reps || videoData.reps }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">Views Increased:</span>
            <span>{{ bookingData?.views || videoData.views }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">New followers:</span>
            <span>{{ bookingData?.newFollowers || videoData.newFollowers }}</span>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>
