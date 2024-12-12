<script setup>
  import { formatDateData, formatNumber, genreDuration } from '@/utils';
  import Dialog from 'primevue/dialog';
  import Divider from 'primevue/divider';
  import { ref } from 'vue';

  const props = defineProps({
    title: String,
    groupName: String,
    isDateDetailVisible: Boolean,
    dateDetails: Object,
    selectedDate: Object,
  });

  const emit = defineEmits(['toggleDateDetailVisible']);

  const toggleDateDetailVisible = () => {
    emit('toggleDateDetailVisible');
  };
  console.log(props.dateDetails);
</script>

<template>
  <Dialog
    v-if="dateDetails"
    :visible="isDateDetailVisible"
    :modal="true"
    :draggable="false"
    :header="title"
    :style="{ width: '60rem' }"
    @update:visible="toggleDateDetailVisible"
  >
    <div class="space-y-4 mt-4 text-lg">
      <h1 class="text-[#808080] italic text-lg font-semibold">
        #{{ formatDateData(selectedDate) }}
      </h1>

      <div class="flex gap-x-4">
        <span class="font-bold">Number of people reach by ads:</span
        ><span class="font-semibold">{{ dateDetails?.featuredContent[0]?.clickCount }}</span>
      </div>
      <div class="flex gap-x-4">
        <span class="font-bold">New followers:</span>
        <span class="font-semibold">{{
          dateDetails?.featuredContent[0]?.newSubscriptionsToday ?? 0
        }}</span>
      </div>
      <Divider class="py-4" />
      <div class="grid grid-cols-2 gap-6">
        <!-- Column 1: Video Stats -->
        <div class="space-y-4 bg-white shadow-md rounded-md p-6">
          <h2 class="text-xl font-bold">Video Details</h2>
          <div class="flex justify-between flex-shrink-0">
            <img
              v-if="
                dateDetails?.featuredContent?.length > 0 &&
                dateDetails?.featuredContent[0]?.video?.thumbnailUrl
              "
              :src="dateDetails?.featuredContent[0]?.video?.thumbnailUrl"
              alt="Thumbnail"
              class="w-[400px] h-[200px] object-cover"
            />
          </div>
          <div>
            <h1 class="font-semibold truncate w-[100px]">
              {{ dateDetails?.featuredContent[0]?.video?.title || 'No title available' }}
            </h1>
          </div>
          <div class="flex justify-between">
            <span class="font-bold">Total REPs Earned:</span>
            <span class="font-semibold"
              >{{
                formatNumber(dateDetails?.featuredContent[0]?.totalRepFromVideo || 0)
              }}
              REPs</span
            >
          </div>
        </div>

        <!-- Column 2: Stream -->
        <div class="space-y-4 bg-white shadow-lg rounded-lg p-6" v-if="dateDetails?.liveInfor">
          <h2 class="text-xl font-bold">Live Stream Details</h2>
          <div class="flex justify-between flex-shrink-0">
            <img
              :src="dateDetails?.liveInfor.thumbnailUrl"
              alt="Thumbnail"
              class="w-[400px] h-[200px] object-cover"
            />
          </div>
          <div>
            <h1 class="font-semibold truncate w-[100px]">
              {{ dateDetails?.liveInfor.title || 'No title available' }}
            </h1>
          </div>
          <div class="flex justify-between">
            <span class="font-bold">Total REPs Earned:</span>
            <span class="font-semibold"
              >{{ formatNumber(dateDetails?.totalRepFromLivestream || 0) }} REPs</span
            >
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>
