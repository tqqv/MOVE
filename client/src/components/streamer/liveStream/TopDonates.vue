import MedalBronze from '@/components/icons/medalBronze.vue';
<script setup>
  import MedalGold from '@/components/icons/medalGold.vue';
  import MedalSilver from '@/components/icons/medalSilver.vue';
  import REPs4 from '@/components/icons/REPsItems/REPs4.vue';
  import REPs5 from '@/components/icons/REPsItems/REPs5.vue';
  import TryAgain from '@/components/icons/tryAgain.vue';
  import { watch } from 'vue';

  const props = defineProps({
    liveStreamData: Object,
  });

  watch(() => {
    console.log(props.liveStreamData?.topDonators);
  });
</script>
<template>
  <div>
    <div
      v-if="props.liveStreamData?.topDonators.length > 0"
      v-for="(user, index) in props.liveStreamData?.topDonators"
      :key="index"
      class="flex justify-between items-center mb-4"
    >
      <div class="flex items-center gap-x-3">
        <div v-if="index === 0">
          <MedalGold />
        </div>
        <div v-else-if="index === 1">
          <MedalSilver />
        </div>
        <div v-else-if="index === 2">
          <MedalBronze />
        </div>
        <div v-else class="flex justify-center items-center size-[29px] rounded-full bg-primary/60">
          <span class="font-medium">{{ index + 1 }}</span>
        </div>
        <img
          :src="user.donatorAvatar"
          alt="profile picture"
          class="size-9 object-cover rounded-full"
        />
        <h2 class="font-semibold">{{ user.donatorName }}</h2>
      </div>
      <div class="flex gap-x-2 items-center">
        <div class="mt-1">
          <REPs5 v-if="index === 0 || index === 1 || index === 2" />
          <REPs4 v-else />
        </div>
        <p
          class="font-medium"
          :class="index === 0 || index === 1 || index === 2 ? 'text-yellow-dark' : 'text-blue'"
        >
          {{ user.totalReps }}
        </p>
      </div>
    </div>
    <div v-else class="flex flex-col justify-center items-center gap-y-6 my-2">
      <TryAgain />
      <span class="font-semibold text-center"
        >Don't be sad because no one donates. Try harder next time.</span
      >
    </div>
  </div>
</template>
