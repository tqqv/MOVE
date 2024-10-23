<script setup>
  import MedalBronze from '@/components/icons/medalBronze.vue';
  import MedalGold from '@/components/icons/medalGold.vue';
  import MedalSilver from '@/components/icons/medalSilver.vue';
  const users = [
    {
      name: 'npmh310',
      points: 85000,
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg',
    },
    {
      name: 'tuilahieu',
      points: 5500,
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg',
    },
    {
      name: 'hieune320',
      points: 5000,
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg',
    },
    {
      name: 'minhhieu120',
      points: 1200,
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg',
    },
    {
      name: 'minhhieu120',
      points: 1200,
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg',
    },

    // Add more users as needed
  ];
</script>
<template>
  <div>
    <div v-for="(user, index) in users" :key="index" class="flex justify-between items-center mb-4">
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
        <p class="font-medium" :class="user.points >= 5000 ? 'text-primary' : 'text-body'">
          {{ user.points }}
        </p>
      </div>
    </div>
  </div>
</template>
