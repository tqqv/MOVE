<script setup>
  import Rate from '@/components/icons/rate.vue';
  import { computed, ref } from 'vue';

  const reportData = ref({
    videoUrl:
      'https://player.vimeo.com/video/1036255486?title=0&byline=0&portrait=0&autoplay=1&app_id=122963',
    channel: {
      avatar:
        'https://lh3.googleusercontent.com/a/ACg8ocJcgDoeNwGt0YBm93RFfjz2245K2BNsHxvbEL3PdiOqnw=s96-c',
      name: 'npmh310',
      followers: 12,
    },
    rating: 4,
    stats: {
      views: 300,
      timeAgo: '3 years ago',
    },
    description: `Lorem ipsum dolor sit amet consectetur adipiscing elit per lacinia, laoreet lobortis
congue ad eleifend massa scelerisque nunc at, sollicitudin etiam tortor euismod vitae dis
nulla senectus. Risus suspendisse cras dapibus parturient nostra sociosqu facilisi rhoncus
conubia, imperdiet molestie placerat netus tristique felis primis penatibus tincidunt,
phasellus sodales sed eleifend natoque et egestas mattis. Penatibus inceptos sem litora
aptent condimentum viverra vestibulum conubia, vulputate nullam diam elementum vehicula
nec class. Erat egestas porta libero mollis posuere laoreet magna per, massa elementum
luctus eros a dapibus suspendisse urna, sed tincidunt volutpat`,
  });

  const showFullText = ref(false);
  const maxLength = 250;
  const truncatedText = computed(() => {
    const text = reportData.value.description;
    if (showFullText.value || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  });

  const toggleText = () => {
    showFullText.value = !showFullText.value;
  };
</script>

<template>
  <div class="flex p-3 border border-gray-dark rounded-md flex-col gap-y-4 w-full">
    <!-- VIDEO -->
    <div class="relative w-full overflow-hidden rounded-lg">
      <iframe
        :src="reportData.videoUrl"
        class="w-full aspect-video rounded-lg"
        frameborder="0"
        allow="autoplay; fullscreen"
        allowfullscreen
      ></iframe>
    </div>

    <!-- CONTENT -->
    <div class="flex flex-col gap-y-3 px-3">
      <div class="text-xl font-semibold">The content of the comment was reported</div>

      <!-- CHANNEL -->
      <div class="flex justify-between">
        <div class="flex items-center gap-x-3">
          <img :src="reportData.channel.avatar" alt="" class="size-10 rounded-full" />
          <div class="flex flex-col mb-1">
            <h1 class="font-medium">{{ reportData.channel.name }}</h1>
            <span class="text-xs text-body">{{ reportData.channel.followers }} followers</span>
          </div>
        </div>

        <!-- RATING -->
        <div class="flex items-center gap-x-2">
          <span class="font-semibold">{{ reportData.rating }}</span>
          <Rate />
        </div>
      </div>

      <!-- DESCRIPTION -->
      <div class="p-3 bg-gray-light rounded-md">
        <div class="flex gap-x-4 text-xs font-semibold mb-3">
          <p>{{ reportData.stats.views }} views</p>
          <p>{{ reportData.stats.timeAgo }}</p>
        </div>
        <p class="text-xs">
          {{ truncatedText }}
        </p>
        <button class="text-xs font-semibold cursor-pointer" @click="toggleText">
          {{ showFullText ? 'Show Less' : 'Show More' }}
        </button>
      </div>
    </div>
  </div>
</template>
