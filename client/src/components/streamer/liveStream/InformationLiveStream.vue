<script setup>
  import Clock from '@/components/icons/clock.vue';
  import Eye from '@/components/icons/eye.vue';
  import Like from '@/components/icons/rate.vue';
  import LogoIcon from '@/components/icons/logoIcon.vue';
  import { formatTimeInStream } from '@/utils';
  import User from '@/components/icons/user.vue';
  import Reply from '@/components/icons/reply.vue';
  import Share from '@/components/icons/share.vue';

  const props = defineProps({
    liveInfo: Array,
    elapsedTime: Number,
    liveStreamData: Object,
    metricsData: Object,
    liveStatus: String,
  });
</script>
,
<template>
  <!-- TIME -->
  <div class="flex justify-start items-center gap-x-3">
    <div class="flex size-8 justify-center items-center bg-primary rounded-full">
      <Clock fill="white" />
    </div>
    <div v-if="liveStatus === 'streamEnded'" class="flex flex-col">
      <p class="font-medium">
        {{ formatTimeInStream(liveStreamData?.duration) }}
      </p>
      <p class="text-sm">Live</p>
    </div>
    <div v-else class="flex flex-col">
      <p class="font-medium w-16">
        {{ elapsedTime > 0 ? formatTimeInStream(elapsedTime) : '00:00:00' }}
      </p>
      <p class="text-sm">Live</p>
    </div>
  </div>
  <!-- Current view -->
  <div class="flex justify-start items-center gap-x-3">
    <div class="flex size-8 justify-center items-center bg-primary rounded-full">
      <Eye fill="white" />
    </div>
    <div v-if="liveStatus === 'streamEnded'" class="flex flex-col">
      <p class="font-medium">
        {{ liveStreamData?.totalView ?? '0' }}
      </p>
      <p class="text-sm">Total views</p>
    </div>
    <div v-else class="flex flex-col">
      <p class="font-medium">{{ metricsData?.currentViews ?? '0' }}</p>
      <p class="text-sm">Current views</p>
    </div>
  </div>
  <!-- Highest time -->
  <div class="flex justify-start items-center gap-x-3">
    <div class="flex size-8 justify-center items-center bg-primary rounded-full">
      <Eye fill="white" />
    </div>
    <div v-if="liveStatus === 'streamEnded'" class="flex flex-col">
      <p class="font-medium">
        {{ liveStreamData?.highestViewAtSameTime ?? '0' }}
      </p>
      <p class="text-sm">Highest views</p>
    </div>
    <div v-else class="flex flex-col">
      <p class="font-medium">{{ metricsData?.highestViews ?? '0' }}</p>
      <p class="text-sm">Highest views</p>
    </div>
  </div>
  <!-- REPS -->
  <div class="flex justify-start items-center gap-x-3">
    <div class="flex size-8 justify-center items-center bg-primary rounded-full">
      <LogoIcon />
    </div>
    <div v-if="liveStatus === 'streamEnded'" class="flex flex-col">
      <p class="font-medium">{{ liveStreamData?.totalReps ?? '0' }}</p>
      <p class="text-sm">REPs</p>
    </div>
    <div v-else class="flex flex-col">
      <p class="font-medium">{{ metricsData?.totalReps ?? '0' }}</p>
      <p class="text-sm">REPs</p>
    </div>
  </div>
  <!-- RATING -->
  <div class="flex justify-start items-center gap-x-3">
    <div class="flex size-8 justify-center items-center bg-primary rounded-full">
      <Like fill="white" width="20px" />
    </div>
    <div v-if="liveStatus === 'streamEnded'" class="flex flex-col">
      <p class="font-medium">{{ liveStreamData?.avgRates ?? '0' }}</p>
      <p class="text-sm">Rating</p>
    </div>
    <div v-else class="flex flex-col">
      <p class="font-medium">{{ metricsData?.avgRates ?? '0' }}</p>
      <p class="text-sm">Rating</p>
    </div>
  </div>
  <!-- Total share -->
  <div class="flex justify-start items-center gap-x-3">
    <div class="flex size-8 justify-center items-center bg-primary rounded-full">
      <Share fill="white" width="14px" />
    </div>
    <div v-if="liveStatus === 'streamEnded'" class="flex flex-col">
      <p class="font-medium">{{ liveStreamData?.totalShare ?? '0' }}</p>
      <p class="text-sm">Share</p>
    </div>
    <div v-else class="flex flex-col">
      <p class="font-medium">{{ metricsData?.totalShares ?? '0' }}</p>
      <p class="text-sm">Share</p>
    </div>
  </div>
</template>
