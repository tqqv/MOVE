import MedalBronze from '@/components/icons/medalBronze.vue';
<script setup>
  import MedalGold from '@/components/icons/medalGold.vue';
  import MedalSilver from '@/components/icons/medalSilver.vue';
  import TryAgain from '@/components/icons/tryAgain.vue';

  const props = defineProps({
    liveStreamData: Object,
  });
</script>
<template>
  <div>
    <div
      v-if="props.liveStreamData?.livestream?.topDonators"
      v-for="(user, index) in props.liveStreamData?.livestream?.topDonators"
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
        <img :src="user.image" alt="profile picture" class="size-10 object-cover rounded-full" />
        <h2>{{ user.name }}</h2>
      </div>
      <div class="flex items-center">
        <p class="font-medium" :class="user.points >= 5000 ? 'text-yellow-dark' : 'text-body'">
          {{ user.points }}
        </p>
      </div>
    </div>
    <div v-else class="flex flex-col justify-center items-center gap-y-6 my-2">
      <TryAgain />
      <span class="font-semibold">Don't be sad because no one donates. Try harder next time.</span>
    </div>
  </div>
</template>
