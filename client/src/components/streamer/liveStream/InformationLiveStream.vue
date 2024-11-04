<script setup>
  import Clock from '@/components/icons/clock.vue';
  import Eye from '@/components/icons/eye.vue';
  import Like from '@/components/icons/like.vue';
  import LogoIcon from '@/components/icons/logoIcon.vue';
  import { formatTimeInStream } from '@/utils';

  const props = defineProps({ liveInfo: Array, elapsedTime: Number, duration: Number });
</script>
<template>
  <div class="flex justify-start items-center gap-x-3">
    <div class="flex size-8 justify-center items-center bg-primary rounded-full">
      <Eye fill="white" />
    </div>
    <div class="flex flex-col">
      <p class="font-medium">23</p>
      <p class="text-sm">views</p>
    </div>
  </div>
  <div class="flex justify-start items-center gap-x-3">
    <div class="flex size-8 justify-center items-center bg-primary rounded-full">
      <Like fill="white" width="20px" />
    </div>
    <div class="flex flex-col">
      <p class="font-medium">23</p>
      <p class="text-sm">likes</p>
    </div>
  </div>
  <div class="flex justify-start items-center gap-x-3">
    <div class="flex size-8 justify-center items-center bg-primary rounded-full">
      <LogoIcon />
    </div>
    <div class="flex flex-col">
      <p class="font-medium">2400</p>
      <p class="text-sm">REPs</p>
    </div>
  </div>
  <div class="flex justify-start items-center gap-x-3">
    <div class="flex size-8 justify-center items-center bg-primary rounded-full">
      <Clock fill="white" />
    </div>
    <div v-if="elapsedTime >= 0" class="flex flex-col">
      <p class="font-medium">
        {{ elapsedTime > 0 ? formatTimeInStream(elapsedTime) : '00:00:00' }}
      </p>
      <p class="text-sm">live</p>
    </div>
    <div v-if="duration" class="flex flex-col">
      <p class="font-medium">
        {{ formatTimeInStream(duration) }}
      </p>
      <p class="text-sm">live</p>
    </div>
  </div>
</template>
