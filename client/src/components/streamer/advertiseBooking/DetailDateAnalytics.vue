<script setup>
  import EmptyImage from '@/components/icons/emptyImage.vue';
  import EmptyPage from '@/pages/EmptyPage.vue';
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

  const emit = defineEmits(['closeDateDetail']);

  const toggleDateDetailVisible = () => {
    emit('closeDateDetail');
  };
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
    <section class="container">
      <div class="space-y-4 mt-4 text-lg">
        <h1 class="text-[#808080] italic text-lg font-semibold">
          #{{ formatDateData(selectedDate) }}
        </h1>

        <div class="flex gap-x-4">
          <span class="font-bold">Number of people reach by ads:</span
          ><span class="font-semibold">{{ dateDetails?.featuredContent[0]?.clickCount }} </span>
        </div>
        <div class="flex gap-x-4">
          <span class="font-bold">New followers:</span>
          <span class="font-semibold">{{
            dateDetails?.featuredContent[0]?.newSubscriptionsToday ?? 0
          }}</span>
          <i class="pi pi-arrow-up pt-1.5 text-primary arrow-animation" style="font-size: 1rem">
            {{
              dateDetails?.featuredContent[0]?.totalFollowers === 0 ||
              dateDetails?.featuredContent[0]?.newSubscriptionsToday === 0
                ? '0%'
                : (
                    (dateDetails?.featuredContent[0]?.newSubscriptionsToday /
                      dateDetails?.featuredContent[0]?.totalFollowers) *
                    100
                  ).toFixed(0) + '%'
            }}
          </i>
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
              <h1 class="font-semibold truncate w-[300px]">
                {{ dateDetails?.featuredContent[0]?.video?.title || 'No title available' }}
              </h1>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Total REPs Earned:</span>
              <div class="flex gap-x-2">
                <span class="font-semibold"
                  >{{
                    formatNumber(dateDetails?.featuredContent[0]?.totalRepFromVideo || 0)
                  }}
                  REPs</span
                >
                <i
                  class="pi pi-arrow-up pt-1.5 text-primary arrow-animation"
                  style="font-size: 1rem"
                >
                  {{
                    dateDetails?.featuredContent[0]?.totalRepFromVideo === 0 ||
                    dateDetails?.featuredContent[0]?.totalRepOfVideo === null
                      ? '0%'
                      : (
                          (dateDetails?.featuredContent[0]?.totalRepFromVideo /
                            dateDetails?.featuredContent[0]?.totalRepOfVideo || 0) * 100
                        ).toFixed(0) + '%'
                  }}
                </i>
              </div>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">View Increase:</span>
              <span class="font-semibold">{{
                dateDetails?.featuredContent[0]?.newSubscriptionsToday ?? 0
              }}</span>
            </div>
          </div>

          <!-- Column 2: Stream -->
          <div class="space-y-4 bg-white shadow-lg rounded-lg p-6">
            <h2 class="text-xl font-bold">Live Stream Details</h2>
            <div v-if="dateDetails?.liveInfor">
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
            <EmptyPage
              isMid="true"
              title="No data livestream found"
              subTitle="No live stream data is available at the moment. Please check back later."
            />
          </div>
        </div>
      </div>
    </section>
  </Dialog>
</template>
<style scoped>
  .arrow-animation {
    animation: arrowMove 1s infinite ease-in-out;
  }

  @keyframes arrowMove {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-2px);
    }
    100% {
      transform: translateY(0);
    }
  }
</style>
